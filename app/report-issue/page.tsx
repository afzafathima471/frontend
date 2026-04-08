// @ts-nocheck
"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ReportIssuePage() {
  const [assets, setAssets] = useState([])
  const [myReports, setMyReports] = useState([]) 
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    asset_id: "",
    condition_status: "Damaged",
    description: "",
    action_taken: "",
    report_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    const savedName = localStorage.getItem("name")
    if (!savedRole) { window.location.href = "/login"; return }
    setRole(savedRole)
    setName(savedName || "User")

    // 1. Saare Assets fetch karna
    fetch("http://localhost:8000/assets")
      .then(r => r.json())
      .then(data => setAssets(data))

    // 2. Is user ki purani reports fetch karna
    fetch("http://localhost:8000/condition-reports")
      .then(r => r.json())
      .then(data => {
        // Sirf wahi reports dikhao jo is user ne submit ki hain
        const filtered = data.filter(r => r.reported_by === (savedName || "User"))
        setMyReports(filtered.reverse()) // Latest report upar dikhegi
      })
  }, [])

  const handleSubmit = async () => {
    if (!form.asset_id || !form.description) {
      alert("Please fill all required fields!")
      return
    }
    setLoading(true)
    
    const reportData = {
      ...form,
      asset_id: parseInt(form.asset_id),
      reported_by: name, // Tracking ke liye name bhej rahe hain
    }

    try {
      const res = await fetch("http://localhost:8000/condition-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      })
      
      if (res.ok) {
        setSuccess(true)
        // Turant list mein nayi report add karna
        setMyReports([reportData, ...myReports])
        
        setForm({
          asset_id: "",
          condition_status: "Damaged",
          description: "",
          action_taken: "",
          report_date: new Date().toISOString().split("T")[0],
        })
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      alert("Error submitting report!")
    } finally {
      setLoading(false)
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
            🚨 Report Issue
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

        {/* Main Content Area */}
        <div style={{ padding: "32px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
          
          {/* Form Section */}
          <div style={{ flex: "1", minWidth: "400px", maxWidth: "600px" }}>
            {success && (
              <div style={{
                backgroundColor: "#d1fae5", color: "#10b981",
                padding: "16px", borderRadius: "12px",
                marginBottom: "24px", fontSize: "14px", fontWeight: "600",
              }}>
                ✅ Report submitted successfully!
              </div>
            )}

            <div style={{
              backgroundColor: "var(--surface)", borderRadius: "12px",
              border: "1px solid var(--border)", padding: "32px",
            }}>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "24px" }}>
                Submit Asset Issue Report
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                  Select Asset *
                </label>
                <select
                  value={form.asset_id}
                  onChange={e => setForm({ ...form, asset_id: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "10px",
                    border: "1.5px solid var(--border)", fontSize: "14px",
                    backgroundColor: "var(--bg)", color: "var(--text-primary)", outline: "none",
                  }}
                >
                  <option value="">-- Select Asset --</option>
                  {assets.map(a => (
                    <option key={a.asset_id} value={a.asset_id}>{a.name} ({a.asset_tag})</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                  Condition Status *
                </label>
                <select
                  value={form.condition_status}
                  onChange={e => setForm({ ...form, condition_status: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "10px",
                    border: "1.5px solid var(--border)", fontSize: "14px",
                    backgroundColor: "var(--bg)", color: "var(--text-primary)", outline: "none",
                  }}
                >
                  <option value="Damaged">Damaged</option>
                  <option value="In Repair">In Repair</option>
                  <option value="Lost">Lost</option>
                  <option value="Good">Good</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What is the issue?"
                  rows={4}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "10px",
                    border: "1.5px solid var(--border)", fontSize: "14px",
                    backgroundColor: "var(--bg)", color: "var(--text-primary)",
                    outline: "none", resize: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", padding: "14px", borderRadius: "10px",
                  border: "none", backgroundColor: "#0d6e5a",
                  color: "white", fontSize: "15px", fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Submitting..." : "Submit Report 🚨"}
              </button>
            </div>
          </div>

          {/* Previous Reports Section */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <div style={{
              backgroundColor: "var(--surface)", borderRadius: "12px",
              border: "1px solid var(--border)", padding: "24px",
              maxHeight: "75vh", overflowY: "auto"
            }}>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>
                My Submitted Reports
              </div>
              
              {myReports.length === 0 ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>No reports yet.</div>
              ) : (
                myReports.map((report, idx) => (
                  <div key={idx} style={{
                    padding: "16px", borderRadius: "8px", border: "1px solid var(--border)",
                    marginBottom: "12px", backgroundColor: "var(--bg)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "700", fontSize: "14px" }}>Asset #{report.asset_id}</span>
                      <span style={{ 
                        fontSize: "11px", padding: "2px 8px", borderRadius: "4px",
                        backgroundColor: "#fee2e2", color: "#ef4444", fontWeight: "600"
                      }}>{report.condition_status}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-primary)" }}>{report.description}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "8px" }}>{report.report_date}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}