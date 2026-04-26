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

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    asset_id: "",
    employee_id: "",
    assignment_date: "",
    expected_return_date: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    if (!savedRole) { window.location.href = "/login"; return }
    setRole(savedRole)

    Promise.all([
      fetch("https://assetvalet-production.up.railway.app/assignments").then(r => r.json()),
      fetch("https://assetvalet-production.up.railway.app/assets").then(r => r.json()),
      fetch("https://assetvalet-production.up.railway.app/employees").then(r => r.json()),
    ]).then(([a, assets, emps]) => {
      setAssignments(a)
      setAssets(assets)
      setEmployees(emps)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getAssetName = (id) => assets.find(a => a.asset_id === id)?.name || "—"
  const getEmployeeName = (id) => employees.find(e => e.employee_id === id)?.name || "—"

  const handleAssign = async () => {
    setFormError("")
    if (!form.asset_id || !form.employee_id || !form.assignment_date) {
      setFormError("Please fill in all required fields.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("https://assetvalet-production.up.railway.app/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: Number(form.asset_id),
          employee_id: Number(form.employee_id),
          assignment_date: form.assignment_date,
          expected_return_date: form.expected_return_date || null,
        }),
      })
      if (!res.ok) throw new Error("Failed to assign")
      const newAssignment = await res.json()
      setAssignments(prev => [...prev, newAssignment])
      setShowModal(false)
      setForm({ asset_id: "", employee_id: "", assignment_date: "", expected_return_date: "" })
    } catch (e) {
      setFormError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
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
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>
                All Assignments
              </div>
              {role === "admin" && (
                <button
                  onClick={() => { setShowModal(true); setFormError("") }}
                  style={{
                    padding: "8px 16px", borderRadius: "8px", border: "none",
                    backgroundColor: "#0ea5e9", color: "white", cursor: "pointer",
                    fontSize: "13px", fontWeight: "600", display: "flex",
                    alignItems: "center", gap: "6px",
                  }}
                >
                  ＋ Assign Asset
                </button>
              )}
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

      {/* Assign Asset Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "var(--surface)", borderRadius: "16px",
            border: "1px solid var(--border)", padding: "32px",
            width: "100%", maxWidth: "460px",
          }}>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "24px" }}>
              🔗 Assign Asset to Employee
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Asset <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={form.asset_id}
                onChange={e => setForm(f => ({ ...f, asset_id: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "8px",
                  border: "1px solid var(--border)", backgroundColor: "var(--bg)",
                  color: "var(--text-primary)", fontSize: "14px", cursor: "pointer",
                }}
              >
                <option value="">Select an asset...</option>
                {assets.map(a => (
                  <option key={a.asset_id} value={a.asset_id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Employee <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={form.employee_id}
                onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "8px",
                  border: "1px solid var(--border)", backgroundColor: "var(--bg)",
                  color: "var(--text-primary)", fontSize: "14px", cursor: "pointer",
                }}
              >
                <option value="">Select an employee...</option>
                {employees.map(e => (
                  <option key={e.employee_id} value={e.employee_id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Assignment Date <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                value={form.assignment_date}
                onChange={e => setForm(f => ({ ...f, assignment_date: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "8px",
                  border: "1px solid var(--border)", backgroundColor: "var(--bg)",
                  color: "var(--text-primary)", fontSize: "14px", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Expected Return Date <span style={{ color: "var(--text-secondary)", fontWeight: "400" }}>(optional)</span>
              </label>
              <input
                type="date"
                value={form.expected_return_date}
                onChange={e => setForm(f => ({ ...f, expected_return_date: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "8px",
                  border: "1px solid var(--border)", backgroundColor: "var(--bg)",
                  color: "var(--text-primary)", fontSize: "14px", boxSizing: "border-box",
                }}
              />
            </div>

            {formError && (
              <div style={{
                marginBottom: "16px", padding: "10px 14px", borderRadius: "8px",
                backgroundColor: "#fef2f2", border: "1px solid #fecaca",
                color: "#dc2626", fontSize: "13px",
              }}>
                {formError}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowModal(false)
                  setFormError("")
                  setForm({ asset_id: "", employee_id: "", assignment_date: "", expected_return_date: "" })
                }}
                style={{
                  padding: "10px 20px", borderRadius: "8px",
                  border: "1px solid var(--border)", backgroundColor: "var(--bg)",
                  color: "var(--text-primary)", cursor: "pointer",
                  fontSize: "13px", fontWeight: "600",
                }}
              >Cancel</button>
              <button
                onClick={handleAssign}
                disabled={submitting}
                style={{
                  padding: "10px 20px", borderRadius: "8px", border: "none",
                  backgroundColor: submitting ? "#7dd3fc" : "#0ea5e9",
                  color: "white", cursor: submitting ? "not-allowed" : "pointer",
                  fontSize: "13px", fontWeight: "600",
                }}
              >{submitting ? "Assigning..." : "Assign Asset"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}