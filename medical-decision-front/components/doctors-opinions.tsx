"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DoctorOpinion {
  mu: number
  nu: number
}

interface DoctorsOpinionsProps {
  doctor1: DoctorOpinion
  setDoctor1: (val: DoctorOpinion) => void
  doctor2: DoctorOpinion
  setDoctor2: (val: DoctorOpinion) => void
}

export default function DoctorsOpinions({ doctor1, setDoctor1, doctor2, setDoctor2 }: DoctorsOpinionsProps) {
  const pi1 = Math.max(0, 1 - doctor1.mu - doctor1.nu)
  const pi2 = Math.max(0, 1 - doctor2.mu - doctor2.nu)
  const isInvalid1 = doctor1.mu + doctor1.nu > 1
  const isInvalid2 = doctor2.mu + doctor2.nu > 1

  const SliderInput = ({
    label,
    value,
    onChange,
    symbol,
  }: { label: string; value: number; onChange: (val: number) => void; symbol: string }) => (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label} <span className="text-primary font-semibold">{symbol}</span>
        </label>
        <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="w-full h-2.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  )

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>AI Opinions</CardTitle>
        <CardDescription>Set belief measures from each AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Doctor 1 */}
        <div className="space-y-4 pb-6 border-b border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold text-foreground">Doctor 1</h3>
          </div>

          <SliderInput
            label="Belief in Disease"
            value={doctor1.mu}
            onChange={(val) => setDoctor1({ ...doctor1, mu: val })}
            symbol="μ₁"
          />
          <SliderInput
            label="Belief in NO Disease"
            value={doctor1.nu}
            onChange={(val) => setDoctor1({ ...doctor1, nu: val })}
            symbol="ν₁"
          />

          <div
            className={`p-3 rounded-lg border-2 transition-colors ${isInvalid1 ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-secondary/50 border-border/50 text-foreground"}`}
          >
            <p className="text-xs font-medium">
              {isInvalid1 ? "⚠️ Invalid: μ + ν cannot exceed 1" : `Hesitation π₁ = ${pi1.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Doctor 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span className="text-sm font-bold text-accent">2</span>
            </div>
            <h3 className="font-semibold text-foreground">Doctor 2</h3>
          </div>

          <SliderInput
            label="Belief in Disease"
            value={doctor2.mu}
            onChange={(val) => setDoctor2({ ...doctor2, mu: val })}
            symbol="μ₂"
          />
          <SliderInput
            label="Belief in NO Disease"
            value={doctor2.nu}
            onChange={(val) => setDoctor2({ ...doctor2, nu: val })}
            symbol="ν₂"
          />

          <div
            className={`p-3 rounded-lg border-2 transition-colors ${isInvalid2 ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-secondary/50 border-border/50 text-foreground"}`}
          >
            <p className="text-xs font-medium">
              {isInvalid2 ? "⚠️ Invalid: μ + ν cannot exceed 1" : `Hesitation π₂ = ${pi2.toFixed(2)}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
