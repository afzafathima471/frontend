// @ts-nocheck 
"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const role = "admin"

const statusColor: Record<string, { color: string; bg: string }> = {
  Assigned: { color: "#0ea5e9", bg: "#e0f2fe" },
  Available: { color: "#10b981", bg: "#d1fae5" },
  "In Repair": { color: "#f59e0b", bg: "#fef3c7" },
  Retired: { color: "#ef4444", bg: "#fee2e2" },
}

export default function Home() {
  const [employees, setEmployees] = useState([]) 
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, assetRes] = await Promise.all([
          fetch("http://localhost:8000/employees"),
          fetch("http://localhost:8000/assets"),
        ])
        const empData = await empRes.json()
        const assetData = await assetRes.json()
        setEmployees(empData)
        setAssets(assetData)
      } catch (error) {
        console.error("API Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { label: "Total Assets", value: assets.length, icon: "💼", bg: "#eef2ff" },
    { label: "Employees", value: employees.length, icon: "👥", bg: "#e0f2fe" },
    { label: "Available", value: assets.filter((a: any) => a.status === "Available").length, icon: "✅", bg: "#d1fae5" },
    { label: "In Repair", value: assets.filter((a: any) => a.status === "In Repair").length, icon: "🔧", bg: "#fef3c7" },
  ]

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
          <div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>
              👋 Welcome back, Afza
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Here's what's happening today
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Body */}
        <div style={{ padding: "32px", flex: 1 }}>

          {/* Stat Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "32px",
          }}>
            {stats.map((stat) => (
              <div key={stat.label} style={{
                backgroundColor: "var(--surface)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: "40px", height: "40px",
                  borderRadius: "10px",
                  backgroundColor: stat.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", marginBottom: "12px",
                }}>
                  {stat.icon}
                </div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
                  {loading ? "..." : stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Assets Table */}
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border)",
              fontSize: "15px",
              fontWeight: "600",
              color: "var(--text-primary)",
            }}>
              Assets from Database
            </div>

            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                Loading...
              </div>
            ) : assets.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                No assets found. Add some from Swagger UI!
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg)" }}>
                    {["Asset Name", "Type", "Status", "Condition"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 24px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset: any) => (
                    <tr key={asset.asset_id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
                        {asset.name}
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        {asset.asset_type}
                      </td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          color: statusColor[asset.status]?.color || "#64748b",
                          backgroundColor: statusColor[asset.status]?.bg || "#f1f5f9",
                        }}>
                          {asset.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        {asset.current_condition || "—"}
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