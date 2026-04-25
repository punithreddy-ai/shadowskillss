import { useState, useEffect, useRef } from "react";
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

// Animated counter hook
function useCountUp(end, duration = 1500, start = 0) {
  const [count, setCount] = useState(start);
  const rafRef = useRef();

  useEffect(() => {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (end - start) * easeOutQuart);
      setCount(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, start]);

  return count;
}

// Simple counter for inline use
function Counter({ value }) {
  const count = useCountUp(value, 1500, 0);
  return <>{count}</>;
}

// Animated progress bar component
function AnimatedProgressBar({ value, color = "#7c3aed", delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
        }}
      />
    </div>
  );
}

// Stat card with animated counter
function StatCard({ label, value, suffix = "", color = "#111827", delay = 0 }) {
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
  const count = useCountUp(numericValue, 1500, 0);

  return (
    <div className={`fade-in-up delay-${delay} hover-lift`} style={{
      background: "#fff",
      borderRadius: 16,
      padding: "20px 24px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: "1px solid rgba(168, 85, 247, 0.08)",
    }}>
      <p style={{ margin: 0, fontSize: 13, color: "#6b7280", fontWeight: 500, letterSpacing: "0.02em" }}>{label}</p>
      <p style={{ margin: "8px 0 0", fontSize: 32, fontWeight: 800, color, fontFamily: "Poppins, sans-serif" }}>
        {count}{suffix}
      </p>
    </div>
  );
}

