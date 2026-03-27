import { useState, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────
const ACCENT = "#5070b0";
const ACCENT_LIGHT = "#90c0e0";
const ACCENT_HOVER = "#6090c0";
const BG = "#0a0a0a";
const BG_CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const RED = "#ef4444";
const GREEN = "#22c55e";
const AMBER = "#f59e0b";

const NICHOS = ["Previdenciário","Trabalhista","Família","Criminal","Empresarial","Imobiliário","Tributário","Outro"];
const CLASSIFICACAO = { quente: "🔥 Quente", morno: "🟡 Morno", frio: "❄️ Frio" };

// ─── ICON COMPONENTS ─────────────────────────────────
const Icon = ({ d, color = ACCENT, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);

const icons = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
  globe: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 7a3 3 0 100 6 3 3 0 000-6z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  check: "M20 6L9 17l-5-5",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  bar: "M12 20V10M18 20V4M6 20v-4",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  instagram: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zM12 9a3 3 0 100 6 3 3 0 000-6z",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  sparkle: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  calendar: "M16 2v4M8 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  megaphone: "M5.8 11.3L2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 00-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  chevRight: "M9 18l6-6-6-6",
  chevDown: "M6 9l6 6 6-6",
  x: "M18 6L6 18M6 6l12 12",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
  target: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6a6 6 0 100 12 6 6 0 000-12zM12 10a2 2 0 100 4 2 2 0 000-4z",
};

// ─── ANIMATED BACKGROUND ─────────────────────────────
const AnimStar = () => (
  <style>{`
    @keyframes animStar { from { transform: translateY(0px); } to { transform: translateY(-2000px); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  `}</style>
);

const AnimBG = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
    <AnimStar />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #0a1128, #000)" }} />
    <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, rgba(80,112,176,0.12) 0%, transparent 70%)`, filter: "blur(80px)" }} />
    <div style={{ position: "absolute", bottom: 0, right: "10%", width: 600, height: 600, background: `radial-gradient(ellipse, rgba(80,112,176,0.08) 0%, transparent 70%)`, filter: "blur(100px)" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    {/* Simple star simulation */}
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2000px", background: "transparent", opacity: 0.4, animation: "animStar 100s linear infinite", backgroundImage: "radial-gradient(1px 1px at 20px 30px, #fff, transparent), radial-gradient(1.5px 1.5px at 150px 70px, #fff, transparent), radial-gradient(1px 1px at 200px 300px, #fff, transparent)" }} />
  </div>
);

// ─── GLASS CARD ───────────────────────────────────────
const Glass = ({ children, style = {}, hover = false, onClick, className = "" }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={{
        background: BG_CARD,
        backdropFilter: "blur(10px)",
        border: `1px solid ${hovered && hover ? "rgba(80,112,176,0.45)" : BORDER}`,
        borderRadius: 20,
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered && hover ? "0 0 60px rgba(80,112,176,0.2)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── PULSE BUTTON ─────────────────────────────────────
const PulseBtn = ({ children, onClick, disabled, small, icon, style = {} }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: disabled ? "rgba(80,112,176,0.15)" : h ? ACCENT_HOVER : ACCENT,
        color: "#fff",
        border: "none",
        borderRadius: small ? 10 : 14,
        padding: small ? "8px 18px" : "14px 32px",
        fontSize: small ? 12 : 14,
        fontWeight: 600,
        fontFamily: "'Manrope', sans-serif",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.3s",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {icon && <Icon d={icons[icon]} color="#fff" size={small ? 14 : 16} />}
      {children}
    </button>
  );
};

// ─── TEXT INPUT ────────────────────────────────────────
const Input = ({ label, value, onChange, placeholder, type = "text", icon, multiline, required }) => {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: focused ? ACCENT : "#888", marginBottom: 6, fontWeight: 500, transition: "color 0.3s" }}>
          {label} {required && <span style={{ color: RED }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && <div style={{ position: "absolute", left: 14, top: multiline ? 14 : "50%", transform: multiline ? "none" : "translateY(-50%)" }}><Icon d={icons[icon]} color={focused ? ACCENT : "#555"} size={16} /></div>}
        <Tag
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={multiline ? 4 : undefined}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${focused ? "rgba(80,112,176,0.5)" : BORDER}`,
            borderRadius: 12,
            padding: icon ? "12px 14px 12px 40px" : "12px 14px",
            color: "#e0e0e0",
            fontSize: 14,
            fontFamily: "'Inter', sans-serif",
            outline: "none",
            transition: "border-color 0.3s",
            resize: multiline ? "vertical" : "none",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
};

// ─── SELECT ───────────────────────────────────────────
const Select = ({ label, value, onChange, options }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: focused ? ACCENT : "#888", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(80,112,176,0.5)" : BORDER}`,
          borderRadius: 12,
          padding: "12px 14px",
          color: "#e0e0e0",
          fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          outline: "none",
          cursor: "pointer",
          appearance: "none",
        }}
      >
        {options.map(o => <option key={o} value={o} style={{ background: "#1a1a1a" }}>{o}</option>)}
      </select>
    </div>
  );
};

// ─── TOGGLE ───────────────────────────────────────────
const Toggle = ({ label, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "8px 0" }}>
    <span style={{ fontSize: 13, color: "#ccc" }}>{label}</span>
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: value ? ACCENT : "rgba(255,255,255,0.1)",
        cursor: "pointer", position: "relative", transition: "background 0.3s",
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.3s" }} />
    </div>
  </div>
);

// ─── STAT CARD ────────────────────────────────────────
const Stat = ({ number, label, color = "#fff", sub }) => (
  <Glass style={{ padding: "20px 16px", textAlign: "center" }}>
    <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "2rem", lineHeight: 1, color }}>{number}</div>
    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 8, color: "#999" }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{sub}</div>}
  </Glass>
);

