"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DatasetAnalytics() {
  const handleUpload = () => {
    // Placeholder for CSV upload functionality
    alert("CSV upload functionality will be implemented with backend integration")
  }

  // Placeholder table data
  const tableData = [
    { mu1: 0.8, nu1: 0.1, mu2: 0.75, nu2: 0.15, z_minus: 0.05, z_plus: 0.35, decision: "TREAT" },
    { mu1: 0.3, nu1: 0.6, mu2: 0.25, nu2: 0.65, z_minus: 0.08, z_plus: 0.28, decision: "DO NOT TREAT" },
    { mu1: 0.5, nu1: 0.3, mu2: 0.4, nu2: 0.5, z_minus: 0.1, z_plus: 0.45, decision: "REQUEST EXAMS" },
    { mu1: 0.9, nu1: 0.05, mu2: 0.85, nu2: 0.1, z_minus: 0.02, z_plus: 0.25, decision: "TREAT" },
  ]

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Dataset & Analytics</CardTitle>
        <CardDescription>Training data and historical analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleUpload}
          variant="outline"
          className="w-full border-border hover:bg-secondary bg-transparent"
        >
          📁 Upload CSV (dataset_xor_medico.csv)
        </Button>

        {/* Filter Dropdown */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Filter by Decision</label>
          <select className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Decisions</option>
            <option>TREAT</option>
            <option>DO NOT TREAT</option>
            <option>REQUEST EXAMS</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 font-semibold text-foreground">μ₁</th>
                <th className="text-left py-2 px-2 font-semibold text-foreground">ν₁</th>
                <th className="text-left py-2 px-2 font-semibold text-foreground">μ₂</th>
                <th className="text-left py-2 px-2 font-semibold text-foreground">ν₂</th>
                <th className="text-left py-2 px-2 font-semibold text-foreground">z₋</th>
                <th className="text-left py-2 px-2 font-semibold text-foreground">z₊</th>
                <th className="text-left py-2 px-2 font-semibold text-foreground">Decision</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-2 px-2 text-muted-foreground">{row.mu1.toFixed(2)}</td>
                  <td className="py-2 px-2 text-muted-foreground">{row.nu1.toFixed(2)}</td>
                  <td className="py-2 px-2 text-muted-foreground">{row.mu2.toFixed(2)}</td>
                  <td className="py-2 px-2 text-muted-foreground">{row.nu2.toFixed(2)}</td>
                  <td className="py-2 px-2 text-muted-foreground">{row.z_minus.toFixed(2)}</td>
                  <td className="py-2 px-2 text-muted-foreground">{row.z_plus.toFixed(2)}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        row.decision === "TREAT"
                          ? "bg-success/10 text-success"
                          : row.decision === "DO NOT TREAT"
                            ? "bg-muted/50 text-muted-foreground"
                            : "bg-warning/10 text-warning"
                      }`}
                    >
                      {row.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Placeholder for Heatmap */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Conflict vs Recommendation</p>
          <div className="bg-secondary/30 border border-border rounded-lg h-40 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Heatmap placeholder (future visualization)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
