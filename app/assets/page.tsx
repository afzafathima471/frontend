// @ts-nocheck
"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const statusColor = {
  Assigned: { color: "#0ea5e9", bg: "#e0f2fe" },
  Available: { color: "#10b981", bg: "#d1fae5" },
  "In Repair": { color: "#f59e0b", bg: "#fef3c7" },
  Retired: { color: "#ef4444", bg: "#fee2e2" },
}

export default function AssetsPage() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [newAsset, setNewAsset] = useState({ 
    name: "", 
    asset_type: "", 
    status: "Available", 
    current_condition: "Good" 
  })

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    const savedName = localStorage.getItem("name")
    if (!savedRole) { window.location.href = "/login"; return }
    setRole(savedRole)
    setName(savedName || "User")
    fetchAssets()
  }, [])

  const fetchAssets = () => {
    setLoading(true)
    fetch("https://assetvalet-production.up.railway.app/assets")
      .then(res => res.json())
      .then(data => { setAssets(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const handleAddAsset = async () => {
    if (!newAsset.name || !newAsset.asset_type) return alert("Please fill in Name and Type")
    try {
      const res = await fetch("https://assetvalet-production.up.railway.app/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAsset,
          purchase_date: new Date().toISOString().split('T')[0]
        })
      })
      if (res.ok) {
        setShowAddModal(false)
        setNewAsset({ name: "", asset_type: "", status: "Available", current_condition: "Good" })
        fetchAssets()
      }
    } catch (err) { console.error(err) }
  }

  const handleDeleteAsset = async (id) => {
    if (!confirm("Are you sure you want to delete this asset?")) return
    try {
      const res = await fetch(`https://assetvalet-production.up.railway.app/assets/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchAssets()
        setActiveMenu(null)
      }
    } catch (err) { console.error(err) }
  }

  // ✅ NEW: Status update handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`https://assetvalet-production.up.railway.app/assets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setAssets(prev =>
          prev.map(a => a.asset_id === id ? { ...a, status: newStatus } : a)
        )
      } else {
        alert("Failed to update status")
      }
    } catch (err) {
      console.error(err)
      alert("Error updating status")
    }
  }

  const filteredAssets = assets.filter(asset => {
    const search = searchTerm.toLowerCase()
    return (
      asset.asset_id?.toString().includes(search) ||
      asset.name?.toLowerCase().includes(search)
    )
  })

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <Sidebar role={role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Navbar */}
        <div style={{
          height: "64px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px",
        }}>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
            💼 Assets
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input 
              type="text" placeholder="🔍 Search Asset ID or Name..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-primary)", width: "250px", fontSize: "14px", outline: "none" }}
            />
            <button
              onClick={() => setShowAddModal(true)}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#10b981", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
            >+ Add Asset</button>
            <button
              onClick={() => { localStorage.clear(); window.location.href = "/login" }}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#ef4444", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
            >Logout</button>
            <ThemeToggle />
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          
          {showAddModal && (
            <div style={{ marginBottom: "24px", padding: "24px", backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>New Asset Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "12px" }}>
                <input placeholder="Asset Name" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                <input placeholder="Type (e.g. Laptop)" value={newAsset.asset_type} onChange={e => setNewAsset({...newAsset, asset_type: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                <input placeholder="Condition" value={newAsset.current_condition} onChange={e => setNewAsset({...newAsset, current_condition: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                <select value={newAsset.status} onChange={e => setNewAsset({...newAsset, status: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
                   <option value="Available">Available</option>
                   <option value="Assigned">Assigned</option>
                   <option value="In Repair">In Repair</option>
                   <option value="Retired">Retired</option>
                </select>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={handleAddAsset} style={{ padding: "10px 20px", backgroundColor: "#10b981", color: "white", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer" }}>Save</button>
                  <button onClick={() => setShowAddModal(false)} style={{ padding: "10px 20px", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", overflow: "visible" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>All Assets</span>
              {searchTerm && <span style={{fontSize: "12px", color: "#10b981"}}>Found: {filteredAssets.length}</span>}
            </div>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg)" }}>
                    {["ID", "Asset Name", "Type", "Purchase Date", "Status", "Condition", "Action"].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map(asset => (
                    <tr key={asset.asset_id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>#{asset.asset_id}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>{asset.name}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>{asset.asset_type}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>{asset.purchase_date}</td>
                      
                      {/* ✅ CHANGED: Status dropdown instead of badge */}
                      <td style={{ padding: "14px 24px" }}>
                        <select
                          value={asset.status}
                          onChange={(e) => handleStatusChange(asset.asset_id, e.target.value)}
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            border: "none",
                            cursor: "pointer",
                            outline: "none",
                            color: statusColor[asset.status]?.color || "#64748b",
                            backgroundColor: statusColor[asset.status]?.bg || "#f1f5f9",
                          }}
                        >
                          <option value="Available">Available</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Repair">In Repair</option>
                          <option value="Retired">Retired</option>
                        </select>
                      </td>

                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>{asset.current_condition || "—"}</td>
                      <td style={{ padding: "14px 24px", position: "relative" }}>
                        <button 
                          onClick={() => setActiveMenu(activeMenu === asset.asset_id ? null : asset.asset_id)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--text-secondary)" }}
                        >⋮</button>
                        
                        {activeMenu === asset.asset_id && (
                          <div style={{ position: "absolute", right: "40px", top: "10px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, padding: "4px", minWidth: "120px" }}>
                            <button 
                              onClick={() => handleDeleteAsset(asset.asset_id)}
                              style={{ width: "100%", textAlign: "left", padding: "8px 12px", backgroundColor: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                            >🗑️ Delete</button>
                          </div>
                        )}
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