// ─── SECTION HEADER ───────────────────────────────────
const SectionHead = ({ num, title, subtitle, accent }) => (
  <div style={{ textAlign: "center", marginBottom: 40 }}>
    <span style={{ display: "inline-block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 600, marginBottom: 12, color: ACCENT }}>Etapa {num}</span>
    <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.2 }}>
      {title} {accent && <span style={{ background: `linear-gradient(135deg, #fff, ${ACCENT}, #204080)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{accent}</span>}
    </h2>
    {subtitle && <p style={{ color: "#888", fontWeight: 300, fontSize: 14, maxWidth: 600, margin: "0 auto" }}>{subtitle}</p>}
    <div style={{ width: 64, height: 2, background: ACCENT, margin: "20px auto 0", opacity: 0.5 }} />
  </div>
);

// ─── RESEARCH ITEM CARD ──────────────────────────────
const ResearchCard = ({ icon, title, status, findings, score, color }) => {
  const [open, setOpen] = useState(false);
  const statusColor = status === "problema" ? RED : status === "atenção" ? AMBER : GREEN;
  const statusLabel = status === "problema" ? "Problema" : status === "atenção" ? "Atenção" : "OK";
  return (
    <Glass hover style={{ padding: 0, overflow: "hidden", marginBottom: 12 }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", cursor: "pointer" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${color || statusColor}15`, border: `1px solid ${color || statusColor}30`, flexShrink: 0 }}>
          <Icon d={icons[icon]} color={color || statusColor} size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: statusColor, padding: "4px 10px", borderRadius: 20, background: `${statusColor}15`, border: `1px solid ${statusColor}25` }}>{statusLabel}</span>
        <Icon d={open ? icons.chevDown : icons.chevRight} color="#555" size={16} />
      </div>
      {open && (
        <div style={{ padding: "0 20px 18px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ paddingTop: 14 }}>
            {findings.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: statusColor, marginTop: 6, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#bbb", lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
            {score !== undefined && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: `${statusColor}08`, borderRadius: 10, border: `1px solid ${statusColor}15` }}>
                <span style={{ fontSize: 11, color: statusColor, fontWeight: 600 }}>Impacto no Score: {score > 0 ? "+" : ""}{score} pontos</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Glass>
  );
};

// ─── STEP INDICATOR ───────────────────────────────────
const StepNav = ({ steps, current, onSelect }) => (
  <div style={{ display: "flex", gap: 4, marginBottom: 32, overflowX: "auto", paddingBottom: 8 }}>
    {steps.map((s, i) => {
      const active = i === current;
      const done = i < current;
      return (
        <div
          key={i}
          onClick={() => done && onSelect(i)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: 12,
            background: active ? "rgba(80,112,176,0.15)" : "transparent",
            border: `1px solid ${active ? "rgba(80,112,176,0.4)" : "transparent"}`,
            cursor: done ? "pointer" : "default",
            transition: "all 0.3s", flexShrink: 0,
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
            background: done ? ACCENT : active ? "rgba(80,112,176,0.25)" : "rgba(255,255,255,0.05)",
            color: done ? "#fff" : active ? ACCENT : "#555",
            border: `1px solid ${done ? ACCENT : active ? "rgba(80,112,176,0.5)" : "rgba(255,255,255,0.08)"}`,
          }}>
            {done ? <Icon d={icons.check} color={BG} size={12} /> : i + 1}
          </div>
          <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? ACCENT_LIGHT : done ? "#999" : "#555", whiteSpace: "nowrap" }}>{s}</span>
        </div>
      );
    })}
  </div>
);

// ─── LOADING SPINNER ──────────────────────────────────
const Spinner = ({ text = "Processando...", steps = [], stepIdx = -1 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 }}>
    <div style={{ width: 40, height: 40, borderRadius: 20, border: `3px solid ${BORDER}`, borderTopColor: ACCENT, animation: "spin 1s linear infinite" }} />
    <span style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>{text}</span>
    {steps.length > 0 && (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8, minWidth: 260 }}>
        {steps.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: done ? 0.6 : active ? 1 : 0.3 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, transition: "all 0.4s", background: done ? GREEN : active ? ACCENT : "rgba(255,255,255,0.06)", border: `1px solid ${done ? GREEN : active ? ACCENT : "rgba(255,255,255,0.1)"}`, color: done || active ? "#fff" : "#555" }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 12, color: done ? GREEN : active ? "#e0e0e0" : "#555", transition: "color 0.4s" }}>{s.label}</span>
              {active && <div style={{ width: 6, height: 6, borderRadius: 3, background: ACCENT, animation: "blink 1s infinite", marginLeft: 4 }} />}
            </div>
          );
        })}
      </div>
    )}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ═══════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════
