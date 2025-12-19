# 🧠⚛️ Quantum Medical Decision Support System

This project presents a **quantum-inspired medical decision support system** that integrates **Intuitionistic Fuzzy Logic**, **Quantum Computing concepts**, and **Artificial Intelligence outputs** to assist clinical decision-making under uncertainty.

The system aggregates diagnostic opinions from multiple AI models and produces one of three possible recommendations:

- ✅ **Treat**
- ❌ **Do not treat**
- 🔍 **Request further medical exams**

The goal is **not to replace medical professionals**, but to provide a structured and explainable computational mechanism to handle **agreement, disagreement, and uncertainty** among heterogeneous AI diagnostic systems.

---

## 🧩 Motivation

In real-world medical scenarios, clinicians often consult **multiple AI models** trained with different datasets, architectures, and assumptions. These models may produce:

- Conflicting predictions  
- Partial agreement  
- High uncertainty  

Traditional aggregation strategies (e.g., majority voting or averaging) **do not explicitly model disagreement or uncertainty**.

This project addresses this gap by combining:

- **Atanassov’s Intuitionistic Fuzzy Logic (A-IFL)** to represent uncertainty,
- **Quantum Computing principles** (superposition, entanglement, interference),
- **XNOR fuzzy-quantum operators** to model consensus and conflict.

---

## ⚛️ Why Quantum Computing?

Quantum Computing provides a natural framework for:

- Handling **multiple interacting sources simultaneously**,
- Representing uncertainty via **quantum superposition**,
- Capturing correlations between evidences through **entanglement**.

In this system, quantum circuits are used as a **computational abstraction**, enabling faster and more expressive aggregation when the number of AI models increases.

> 💡 Conceptually, the quantum approach scales better when many AI systems are involved, since multiple evidences are processed in parallel within a single quantum register.

---

## 🧠 Fuzzy–Quantum Decision Logic

Each AI model output is represented as an **intuitionistic fuzzy value**:

\[
\tilde{x} = (\mu, \nu)
\]

Where:
- \(\mu\): membership degree (confidence in diagnosis),
- \(\nu\): non-membership degree (confidence against diagnosis),
- \(1 - \mu - \nu\): hesitation.

### 🔗 XNOR as the Core Operator

This project focuses on the **intuitionistic fuzzy XNOR operator**, which is particularly suitable for **medical consensus analysis**:

- High value when AI systems **agree**,
- Low value when they **disagree**,
- Explicitly captures **uncertainty**.

The fuzzy XNOR is mapped to a **quantum circuit** using:
- **Pauli-X gates** (negation),
- **Toffoli gates** (t-norm / conjunction),
- Measurement probabilities as fuzzy degrees.

---

## 🏥 Decision Interpretation

After aggregating all AI opinions, the system produces a final recommendation:

| Fuzzy–Quantum Result | Interpretation |
|---------------------|----------------|
| High membership, low non-membership | **Treat** |
| Low membership, high non-membership | **Do not treat** |
| High hesitation | **Request further exams** |

This mapping makes the decision process **transparent and explainable**, a crucial requirement in medical applications.

---

## 🖥️ System Architecture

The project is divided into three main components:

### 🔹 Backend (FastAPI + Python)
- Implements fuzzy-quantum aggregation logic
- Handles AI model outputs
- Exposes REST endpoints for decision computation

📁 `medical-decision-backend/`

### 🔹 Frontend (Next.js + React)
- Interactive medical decision interface
- Displays AI opinions and final recommendation
- Visualizes uncertainty and confidence levels

📁 `medical-decision-front/`

### 🔹 Quantum–Fuzzy Core
- Mathematical definition of fuzzy XNOR
- Quantum circuit modeling
- Measurement-based interpretation

---

## 🚀 How to Run

### Backend
```bash
cd medical-decision-backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd medical-decision-front
pnpm install
pnpm dev
```
---

## Practical Use Case

A physician receives diagnostic outputs from multiple AI systems (e.g., imaging, lab analysis, clinical prediction).

Instead of simply voting, the system:

Encodes each AI output as an intuitionistic fuzzy value,

Aggregates them using a quantum-inspired XNOR operator,

Returns a single, interpretable recommendation.

This is especially useful in:

Complex diagnoses,

Conflicting AI predictions,

High-risk medical decisions.
---

## Research Context

This project is connected to research in:

Quantum Computing

Intuitionistic Fuzzy Logic

Explainable AI

Medical Decision Support Systems

It also serves as a proof of concept for integrating theoretical fuzzy–quantum models with real software systems.

---

## Future Work

Integration with real medical datasets

Execution on quantum simulators (Qiskit)

Performance comparison with classical aggregation methods

Extension to multi-class and temporal diagnoses

---

## Author

Cecilia Botelho
PhD Researcher in Computer Science
Focus: Quantum Computing & Artificial Intelligence

GitHub: https://github.com/CeciliaBotelho