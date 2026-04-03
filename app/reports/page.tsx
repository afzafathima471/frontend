// @ts-nocheck
"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ReportsPage() {
  const [assets, setAssets] = useState([])
  const [employees, setEmployees] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState("")

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    if (!savedRole) { window.location.href = "/login"; return }
    setRole(savedRole)

    Promise.all([
      fetch("http://localhost:8000/assets").then(r => r.json()),
      fetch("http://localhost:8000/employees").then(r => r.json()),
      fetch("http://localhost:8000/assignments").then(r => r.json()),
    ]).then(([a, e, asgn]) => {
      setAssets(a)
      setEmployees(e)
      setAssignments(asgn)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

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
            📊 Reports
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

          {/* Summary Cards */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px", marginBottom: "32px",
          }}>
            {[
              { label: "Total Assets", value: assets.length, icon: "💼", bg: "#eef2ff", color: "#6366f1" },
              { label: "Total Employees", value: employees.length, icon: "👥", bg: "#e0f2fe", color: "#0ea5e9" },
              { label: "Total Assignments", value: assignments.length, icon: "🔗", bg: "#d1fae5", color: "#10b981" },
              { label: "Assets In Repair", value: assets.filter(a => a.status === "In Repair").length, icon: "🔧", bg: "#fef3c7", color: "#f59e0b" },
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

          {/* Two column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

            {/* Asset Status Breakdown */}
            <div style={{
              backgroundColor: "var(--surface)", borderRadius: "12px",
              border: "1px solid var(--border)", padding: "24px",
            }}>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "20px" }}>
                📊 Asset Status Breakdown
              </div>
              {[
                { label: "Available", value: assets.filter(a => a.status === "Available").length, color: "#10b981", bg: "#d1fae5" },
                { label: "Assigned", value: assets.filter(a => a.status === "Assigned").length, color: "#0ea5e9", bg: "#e0f2fe" },
                { label: "In Repair", value: assets.filter(a => a.status === "In Repair").length, color: "#f59e0b", bg: "#fef3c7" },
                { label: "Retired", value: assets.filter(a => a.status === "Retired").length, color: "#ef4444", bg: "#fee2e2" },
              ].map(item => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: "16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "10px", height: "10px", borderRadius: "50%",
                      backgroundColor: item.color,
                    }} />
                    <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>{item.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      height: "8px", borderRadius: "4px",
                      backgroundColor: item.bg, width: "100px",
                    }}>
                      <div style={{
                        height: "8px", borderRadius: "4px",
                        backgroundColor: item.color,
                        width: assets.length ? `${(item.value / assets.length) * 100}%` : "0%",
                      }} />
                    </div>
                    <span style={{
                      fontSize: "12px", fontWeight: "600", padding: "2px 8px",
                      borderRadius: "12px", color: item.color, backgroundColor: item.bg,
                    }}>{loading ? "..." : item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Department Breakdown */}
            <div style={{
              backgroundColor: "var(--surface)", borderRadius: "12px",
              border: "1px solid var(--border)", padding: "24px",
            }}>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "20px" }}>
                🏢 Employees by Department
              </div>
              {loading ? (
                <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
              ) : (
                [...new Set(employees.map(e => e.department))].map((dept, i) => {
                  const count = employees.filter(e => e.department === dept).length
                  const colors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"]
                  const bgs = ["#eef2ff", "#e0f2fe", "#d1fae5", "#fef3c7", "#fee2e2"]
                  return (
                    <div key={dept} style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", marginBottom: "16px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "10px", height: "10px", borderRadius: "50%",
                          backgroundColor: colors[i % colors.length],
                        }} />
                        <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>{dept}</span>
                      </div>
                      <span style={{
                        fontSize: "12px", fontWeight: "600", padding: "2px 8px",
                        borderRadius: "12px",
                        color: colors[i % colors.length],
                        backgroundColor: bgs[i % bgs.length],
                      }}>{count} employees</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Recent Assignments */}
          <div style={{
            backgroundColor: "var(--surface)", borderRadius: "12px",
            border: "1px solid var(--border)", overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid var(--border)",
              fontSize: "15px", fontWeight: "600", color: "var(--text-primary)",
            }}>
              🔗 Recent Assignments Summary
            </div>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
            ) : assignments.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                No assignments yet!
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg)" }}>
                    {["Assignment ID", "Asset ID", "Employee ID", "Date", "Status"].map(h => (
                      <th key={h} style={{
                        padding: "12px 24px", textAlign: "left", fontSize: "12px",
                        fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.slice(0, 5).map(a => (
                    <tr key={a.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>#{a.id}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-primary)" }}>#{a.asset_id}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>#{a.employee_id}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>{a.assignment_date}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{
                          fontSize: "12px", fontWeight: "600", padding: "4px 10px",
                          borderRadius: "20px",
                          color: a.actual_return_date ? "#10b981" : "#0ea5e9",
                          backgroundColor: a.actual_return_date ? "#d1fae5" : "#e0f2fe",
                        }}>
                          {a.actual_return_date ? "Returned" : "Active"}
                        </span>
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