export default function PropLabIntelligence() {
  const STEPS = ["Lead", "Pesquisa", "Proposta", "Análise", "Design"];
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState({
    nome: "", username: "", nicho: "Previdenciário", seguidores: "",
    bio: "", email: "", telefone: "", cidade: "", oab: "", oabUF: "", oabAnos: "",
    cnpj: "", razaoSocial: "", site: "", linkBio: "",
    temSite: false, temPixel: false, temGA: false, temGMB: false,
    temLinkBio: false, contaBusiness: false, scoreFerramenta: "",
    classificacao: "quente", ctaSemLink: false,
    notasReuniao: "",
  });
  const [research, setResearch] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  const [finalHTML, setFinalHTML] = useState(null);
  const [calendlyUrl, setCalendlyUrl] = useState("https://calendly.com/marketingavestra/30min");
  const [propostaEditada, setPropostaEditada] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [genStepIdx, setGenStepIdx] = useState(-1);
  const [genSteps, setGenSteps] = useState([]);
  const [deployStatus, setDeployStatus] = useState(null); // null | "loading" | "success" | "error"
  const [deployedUrl, setDeployedUrl] = useState("");
  const iframeRef = useRef(null);

  // ─── SLUG HELPER ─────────────────────────────────
  const toSlug = (name) =>
    name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  // ─── DEPLOY TO DOMAIN ────────────────────────────
  const deployProposal = useCallback(async () => {
    setDeployStatus("loading");
    const slug = toSlug(lead.nome);
    try {
      const response = await fetch("/api/deploy-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, html: finalHTML }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Erro ${response.status}`);
      setDeployedUrl(data.url);
      setDeployStatus("success");
    } catch (err) {
      setDeployStatus(err.message);
    }
  }, [lead.nome, finalHTML]);

  // ─── CLAUDE API HELPER ───────────────────────────
  const callClaude = useCallback(async (prompt, maxTokens = 2000) => {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Erro ${response.status} na API`);
    }
    const data = await response.json();
    return data.content?.map(i => i.text || "").join("") || "";
  }, []);

  // ─── GENERATE RESEARCH ───────────────────────────
  const generateResearch = useCallback(async () => {
    setGenerating(true);
    setGenStatus("Analisando presença digital...");

    const researchPrompt = `Você é um analista de presença digital especializado em negócios jurídicos brasileiros. Analise o seguinte lead e gere um diagnóstico completo em JSON.

DADOS DO LEAD:
- Nome: ${lead.nome}
- Username: @${lead.username}
- Nicho: ${lead.nicho}
- Seguidores: ${lead.seguidores}
- Bio: ${lead.bio}
- Cidade: ${lead.cidade}
- OAB: ${lead.oab} (${lead.oabUF}) — ${lead.oabAnos} anos
- CNPJ: ${lead.cnpj || "Não encontrado"}
- Site: ${lead.temSite ? lead.site : "Não possui"}
- Pixel Facebook: ${lead.temPixel ? "Instalado" : "Não instalado"}
- Google Analytics: ${lead.temGA ? "Instalado" : "Não instalado"}
- Google Meu Negócio: ${lead.temGMB ? "Ativo" : "Não cadastrado"}
- Link na Bio: ${lead.temLinkBio ? lead.linkBio : "Não possui"}
- CTA sem link: ${lead.ctaSemLink ? "Sim — tem CTA mas sem link funcional" : "Não"}
- Conta Business: ${lead.contaBusiness ? "Sim" : "Não"}
- Score da ferramenta: ${lead.scoreFerramenta}/100
- Classificação: ${lead.classificacao}
- Notas da reunião/pesquisa: ${lead.notasReuniao}

Responda APENAS com JSON válido, sem markdown, sem backticks. Use esta estrutura exata:

{
  "resumo_executivo": "Uma frase de impacto sobre o estado digital deste lead",
  "score_presenca_digital": 0-100,
  "areas": {
    "google_meu_negocio": {
      "status": "problema|atencao|ok",
      "findings": ["achado 1", "achado 2", "achado 3"],
      "score_impact": número positivo ou negativo,
      "oportunidade": "frase sobre a oportunidade"
    },
    "site_e_landing": {
      "status": "problema|atencao|ok",
      "findings": ["achado 1", "achado 2", "achado 3"],
      "score_impact": número,
      "oportunidade": "frase"
    },
    "pixel_tracking": {
      "status": "problema|atencao|ok",
      "findings": ["achado 1", "achado 2"],
      "score_impact": número,
      "oportunidade": "frase"
    },
    "instagram_bio": {
      "status": "problema|atencao|ok",
      "findings": ["achado 1", "achado 2", "achado 3"],
      "score_impact": número,
      "oportunidade": "frase"
    },
    "anuncios_marketing": {
      "status": "problema|atencao|ok",
      "findings": ["achado 1", "achado 2"],
      "score_impact": número,
      "oportunidade": "frase"
    }
  },
  "diagnostico_geral": "Parágrafo descrevendo o estado geral e as oportunidades",
  "top_3_problemas": ["problema 1", "problema 2", "problema 3"],
  "proposta_valor": "Uma frase poderosa que resume o que podemos fazer por este lead",
  "bio_sugerida": "Sugestão de bio otimizada para Instagram (máx 150 chars)",
  "link_bio_sugerido": "Tipo de link tree/página ideal para este nicho"
}`;

    setApiError(null);
    try {
      const text = await callClaude(researchPrompt, 2000);
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResearch(parsed);
      setStep(1);
    } catch (err) {
      setApiError(err.message);
    }
    setGenerating(false);
  }, [lead, callClaude]);

  // ─── GENERATE PROPOSAL ──────────────────────────
  const generateProposal = useCallback(async () => {
    setGenerating(true);
    setGenStatus("Gerando proposta personalizada...");

    const proposalPrompt = `Você é um escritor sênior de propostas B2B seguindo o framework SPIN. Gere uma proposta comercial completa em português (pt-BR) para este lead:

BRIEFING DO LEAD:
- Nome: ${lead.nome} (@${lead.username})
- Nicho: ${lead.nicho} — ${lead.cidade}
- OAB: ${lead.oab}/${lead.oabUF} — ${lead.oabAnos} anos de atuação
- Seguidores: ${lead.seguidores}

DIAGNÓSTICO DE PRESENÇA DIGITAL:
${JSON.stringify(research, null, 2)}

NOTAS DA PESQUISA:
${lead.notasReuniao}

Gere uma proposta em MARKDOWN com estas seções obrigatórias:
1. Título impactante e subtítulo
2. "O Problema" — Espelhe a dor do lead com os dados reais do diagnóstico. Use os números encontrados. Faça o lead sentir que precisa de ajuda.
3. "A Solução" — Descreva cada entregável como benefício. Inclua: site profissional, otimização GMB, link na bio profissional, pixel/tracking, gestão de anúncios, e qualquer item relevante.
4. "Resultados Esperados" — Projeções conservadoras e credíveis.
5. "Cronograma" — Fases com D+7, D+14, D+30 etc.
6. "Investimento" — Deixe um placeholder [VALOR] para o usuário preencher.
7. "Próximos Passos" — 3 passos simples, o último sendo agendar uma call via Calendly.

PRINCÍPIOS:
- Tom profissional mas acessível, como parceiro e não vendedor
- Lidere com dor, transicione para esperança, feche com ação
- Use os dados reais do diagnóstico como prova
- Benefícios > Features
- Urgência ética, sem manipulação
- A proposta deve ser irrecusável mostrando que o custo de NÃO agir é maior que o investimento`;

    setApiError(null);
    try {
      const text = await callClaude(proposalPrompt, 4000);
      setProposal(text);
      setPropostaEditada(text);
      setStep(2);
    } catch (err) {
      setApiError(err.message);
    }
    setGenerating(false);
  }, [lead, research, callClaude]);

  // ─── ANALYZE PROPOSAL ──────────────────────────
  const ANALYST_STEPS = [
    { label: "Closer Analyst — closability e precificação" },
    { label: "Copywriter Analyst — copy, tom e CTA" },
    { label: "Devil's Advocate — vulnerabilidades e riscos" },
    { label: "Proposal Analyst — arco narrativo e estrutura" },
  ];

  const analyzeProposal = useCallback(async () => {
    setGenerating(true);
    setGenSteps(ANALYST_STEPS);
    setGenStepIdx(0);
    setGenStatus("Rodando análise com 4 especialistas...");

    const timers = [
      setTimeout(() => setGenStepIdx(1), 5000),
      setTimeout(() => setGenStepIdx(2), 10000),
      setTimeout(() => setGenStepIdx(3), 15000),
    ];

    const propostaTruncada = propostaEditada.slice(0, 3500);

    const analysisPrompt = `Você vai assumir 4 papéis de analista para revisar esta proposta. Responda APENAS com JSON válido, sem markdown, sem backticks.

BRIEFING: Lead ${lead.nome}, ${lead.nicho}, ${lead.cidade}. Score presença digital: ${research?.score_presenca_digital}/100.

PROPOSTA:
${propostaTruncada}

Para CADA analista, forneça nota (1-10), pontos fortes, pontos fracos, e recomendações. Responda em pt-BR.

JSON exato:
{
  "closer": {
    "nota": 8,
    "veredito": "frase curta",
    "fortes": ["ponto 1", "ponto 2"],
    "fracos": ["ponto 1", "ponto 2"],
    "recomendacoes": ["rec 1", "rec 2"]
  },
  "copywriter": {
    "nota": 8,
    "veredito": "frase curta",
    "fortes": ["ponto 1", "ponto 2"],
    "fracos": ["ponto 1", "ponto 2"],
    "recomendacoes": ["rec 1", "rec 2"]
  },
  "devils_advocate": {
    "nota": 8,
    "veredito": "frase curta",
    "vulnerabilidades": [{"problema": "desc", "severidade": "CRÍTICO", "fix": "sugestão"}],
    "risco_geral": "frase"
  },
  "proposal_analyst": {
    "nota": 8,
    "veredito": "frase curta",
    "arco_narrativo": "avaliação",
    "secoes_reordenar": ["sugestão"],
    "top_3_mudancas": ["mudança 1", "mudança 2", "mudança 3"]
  },
  "nota_geral": 8,
  "pronta_para_enviar": true,
  "resumo_executivo": "frase resumo"
}`;

    setApiError(null);

    try {
      const text = await callClaude(analysisPrompt, 2500);
      timers.forEach(clearTimeout);
      const clean = text.replace(/```json|```/g, "").trim();
      setAnalysis(JSON.parse(clean));
      setStep(3);
    } catch (err) {
      timers.forEach(clearTimeout);
      setApiError(err.message);
    }
    setGenSteps([]);
    setGenStepIdx(-1);
    setGenerating(false);
  }, [lead, research, propostaEditada, callClaude]);

  // ─── GENERATE FINAL HTML ────────────────────────
  const generateFinalHTML = useCallback(async () => {
    setGenerating(true);
    setGenStatus("Montando proposta no design Avestra Blue...");

    const avestralCSS = `*, *::before, *::after { box-sizing: border-box; }
        :root { --accent-blue: #5070b0; --accent-blue-glow: rgba(80, 112, 176, 0.5); }
        * { scroll-behavior: smooth; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes border-spin { from { --gradient-angle: 0deg; } to { --gradient-angle: 360deg; } }
        @keyframes shimmer { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes animStar { from { transform: translateY(0px); } to { transform: translateY(-2000px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(80, 112, 176, 0.2); } 50% { box-shadow: 0 0 40px rgba(80, 112, 176, 0.4); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes count-up { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @property --gradient-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
        .animate-fade-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .shiny-cta { --gradient-angle: 0deg; position: relative; overflow: hidden; border-radius: 9999px; padding: 1rem 2.5rem; background: linear-gradient(#000000, #000000) padding-box, conic-gradient(from var(--gradient-angle), transparent 0%, #5070b0 5%, #5070b0 15%, #5070b0 30%, transparent 40%, transparent 100%) border-box; border: 2px solid transparent; cursor: pointer; isolation: isolate; animation: border-spin 2.5s linear infinite; }
        .shiny-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, white 0.5px, transparent 0); background-size: 4px 4px; opacity: 0.1; z-index: 0; }
        .stars-1 { box-shadow: 234px 124px #fff, 654px 345px #fff, 876px 12px #fff, 1200px 800px #fff, 400px 1500px #fff, 1800px 200px #fff, 100px 1000px #fff, 900px 1900px #fff, 500px 600px #fff, 1400px 100px #fff, 300px 400px #fff, 1600px 1200px #fff, 50px 300px #fff, 750px 1100px #fff, 1100px 1600px #fff, 1700px 700px #fff, 200px 1800px #fff, 950px 50px #fff; }
        .stars-2 { box-shadow: 123px 456px #fff, 789px 234px #fff, 456px 890px #fff, 1100px 300px #fff, 200px 1200px #fff, 1500px 500px #fff, 600px 1700px #fff, 1300px 900px #fff, 350px 750px #fff, 850px 1400px #fff, 1650px 1050px #fff; }
        .stars-3 { box-shadow: 50px 50px rgba(80,112,176,0.3), 800px 400px rgba(80,112,176,0.2), 1400px 1000px rgba(80,112,176,0.25), 300px 1300px rgba(80,112,176,0.15), 1000px 200px rgba(80,112,176,0.2); }
        .gradient-blur { position: fixed; z-index: 40; inset: 0 0 auto 0; height: 120px; pointer-events: none; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); backdrop-filter: blur(8px); mask-image: linear-gradient(to bottom, black, transparent); }
        .selection-blue::selection { background: #5070b0; color: white; }
        .text-stroke { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1); color: transparent; }
        .pilar-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .pilar-card:hover { transform: translateY(-4px); border-color: rgba(80, 112, 176, 0.3); }
        .timeline-line { position: relative; }
        .timeline-line::before { content: ''; position: absolute; left: 24px; top: 60px; bottom: -20px; width: 2px; background: linear-gradient(to bottom, #5070b0, transparent); }
        .timeline-line:last-child::before { display: none; }
        .price-slash { position: relative; }
        .price-slash::after { content: ''; position: absolute; left: -5%; top: 50%; width: 110%; height: 3px; background: #5070b0; transform: rotate(-8deg); }
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .glow-number { text-shadow: 0 0 30px rgba(80, 112, 176, 0.5), 0 0 60px rgba(80, 112, 176, 0.2); }
        .metric-card { background: linear-gradient(135deg, rgba(80, 112, 176, 0.05), transparent); }
        .section-divider { background: linear-gradient(90deg, transparent, rgba(80, 112, 176, 0.3), transparent); height: 1px; }
        .compare-table td, .compare-table th { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
        .compare-table th { color: #5070b0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px; }
        .compare-table .bad { color: #ef4444; } .compare-table .good { color: #22c55e; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #000; } ::-webkit-scrollbar-thumb { background: #5070b0; border-radius: 3px; }
        @media (max-width: 768px) { .pilares-grid { grid-template-columns: 1fr !important; } }`;

    const htmlPrompt = `Você é um desenvolvedor front-end especializado em landing pages premium. Gere uma página HTML completa no design AVESTRA BLUE (dark navy/blue palette, estilo moderno com estrelas animadas) para a proposta abaixo.

CONTEÚDO DA PROPOSTA (markdown):
${propostaEditada}

DADOS DO LEAD:
- Nome: ${lead.nome}
- Nicho: ${lead.nicho}
- Cidade: ${lead.cidade}
- Escritório/Empresa: ${lead.razaoSocial || lead.nome}

CALENDLY URL: ${calendlyUrl}

CSS OBRIGATÓRIO (use exatamente este CSS no <style>, não omita nada):
${avestralCSS}

ESTRUTURA HTML OBRIGATÓRIA:
1. <head> com:
   - Tailwind CDN (https://cdn.tailwindcss.com)
   - Iconify: <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
   - Google Fonts: Manrope (200;400;600;700;800) + Inter (300;400;500;600;700)
   - O CSS acima no <style>
2. Background global FIXO (z-0, pointer-events-none):
   - div com bg-gradient-to-b from-[#0a1128] to-black
   - div w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]
   - div w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]
   - div w-[3px] h-[3px] bg-transparent stars-3 animate-[animStar_120s_linear_infinite]
   - div central blue glow blur-[120px] bg-blue-600/5 w-[800px] h-[800px]
   - grid overlay: bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)...] bg-[size:40px_40px]
3. Top blur header: <div class="gradient-blur"></div>
4. Navbar fixo: max-w-5xl, bg-black/60 backdrop-blur-xl border border-white/10 rounded-full, links de seção + botão "Agendar" com animação hover spin azul
5. Hero section fullscreen (min-h-screen): animated badge com ping dot azul + "Proposta Exclusiva", título Manrope font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40, nome do lead em destaque em azul com underline curvo SVG, subtítulo zinc-400, linha "Para: [nome] | De: Agência Avestra | [data]", botão shiny-cta "Ver Proposta" com iconify arrow-right
6. Seção Diagnóstico: section-divider, label "01 — DIAGNÓSTICO" em azul uppercase tracking, título Manrope bold, grid de metric-cards azuis com glow-number + label, parágrafo empático com dados reais, 3 problem cards com border-blue/20 bg-blue-950/20
7. Seção "Por Que É Diferente": compare table (bad/good) com header azul
8. Seção "A Solução / Pilares": section-divider, pilares-grid bento (lg:grid-cols-3, primeiro card lg:col-span-2 lg:row-span-2), cada pilar-card com: número em glow-number azul, iconify icon, título Manrope bold, bullets de benefícios, resultado esperado em badge verde
9. Seção "Jornada": timeline-line com dot azul circular, steps numerados, connector line
10. Seção "Cronograma": grid 2x2 de phase-cards com top bar gradient azul, fase + período + milestones
11. Seção "Investimento": featured card with border-blue/30 shadow-blue, preço Manrope italic glow-number, price-slash para valor original (se aplicável), variável mensal, badge "Melhor Custo-Benefício"
12. Full-width blue banner: bg-blue-950/30 border-y border-blue/20, citação impactante ou frase de urgência em Manrope italic grande
13. Seção "Próximos Passos" + CTA: 3 steps com círculos azuis numerados, botão shiny-cta grande linkando para ${calendlyUrl} com iconify calendar icon
14. Footer: texto principal em Manrope, huge watermark text-stroke "AVESTRA" ou nome da empresa, data, disclaimer confidencial
15. <script> no final com IntersectionObserver para scroll reveal (.reveal → .active)

REGRAS CRÍTICAS:
- Use classes Tailwind para layout/spacing (max-w-5xl mx-auto px-6 py-20, grid, flex, rounded-3xl, etc.)
- Use as classes CSS customizadas (.pilar-card, .metric-card, .glow-number, .timeline-line, .price-slash, .reveal, .section-divider, .shiny-cta, .stars-1, .stars-2, .stars-3, .gradient-blur, etc.)
- Scroll reveal usa .reveal + .active (NÃO .visible)
- Use iconify icons: lucide:arrow-right, lucide:check, lucide:x, lucide:calendar, lucide:lock, lucide:shield, lucide:trending-up, lucide:zap, etc.
- Todo texto em Português (pt-BR)
- Use os dados reais da proposta — não invente informações
- O HTML final deve ter 800+ linhas
- NÃO use markdown no output — apenas HTML puro começando com <!DOCTYPE html>`;

    setApiError(null);
    try {
      const text = await callClaude(htmlPrompt, 8000);
      const htmlClean = text.replace(/```html|```/g, "").trim();
      setFinalHTML(htmlClean);
      setStep(4);
    } catch (err) {
      setApiError(err.message);
    }
    setGenerating(false);
  }, [propostaEditada, lead, calendlyUrl, callClaude]);

  // ─── RENDER STEPS ───────────────────────────────
  const renderStep0 = () => (
    <div>
      <SectionHead num="01" title="Dados do" accent="Lead" subtitle="Preencha com os dados do OAB Lead Qualifier ou cole manualmente" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <Glass style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: ACCENT, fontWeight: 600, marginBottom: 16 }}>Informações Básicas</div>
            <Input label="Nome completo" value={lead.nome} onChange={v => setLead(l => ({...l, nome: v}))} placeholder="Ex: Sablina Castro" icon="user" required />
            <Input label="Username Instagram" value={lead.username} onChange={v => setLead(l => ({...l, username: v}))} placeholder="Ex: sablinacastro" icon="instagram" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Select label="Nicho" value={lead.nicho} onChange={v => setLead(l => ({...l, nicho: v}))} options={NICHOS} />
              <Input label="Cidade" value={lead.cidade} onChange={v => setLead(l => ({...l, cidade: v}))} placeholder="São Paulo" icon="map" />
            </div>
            <Input label="Seguidores" value={lead.seguidores} onChange={v => setLead(l => ({...l, seguidores: v}))} placeholder="1676" type="number" />
            <Input label="Bio do Instagram" value={lead.bio} onChange={v => setLead(l => ({...l, bio: v}))} placeholder="⚖️ Advogada | Previdenciário..." multiline />
          </Glass>

          <Glass style={{ padding: 24 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: ACCENT, fontWeight: 600, marginBottom: 16 }}>Contato</div>
            <Input label="Email" value={lead.email} onChange={v => setLead(l => ({...l, email: v}))} placeholder="email@exemplo.com" icon="mail" />
            <Input label="Telefone / WhatsApp" value={lead.telefone} onChange={v => setLead(l => ({...l, telefone: v}))} placeholder="31982424656" icon="phone" />
          </Glass>
        </div>

        <div>
          <Glass style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: ACCENT, fontWeight: 600, marginBottom: 16 }}>Dados Profissionais</div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <Input label="Nº OAB" value={lead.oab} onChange={v => setLead(l => ({...l, oab: v}))} placeholder="123456" />
              <Input label="UF" value={lead.oabUF} onChange={v => setLead(l => ({...l, oabUF: v}))} placeholder="SP" />
              <Input label="Anos" value={lead.oabAnos} onChange={v => setLead(l => ({...l, oabAnos: v}))} placeholder="3" type="number" />
            </div>
            <Input label="CNPJ" value={lead.cnpj} onChange={v => setLead(l => ({...l, cnpj: v}))} placeholder="12.345.678/0001-90" />
            <Input label="Razão Social" value={lead.razaoSocial} onChange={v => setLead(l => ({...l, razaoSocial: v}))} placeholder="Castro Advocacia Ltda" />
          </Glass>

          <Glass style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: ACCENT, fontWeight: 600, marginBottom: 16 }}>Presença Digital (do Lead Qualifier)</div>
            <Input label="URL do Site" value={lead.site} onChange={v => setLead(l => ({...l, site: v}))} placeholder="https://..." icon="globe" />
            <Input label="Link na Bio" value={lead.linkBio} onChange={v => setLead(l => ({...l, linkBio: v}))} placeholder="https://linktr.ee/..." icon="link" />
            <Toggle label="Tem site?" value={lead.temSite} onChange={v => setLead(l => ({...l, temSite: v}))} />
            <Toggle label="Pixel Facebook instalado?" value={lead.temPixel} onChange={v => setLead(l => ({...l, temPixel: v}))} />
            <Toggle label="Google Analytics instalado?" value={lead.temGA} onChange={v => setLead(l => ({...l, temGA: v}))} />
            <Toggle label="Google Meu Negócio ativo?" value={lead.temGMB} onChange={v => setLead(l => ({...l, temGMB: v}))} />
            <Toggle label="Tem link na bio?" value={lead.temLinkBio} onChange={v => setLead(l => ({...l, temLinkBio: v}))} />
            <Toggle label="CTA na bio SEM link funcional?" value={lead.ctaSemLink} onChange={v => setLead(l => ({...l, ctaSemLink: v}))} />
            <Toggle label="Conta Business?" value={lead.contaBusiness} onChange={v => setLead(l => ({...l, contaBusiness: v}))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Score (0-100)" value={lead.scoreFerramenta} onChange={v => setLead(l => ({...l, scoreFerramenta: v}))} placeholder="87" type="number" />
              <Select label="Classificação" value={lead.classificacao} onChange={v => setLead(l => ({...l, classificacao: v}))} options={["quente","morno","frio"]} />
            </div>
          </Glass>

          <Glass style={{ padding: 24 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: ACCENT, fontWeight: 600, marginBottom: 16 }}>Notas da Pesquisa / Reunião</div>
            <Input value={lead.notasReuniao} onChange={v => setLead(l => ({...l, notasReuniao: v}))} placeholder="Cole aqui suas anotações, transcrição da call, observações sobre o lead..." multiline />
          </Glass>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <PulseBtn onClick={generateResearch} disabled={!lead.nome || generating} icon="search">
          {generating ? "Analisando..." : "Iniciar Pesquisa de Presença Digital"}
        </PulseBtn>
      </div>
    </div>
  );

  const renderStep1 = () => {
    if (!research) return <Spinner text="Carregando pesquisa..." />;
    const a = research.areas;
    return (
      <div>
        <SectionHead num="02" title="Diagnóstico" accent="Digital" subtitle={research.resumo_executivo} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          <Stat number={research.score_presenca_digital + "/100"} label="Score Digital" color={research.score_presenca_digital < 40 ? RED : research.score_presenca_digital < 70 ? AMBER : GREEN} />
          <Stat number={lead.scoreFerramenta || "—"} label="Score Lead Qualifier" color={ACCENT} />
          <Stat number={CLASSIFICACAO[lead.classificacao]} label="Classificação" color={lead.classificacao === "quente" ? RED : lead.classificacao === "morno" ? AMBER : "#60a5fa"} />
        </div>

        <Glass style={{ padding: 24, marginBottom: 24, borderLeft: `3px solid ${RED}` }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: RED, fontWeight: 600, marginBottom: 12 }}>Top 3 Problemas Identificados</div>
          {research.top_3_problemas.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "center" }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: `${RED}15`, border: `1px solid ${RED}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Manrope', sans-serif", fontSize: 12, color: RED }}>{i+1}</div>
              <span style={{ fontSize: 14, color: "#ccc" }}>{p}</span>
            </div>
          ))}
        </Glass>

        <div style={{ marginBottom: 24 }}>
          <ResearchCard icon="map" title="Google Meu Negócio" status={a.google_meu_negocio.status} findings={a.google_meu_negocio.findings} score={a.google_meu_negocio.score_impact} />
          <ResearchCard icon="globe" title="Site & Landing Page" status={a.site_e_landing.status} findings={a.site_e_landing.findings} score={a.site_e_landing.score_impact} />
          <ResearchCard icon="code" title="Pixel & Tracking" status={a.pixel_tracking.status} findings={a.pixel_tracking.findings} score={a.pixel_tracking.score_impact} />
          <ResearchCard icon="instagram" title="Instagram & Bio" status={a.instagram_bio.status} findings={a.instagram_bio.findings} score={a.instagram_bio.score_impact} />
          <ResearchCard icon="megaphone" title="Anúncios & Marketing" status={a.anuncios_marketing.status} findings={a.anuncios_marketing.findings} score={a.anuncios_marketing.score_impact} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          <Glass style={{ padding: 24, borderLeft: `3px solid ${GREEN}` }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: GREEN, fontWeight: 600, marginBottom: 12 }}>Bio Sugerida</div>
            <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.8, whiteSpace: "pre-line" }}>{research.bio_sugerida}</p>
          </Glass>
          <Glass style={{ padding: 24, borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: ACCENT, fontWeight: 600, marginBottom: 12 }}>Proposta de Valor</div>
            <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.8, fontStyle: "italic" }}>{research.proposta_valor}</p>
          </Glass>
        </div>

        <div style={{ textAlign: "center" }}>
          <PulseBtn onClick={generateProposal} disabled={generating} icon="file">
            {generating ? "Gerando Proposta..." : "Gerar Proposta Personalizada"}
          </PulseBtn>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    if (!proposal) return <Spinner text="Gerando proposta..." />;
    return (
      <div>
        <SectionHead num="03" title="Proposta" accent="Personalizada" subtitle="Revise e edite antes de enviar para análise dos especialistas" />

        <Glass style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: ACCENT, fontWeight: 600 }}>Editor da Proposta</span>
            <PulseBtn small onClick={() => setPropostaEditada(proposal)} icon="sparkle">Reset</PulseBtn>
          </div>
          <textarea
            value={propostaEditada}
            onChange={e => setPropostaEditada(e.target.value)}
            style={{
              width: "100%", minHeight: 500,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: 20,
              color: "#e0e0e0", fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineHeight: 1.8, outline: "none",
              resize: "vertical", boxSizing: "border-box",
            }}
          />
        </Glass>

        <Glass style={{ padding: 20, marginBottom: 24 }}>
          <Input label="URL do Calendly (aparecerá no CTA final)" value={calendlyUrl} onChange={setCalendlyUrl} placeholder="https://calendly.com/seu-link" icon="calendar" />
        </Glass>

        <div style={{ textAlign: "center" }}>
          <PulseBtn onClick={analyzeProposal} disabled={generating} icon="search">
            {generating ? "Analisando..." : "Rodar Análise com 4 Especialistas"}
          </PulseBtn>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    if (!analysis) return <Spinner text="Rodando análise..." />;
    const agents = [
      { key: "closer", name: "Closer Analyst", icon: "target", color: RED },
      { key: "copywriter", name: "Copywriter Analyst", icon: "file", color: AMBER },
      { key: "devils_advocate", name: "Devil's Advocate", icon: "alert", color: "#f97316" },
      { key: "proposal_analyst", name: "Proposal Analyst", icon: "bar", color: "#8b5cf6" },
    ];

    return (
      <div>
        <SectionHead num="04" title="Análise" accent="Especializada" subtitle={analysis.resumo_executivo} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {agents.map(ag => (
            <Glass key={ag.key} style={{ padding: 20, textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${ag.color}12`, border: `1px solid ${ag.color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Icon d={icons[ag.icon]} color={ag.color} size={20} />
              </div>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 700, color: ag.color }}>{analysis[ag.key]?.nota || "—"}</div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", marginTop: 4 }}>{ag.name}</div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 8, fontStyle: "italic" }}>{analysis[ag.key]?.veredito}</div>
            </Glass>
          ))}
        </div>

        <Glass style={{ padding: 24, marginBottom: 24, textAlign: "center", borderTop: `3px solid ${analysis.pronta_para_enviar ? GREEN : AMBER}` }}>
          <div style={{ fontSize: 48, fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: analysis.nota_geral >= 7 ? GREEN : analysis.nota_geral >= 5 ? AMBER : RED }}>{analysis.nota_geral}/10</div>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", color: "#888", marginTop: 8 }}>Nota Geral</div>
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: analysis.pronta_para_enviar ? `${GREEN}15` : `${AMBER}15`, border: `1px solid ${analysis.pronta_para_enviar ? GREEN : AMBER}30` }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: analysis.pronta_para_enviar ? GREEN : AMBER }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: analysis.pronta_para_enviar ? GREEN : AMBER }}>{analysis.pronta_para_enviar ? "Pronta para enviar" : "Recomenda-se revisão"}</span>
          </div>
        </Glass>

        {/* Detailed analysis cards */}
        {agents.map(ag => {
          const d = analysis[ag.key];
          if (!d) return null;
          return (
            <Glass key={ag.key} style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Icon d={icons[ag.icon]} color={ag.color} size={18} />
                <span style={{ fontSize: 13, fontWeight: 600, color: ag.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{ag.name}</span>
              </div>
              {d.fortes && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: GREEN, fontWeight: 600, textTransform: "uppercase" }}>Pontos Fortes</span>
                  {d.fortes.map((f, i) => <div key={i} style={{ fontSize: 13, color: "#bbb", padding: "4px 0 4px 16px", borderLeft: `2px solid ${GREEN}30` }}>• {f}</div>)}
                </div>
              )}
              {d.fracos && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: RED, fontWeight: 600, textTransform: "uppercase" }}>Pontos Fracos</span>
                  {d.fracos.map((f, i) => <div key={i} style={{ fontSize: 13, color: "#bbb", padding: "4px 0 4px 16px", borderLeft: `2px solid ${RED}30` }}>• {f}</div>)}
                </div>
              )}
              {d.recomendacoes && (
                <div>
                  <span style={{ fontSize: 11, color: ACCENT, fontWeight: 600, textTransform: "uppercase" }}>Recomendações</span>
                  {d.recomendacoes.map((r, i) => <div key={i} style={{ fontSize: 13, color: "#bbb", padding: "4px 0 4px 16px", borderLeft: `2px solid ${ACCENT}30` }}>→ {r}</div>)}
                </div>
              )}
              {d.vulnerabilidades && (
                <div>
                  <span style={{ fontSize: 11, color: "#f97316", fontWeight: 600, textTransform: "uppercase" }}>Vulnerabilidades</span>
                  {d.vulnerabilidades.map((v, i) => (
                    <div key={i} style={{ padding: "10px 14px", margin: "8px 0", borderRadius: 10, background: `${v.severidade === "CRÍTICO" ? RED : v.severidade === "IMPORTANTE" ? AMBER : "#666"}08`, border: `1px solid ${v.severidade === "CRÍTICO" ? RED : v.severidade === "IMPORTANTE" ? AMBER : "#666"}15` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: v.severidade === "CRÍTICO" ? RED : AMBER, marginBottom: 4 }}>{v.severidade}</div>
                      <div style={{ fontSize: 13, color: "#ccc" }}>{v.problema}</div>
                      <div style={{ fontSize: 12, color: ACCENT, marginTop: 4 }}>Fix: {v.fix}</div>
                    </div>
                  ))}
                </div>
              )}
              {d.top_3_mudancas && (
                <div>
                  <span style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 600, textTransform: "uppercase" }}>Top 3 Mudanças</span>
                  {d.top_3_mudancas.map((m, i) => <div key={i} style={{ fontSize: 13, color: "#bbb", padding: "4px 0 4px 16px", borderLeft: `2px solid #8b5cf630` }}>{i+1}. {m}</div>)}
                </div>
              )}
            </Glass>
          );
        })}

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <PulseBtn onClick={generateFinalHTML} disabled={generating} icon="zap">
            {generating ? "Gerando Design..." : "Gerar Proposta HTML (Avestra Blue)"}
          </PulseBtn>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    if (!finalHTML) return <Spinner text="Montando design Avestra Blue..." />;
    return (
      <div>
        <SectionHead num="05" title="Proposta" accent="Final" subtitle="Preview e download da proposta no design Avestra Blue" />

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
          <PulseBtn small onClick={() => setShowPreview(!showPreview)} icon="eye">{showPreview ? "Fechar Preview" : "Ver Preview"}</PulseBtn>
          <PulseBtn small onClick={() => {
            const blob = new Blob([finalHTML], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `proposta-${lead.nome.toLowerCase().replace(/\s+/g, "-")}.html`;
            a.click();
            URL.revokeObjectURL(url);
          }} icon="download">Baixar HTML</PulseBtn>
          <PulseBtn small onClick={() => navigator.clipboard.writeText(finalHTML)} icon="file">Copiar HTML</PulseBtn>
          <PulseBtn
            small
            onClick={deployProposal}
            disabled={deployStatus === "loading"}
            icon="send"
            style={{ background: deployStatus === "success" ? GREEN : undefined }}
          >
            {deployStatus === "loading" ? "Publicando..." : deployStatus === "success" ? "Publicado ✓" : "Publicar em sala.bonadio.site"}
          </PulseBtn>
        </div>

        {/* Deploy status */}
        {deployStatus === "success" && (
          <Glass style={{ padding: "16px 20px", marginBottom: 20, borderLeft: `3px solid ${GREEN}`, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Proposta publicada</div>
              <a href={deployedUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: ACCENT_LIGHT, fontWeight: 500, textDecoration: "none", wordBreak: "break-all" }}>{deployedUrl}</a>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Ativa em ~30s após o deploy automático do Vercel</div>
            </div>
            <PulseBtn small onClick={() => navigator.clipboard.writeText(deployedUrl)} icon="link">Copiar link</PulseBtn>
          </Glass>
        )}

        {typeof deployStatus === "string" && deployStatus !== "loading" && deployStatus !== "success" && (
          <Glass style={{ padding: "14px 20px", marginBottom: 20, borderLeft: `3px solid ${RED}` }}>
            <div style={{ fontSize: 12, color: RED, fontWeight: 600 }}>Erro no deploy</div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{deployStatus}</div>
          </Glass>
        )}

        {showPreview && (
          <Glass style={{ padding: 0, overflow: "hidden", marginBottom: 24, borderRadius: 16 }}>
            <div style={{ background: "rgba(80,112,176,0.1)", padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: RED }} />
              <div style={{ width: 10, height: 10, borderRadius: 5, background: AMBER }} />
              <div style={{ width: 10, height: 10, borderRadius: 5, background: GREEN }} />
              <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>proposta-{lead.nome.toLowerCase().replace(/\s+/g, "-")}.html</span>
            </div>
            <iframe
              ref={iframeRef}
              srcDoc={finalHTML}
              style={{ width: "100%", height: 700, border: "none" }}
              title="Proposta Preview"
            />
          </Glass>
        )}

        <Glass style={{ padding: 24, borderLeft: `3px solid ${GREEN}`, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Icon d={icons.check} color={GREEN} size={20} />
            <span style={{ fontSize: 14, fontWeight: 600, color: GREEN }}>Pipeline Completo!</span>
          </div>
          <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.8 }}>
            A proposta personalizada para <strong style={{ color: "#fff" }}>{lead.nome}</strong> foi gerada com sucesso. Envie o arquivo HTML para o lead junto com o link do Calendly para agendar a call de apresentação.
          </div>
          <div style={{ marginTop: 16, padding: "14px 20px", background: "rgba(80,112,176,0.1)", borderRadius: 12, border: `1px solid rgba(80,112,176,0.2)` }}>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Fluxo de Envio Sugerido</div>
            <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.8 }}>
              1. Clique em <strong style={{ color: ACCENT_LIGHT }}>Publicar em sala.bonadio.site</strong> — o HTML vai direto para o repo e a Vercel deploya em ~30s<br/>
              2. Copie o link gerado (ex: sala.bonadio.site/sablina-castro)<br/>
              3. Envie pelo WhatsApp: "Oi [Nome], preparei um estudo completo sobre a presença digital do seu escritório. Dá uma olhada: [link]"<br/>
              4. O lead abre, vê o diagnóstico personalizado, e agenda pelo Calendly no final
            </div>
          </div>
        </Glass>
      </div>
    );
  };

  // ─── MAIN RENDER ────────────────────────────────
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#e0e0e0" }}>
      <AnimBG />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@200;400;600;700;800&display=swap');
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${ACCENT}; border-radius: 3px; }
        ::selection { background: rgba(80,112,176,0.4); color: #fff; }
      `}</style>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(80,112,176,0.15)", border: `1px solid rgba(80,112,176,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={icons.zap} color={ACCENT} size={20} />
            </div>
            <div>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>PropLab <span style={{ color: ACCENT }}>Intelligence</span></div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#666" }}>Lead → Pesquisa → Proposta → Design</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {lead.nome && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 20, background: "rgba(80,112,176,0.12)", border: `1px solid rgba(80,112,176,0.25)` }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: GREEN, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, color: ACCENT_LIGHT, fontWeight: 500 }}>{lead.nome}</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, background: "rgba(80,112,176,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: GREEN, fontSize: 11, fontWeight: 600 }}>
              <Icon d={icons.sparkle} color={GREEN} size={14} />
              API ✓
            </div>
          </div>
        </div>

        {/* API Error banner */}
        {apiError && (
          <div style={{ padding: "14px 20px", marginBottom: 20, borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
            <Icon d={icons.alert} color="#ef4444" size={18} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 600 }}>Erro na API Claude</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{apiError}</div>
            </div>
            <button onClick={() => setApiError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}>
              <Icon d={icons.x} color="#666" size={16} />
            </button>
          </div>
        )}

        <StepNav steps={STEPS} current={step} onSelect={setStep} />

        {generating && <Spinner text={genStatus} steps={genSteps} stepIdx={genStepIdx} />}
        {!generating && step === 0 && renderStep0()}
        {!generating && step === 1 && renderStep1()}
        {!generating && step === 2 && renderStep2()}
        {!generating && step === 3 && renderStep3()}
        {!generating && step === 4 && renderStep4()}
      </div>
    </div>
  );
}
