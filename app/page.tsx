// @ts-nocheck
"use client"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const statusColor = {
  Assigned: { color: "#0ea5e9", bg: "#e0f2fe" },
  Available: { color: "#10b981", bg: "#d1fae5" },
  "In Repair": { color: "#f59e0b", bg: "#fef3c7" },
  Retired: { color: "#ef4444", bg: "#fee2e2" },
}

export default function Home() {
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  const [employees, setEmployees] = useState([])
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { setTheme } = useTheme()

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    const savedName = localStorage.getItem("name")
    if (!savedRole) {
      window.location.href = "/login"
      return
    }
    setRole(savedRole)
    setName(savedName || "User")
    setTheme(savedRole === "admin" ? "dark" : "light")
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
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
  }, [ready])

  const handleRoleSwitch = () => {
    const newRole = role === "admin" ? "employee" : "admin"
    setRole(newRole)
    setTheme(newRole === "admin" ? "dark" : "light")
    localStorage.setItem("role", newRole)
  }

  const filteredAssets = assets.filter((asset) => {
    const search = searchTerm.toLowerCase()
    const assignedEmployee = employees.find(emp => emp.employee_id === asset.employee_id)
    
    return (
      asset.asset_id?.toString().includes(search) ||
      asset.name?.toLowerCase().includes(search) ||
      asset.status?.toLowerCase().includes(search) ||
      assignedEmployee?.name?.toLowerCase().includes(search) ||
      assignedEmployee?.employee_id?.toString().includes(search)
    )
  })

  const stats = [
    { label: "Total Assets", value: assets.length, icon: "💼", bg: "#eef2ff" },
    { label: "Employees", value: employees.length, icon: "👥", bg: "#e0f2fe" },
    { label: "Available", value: assets.filter((a) => a.status === "Available").length, icon: "✅", bg: "#d1fae5" },
    { label: "In Repair", value: assets.filter((a) => a.status === "In Repair").length, icon: "🔧", bg: "#fef3c7" },
  ]

  if (!ready) return null

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
              👋 Welcome back, {name}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              {role === "admin" ? "Administrator View" : "Employee View"}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input 
              type="text" 
              placeholder="🔍 Search ID, Name, Status..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
                color: "var(--text-primary)",
                fontSize: "13px",
                width: "250px",
                outline: "none"
              }}
            />

            {/* Only show Switch button if current role is admin */}
            {role === "admin" && (
              <button
                onClick={handleRoleSwitch}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                👤 Switch to Employee
              </button>
            )}

            <button
              onClick={() => {
                localStorage.clear()
                window.location.href = "/login"
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#ef4444",
                color: "white",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "32px", flex: 1 }}>

          {/* Stat Cards — Admin only */}
          {role === "admin" && (
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
          )}

          {/* Assets Table — Admin only */}
          {role === "admin" && (
            <div style={{
              backgroundColor: "var(--surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              overflow: "hidden",
              marginBottom: "24px",
            }}>
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
                fontSize: "15px",
                fontWeight: "600",
                color: "var(--text-primary)",
                display: "flex",
                justifyContent: "space-between"
              }}>
                <span>Assets from Database</span>
                {searchTerm && <span style={{fontSize: "12px", color: "#6366f1"}}>Filtered Results: {filteredAssets.length}</span>}
              </div>

              {loading ? (
                <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                  Loading...
                </div>
              ) : filteredAssets.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                  No matches found for "{searchTerm}"
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--bg)" }}>
                      {["ID", "Asset Name", "Type", "Status", "Condition"].map((h) => (
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
                    {filteredAssets.map((asset) => (
                      <tr key={asset.asset_id} style={{ borderTop: "1px solid var(--border)" }}>
                        <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                          #{asset.asset_id}
                        </td>
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
          )}

          {/* Employee View */}
          {role === "employee" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{
                backgroundColor: "var(--surface)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "32px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>👋</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
                  Welcome, {name}!
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  You have access to your assigned assets only.
                </div>
              </div>

              <div style={{
                backgroundColor: "var(--surface)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "24px",
              }}>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>
                  💼 My Assigned Assets
                </div>
                {assets.filter((a) => a.status === "Assigned").length === 0 ? (
                  <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "24px" }}>
                    No assets assigned yet.
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "var(--bg)" }}>
                        {["Asset Name", "Type", "Status"].map((h) => (
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
                      {assets.filter((a) => a.status === "Assigned").map((asset) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}