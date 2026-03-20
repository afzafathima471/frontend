"use client"
import Link from "next/link"
import { useState } from "react"

const adminLinks = [
  { name: "Dashboard", path: "/dashboard", icon: "⬛" },
  { name: "Assets", path: "/assets", icon: "💼" },
  { name: "Employees", path: "/employees", icon: "👥" },
  { name: "Assignments", path: "/assignments", icon: "🔗" },
  { name: "Reports", path: "/reports", icon: "📊" },
]

const employeeLinks = [
  { name: "My Assets", path: "/my-assets", icon: "💼" },
  { name: "Report Issue", path: "/report-issue", icon: "🚨" },
]

export default function Sidebar({ role = "admin" }: { role?: string }) {
  const [active, setActive] = useState("Dashboard")
  const links = role === "admin" ? adminLinks : employeeLinks

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        gap: "4px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "32px", paddingLeft: "12px" }}>
        <div style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#ffffff",
          letterSpacing: "-0.5px",
        }}>
          Asset<span style={{ color: "#6366f1" }}>Valet</span>
        </div>
        <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>
          {role === "admin" ? "Administrator" : "Employee"}
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            onClick={() => setActive(link.name)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: active === link.name ? "600" : "400",
              color: active === link.name ? "#ffffff" : "var(--sidebar-text)",
              backgroundColor: active === link.name ? "#6366f1" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: "16px" }}>{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Bottom role badge */}
      <div style={{ marginTop: "auto", paddingLeft: "12px" }}>
        <div style={{
          fontSize: "11px",
          color: "#475569",
          padding: "8px 12px",
          backgroundColor: "#1e293b",
          borderRadius: "8px",
          display: "inline-block",
        }}>
          🔐 {role === "admin" ? "Admin Access" : "Employee Access"}
        </div>
      </div>
    </div>
  )
}