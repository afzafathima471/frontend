"use client"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const role = "admin" // change to "employee" for employee view

const stats = [
  { label: "Total Assets", value: "248", icon: "💼", color: "#6366f1", bg: "#eef2ff" },
  { label: "Assigned", value: "183", icon: "🔗", color: "#0ea5e9", bg: "#e0f2fe" },
  { label: "Available", value: "41", icon: "✅", color: "#10b981", bg: "#d1fae5" },
  { label: "In Repair", value: "24", icon: "🔧", color: "#f59e0b", bg: "#fef3c7" },
]

const assets = [
  { name: "MacBook Pro 14\"", employee: "Rahul Sharma", status: "Assigned", dept: "Engineering" },
  { name: "Dell Monitor 27\"", employee: "Priya Nair", status: "Available", dept: "Design" },
  { name: "iPhone 14 Pro", employee: "Amit Verma", status: "In Repair", dept: "Sales" },
  { name: "Logitech MX Keys", employee: "Sara Khan", status: "Assigned", dept: "HR" },
  { name: "iPad Air 5th Gen", employee: "Unassigned", status: "Available", dept: "—" },
]

const statusColor: Record<string, { color: string; bg: string }> = {
  Assigned: { color: "#0ea5e9", bg: "#e0f2fe" },
  Available: { color: "#10b981", bg: "#d1fae5" },
  "In Repair": { color: "#f59e0b", bg: "#fef3c7" },
  Retired: { color: "#ef4444", bg: "#fee2e2" },
}

export default function Home() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <Sidebar role={role} />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Top Navbar */}
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

        {/* Page Body */}
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
                boxShadow: "var(--card-shadow)",
                border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: "40px", height: "40px",
                  borderRadius: "10px",
                  backgroundColor: stat.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px",
                  marginBottom: "12px",
                }}>
                  {stat.icon}
                </div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Assets Table */}
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            boxShadow: "var(--card-shadow)",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>
                Recent Assets
              </div>
              <div style={{ fontSize: "13px", color: "#6366f1", cursor: "pointer" }}>
                View all →
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg)" }}>
                  {["Asset Name", "Employee", "Department", "Status"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, i) => (
                  <tr key={i} style={{
                    borderTop: "1px solid var(--border)",
                    transition: "background 0.15s",
                  }}>
                    <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
                      {asset.name}
                    </td>
                    <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                      {asset.employee}
                    </td>
                    <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                      {asset.dept}
                    </td>
                    <td style={{ padding: "14px 24px" }}>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        color: statusColor[asset.status]?.color,
                        backgroundColor: statusColor[asset.status]?.bg,
                      }}>
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}