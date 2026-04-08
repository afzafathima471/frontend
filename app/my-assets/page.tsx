// @ts-nocheck
"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function MyAssetsPage() {
  const [myAssets, setMyAssets] = useState([])
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    const savedName = localStorage.getItem("name")
    
    if (!savedRole) { 
      window.location.href = "/login"
      return 
    }
    
    setRole(savedRole)
    setName(savedName || "User")

    // Fetch assets and match with savedName
    fetch("http://localhost:8000/assets")
      .then(r => r.json())
      .then(data => {
        // Dashboard pe jo dikh raha hai wahi yahan dikhne ke liye filter logic:
        const filtered = data.filter(a => 
          a.assigned_to?.toString().toLowerCase().trim() === savedName?.toString().toLowerCase().trim()
        )
        setMyAssets(filtered)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      backgroundColor: "var(--bg)", 
      fontFamily: "Inter, -apple-system, sans-serif" // Theme font matching
    }}>
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
          <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>
             My Assigned Assets
          </div>
          <ThemeToggle />
        </div>

        {/* Body */}
        <div style={{ padding: "40px", maxWidth: "1200px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 8px 0" }}>
              Welcome back, {name}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
              Here is the list of assets currently linked to your profile.
            </p>
          </div>

          {loading ? (
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Fetching your assets...</p>
          ) : myAssets.length === 0 ? (
            <div style={{
              padding: "60px 20px", 
              textAlign: "center", 
              backgroundColor: "var(--surface)", 
              borderRadius: "16px",
              border: "1px dashed var(--border)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{ fontSize: "32px" }}>📦</div>
              <div style={{ color: "var(--text-primary)", fontWeight: "600" }}>No assets found</div>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", maxWidth: "300px", margin: 0 }}>
                It seems there are no assets assigned to "{name}" in our records.
              </p>
            </div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
              gap: "24px" 
            }}>
              {myAssets.map((asset) => (
                <div key={asset.asset_id} style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "24px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ 
                        fontSize: "12px", 
                        fontWeight: "700", 
                        color: "#0d6e5a", 
                        backgroundColor: "#e6f4f1", 
                        padding: "4px 10px", 
                        borderRadius: "20px",
                        textTransform: "uppercase"
                      }}>
                        {asset.category || "Asset"}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        #{asset.asset_tag}
                      </span>
                    </div>
                    
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 12px 0" }}>
                      {asset.name}
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>Status</span>
                        <span style={{ color: "#10b981", fontWeight: "600" }}>Active</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>Serial</span>
                        <span style={{ color: "var(--text-primary)" }}>{asset.serial_number || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/report-issue" style={{
                    marginTop: "24px",
                    textDecoration: "none",
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "#ef4444",
                    fontSize: "13px",
                    fontWeight: "600",
                    display: "block",
                    transition: "all 0.2s"
                  }}>
                    🚨 Report Issue
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}