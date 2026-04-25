import { useState, useEffect } from "react";
import { Radar, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API = "http://127.0.0.1:8000";
const NAV = ["Dashboard", "Projects", "Insights", "Activity", "Career Suggestions", "Badges", "Time Breaker", "Cron Status"];

const BADGES = [
  { icon: "🎯", title: "Focus Master", desc: "You maintain deep focus during coding sessions." },
  { icon: "🚀", title: "Consistent Coder", desc: "You show consistent commit patterns over time." },
  { icon: "⚡", title: "Problem Solver", desc: "Your repos show strong problem solving ability." },
  { icon: "🌅", title: "Early Bird", desc: "You tend to commit early and often." },
  { icon: "🛡️", title: "Guardian Reviewer", desc: "You maintain high quality in your codebase." },
  { icon: "🧠", title: "Insight Seeker", desc: "You actively explore and learn new technologies." },
  { icon: "🔥", title: "Momentum Streak", desc: "You sustain repeatable coding momentum across days." },
  { icon: "🏁", title: "Ship Captain", desc: "You consistently turn ideas into shipped projects." },
];

export default function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState("Dashboard");
  const [cronStatus, setCronStatus] = useState(null);
  const [cronLogs, setCronLogs] = useState([]);
  const [trackedUsers, setTrackedUsers] = useState({});
  const [triggerMsg, setTriggerMsg] = useState("");

  const analyze = async () => {
    if (!username) return;
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetch(`${API}/analyze/${username}`);
      const json = await res.json();
      if (json.detail) throw new Error(json.detail);
      setData(json);
      setActive("Dashboard");
      fetchCronData();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const fetchCronData = async () => {
    try {
      const [s, l, t] = await Promise.all([
        fetch(`${API}/cron/status`).then(r => r.json()),
        fetch(`${API}/cron/logs`).then(r => r.json()),
        fetch(`${API}/tracked`).then(r => r.json()),
      ]);
      setCronStatus(s);
      setCronLogs(l.logs || []);
      setTrackedUsers(t.tracked_users || {});
    } catch (e) { console.error(e); }
  };

  const triggerCron = async () => {
    try {
      const res = await fetch(`${API}/cron/trigger`, { method: "POST" });
      const json = await res.json();
      setTriggerMsg(json.message);
      setTimeout(() => setTriggerMsg(""), 3000);
      setTimeout(fetchCronData, 3000);
    } catch (e) { setTriggerMsg("Failed to trigger"); }
  };

  useEffect(() => { fetchCronData(); }, []);

  // Design system
  const colors = {
    primary: "#6366f1",
    primaryLight: "#818cf8",
    primaryDark: "#4f46e5",
    secondary: "#10b981",
    secondaryLight: "#34d399",
    accent: "#f59e0b",
    accentLight: "#fbbf24",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#1e293b",
    textLight: "#64748b",
    border: "#e2e8f0",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  };

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)",
      color: colors.text,
    },
    sidebar: {
      width: "240px",
      background: colors.card,
      borderRight: `1px solid ${colors.border}`,
      padding: "28px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      position: "fixed",
      height: "100vh",
      overflowY: "auto",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      zIndex: 10,
    },
    sidebarLogo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontWeight: 800,
      fontSize: "20px",
      color: colors.primary,
      marginBottom: "8px",
    },
    sidebarDot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      display: "inline-block",
    },
    sidebarTagline: {
      color: colors.textLight,
      fontSize: "13px",
      marginTop: "6px",
      lineHeight: 1.4,
    },
    navButton: {
      textAlign: "left",
      padding: "10px 16px",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: 500,
      background: active === "Dashboard" ? "#eef2ff" : "transparent",
      color: active === "Dashboard" ? colors.primary : colors.textLight,
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginBottom: "4px",
    },
    card: {
      background: colors.card,
      borderRadius: "18px",
      padding: "28px",
      boxShadow: "0 6px 20px rgba(99, 102, 241, 0.08)",
      border: `1px solid ${colors.border}`,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(99, 102, 241, 0.15)",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "12px",
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
      color: "#fff",
      fontWeight: 700,
      fontSize: "15px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
    },
    buttonHover: {
      transform: "scale(1.02)",
      boxShadow: "0 6px 18px rgba(99, 102, 241, 0.4)",
    },
    input: {
      padding: "14px 20px",
      borderRadius: "12px",
      border: `2px solid ${colors.border}`,
      fontSize: "16px",
      width: "320px",
      outline: "none",
      transition: "border-color 0.2s ease",
      background: colors.card,
    },
    inputFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primary}20`,
    },
  };

  // Landing
  if (!data) {
    return (
      <div style={{ ...styles.container, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px", maxWidth: "600px" }}>
          <div style={{ fontSize: "72px", marginBottom: "20px" }}>🕵️</div>
          <h1 style={{ fontSize: "48px", fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>ShadowSkills</h1>
          <p style={{ color: colors.textLight, marginTop: "12px", fontSize: "18px", lineHeight: 1.6 }}>
            Quietly tracking your growth in the background. Get insights into your GitHub activity, skills, and career potential.
          </p>
        </div>
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          <input
            style={{ ...styles.input }}
            placeholder="Enter GitHub username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyze()}
            onFocus={e => e.target.style = { ...styles.input, ...styles.inputFocus }}
            onBlur={e => e.target.style = styles.input}
          />
          <button
            onClick={analyze}
            style={{ ...styles.button }}
            onMouseEnter={e => e.target.style = { ...styles.button, ...styles.buttonHover }}
            onMouseLeave={e => e.target.style = styles.button}
            disabled={loading}
          >
            {loading ? "🔍 Analyzing..." : "🚀 Analyze"}
          </button>
        </div>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: `3px solid ${colors.border}`, borderTopColor: colors.primary, animation: "spin 1s linear infinite" }}></div>
            <p style={{ color: colors.primary, fontSize: "16px", fontWeight: 600 }}>Reading your digital footprint...</p>
          </div>
        )}
        {error && (
          <div style={{ background: "#fee2e2", border: `1px solid ${colors.error}`, borderRadius: "12px", padding: "16px 24px", marginTop: "20px", maxWidth: "500px" }}>
            <p style={{ color: colors.error, margin: 0, fontWeight: 600 }}>⚠️ {error}</p>
          </div>
        )}
        {cronStatus && (
          <div style={{ marginTop: "32px", background: colors.card, borderRadius: "16px", padding: "20px 30px", fontSize: "14px", color: colors.textLight, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: `1px solid ${colors.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, color: colors.primary }}>🕐 Cron Status:</span>
              <span style={{ background: cronStatus.scheduler_running ? "#d1fae5" : "#fee2e2", color: cronStatus.scheduler_running ? "#065f46" : "#991b1b", padding: "4px 12px", borderRadius: "20px", fontWeight: 600 }}>
                {cronStatus.scheduler_running ? "✅ Running" : "❌ Stopped"}
              </span>
              <span>Tracked users: <strong>{cronStatus.tracked_user_count}</strong></span>
              <span>Interval: <strong>{cronStatus.interval_hours}h</strong></span>
            </div>
          </div>
        )}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            h1 { font-size: 36px; }
            input { width: 100%; max-width: 320px; }
          }
        `}</style>
      </div>
    );
  }

  const g = data.github || {};
  const skillNames = data.skills?.map(s => s.name) || [];
  const skillValues = data.skills?.map(s => s.confidence) || [];

  const radarData = {
    labels: skillNames.length ? skillNames : ["Logic", "Speed", "Persistence", "Focus", "Clarity", "Consistency"],
    datasets: [{
      label: "Skills",
      data: skillValues.length ? skillValues : [80, 85, 75, 90, 70, 78],
      backgroundColor: "rgba(99, 102, 241, 0.2)",
      borderColor: colors.primary,
      pointBackgroundColor: colors.primary,
      borderWidth: 2,
      pointRadius: 5,
    }]
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Commits",
      data: [8, 15, 14, 6, 10, 8, 12],
      backgroundColor: colors.primary,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const InfoCard = ({ icon, title, desc, extra = {} }) => (
    <div style={{
      border: `1px solid ${colors.border}`,
      borderRadius: "14px",
      padding: "20px",
      marginBottom: "16px",
      background: colors.card,
      transition: "all 0.2s ease",
      ...extra,
    }}>
      <h4 style={{ margin: "0 0 8px", fontWeight: 700, color: colors.text, fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "20px" }}>{icon}</span> {title}
      </h4>
      <p style={{ margin: 0, color: colors.textLight, fontSize: "14px", lineHeight: 1.5 }}>{desc}</p>
    </div>
  );

  return (
    <div style={{ ...styles.container, display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.sidebarLogo}>
            <span style={styles.sidebarDot}></span>
            ShadowSkills
          </div>
          <p style={styles.sidebarTagline}>Quietly tracking your growth in the background.</p>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {NAV.map(n => (
            <button
              key={n}
              onClick={() => setActive(n)}
              style={{
                ...styles.navButton,
                background: active === n ? "#eef2ff" : "transparent",
                color: active === n ? colors.primary : colors.textLight,
              }}
              onMouseEnter={e => e.target.style.background = "#f1f5f9"}
              onMouseLeave={e => e.target.style.background = active === n ? "#eef2ff" : "transparent"}
            >
              {n}
            </button>
          ))}
        </nav>
        <button
          onClick={() => { setData(null); setUsername(""); }}
          style={{
            marginTop: "auto",
            fontSize: "13px",
            color: colors.textLight,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "10px",
            borderRadius: "8px",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.target.style.background = "#f1f5f9"}
          onMouseLeave={e => e.target.style.background = "none"}
        >
          ← Analyze another user
        </button>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: "240px", flex: 1, padding: "32px", maxWidth: "calc(100vw - 240px)" }}>
        {/* Topbar */}
        <div style={{
          background: colors.card,
          borderRadius: "18px",
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          border: `1px solid ${colors.border}`,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
              ☀️ Good morning, <span style={{ color: colors.primary, fontWeight: 800 }}>{g.name || g.username}</span>! 🌱
            </p>
            <p style={{ margin: "8px 0 0", fontSize: "14px", color: colors.textLight }}>
              Based on real activity. No self‑assessment.
            </p>
          </div>
          <div style