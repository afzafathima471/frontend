"use client"

import Link from "next/link"

export default function Sidebar() {

  // Temporary role simulation
  const user = {
    role: "employee"   // change to "employee" to test
  }

  const adminLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Assets", path: "/assets" },
    { name: "Employees", path: "/employees" },
    { name: "Assignments", path: "/assignments" },
    { name: "Reports", path: "/reports" }
  ]

  const employeeLinks = [
    { name: "My Assets", path: "/my-assets" },
    { name: "Report Issue", path: "/report-issue" }
  ]

  const links = user.role === "admin" ? adminLinks : employeeLinks

  return (
    <div className="w-60 h-screen bg-slate-900 text-white p-4">

      <h2 className="text-xl font-bold mb-6">
        OptiAsset
      </h2>

      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.path}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}