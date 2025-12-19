"use client"

import { useState } from "react"
import Header from "@/components/header"
import DoctorsOpinions from "@/components/doctors-opinions"
import DecisionSummary from "@/components/decision-summary"
import DatasetAnalytics from "@/components/dataset-analytics"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [doctor1, setDoctor1] = useState({ mu: 0.7, nu: 0.2 })
  const [doctor2, setDoctor2] = useState({ mu: 0.65, nu: 0.25 })
  const [recommendation, setRecommendation] = useState<null | {
    decision: "TREAT" | "DO NOT TREAT" | "REQUEST EXAMS"
    scores: { treat: number; doNotTreat: number; requestExams: number }
    interpretation: string
  }>(null)

  // 🔁 AGORA: em vez de calcular aqui, chamamos o backend
  const handleCompute = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor1,
          doctor2,
        }),
      })

      if (!res.ok) {
        console.error("Erro ao chamar backend:", res.status)
        return
      }

      const data = await res.json()

      setRecommendation({
        decision: data.decision as "TREAT" | "DO NOT TREAT" | "REQUEST EXAMS",
        scores: {
          treat: data.scores.treat,
          doNotTreat: data.scores.doNotTreat,
          requestExams: data.scores.requestExams,
        },
        interpretation: data.interpretation,
      })
    } catch (error) {
      console.error("Erro geral na API:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Input controls */}
            <div className="lg:col-span-1 space-y-6">
              <DoctorsOpinions
                doctor1={doctor1}
                setDoctor1={setDoctor1}
                doctor2={doctor2}
                setDoctor2={setDoctor2}
              />

              <Button
                onClick={handleCompute}
                className="w-full h-11 text-base font-semibold rounded-lg"
                size="lg"
              >
                Analyze Assessment
              </Button>
            </div>

            {/* Right column - Results and visualizations */}
            <div className="lg:col-span-2 space-y-6">
              {recommendation ? (
                <DecisionSummary recommendation={recommendation} />
              ) : (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-base">
                      Set physician opinions and click
                    </p>
                    <p className="font-semibold text-foreground">
                      "Analyze Assessment"
                    </p>
                    <p className="text-muted-foreground text-sm">
                      to generate a clinical recommendation
                    </p>
                  </div>
                </div>
              )}

              <DatasetAnalytics />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
