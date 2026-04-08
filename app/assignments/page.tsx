// @ts-nocheck
"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [assets, setAssets] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState("")

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    if (!savedRole) { window.location.href = "/login"; return }
    setRole(savedRole)

    Promise.all([
      fetch("http://assetvalet-production.up.railway.app/assignments").then(r => r.json()),
      fetch("http://assetvalet-production.up.railway.app/assets").then(r => r.json()),
      fetch("http://assetvalet-production.up.railway.app/employees").then(r => r.json()),
    ]).then(([a, assets, emps]) => {
      setAssignments(a)
      setAssets(assets)
      setEmployees(emps)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getAssetName = (id) => assets.find(a => a.asset_id === id)?.name || "—"
  const getEmployeeName = (id) => employees.find(e => e.employee_id === id)?.name || "—"

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
            🔗 Assignments
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
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px", marginBottom: "32px",
          }}>
            {[
              { label: "Total Assignments", value: assignments.length, icon: "🔗", bg: "#e0f2fe" },
              { label: "Active", value: assignments.filter(a => !a.actual_return_date).length, icon: "✅", bg: "#d1fae5" },
              { label: "Returned", value: assignments.filter(a => a.actual_return_date).length, icon: "↩️", bg: "#fef3c7" },
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

          {/* Table */}
          <div style={{
            backgroundColor: "var(--surface)", borderRadius: "12px",
            border: "1px solid var(--border)", overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid var(--border)",
              fontSize: "15px", fontWeight: "600", color: "var(--text-primary)",
            }}>
              All Assignments
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
                    {["ID", "Asset", "Employee", "Assigned Date", "Expected Return", "Status"].map(h => (
                      <th key={h} style={{
                        padding: "12px 24px", textAlign: "left", fontSize: "12px",
                        fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>#{assignment.id}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
                        {getAssetName(assignment.asset_id)}
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "50%",
                            backgroundColor: "#e8f5f2", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "12px", fontWeight: "700",
                            color: "#0d6e5a",
                          }}>
                            {getEmployeeName(assignment.employee_id)?.charAt(0)}
                          </div>
                          {getEmployeeName(assignment.employee_id)}
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        {assignment.assignment_date}
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        {assignment.expected_return_date || "—"}
                      </td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{
                          fontSize: "12px", fontWeight: "600", padding: "4px 10px",
                          borderRadius: "20px",
                          color: assignment.actual_return_date ? "#10b981" : "#0ea5e9",
                          backgroundColor: assignment.actual_return_date ? "#d1fae5" : "#e0f2fe",
                        }}>
                          {assignment.actual_return_date ? "Returned" : "Active"}
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