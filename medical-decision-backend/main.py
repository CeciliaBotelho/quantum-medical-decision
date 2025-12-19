from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
from qiskit_aer import Aer
from qiskit import QuantumCircuit, transpile
import numpy as np

# =====================================================
# 1) MODELOS PARA O FRONT
# =====================================================

class DoctorOpinion(BaseModel):
    mu: float
    nu: float

class DecisionRequest(BaseModel):
    doctor1: DoctorOpinion
    doctor2: DoctorOpinion

InternalDecisionLabel = Literal["NAO_TRATAR", "PEDIR_EXAME", "TRATAR"]
ExternalDecisionLabel = Literal["TREAT", "DO NOT TREAT", "REQUEST EXAMS"]

class DecisionResponse(BaseModel):
    decision: ExternalDecisionLabel
    scores: dict
    mu_xor: float
    nu_xor: float
    pi_xor: float
    interpretation: str


# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI(title="Quantum-Intuitionistic Medical API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# 2) ENCODING DOS VALORES FUZZY NOS QUBITS (ARTIGO)
# =====================================================

def matriz_inputs(qc, f_A_values):
    """
    Codifica cada valor fuzzy x em:
       |ψ> = sqrt(1-x)|0> + sqrt(x)|1>
    via rotação U(θ, 0, π), com
       θ = 2 arctan( sqrt(x) / sqrt(1-x) ).
    """
    for qubit_index in range(4):
        x = f_A_values[qubit_index]

        if x <= 0.0:
            theta = 0.0
        elif x >= 1.0:
            theta = np.pi
        else:
            theta = 2 * np.arctan(np.sqrt(x) / np.sqrt(1.0 - x))

        qc.u(theta, 0, np.pi, qubit_index)


# =====================================================
# 3) XOR INTUICIONISTA — CIRCUITO DO ARTIGO (CORRECT!)
# =====================================================

def build_full_circuit(x1, x2, y1, y2):
    """
    q8 = μ⊕
    q9 = ν⊕
    """
    qc = QuantumCircuit(10, 2, name="xor_intuitionistic_full")

    matriz_inputs(qc, [x1, x2, y1, y2])

    # ---- S(T(x2,y1), T(x1,y2)) → μ⊕ em q8 ----
    qc.ccx(1, 2, 4)   # T(x2,y1)
    qc.x(4)
    qc.ccx(0, 3, 5)   # T(x1,y2)
    qc.x(5)

    qc.ccx(4, 5, 8)   # S(...) = ¬T(¬T1,¬T2)
    qc.x(4)
    qc.x(5)
    qc.x(8)

    # ---- parte do upper → ν⊕ em q9 ----
    qc.x(0)
    qc.x(1)
    qc.x(2)
    qc.x(3)

    qc.ccx(0, 3, 6)
    qc.x(0)
    qc.x(3)
    qc.x(6)

    qc.ccx(1, 2, 7)
    qc.x(1)
    qc.x(2)
    qc.x(7)

    qc.ccx(6, 7, 9)

        # ---- XNOR = NOT(XOR) nas saídas ----
    qc.x(8)  # μ⊙ = 1 - μ⊕
    qc.x(9)  # ν⊙ = 1 - ν⊕


    # medir:
    qc.measure(8, 0)  # μ⊕
    qc.measure(9, 1)  # ν⊕

    return qc


# =====================================================
# 4) SIMULAÇÃO DO CIRCUITO E EXTRAÇÃO DE μ⊕, ν⊕, π⊕
# =====================================================

def run_full_sample(x1, x2, y1, y2, shots=2000):
    qc = build_full_circuit(x1, x2, y1, y2)

    backend = Aer.get_backend("qasm_simulator")
    tc = transpile(qc, backend)
    counts = backend.run(tc, shots=shots).result().get_counts()

    total = sum(counts.values())
    mu_hits = 0
    nu_hits = 0

    for bits, c in counts.items():
        # bits = "c1c0"
        nu_bit = bits[0]  # q9
        mu_bit = bits[1]  # q8

        if mu_bit == "1":
            mu_hits += c
        if nu_bit == "1":
            nu_hits += c

    # AGORA estes valores já são XNOR (porque você deu qc.x(8) e qc.x(9))
    mu_xnor = mu_hits / total   # grau de ACORDO (similaridade)
    nu_xnor = nu_hits / total   # grau de DESACORDO (conflito)

    pi_xnor = max(0.0, 1.0 - mu_xnor - nu_xnor)

    # retorno mantendo nomes antigos pra não quebrar nada:
    return mu_xnor, nu_xnor, pi_xnor

