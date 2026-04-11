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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes floatLaptop {
          0%, 100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(-18px) rotate(-8deg); }
        }
        @keyframes floatPhone {
          0%, 100% { transform: translateY(0px) rotate(6deg); }
          50% { transform: translateY(-14px) rotate(6deg); }
        }
        @keyframes floatTablet {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50% { transform: translateY(-10px) rotate(-4deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.85); opacity: 0.6; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(0.85); opacity: 0; }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .login-wrapper {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          position: fixed;
          top: 0; left: 0;
          z-index: 9999;
          font-family: 'Sora', sans-serif;
          overflow: hidden;
          background: #020f0b;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(29, 233, 182, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29, 233, 182, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 8s linear infinite;
          z-index: 0;
        }

        .orb-1 {
          position: absolute;
          width: 520px; height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(29, 233, 182, 0.12) 0%, transparent 70%);
          top: -150px; left: -80px;
          animation: orbFloat 9s ease-in-out infinite;
          z-index: 0;
        }
        .orb-2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 150, 110, 0.1) 0%, transparent 70%);
          bottom: -100px; left: 25%;
          animation: orbFloat 12s ease-in-out infinite reverse;
          z-index: 0;
        }
        .orb-3 {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(29, 233, 182, 0.07) 0%, transparent 70%);
          top: 50%; right: 42%;
          animation: orbFloat 7s ease-in-out infinite 2s;
          z-index: 0;
        }

        .scanline {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(29, 233, 182, 0.15), transparent);
          z-index: 1;
          animation: scanline 6s linear infinite;
          pointer-events: none;
        }

        .left-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 5% 0 8%;
          position: relative;
          z-index: 5;
          animation: fadeInUp 0.9s ease both;
        }

        .brand-tag {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #1de9b6;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-tag::before {
          content: '';
          width: 28px; height: 1px;
          background: #1de9b6;
        }

        .brand-name {
          font-size: clamp(52px, 6vw, 88px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -3px;
          margin-bottom: 28px;
          position: relative;
        }
        .brand-name .asset {
          display: block;
          color: #ffffff;
        }
        .brand-name .valet {
          display: block;
          color: transparent;
          -webkit-text-stroke: 2px #1de9b6;
          background: linear-gradient(135deg, #1de9b6, #00b894);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-tagline {
          font-size: 15px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.5px;
          line-height: 1.6;
          max-width: 340px;
          margin-bottom: 52px;
          border-left: 2px solid rgba(29, 233, 182, 0.35);
          padding-left: 18px;
        }

        .stats-row {
          display: flex;
          gap: 36px;
          margin-bottom: 20px;
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-num {
          font-family: 'Space Mono', monospace;
          font-size: 22px;
          font-weight: 700;
          color: #1de9b6;
        }
        .stat-label { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 1px; }

        .devices-scene {
          position: fixed;
          top: 50%;
          left: 55%;
          transform: translate(-50%, -50%);
          width: 500px;
          height:200px;
          pointer-events: none;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 16px;
        }

        .laptop-wrap {
          animation: floatLaptop 5s ease-in-out infinite;
          filter: drop-shadow(0 30px 60px rgba(0,0,0,0.6));
        }
        .phone-wrap {
          animation: floatPhone 4.5s ease-in-out infinite 0.8s;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
        }
        .tablet-wrap {
          animation: floatTablet 6s ease-in-out infinite 1.5s;
          filter: drop-shadow(0 25px 50px rgba(0,0,0,0.55));
        }

        .right-panel {
          width: 480px;
          min-width: 420px;
          padding: 60px 8% 60px 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          position: relative;
          z-index: 10;
          animation: slideInRight 0.9s ease 0.2s both;
        }

        .glass-card {
          width: 100%;
          max-width: 430px;
          padding: 52px 42px;
          border-radius: 28px;
          background: rgba(2, 28, 20, 0.55);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(29, 233, 182, 0.18);
          box-shadow:
            0 0 0 1px rgba(29, 233, 182, 0.05),
            0 30px 80px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(29, 233, 182, 0.12);
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 120px; height: 120px;
          background: radial-gradient(circle at top right, rgba(29, 233, 182, 0.12), transparent 70%);
          pointer-events: none;
        }
        .glass-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 80px; height: 80px;
          background: radial-gradient(circle at bottom left, rgba(29, 233, 182, 0.06), transparent 70%);
          pointer-events: none;
        }

        .card-header { text-align: center; margin-bottom: 36px; }
        .card-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px; height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #1de9b6, #00b894);
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(29, 233, 182, 0.35);
        }
        .card-title {
          color: #fff;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .card-subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          font-weight: 300;
        }

        .error-box {
          background: rgba(255, 77, 77, 0.1);
          color: #ff6b6b;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          text-align: center;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 77, 77, 0.2);
        }

        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .form-label {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.5px;
          font-weight: 400;
          margin-left: 2px;
        }
        .form-input {
          padding: 14px 18px;
          border-radius: 14px;
          border: 1px solid rgba(29, 233, 182, 0.12);
          background: rgba(0, 0, 0, 0.3);
          color: #fff;
          outline: none;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          width: 100%;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.22); }
        .form-input:focus {
          border-color: rgba(29, 233, 182, 0.5);
          background: rgba(29, 233, 182, 0.04);
          box-shadow: 0 0 0 3px rgba(29, 233, 182, 0.1);
        }

        .options-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          margin-bottom: 28px;
        }
        .remember-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .forgot-link {
          color: #1de9b6;
          text-decoration: none;
          font-size: 12px;
          transition: opacity 0.2s;
        }
        .forgot-link:hover { opacity: 0.75; }

        .login-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #1de9b6 0%, #00b894 100%);
          color: #011a14;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(29, 233, 182, 0.3);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.3px;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          background-size: 200% 100%;
          animation: shimmer 2.5s ease infinite;
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(29, 233, 182, 0.4); }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .loading-dots { display: inline-flex; gap: 5px; align-items: center; justify-content: center; }
        .loading-dots span {
          width: 6px; height: 6px; border-radius: 50%;
          background: #011a14;
          animation: dotPulse 1.4s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        .card-footer { margin-top: 32px; text-align: center; }
        .footer-text { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 20px; }
        .footer-text span { color: #1de9b6; cursor: pointer; transition: opacity 0.2s; }
        .footer-text span:hover { opacity: 0.75; }

        .divider {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 20px;
          font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 1px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(255,255,255,0.1);
        }

        .social-row { display: flex; justify-content: center; gap: 16px; }
        .social-btn {
          width: 44px; height: 44px; border-radius: 12px;
          border: 1px solid rgba(29, 233, 182, 0.15);
          background: rgba(29, 233, 182, 0.04);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.6); font-size: 14px;
          font-weight: 600; transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .social-btn:hover {
          border-color: rgba(29, 233, 182, 0.4);
          background: rgba(29, 233, 182, 0.08);
          color: #1de9b6;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(29, 233, 182, 0.5);
          pointer-events: none;
          z-index: 1;
        }

        @media (max-width: 900px) {
          .login-wrapper { justify-content: center; }
          .left-panel { display: none; }
          .right-panel { width: 100%; padding: 24px; justify-content: center; }
        }
      `}</style>

      <div className="login-wrapper">
        <div className="bg-grid" />
        <div className="orb-1" />
        <div className="orb-2" />
        <div className="orb-3" />
        <div className="scanline" />

        {[
          { w: 3, h: 3, top: "18%", left: "12%", opacity: 0.5, anim: "orbFloat 7s ease-in-out infinite" },
          { w: 5, h: 5, top: "65%", left: "8%", opacity: 0.35, anim: "orbFloat 9s ease-in-out infinite 1s" },
          { w: 2, h: 2, top: "30%", left: "45%", opacity: 0.6, anim: "orbFloat 5s ease-in-out infinite 2s" },
          { w: 4, h: 4, top: "75%", left: "52%", opacity: 0.4, anim: "orbFloat 8s ease-in-out infinite 3s" },
          { w: 3, h: 3, top: "12%", left: "58%", opacity: 0.45, anim: "orbFloat 6s ease-in-out infinite 0.5s" },
        ].map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{ width: p.w, height: p.h, top: p.top, left: p.left, opacity: p.opacity, animation: p.anim }}
          />
        ))}

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="brand-tag">Asset Management Platform</div>

          <div className="brand-name">
            <span className="asset">Asset</span>
            <span className="valet">Valet</span>
          </div>

          <div className="brand-tagline">
            Growth driven by Assets,<br />led by people.
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-num">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">256-bit</span>
              <span className="stat-label">Encrypted</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">Real-time</span>
              <span className="stat-label">Tracking</span>
            </div>
          </div>

          <div className="devices-scene">
            <div className="laptop-wrap">
              <svg width="240" height="160" viewBox="0 0 240 160" fill="none">
                <rect x="20" y="10" width="200" height="128" rx="10" fill="#0a2e24" stroke="rgba(29,233,182,0.25)" strokeWidth="1.5"/>
                <rect x="30" y="20" width="180" height="108" rx="6" fill="#051a12"/>
                <rect x="30" y="20" width="180" height="108" rx="6" fill="url(#screenGrad)" opacity="0.6"/>
                <rect x="42" y="36" width="80" height="6" rx="3" fill="rgba(29,233,182,0.5)"/>
                <rect x="42" y="50" width="120" height="4" rx="2" fill="rgba(29,233,182,0.15)"/>
                <rect x="42" y="62" width="100" height="4" rx="2" fill="rgba(29,233,182,0.12)"/>
                <rect x="42" y="80" width="156" height="24" rx="6" fill="rgba(29,233,182,0.06)" stroke="rgba(29,233,182,0.2)" strokeWidth="1"/>
                <rect x="48" y="86" width="60" height="3" rx="1.5" fill="rgba(29,233,182,0.3)"/>
                <rect x="48" y="94" width="40" height="3" rx="1.5" fill="rgba(29,233,182,0.15)"/>
                <circle cx="185" cy="92" r="8" fill="rgba(29,233,182,0.15)" stroke="rgba(29,233,182,0.4)" strokeWidth="1"/>
                <circle cx="120" cy="24" r="2" fill="rgba(29,233,182,0.4)"/>
                <rect x="0" y="138" width="240" height="16" rx="4" fill="#0a2e24" stroke="rgba(29,233,182,0.2)" strokeWidth="1"/>
                <rect x="80" y="140" width="80" height="8" rx="4" fill="rgba(29,233,182,0.08)"/>
                <defs>
                  <linearGradient id="screenGrad" x1="30" y1="20" x2="210" y2="128" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1de9b6" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="#00b894" stopOpacity="0.02"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="tablet-wrap">
              <svg width="100" height="140" viewBox="0 0 100 140" fill="none">
                <rect x="4" y="4" width="92" height="132" rx="12" fill="#0a2e24" stroke="rgba(29,233,182,0.22)" strokeWidth="1.5"/>
                <rect x="10" y="14" width="80" height="108" rx="6" fill="#051a12"/>
                <rect x="16" y="22" width="50" height="5" rx="2.5" fill="rgba(29,233,182,0.45)"/>
                <rect x="16" y="34" width="68" height="3" rx="1.5" fill="rgba(29,233,182,0.15)"/>
                <rect x="16" y="42" width="55" height="3" rx="1.5" fill="rgba(29,233,182,0.1)"/>
                <rect x="16" y="54" width="68" height="38" rx="5" fill="rgba(29,233,182,0.05)" stroke="rgba(29,233,182,0.18)" strokeWidth="1"/>
                <rect x="22" y="60" width="30" height="3" rx="1.5" fill="rgba(29,233,182,0.25)"/>
                <rect x="22" y="68" width="22" height="3" rx="1.5" fill="rgba(29,233,182,0.15)"/>
                <rect x="22" y="76" width="26" height="3" rx="1.5" fill="rgba(29,233,182,0.1)"/>
                <circle cx="50" cy="130" r="4" fill="rgba(29,233,182,0.2)" stroke="rgba(29,233,182,0.3)" strokeWidth="1"/>
              </svg>
            </div>

            <div className="phone-wrap">
              <svg width="65" height="120" viewBox="0 0 65 120" fill="none">
                <rect x="3" y="3" width="59" height="114" rx="14" fill="#0a2e24" stroke="rgba(29,233,182,0.25)" strokeWidth="1.5"/>
                <rect x="9" y="14" width="47" height="88" rx="8" fill="#051a12"/>
                <rect x="15" y="22" width="28" height="4" rx="2" fill="rgba(29,233,182,0.5)"/>
                <rect x="15" y="32" width="35" height="2.5" rx="1.25" fill="rgba(29,233,182,0.15)"/>
                <rect x="15" y="39" width="28" height="2.5" rx="1.25" fill="rgba(29,233,182,0.1)"/>
                <rect x="15" y="50" width="35" height="20" rx="5" fill="rgba(29,233,182,0.06)" stroke="rgba(29,233,182,0.2)" strokeWidth="1"/>
                <rect x="19" y="55" width="16" height="2" rx="1" fill="rgba(29,233,182,0.3)"/>
                <rect x="19" y="61" width="12" height="2" rx="1" fill="rgba(29,233,182,0.15)"/>
                <rect x="15" y="78" width="35" height="16" rx="5" fill="rgba(29,233,182,0.04)" stroke="rgba(29,233,182,0.15)" strokeWidth="1"/>
                <rect x="22" y="108" width="21" height="3" rx="1.5" fill="rgba(29,233,182,0.25)"/>
                <rect x="22" y="6" width="21" height="5" rx="2.5" fill="rgba(29,233,182,0.1)"/>
                <circle cx="32.5" cy="8.5" r="1.5" fill="rgba(29,233,182,0.3)"/>
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="glass-card">
            <div className="card-header">
              <div className="card-logo">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M13 3L22 8V18L13 23L4 18V8L13 3Z" fill="none" stroke="#011a14" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M13 3L13 13M13 13L22 8M13 13L4 8M13 13L13 23M13 13L22 18M13 13L4 18" stroke="#011a14" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="card-title">Welcome Back</div>
              <div className="card-subtitle">Sign in to Asset Valet</div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
              <div className="form-group">
                <label className="form-label">USERNAME</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PASSWORD</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="options-row">
                <label className="remember-label">
                  <input type="checkbox" style={{ accentColor: "#1de9b6" }} />
                  Remember me
                </label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? (
                  <div className="loading-dots">
                    <span /><span /><span />
                  </div>
                ) : "Login"}
              </button>
            </form>

            <div className="card-footer">
              <p className="footer-text">
                Don't have an account? <span>Sign Up</span>
              </p>
              <div className="divider">OR CONTINUE WITH</div>
              <div className="social-row">
                <div className="social-btn">G</div>
                <div className="social-btn">in</div>
                <div className="social-btn">✉</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}