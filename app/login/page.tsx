"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://assetvalet-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Invalid Username or Password!");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // LocalStorage mein save karo
      if (data) {
      localStorage.setItem("employee_id", String(data.employee_id));
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.username);

      router.push("/");
      }

    } catch (err) {
      setError("Server se connect nahi ho pa raha. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={containerStyle}>
      <div style={glassCard}>
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h2 style={{ color: "#fff", fontSize: "32px", fontWeight: "700", margin: "0 0 10px 0" }}>
            Welcome Back
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        {error && <p style={errorBox}>{error}</p>}

        <form onSubmit={handleLogin} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={optionsRow}>
            <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <input type="checkbox" style={{ marginRight: "8px", accentColor: "#1de9b6" }} />
              Remember Me
            </label>
            <a href="#" style={{ color: "#1de9b6", textDecoration: "none" }}>Forgot Password?</a>
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={footerStyle}>
          <p>Don't have an account? <span style={{ color: "#1de9b6", cursor: "pointer" }}>Sign Up</span></p>
          <div style={divider}><span>Or Sign In With</span></div>
          <div style={socialRow}>
            <div style={socialIcon}>G</div>
            <div style={socialIcon}>in</div>
            <div style={socialIcon}>M</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- STYLES (same as before) ---
const containerStyle: React.CSSProperties = {
  height: "100vh", width: "100vw", display: "flex", alignItems: "center",
  justifyContent: "flex-end", paddingRight: "10%",
  backgroundImage: "url('/login-bg.png')", backgroundSize: "cover",
  backgroundPosition: "center", position: "fixed", top: 0, left: 0,
  zIndex: 9999, fontFamily: "'Sora', sans-serif", overflow: "hidden"
};
const glassCard: React.CSSProperties = {
  width: "100%", maxWidth: "420px", padding: "50px 40px", borderRadius: "32px",
  background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(25px)",
  WebkitBackdropFilter: "blur(25px)", border: "1px solid rgba(255, 255, 255, 0.91)",
  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.93)", zIndex: 10, color: "#ffffffee"
};
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "24px" };
const inputGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle: React.CSSProperties = { fontSize: "13px", color: "rgba(255,255,255,0.8)", marginLeft: "4px" };
const inputStyle: React.CSSProperties = {
  padding: "15px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.3)", color: "#fff", outline: "none", fontSize: "15px"
};
const optionsRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(255, 255, 255, 0.98)" };
const buttonStyle: React.CSSProperties = {
  padding: "16px", borderRadius: "14px", border: "none", background: "#1de9b6",
  color: "#01221c", fontWeight: "700", fontSize: "16px", cursor: "pointer",
  boxShadow: "0 8px 20px rgba(29, 233, 182, 0.3)", marginTop: "10px"
};
const errorBox: React.CSSProperties = {
  background: "rgba(255, 77, 77, 0.15)", color: "#800e14", padding: "10px",
  borderRadius: "10px", fontSize: "14px", textAlign: "center",
  marginBottom: "20px", border: "1px solid rgba(255, 77, 77, 0.2)"
};
const footerStyle: React.CSSProperties = { marginTop: "35px", textAlign: "center", fontSize: "13px", color: "rgba(255, 255, 255, 0.95)" };
const divider: React.CSSProperties = { margin: "25px 0", borderTop: "1px solid rgba(255, 255, 255, 0.97)", position: "relative" };
const socialRow: React.CSSProperties = { display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" };
const socialIcon: React.CSSProperties = {
  width: "42px", height: "42px", borderRadius: "50%", border: "1px solid rgba(255, 255, 255, 0.94)",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff"
};