// Wave component for landing page
function Waves() {
  return (
    <div className="wave-container">
      <div className="wave" />
      <div className="wave" />
      <div className="wave" />
    </div>
  );
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  const s = { fontFamily: "Inter, sans-serif" };

  const card = (children, extra = {}, delay = 0) => (
    <div className={`fade-in-up delay-${delay} hover-lift`} style={{
      background: "#fff",
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: "1px solid rgba(168, 85, 247, 0.08)",
      ...extra
    }}>
      {children}
    </div>
  );

  const infoCard = (icon, title, desc, extra = {}, delay = 0) => (
    <div key={title} className={`fade-in-up delay-${delay} hover-lift`} style={{
      border: "1.5px solid rgba(168, 85, 247, 0.12)",
      borderRadius: 12,
      padding: "16px 20px",
      marginBottom: 12,
      background: "#fff",
      ...extra
    }}>
      <h4 style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: 15 }}>{icon} {title}</h4>
      <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14, lineHeight: 1.5 }}>{desc}</p>
    </div>
  );

  // ========== LANDING PAGE ==========
  if (!data) {
    return (
      <div style={{
        ...s,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #faf5ff 0%, #f0fdf4 40%, #fff7ed 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle background pattern */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        {/* Floating decorative elements */}
        <div className="float-animation" style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)",
          filter: "blur(1px)",
        }} />
        <div className="float-animation" style={{
          position: "absolute",
          top: "25%",
          right: "15%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
          filter: "blur(1px)",
          animationDelay: "1s",
        }} />
        <div className="float-animation" style={{
          position: "absolute",
          bottom: "30%",
          left: "15%",
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, transparent 100%)",
          filter: "blur(1px)",
          animationDelay: "2s",
        }} />

        {/* Main content */}
        <div style={{
          textAlign: "center",
          zIndex: 2,
          maxWidth: 700,
          padding: "0 24px",
        }}>
          {/* Tagline */}
          <div className={mounted ? "fade-in-up" : ""} style={{ marginBottom: 48 }}>
            <h1 style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 800,
              color: "#111827",
              margin: 0,
              lineHeight: 1.15,
              fontFamily: "Poppins, sans-serif",
              letterSpacing: "-0.02em",
            }}>
              Stop guessing your skills.
            </h1>
            <h1 style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 800,
              color: "#7c3aed",
              margin: "8px 0 0",
              lineHeight: 1.15,
              fontFamily: "Poppins, sans-serif",
              letterSpacing: "-0.02em",
            }}>
              Start observing them.
            </h1>
          </div>

          {/* Subtitle */}
          <p className="fade-in-up delay-2" style={{
            color: "#6b7280",
            fontSize: 17,
            marginBottom: 40,
            lineHeight: 1.6,
            fontWeight: 400,
          }}>
            Enter your GitHub username to unlock insights about your coding patterns, strengths, and growth opportunities.
          </p>

          {/* Input + Button */}
          <div className="fade-in-up delay-3" style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 16,
          }}>
            <input
              className="glass-input"
              style={{
                ...s,
                padding: "14px 20px",
                borderRadius: 14,
                fontSize: 16,
                width: 300,
                color: "#111827",
              }}
              placeholder="Enter GitHub username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && analyze()}
            />
            <button
              onClick={analyze}
              className="btn-purple"
              style={{
                ...s,
                padding: "14px 32px",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span className="pulse-soft" style={{ display: "inline-block" }}>◌</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Analyze
                </>
              )}
            </button>
          </div>

          {loading && (
            <p className="fade-in" style={{ color: "#7c3aed", fontSize: 14, marginTop: 16 }}>
              <span className="pulse-soft">✨</span> Reading your digital footprint...
            </p>
          )}
          {error && (
            <p className="fade-in-up" style={{ color: "#ef4444", fontSize: 14, marginTop: 16, background: "#fef2f2", padding: "10px 16px", borderRadius: 10, display: "inline-block" }}>
              ⚠️ {error}
            </p>
          )}

          {/* Cron status badge */}
          {cronStatus && (
            <div className="fade-in-up delay-4" style={{
              marginTop: 32,
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: 13,
              color: "#6b7280",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              border: "1px solid rgba(168, 85, 247, 0.08)",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: cronStatus.scheduler_running ? "#22c55e" : "#ef4444",
                display: "inline-block",
                boxShadow: cronStatus.scheduler_running ? "0 0 8px rgba(34, 197, 94, 0.4)" : "none",
              }} />
              <span>Cron {cronStatus.scheduler_running ? "running" : "stopped"}</span>
              <span style={{ color: "#d1d5db" }}>|</span>
              <span>{cronStatus.tracked_user_count} tracked</span>
              <span style={{ color: "#d1d5db" }}>|</span>
              <span>Every {cronStatus.interval_hours}h</span>
            </div>
          )}
        </div>

        {/* Waves */}
        <Waves />
      </div>
    );
  }

  // ========== DASHBOARD DATA ==========
  const g = data.github || {};
  const skillNames = data.skills?.map(s => s.name) || [];
  const skillValues = data.skills?.map(s => s.confidence) || [];

  const radarData = {
    labels: skillNames.length ? skillNames : ["Logic", "Speed", "Persistence", "Focus", "Clarity", "Consistency"],
    datasets: [{
      label: "Skills",
      data: skillValues.length ? skillValues : [80, 85, 75, 90, 70, 78],
      backgroundColor: "rgba(124, 58, 237, 0.15)",
      borderColor: "#7c3aed",
      pointBackgroundColor: "#7c3aed",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#7c3aed",
      pointRadius: 5,
      pointHoverRadius: 8,
      borderWidth: 2.5,
    }]
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Commits",
      data: [8, 15, 14, 6, 10, 8, 12],
      backgroundColor: [
        "rgba(17, 24, 39, 0.8)",
        "rgba(124, 58, 237, 0.8)",
        "rgba(34, 197, 94, 0.8)",
        "rgba(17, 24, 39, 0.6)",
        "rgba(124, 58, 237, 0.6)",
        "rgba(34, 197, 94, 0.6)",
        "rgba(17, 24, 39, 0.5)",
      ],
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: [
        "#111827",
        "#7c3aed",
        "#22c55e",
        "#374151",
        "#8b5cf6",
        "#16a34a",
        "#4b5563",
      ],
    }]
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false,
          stepSize: 20,
        },
        grid: {
          color: "rgba(168, 85, 247, 0.1)",
        },
        angleLines: {
          color: "rgba(168, 85, 247, 0.1)",
        },
        pointLabels: {
          font: { size: 12, family: "Inter, sans-serif", weight: "600" },
          color: "#4b5563",
        },
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleFont: { family: "Inter, sans-serif", size: 13 },
        bodyFont: { family: "Inter, sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutQuart",
    },
  };

  const barOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleFont: { family: "Inter, sans-serif", size: 13 },
        bodyFont: { family: "Inter, sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(168, 85, 247, 0.06)", drawBorder: false },
        ticks: {
          font: { family: "Inter, sans-serif", size: 11 },
          color: "#9ca3af",
          padding: 8,
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "Inter, sans-serif", size: 12, weight: "500" },
          color: "#6b7280",
          padding: 8,
        },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
      delay: (context) => context.dataIndex * 100,
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? "pointer" : "default";
    },
  };

  // ========== DASHBOARD PAGE ==========
  return (
    <div style={{
      ...s,
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #faf5ff 0%, #f0fdf4 50%, #fff7ed 100%)",
      backgroundAttachment: "fixed",
    }}>

      {/* Sidebar */}
      <aside className="slide-in-left" style={{
        width: 240,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(168, 85, 247, 0.1)",
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        zIndex: 10,
      }}>
        <div className="fade-in-up">
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 800,
            fontSize: 20,
            color: "#111827",
            fontFamily: "Poppins, sans-serif",
          }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              display: "inline-block",
              boxShadow: "0 0 12px rgba(124, 58, 237, 0.3)",
            }} />
            ShadowSkills
          </div>
          <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
            Quietly tracking your growth in the background.
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((n, i) => (
            <button
              key={n}
              onClick={() => setActive(n)}
              className={`sidebar-item ${active === n ? "active" : ""}`}
              style={{
                ...s,
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: active === n ? 600 : 500,
                background: active === n ? "linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, transparent 100%)" : "transparent",
                color: active === n ? "#7c3aed" : "#6b7280",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: active === n ? "translateX(4px)" : "translateX(0)",
              }}
            >
              {n}
            </button>
          ))}
        </nav>

        <button
          onClick={() => { setData(null); setUsername(""); }}
          className="fade-in-up delay-5"
          style={{
            ...s,
            marginTop: "auto",
            fontSize: 12,
            color: "#9ca3af",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "8px 12px",
            borderRadius: 8,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => { e.target.style.color = "#7c3aed"; e.target.style.background = "rgba(168, 85, 247, 0.05)"; }}
          onMouseLeave={e => { e.target.style.color = "#9ca3af"; e.target.style.background = "none"; }}
        >
          ← Analyze another
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 240, flex: 1, padding: 24, minHeight: "100vh" }}>

        {/* Topbar */}
        <div className="fade-in-up" style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderRadius: 16,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          border: "1px solid rgba(168, 85, 247, 0.08)",
        }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>
            ☀️ Good morning, <span style={{ color: "#7c3aed", fontWeight: 700 }}>{g.name || g.username}</span>! 🌱
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>
            Based on real activity. No self-assessment.
          </p>
        </div>

        {/* Dashboard */}
        {active === "Dashboard" && (<>
          <div className="fade-in-up delay-1" style={{
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)",
            border: "1.5px solid rgba(34, 197, 94, 0.15)",
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 20,
            color: "#166534",
            fontSize: 14,
            fontWeight: 500,
          }}>
            💡 {data.summary}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
            <StatCard label="Consistency Score" value={data.skills?.[0]?.confidence || 78} suffix="%" color="#111827" delay={1} />
            <StatCard label="Confidence Score" value={data.skills?.[1]?.confidence || 72} suffix="%" color="#7c3aed" delay={2} />
            <StatCard label="Public Repos" value={g.public_repos || 0} color="#22c55e" delay={3} />
            <StatCard label="Followers" value={g.followers || 0} color="#111827" delay={4} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {card(<>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Skill Radar</h3>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "#9ca3af" }}>Based on commit frequency, session depth, and task completion patterns.</p>
              <div className="chart-container">
                <Radar data={radarData} options={radarOptions} />
              </div>
              {/* Skill progress bars */}
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {data.skills?.map((skill, i) => (
                  <div key={skill.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{skill.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>{skill.confidence}%</span>
                    </div>
                    <AnimatedProgressBar
                      value={skill.confidence}
                      color={i % 3 === 0 ? "#111827" : i % 3 === 1 ? "#7c3aed" : "#22c55e"}
                      delay={i * 200}
                    />
                  </div>
                ))}
              </div>
            </>, {}, 2)}

            {card(<>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Activity Overview (Last 7 Days)</h3>
              <div className="chart-container">
                <Bar data={barData} options={barOptions} />
              </div>
            </>, {}, 3)}

            {card(<>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Why this matters</h3>
              <p style={{ margin: 0, fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
                {g.bio || "Your GitHub activity reveals more about you than any resume. We analyze your commit patterns, repository diversity, and coding consistency to surface insights that help you grow."}
              </p>
            </>, {}, 4)}

            {card(<>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Quick Stats</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Total Commits", value: g.commit_summary?.commit_count || 0, color: "#111827" },
                  { label: "Languages", value: [...new Set(g.repos?.map(r => r.language).filter(Boolean))].length || 0, color: "#7c3aed" },
                  { label: "Top Repo Stars", value: Math.max(...(g.repos?.map(r => r.stars) || [0])), color: "#22c55e" },
                  { label: "Total Forks", value: g.repos?.reduce((a, r) => a + (r.forks || 0), 0) || 0, color: "#111827" },
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%)",
                    borderRadius: 10,
                    padding: "14px 16px",
                    textAlign: "center",
                    border: "1px solid rgba(168, 85, 247, 0.08)",
                  }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: stat.color, fontFamily: "Poppins, sans-serif" }}>
                      <Counter value={stat.value} />
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </>, {}, 5)}
          </div>
        </>)}

        {/* Projects */}
        {active === "Projects" && card(<>
          <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Projects</h3>
          {g.repos?.slice(0, 6).map((r, i) => infoCard("📁", r.name, `${r.description || "No description."} ⭐ ${r.stars} · 🍴 ${r.forks}${r.language ? ` · 💻 ${r.language}` : ""}`, {}, i))}
        </>, {}, 1)}

        {/* Insights */}
        {active === "Insights" && card(<>
          <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Insights</h3>
          {data.hidden_strengths?.map((st, i) => infoCard(["🌟", "💡", "🚀"][i] || "✨", `Strength #${i + 1}`, st, {}, i))}
          {data.blind_spots?.map((st, i) => infoCard("⚠️", `Blind Spot #${i + 1}`, st, { borderColor: "rgba(239, 68, 68, 0.15)", background: "#fef2f2" }, i + 3))}
        </>, {}, 1)}

        {/* Activity */}
        {active === "Activity" && card(<>
          <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Activity</h3>
          {infoCard("📝", "Recent Commits", `${g.commit_summary?.commit_count || 0} commits analyzed across all public repos.`, {}, 0)}
          {g.commit_summary?.recent_commits?.map((c, i) => (
            <div key={i} className={`fade-in-up delay-${Math.min(i + 1, 8)} hover-lift`} style={{
              border: "1.5px solid rgba(168, 85, 247, 0.12)",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 10,
              background: "#fff",
            }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#7c3aed" }}>📦 {c.repo}</p>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{c.message?.slice(0, 120)}</p>
              {c.timestamp && <p style={{ margin: "6px 0 0", fontSize: 11, color: "#9ca3af" }}>{new Date(c.timestamp).toLocaleString()}</p>}
            </div>
          ))}
        </>, {}, 1)}

        {/* Career */}
        {active === "Career Suggestions" && card(<>
          <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Career Suggestions</h3>
          {data.career_roles?.map((r, i) => (
            <div key={i} className={`fade-in-up delay-${i + 1} hover-lift`} style={{
              border: "1.5px solid rgba(168, 85, 247, 0.12)",
              borderRadius: 14,
              padding: "20px 24px",
              marginBottom: 14,
              background: "#fff",
            }}>
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#111827" }}>{["🎯", "🧠", "🚀"][i]} {r}</h4>
              <p style={{ margin: "8px 0 12px", color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>This role matches your behavioral patterns and GitHub activity.</p>
              <a href={`https://unstop.com/jobs?searchTerm=${encodeURIComponent(r)}`} target="_blank" rel="noreferrer"
                style={{ display: "inline-block", padding: "8px 18px", background: "linear-gradient(135deg, #111827 0%, #374151 100%)", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", marginRight: 10, transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(17, 24, 39, 0.25)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
              >
                🔍 Find Jobs on Unstop
              </a>
              <a href={`https://unstop.com/internships?searchTerm=${encodeURIComponent(r)}`} target="_blank" rel="noreferrer"
                style={{ display: "inline-block", padding: "8px 18px", background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(124, 58, 237, 0.35)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
              >
                🎓 Find Internships
              </a>
            </div>
          ))}
        </>, {}, 1)}

        {/* Badges */}
        {active === "Badges" && card(<>
          <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Badges</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {BADGES.map((b, i) => (
              <div key={i} className={`fade-in-up delay-${Math.min(i + 1, 8)} badge-card`} style={{
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.06) 0%, rgba(34, 197, 94, 0.04) 100%)",
                borderRadius: 16,
                padding: 28,
                textAlign: "center",
                border: "1.5px solid rgba(168, 85, 247, 0.1)",
              }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>{b.icon}</div>
                <p style={{ margin: "8px 0 4px", fontWeight: 700, fontSize: 15, color: "#111827" }}>{b.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </>, {}, 1)}

        {/* Time Breaker */}
        {active === "Time Breaker" && card(<>
          <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>⚡ Time Breaker</h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#9ca3af" }}>Top 5 fastest consecutive commits — shows your speed and momentum.</p>
          {data.time_breaker?.length ? data.time_breaker.map((t, i) => (
            <div key={i} className={`fade-in-up delay-${Math.min(i + 1, 8)} hover-lift`} style={{
              border: "1.5px solid rgba(168, 85, 247, 0.12)",
              borderRadius: 14,
              padding: "16px 20px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#fff",
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed", minWidth: 40, fontFamily: "Poppins, sans-serif" }}>#{t.rank}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" }}>{t.message}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>📦 {t.repo} · {new Date(t.committed_at).toLocaleString()}</p>
              </div>
              <div style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                border: "1.5px solid rgba(34, 197, 94, 0.2)",
                borderRadius: 12,
                padding: "8px 16px",
                textAlign: "center",
              }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#16a34a", fontFamily: "Poppins, sans-serif" }}>{t.gap_minutes}m</p>
                <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>gap</p>
              </div>
            </div>
          )) : <p style={{ color: "#9ca3af" }}>No time breaker data available for this user.</p>}
        </>, {}, 1)}

        {/* Cron Status */}
        {active === "Cron Status" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {card(<>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111827" }}>🕐 Scheduler Info</h3>
              {cronStatus ? (<>
                {[
                  { label: "Scheduler Running", value: cronStatus.scheduler_running ? "✅ Yes" : "❌ No" },
                  { label: "Interval", value: `Every ${cronStatus.interval_hours} hours` },
                  { label: "Tracked Users", value: cronStatus.tracked_user_count },
                  { label: "Next Run", value: cronStatus.jobs?.[0]?.next_run ? new Date(cronStatus.jobs[0].next_run).toLocaleString() : "N/A" },
                ].map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(168, 85, 247, 0.08)" }}>
                    <span style={{ color: "#6b7280", fontSize: 14 }}>{m.label}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{m.value}</span>
                  </div>
                ))}
                <button onClick={triggerCron} className="btn-purple" style={{
                  ...s, marginTop: 16, width: "100%", padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                }}>
                  ▶️ Trigger Cron Now
                </button>
                {triggerMsg && <p className="fade-in-up" style={{ color: "#16a34a", textAlign: "center", marginTop: 8, fontSize: 13 }}>{triggerMsg}</p>}
              </>) : <p style={{ color: "#9ca3af" }}>Loading...</p>}
            </>, {}, 1)}

            {card(<>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111827" }}>👥 Tracked Users</h3>
              {Object.keys(trackedUsers).length ? Object.entries(trackedUsers).map(([u, meta], i) => (
                <div key={i} className="fade-in-up hover-lift" style={{
                  border: "1.5px solid rgba(168, 85, 247, 0.12)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 10,
                  background: "#fff",
                }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "#7c3aed" }}>@{u}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>Added: {new Date(meta.added_at).toLocaleString()}</p>
                </div>
              )) : <p style={{ color: "#9ca3af", fontSize: 14 }}>No users tracked yet. Analyze a user to start tracking.</p>}
            </>, {}, 2)}
          </div>

          {card(<>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111827" }}>📋 Cron Logs</h3>
            {cronLogs.length ? [...cronLogs].reverse().map((log, i) => (
              <div key={i} className={`fade-in-up delay-${Math.min(i + 1, 8)}`} style={{
                border: "1.5px solid rgba(168, 85, 247, 0.12)",
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 12,
                background: "#fff",
              }}>
                <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 13, color: "#374151" }}>🕐 {new Date(log.run_at).toLocaleString()}</p>
                {log.results?.map((r, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid rgba(168, 85, 247, 0.06)" }}>
                    <span style={{ color: "#6b7280" }}>@{r.username}</span>
                    <span style={{ color: r.status === "ok" ? "#16a34a" : "#ef4444", fontWeight: 600 }}>{r.status === "ok" ? "✅ Success" : `❌ ${r.error}`}</span>
                  </div>
                ))}
              </div>
            )) : <p style={{ color: "#9ca3af", fontSize: 14 }}>No cron runs yet. Trigger one above!</p>}
          </>, {}, 3)}
        </>)}

      </main>
    </div>
  );
}