# =====================================================
# 5) REGRAS NOVAS (COERENTES COM O XOR INTUICIONISTA)
# =====================================================
def evaluate_rules_medico(mu1, nu1, mu2, nu2, shots=2000):
    mu_xnor, nu_xnor, pi_xnor = run_full_sample(mu1, nu1, mu2, nu2, shots)

    avg_mu = (mu1 + mu2) / 2
    avg_nu = (nu1 + nu2) / 2

    pi1 = max(0.0, 1.0 - mu1 - nu1)
    pi2 = max(0.0, 1.0 - mu2 - nu2)
    pi_med = (pi1 + pi2) / 2

    hesitacao = max(pi_med, pi_xnor)

    # usa as DUAS medidas do circuito
    q_conf = mu_xnor * (1.0 - nu_xnor)   # confiança quântica

    tratar = avg_mu * q_conf * (1.0 - hesitacao)
    nao_tratar = avg_nu * q_conf * (1.0 - hesitacao)

    pedir_exame = max(1.0 - q_conf, hesitacao)

    S = tratar + nao_tratar + pedir_exame
    if S < 1e-9:
        return 0.33, 0.34, 0.33, (mu_xnor, nu_xnor, hesitacao)

    tratar /= S
    nao_tratar /= S
    pedir_exame /= S

    return nao_tratar, pedir_exame, tratar, (mu_xnor, nu_xnor, hesitacao)


def decide_medico(mu1, nu1, mu2, nu2):
    n, e, t, (mu_xor, nu_xor, pi_xor) = evaluate_rules_medico(mu1, nu1, mu2, nu2)

    scores = {
        "NAO_TRATAR": n,
        "PEDIR_EXAME": e,
        "TRATAR": t,
    }
    decisao = max(scores, key=scores.get)

    return decisao, scores, mu_xor, nu_xor, pi_xor


# =====================================================
# 6) MAPEAMENTO PARA O FRONT
# =====================================================

def map_internal_to_external(label: InternalDecisionLabel) -> ExternalDecisionLabel:
    if label == "TRATAR":
        return "TREAT"
    elif label == "NAO_TRATAR":
        return "DO NOT TREAT"
    else:
        return "REQUEST EXAMS"


def map_scores_to_front(scores: dict) -> dict:
    return {
        "treat": scores["TRATAR"],
        "doNotTreat": scores["NAO_TRATAR"],
        "requestExams": scores["PEDIR_EXAME"],
    }


# =====================================================
# 7) ENDPOINT /decide
# =====================================================

@app.post("/decide", response_model=DecisionResponse)
def decide(payload: DecisionRequest):
    mu1, nu1 = payload.doctor1.mu, payload.doctor1.nu
    mu2, nu2 = payload.doctor2.mu, payload.doctor2.nu

    decisao_interna, scores_internos, mu_xor, nu_xor, pi_xor = decide_medico(mu1, nu1, mu2, nu2)

    decision_external = map_internal_to_external(decisao_interna)
    scores_front = map_scores_to_front(scores_internos)

    interpretation = (
        f"μ⊙={mu_xor:.2f}, ν⊙={nu_xor:.2f}, π⊙={pi_xor:.2f}. "
        f"(μ⊙=acordo, ν⊙=conflito, π⊙=hesitação). "
        f"Final decision: {decisao_interna}."
)

    return DecisionResponse(
        decision=decision_external,
        scores=scores_front,
        mu_xor=mu_xor,
        nu_xor=nu_xor,
        pi_xor=pi_xor,
        interpretation=interpretation
    )
