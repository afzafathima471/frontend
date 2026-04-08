// @ts-nocheck
"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  
  // Search and Modal States
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null) // Tracks which 3-dot menu is open
  const [newEmployee, setNewEmployee] = useState({ name: "", department: "", designation: "" })

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    const savedName = localStorage.getItem("name")
    if (!savedRole) { window.location.href = "/login"; return }
    setRole(savedRole)
    setName(savedName || "User")
    fetchEmployees()
  }, [])

  const fetchEmployees = () => {
    setLoading(true)
    fetch("http://assetvalet-production.up.railway.app/employees")
      .then(res => res.json())
      .then(data => { setEmployees(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const handleAddEmployee = async () => {
    if (!newEmployee.name) return alert("Name is required")
    try {
      const res = await fetch("http://assetvalet-production.up.railway.app/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEmployee,
          joining_date: new Date().toISOString().split('T')[0]
        })
      })
      if (res.ok) {
        setShowAddModal(false)
        setNewEmployee({ name: "", department: "", designation: "" })
        fetchEmployees()
      }
    } catch (err) { console.error(err) }
  }

  const handleDeleteEmployee = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return
    try {
      const res = await fetch(`http://assetvalet-production.up.railway.app/employees/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchEmployees()
        setActiveMenu(null)
      }
    } catch (err) { console.error(err) }
  }

  const filteredEmployees = employees.filter(emp => 
    emp.employee_id?.toString().includes(searchTerm) || 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <Sidebar role={role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Navbar */}
        <div style={{
          height: "64px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px",
        }}>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>👥 Employees</div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input 
              type="text" placeholder="Search ID or Name..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-primary)", outline: "none" }}
            />
            <button
              onClick={() => setShowAddModal(true)}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#10b981", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
            >+ Add Employee</button>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login" }} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#ef4444", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Logout</button>
            <ThemeToggle />
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          
          {/* Add Employee Form */}
          {showAddModal && (
            <div style={{ marginBottom: "24px", padding: "24px", backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>New Employee Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px" }}>
                <input placeholder="Full Name" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                <input placeholder="Department" value={newEmployee.department} onChange={e => setNewEmployee({...newEmployee, department: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                <input placeholder="Designation" value={newEmployee.designation} onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={handleAddEmployee} style={{ padding: "10px 20px", backgroundColor: "#10b981", color: "white", borderRadius: "8px", border: "none", fontWeight: "600" }}>Save</button>
                  <button onClick={() => setShowAddModal(false)} style={{ padding: "10px 20px", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-secondary)" }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", overflow: "visible" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>All Employees</div>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg)" }}>
                    {["ID", "Name", "Department", "Designation", "Joining Date", "Action"].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.employee_id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>#{emp.employee_id}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>{emp.name}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>{emp.department}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>{emp.designation}</td>
                      <td style={{ padding: "14px 24px", fontSize: "14px", color: "var(--text-secondary)" }}>{emp.joining_date}</td>
                      <td style={{ padding: "14px 24px", position: "relative" }}>
                        <button 
                          onClick={() => setActiveMenu(activeMenu === emp.employee_id ? null : emp.employee_id)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--text-secondary)" }}
                        >⋮</button>
                        
                        {activeMenu === emp.employee_id && (
                          <div style={{
                            position: "absolute", right: "40px", top: "10px", backgroundColor: "var(--surface)",
                            border: "1px solid var(--border)", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            zIndex: 10, padding: "4px", minWidth: "120px"
                          }}>
                            <button 
                              onClick={() => handleDeleteEmployee(emp.employee_id)}
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