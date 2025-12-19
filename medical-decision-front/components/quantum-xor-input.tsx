"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuantumXorInputProps {
  values: { z_minus: number; z_plus: number }
  setValues: (val: { z_minus: number; z_plus: number }) => void
  onCompute: () => void
}

export default function QuantumXorInput({ values, setValues, onCompute }: QuantumXorInputProps) {
  const conflict = values.z_plus - values.z_minus
  const conflictStatus = conflict < 0.2 ? "Low" : conflict < 0.5 ? "Moderate" : "High"
  const conflictColor = conflict < 0.2 ? "text-success" : conflict < 0.5 ? "text-warning" : "text-destructive"

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Quantum Conflict Analysis</CardTitle>
        <CardDescription>Minimum and maximum conflict parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground flex justify-between mb-2">
            <span>Minimum Conflict</span>
            <span className="text-accent">{values.z_minus.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={values.z_minus}
            onChange={(e) =>
              setValues({
                ...values,
                z_minus: Number.parseFloat(e.target.value),
              })
            }
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground flex justify-between mb-2">
            <span>Maximum Conflict</span>
            <span className="text-accent">{values.z_plus.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={values.z_plus}
            onChange={(e) =>
              setValues({
                ...values,
                z_plus: Number.parseFloat(e.target.value),
              })
            }
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="bg-secondary/30 border border-border rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Conflict Level:</span>
          <span className={`text-lg font-bold ${conflictColor}`}>{conflictStatus}</span>
        </div>

        <Button
          onClick={onCompute}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Compute Recommendation
        </Button>
      </CardContent>
    </Card>
  )
}
