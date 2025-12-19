import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DecisionSummaryProps {
  recommendation: {
    decision: "TREAT" | "DO NOT TREAT" | "REQUEST EXAMS"
    scores: { treat: number; doNotTreat: number; requestExams: number }
    interpretation: string
  }
}

export default function DecisionSummary({ recommendation }: DecisionSummaryProps) {
  const getDecisionStyle = (decision: string) => {
    switch (decision) {
      case "TREAT":
        return { bg: "bg-green-50 border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" }
      case "DO NOT TREAT":
        return { bg: "bg-slate-50 border-slate-200", text: "text-slate-700", badge: "bg-slate-100 text-slate-700" }
      case "REQUEST EXAMS":
        return { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" }
      default:
        return { bg: "bg-secondary border-border", text: "text-foreground", badge: "bg-secondary text-foreground" }
    }
  }

  const style = getDecisionStyle(recommendation.decision)

  const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs font-bold text-primary">{(value * 100).toFixed(0)}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  )

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Clinical Recommendation</CardTitle>
        <CardDescription>Analysis based on AI assessments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Recommendation */}
        <div className={`p-6 rounded-lg border-2 ${style.bg}`}>
          <p className={`text-xs uppercase font-bold tracking-widest mb-2 ${style.text}`}>Final Recommendation</p>
          <p className={`text-3xl font-bold ${style.text}`}>{recommendation.decision}</p>
        </div>

        {/* Score Bars */}
        <div className="space-y-4 pt-4 border-t border-border">
          <p className="text-sm font-semibold text-foreground">Confidence Scores</p>
          <ScoreBar label="Treat Score" value={recommendation.scores.treat} color="bg-green-500" />
          <ScoreBar label="Request Exams Score" value={recommendation.scores.requestExams} color="bg-amber-500" />
          <ScoreBar label="Do Not Treat Score" value={recommendation.scores.doNotTreat} color="bg-slate-400" />
        </div>

        {/* Interpretation */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Clinical Reasoning</p>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <p className="text-sm leading-relaxed text-foreground">{recommendation.interpretation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
