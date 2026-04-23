// @ts-nocheck
"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState("")

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    if (!savedRole) { window.location.href = "/login"; return }
    setRole(savedRole)

    Promise.all([
      fetch("https://assetvalet-production.up.railway.app/condition-reports").then(r => r.json()),
      fetch("https://assetvalet-production.up.railway.app/assets").then(r => r.json()),
    ]).then(([r, a]) => {
      setReports(r)
      setAssets(a)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getAssetName = (id) => assets.find(a => a.asset_id === id)?.name || "—"

  const statusColor = {
    "Good": { color: "#10b981", bg: "#d1fae5" },
    "Damaged": { color: "#ef4444", bg: "#fee2e2" },
    "In Repair": { color: "#f59e0b", bg: "#fef3c7" },
    "Lost": { color: "#6366f1", bg: "#eef2ff" },
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <Sidebar role={role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Navbar */}
        <div style={{
          height: "64px",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
            📋 Condition Reports
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => { localStorage.clear(); window.location.href = "/login" }}
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "none",
                backgroundColor: "#ef4444", color: "white", cursor: "pointer",
                fontSize: "13px", fontWeight: "600",
              }}
            >Logout</button>
            <ThemeToggle />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px", marginBottom: "32px",
          }}>
            {[
              { label: "Total Reports", value: reports.length, icon: "📋", bg: "#eef2ff" },
              { label: "Damaged", value: reports.filter(r => r.condition_status === "Damaged").length, icon: "❌", bg: "#fee2e2" },
              { label: "In Repair", value: reports.filter(r => r.condition_status === "In Repair").length, icon: "🔧", bg: "#fef3c7" },
              { label: "Lost", value: reports.filter(r => r.condition_status === "Lost").length, icon: "🔍", bg: "#e0f2fe" },
            ].map(stat => (
              <div key={stat.label} style={{
                backgroundColor: "var(--surface)", borderRadius: "12px",
                padding: "20px", border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  backgroundColor: stat.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "18px", marginBottom: "12px",
                }}>{stat.icon}</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
                  {loading ? "..." : stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Reports Table */}
          <div style={{
            backgroundColor: "var(--surface)", borderRadius: "12px",
            border: "1px solid var(--border)", overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid var(--border)",
              fontSize: "15px", fontWeight: "600", color: "var(--text-primary)",
            }}>
              All Condition Reports
            </div>

            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                Loading...
              </div>
            ) : reports.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                No reports yet! Employees can submit reports from their dashboard.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg)" }}>
                    {["ID", "Asset", "Evidence", "Date", "Condition", "Description", "Action Taken"].map(h => (
                      <th key={h} style={{
                        padding: "12px 24px", textAlign: "left", fontSize: "12px",
                        fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        #{report.id}
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
                        {getAssetName(report.asset_id)}
                      </td>
                      {/* Evidence Column */}
                      <td style={{ padding: "14px 24px" }}>
                        {report.image ? (
                          <img 
                            src={report.image} 
                            alt="Evidence" 
                            style={{ 
                              width: "48px", 
                              height: "48px", 
                              borderRadius: "6px", 
                              objectFit: "cover",
                              border: "1px solid var(--border)",
                              cursor: "pointer"
                            }} 
                            onClick={() => {
                              const win = window.open()
                              win?.document.write(`<img src="${report.image}" style="max-width:100%;max-height:100vh;" />`)
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>No Image</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        {report.report_date}
                      </td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{
                          fontSize: "12px", fontWeight: "600", padding: "4px 10px",
                          borderRadius: "20px",
                          color: statusColor[report.condition_status]?.color || "#64748b",
                          backgroundColor: statusColor[report.condition_status]?.bg || "#f1f5f9",
                        }}>
                          {report.condition_status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)", maxWidth: "200px" }}>
                        {report.description}
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        {report.action_taken || "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}