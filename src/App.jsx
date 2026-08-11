import React, { useState, useMemo } from "react";
import {
  Shield, Send, CheckCircle2, XCircle, AlertTriangle, Activity,
  Radio, LayoutDashboard, Inbox, ChevronRight, Clock, Users,
  X, Eye, EyeOff, Zap
} from "lucide-react";

const TLP = {
  RED: { label: "TLP:RED", color: "#C0392B", desc: "Named recipients only" },
  AMBER: { label: "TLP:AMBER", color: "#D89614", desc: "Limited to this community" },
  GREEN: { label: "TLP:GREEN", color: "#2E8B57", desc: "Community-wide" },
  CLEAR: { label: "TLP:CLEAR", color: "#94A3B8", desc: "Public" },
};

const TYPES = ["IP Address", "Domain", "File Hash", "URL", "Email Address", "TTP / Behavior"];

const SEED = [
  {
    id: "SUB-1042", org: "Meridian Bank", allowDisclosure: false, type: "IP Address",
    value: "185.220.101.47", desc: "C2 beacon observed post-phishing click, repeated outbound on port 443.",
    tlp: "AMBER", severity: "high", status: "approved", ts: "08:14",
  },
  {
    id: "SUB-1041", org: "Northwind Insurance", allowDisclosure: true, type: "File Hash",
    value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    desc: "SHA-256 of dropper attached to invoice-themed phishing campaign.",
    tlp: "GREEN", severity: "medium", status: "approved", ts: "07:52",
  },
  {
    id: "SUB-1040", org: "Coastal Credit Union", allowDisclosure: false, type: "Domain",
    value: "secure-update-portal[.]net", desc: "Typosquat domain hosting credential harvesting page mimicking member login.",
    tlp: "GREEN", severity: "medium", status: "pending", ts: "07:30",
  },
  {
    id: "SUB-1039", org: "Meridian Bank", allowDisclosure: false, type: "TTP / Behavior",
    value: "T1566.001 + T1204.002", desc: "Spearphishing attachment leading to user-executed macro, consistent with prior campaign cluster.",
    tlp: "AMBER", severity: "critical", status: "pending", ts: "06:58",
  },
  {
    id: "SUB-1038", org: "Northwind Insurance", allowDisclosure: true, type: "URL",
    value: "hxxps://claim-verify[.]info/auth", desc: "Fake claims-verification link distributed via SMS, harvests SSNs.",
    tlp: "CLEAR", severity: "medium", status: "approved", ts: "06:20",
  },
];

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ISACDemo() {
  const [role, setRole] = useState("member");
  const [tab, setTab] = useState("submit");
  const [subs, setSubs] = useState(SEED);
  const [alert, setAlert] = useState(null);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    type: TYPES[0], value: "", desc: "", tlp: "GREEN", severity: "medium", allowDisclosure: false,
  });

  const pending = subs.filter((s) => s.status === "pending");
  const approved = subs.filter((s) => s.status === "approved");

  const stats = useMemo(() => {
    const byType = {};
    approved.forEach((s) => { byType[s.type] = (byType[s.type] || 0) + 1; });
    const maxCount = Math.max(1, ...Object.values(byType));
    return {
      total: subs.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      contributors: new Set(subs.map((s) => s.org)).size,
      byType, maxCount,
    };
  }, [subs]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  function submit() {
    if (!form.value.trim() || !form.desc.trim()) {
      showToast("Add an indicator value and a description first");
      return;
    }
    const id = "SUB-" + (1043 + subs.filter((s) => s.org === "Your Org").length);
    const newSub = {
      id, org: "Your Org", allowDisclosure: form.allowDisclosure, type: form.type,
      value: form.value.trim(), desc: form.desc.trim(), tlp: form.tlp,
      severity: form.severity, status: "pending", ts: timeNow(),
    };
    setSubs([newSub, ...subs]);
    setForm({ type: TYPES[0], value: "", desc: "", tlp: "GREEN", severity: "medium", allowDisclosure: false });
    showToast(`${id} submitted for analyst review`);
  }

  function decide(id, status) {
    setSubs(subs.map((s) => (s.id === id ? { ...s, status } : s)));
    showToast(status === "approved" ? `${id} approved and disseminated` : `${id} rejected`);
  }

  function broadcastAlert() {
    setAlert({
      text: "Active exploitation observed: credential-harvesting campaign impersonating member login portals. Verify DNS filtering rules now.",
      ts: timeNow(),
    });
    showToast("Emergency alert broadcast to all members");
  }

  return (
    <div className="app">
      <style>{`
        :root{
          --bg:#0B0F17; --surface:#121926; --surface-raised:#1A2333; --border:#28324580;
          --text:#E7ECF3; --text-muted:#8B96AB; --text-dim:#5C6883;
          --accent:#4FD1C5; --accent-dim:#2E7A72;
          --mono: 'IBM Plex Mono', 'JetBrains Mono', monospace;
          --sans: 'IBM Plex Sans', 'Inter', sans-serif;
        }
        *{box-sizing:border-box;}
        .app{
          background:var(--bg); color:var(--text); font-family:var(--sans);
          min-height:600px; display:flex; border-radius:12px; overflow:hidden;
          border:1px solid var(--border); position:relative;
        }
        .sidebar{
          width:220px; background:var(--surface); border-right:1px solid var(--border);
          display:flex; flex-direction:column; padding:20px 14px; flex-shrink:0;
        }
        .brand{ display:flex; align-items:center; gap:8px; padding:0 6px 20px 6px; }
        .brand-text{ font-family:var(--mono); font-size:13px; letter-spacing:0.08em; color:var(--text); font-weight:600;}
        .brand-sub{ font-size:10px; color:var(--text-dim); letter-spacing:0.1em; margin-top:1px;}
        .role-switch{ display:flex; background:var(--surface-raised); border-radius:8px; padding:3px; margin-bottom:22px; border:1px solid var(--border);}
        .role-btn{ flex:1; background:none; border:none; color:var(--text-dim); font-size:11px; font-family:var(--sans);
          padding:7px 4px; border-radius:6px; cursor:pointer; font-weight:600; letter-spacing:0.02em; transition:all .15s;}
        .role-btn.active{ background:var(--accent); color:#08131A; }
        .nav-item{ display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:7px; cursor:pointer;
          color:var(--text-muted); font-size:13px; margin-bottom:2px; border:1px solid transparent; transition:all .15s;}
        .nav-item:hover{ background:var(--surface-raised); color:var(--text);}
        .nav-item.active{ background:var(--surface-raised); color:var(--accent); border-color:var(--border);}
        .nav-item .badge{ margin-left:auto; background:var(--accent-dim); color:#CFF7F1; font-size:10px; padding:1px 6px; border-radius:10px; font-family:var(--mono);}
        .nav-label{ font-size:10px; color:var(--text-dim); letter-spacing:0.12em; margin:16px 8px 6px 8px; text-transform:uppercase;}
        .main{ flex:1; padding:22px 26px; overflow-y:auto; max-height:640px; }
        .header-row{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:18px;}
        h1{ font-size:18px; margin:0; font-weight:600; letter-spacing:-0.01em;}
        .subtext{ color:var(--text-muted); font-size:12.5px; margin-top:3px;}
        .stripe-card{ background:var(--surface); border:1px solid var(--border); border-radius:9px; margin-bottom:11px;
          overflow:hidden; display:flex; }
        .stripe{ width:5px; flex-shrink:0; }
        .stripe-body{ padding:13px 15px; flex:1; }
        .stripe-top{ display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;}
        .id-mono{ font-family:var(--mono); font-size:11px; color:var(--text-dim);}
        .tlp-badge{ font-family:var(--mono); font-size:9.5px; font-weight:700; letter-spacing:0.04em; padding:2px 7px; border-radius:4px; }
        .type-pill{ font-size:10.5px; color:var(--text-muted); background:var(--surface-raised); padding:2px 8px; border-radius:20px; border:1px solid var(--border);}
        .sev-dot{ width:6px; height:6px; border-radius:50%; display:inline-block; margin-right:5px;}
        .value-mono{ font-family:var(--mono); font-size:12.5px; color:var(--text); margin-bottom:4px; word-break:break-all;}
        .desc-text{ font-size:12.5px; color:var(--text-muted); line-height:1.5;}
        .meta-row{ display:flex; align-items:center; gap:12px; margin-top:9px; font-size:11px; color:var(--text-dim);}
        .actions{ display:flex; gap:8px; margin-top:11px;}
        .btn{ font-family:var(--sans); font-size:12px; font-weight:600; padding:6px 13px; border-radius:6px; border:1px solid var(--border);
          cursor:pointer; display:flex; align-items:center; gap:6px; background:var(--surface-raised); color:var(--text); transition:all .15s;}
        .btn:hover{ filter:brightness(1.2); }
        .btn-primary{ background:var(--accent); color:#08131A; border:none; }
        .btn-reject{ background:transparent; color:#D97070; border-color:#D9707044;}
        .btn-danger{ background:#B23A2E; color:#fff; border:none;}
        form.panel{ background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:20px; max-width:560px;}
        .field{ margin-bottom:14px; }
        .field label{ display:block; font-size:11.5px; color:var(--text-muted); margin-bottom:6px; font-weight:600; letter-spacing:0.01em;}
        .field input, .field textarea, .field select{
          width:100%; background:var(--surface-raised); border:1px solid var(--border); color:var(--text);
          padding:9px 11px; border-radius:6px; font-family:var(--sans); font-size:13px; outline:none;
        }
        .field textarea{ resize:vertical; min-height:64px; font-family:var(--sans);}
        .field input:focus, .field textarea:focus, .field select:focus{ border-color:var(--accent); }
        .row2{ display:flex; gap:12px; }
        .row2 .field{ flex:1; }
        .tlp-select{ display:flex; gap:6px; }
        .tlp-opt{ flex:1; padding:8px 4px; border-radius:6px; border:1.5px solid var(--border); cursor:pointer;
          text-align:center; font-family:var(--mono); font-size:9.5px; font-weight:700; letter-spacing:0.03em; color:var(--text-dim); background:var(--surface-raised);}
        .checkbox-row{ display:flex; align-items:flex-start; gap:8px; font-size:12px; color:var(--text-muted); margin-bottom:16px; line-height:1.4;}
        .checkbox-row input{ margin-top:2px; width:auto;}
        .stat-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:11px; margin-bottom:20px;}
        .stat-card{ background:var(--surface); border:1px solid var(--border); border-radius:9px; padding:14px 16px;}
        .stat-num{ font-family:var(--mono); font-size:22px; font-weight:600; color:var(--accent);}
        .stat-label{ font-size:10.5px; color:var(--text-dim); margin-top:4px; letter-spacing:0.03em;}
        .bar-row{ display:flex; align-items:center; gap:10px; margin-bottom:9px;}
        .bar-label{ width:120px; font-size:11.5px; color:var(--text-muted); flex-shrink:0;}
        .bar-track{ flex:1; background:var(--surface-raised); border-radius:4px; height:16px; overflow:hidden;}
        .bar-fill{ height:100%; background:linear-gradient(90deg,var(--accent-dim),var(--accent)); border-radius:4px;}
        .bar-val{ font-family:var(--mono); font-size:11px; color:var(--text-dim); width:20px; text-align:right;}
        .empty{ text-align:center; padding:50px 20px; color:var(--text-dim);}
        .alert-banner{ background:#3A1414; border-bottom:1px solid #B23A2E; padding:10px 18px; display:flex; align-items:center; gap:10px;
          font-size:12.5px; color:#FFD7D0; position:relative;}
        .toast{ position:absolute; bottom:18px; left:50%; transform:translateX(-50%); background:var(--surface-raised); border:1px solid var(--accent);
          color:var(--text); padding:9px 16px; border-radius:8px; font-size:12.5px; display:flex; align-items:center; gap:8px; box-shadow:0 8px 24px rgba(0,0,0,0.4); z-index:20;}
        .org-tag{ font-size:11px; color:var(--text-dim);}
        .locked{ display:flex; align-items:center; gap:5px; color:var(--text-dim); font-size:10.5px;}
      `}</style>

      {alert && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 15 }}>
          <div className="alert-banner">
            <Zap size={15} color="#FF6B5B" />
            <span><strong>EMERGENCY — {alert.ts}</strong> &nbsp;{alert.text}</span>
            <button onClick={() => setAlert(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer" }}>
              <X size={14} color="#FFD7D0" />
            </button>
          </div>
        </div>
      )}

      <div className="sidebar" style={{ marginTop: alert ? 40 : 0 }}>
        <div className="brand">
          <Shield size={20} color="#4FD1C5" />
          <div>
            <div className="brand-text">SENTINEL ISAC</div>
            <div className="brand-sub">SECTOR INTEL EXCHANGE</div>
          </div>
        </div>

        <div className="role-switch">
          <button className={`role-btn ${role === "member" ? "active" : ""}`} onClick={() => { setRole("member"); setTab("submit"); }}>MEMBER</button>
          <button className={`role-btn ${role === "analyst" ? "active" : ""}`} onClick={() => { setRole("analyst"); setTab("queue"); }}>ANALYST</button>
        </div>

        <div className="nav-label">Workflow</div>
        {role === "member" && (
          <div className={`nav-item ${tab === "submit" ? "active" : ""}`} onClick={() => setTab("submit")}>
            <Send size={14} /> Submit report
          </div>
        )}
        {role === "analyst" && (
          <div className={`nav-item ${tab === "queue" ? "active" : ""}`} onClick={() => setTab("queue")}>
            <Inbox size={14} /> Review queue
            {pending.length > 0 && <span className="badge">{pending.length}</span>}
          </div>
        )}
        <div className={`nav-item ${tab === "feed" ? "active" : ""}`} onClick={() => setTab("feed")}>
          <Radio size={14} /> Shared feed
        </div>
        <div className={`nav-item ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>
          <LayoutDashboard size={14} /> Dashboard
        </div>

        {role === "analyst" && (
          <>
            <div className="nav-label">Community</div>
            <div className="nav-item" onClick={broadcastAlert} style={{ color: "#FF8A7A" }}>
              <AlertTriangle size={14} /> Broadcast alert
            </div>
          </>
        )}

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 10.5, color: "var(--text-dim)" }}>
          Logged in as<br /><strong style={{ color: "var(--text-muted)" }}>{role === "member" ? "Your Org" : "Duty Analyst"}</strong>
        </div>
      </div>

      <div className="main" style={{ marginTop: alert ? 40 : 0 }}>
        {tab === "submit" && role === "member" && (
          <>
            <div className="header-row">
              <div>
                <h1>Submit a threat report</h1>
                <div className="subtext">Goes to the duty analyst for triage before it reaches the community.</div>
              </div>
            </div>
            <div className="panel">
              <div className="row2">
                <div className="field">
                  <label>Indicator type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Severity</label>
                  <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                    <option value="low">Low</option><option value="medium">Medium</option>
                    <option value="high">High</option><option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Indicator value</label>
                <input placeholder="e.g. 185.220.101.47, or a domain, hash, URL…" value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea placeholder="What did you observe, and in what context?" value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })} />
              </div>
              <div className="field">
                <label>Classification (TLP)</label>
                <div className="tlp-select">
                  {Object.entries(TLP).map(([k, v]) => (
                    <div key={k} className="tlp-opt" onClick={() => setForm({ ...form, tlp: k })}
                      style={form.tlp === k ? { borderColor: v.color, color: v.color, background: v.color + "18" } : {}}>
                      {v.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" checked={form.allowDisclosure}
                  onChange={(e) => setForm({ ...form, allowDisclosure: e.target.checked })} />
                <span>Allow the community to see my organization's name attached to this report. Otherwise it's shared as "a member org."</span>
              </div>
              <button className="btn btn-primary" type="button" onClick={submit}><Send size={13} /> Submit for review</button>
            </div>
          </>
        )}

        {tab === "queue" && role === "analyst" && (
          <>
            <div className="header-row">
              <div>
                <h1>Review queue</h1>
                <div className="subtext">{pending.length} report{pending.length !== 1 ? "s" : ""} awaiting triage.</div>
              </div>
            </div>
            {pending.length === 0 && <div className="empty">Queue is clear. Nothing waiting on review.</div>}
            {pending.map((s) => <SubmissionCard key={s.id} s={s} analyst onDecide={decide} />)}
          </>
        )}

        {tab === "feed" && (
          <>
            <div className="header-row">
              <div>
                <h1>Shared feed</h1>
                <div className="subtext">Approved, sanitized reports visible to the community.</div>
              </div>
            </div>
            {approved.length === 0 && <div className="empty">No approved reports yet.</div>}
            {approved.map((s) => <SubmissionCard key={s.id} s={s} viewerOrg="Your Org" />)}
          </>
        )}

        {tab === "dashboard" && (
          <>
            <div className="header-row">
              <div>
                <h1>Program dashboard</h1>
                <div className="subtext">Health of the sharing pipeline at a glance.</div>
              </div>
            </div>
            <div className="stat-grid">
              <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-label">TOTAL SUBMISSIONS</div></div>
              <div className="stat-card"><div className="stat-num">{stats.approvedCount}</div><div className="stat-label">DISSEMINATED</div></div>
              <div className="stat-card"><div className="stat-num">{stats.pendingCount}</div><div className="stat-label">IN REVIEW</div></div>
              <div className="stat-card"><div className="stat-num">{stats.contributors}</div><div className="stat-label">CONTRIBUTING ORGS</div></div>
            </div>
            <div className="panel" style={{ maxWidth: 560, padding: 18 }}>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14, fontWeight: 600 }}>DISSEMINATED REPORTS BY TYPE</div>
              {Object.keys(stats.byType).length === 0 && <div style={{ fontSize: 12, color: "var(--text-dim)" }}>No data yet.</div>}
              {Object.entries(stats.byType).map(([type, count]) => (
                <div className="bar-row" key={type}>
                  <div className="bar-label">{type}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${(count / stats.maxCount) * 100}%` }} /></div>
                  <div className="bar-val">{count}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {toast && (
        <div className="toast"><CheckCircle2 size={14} color="var(--accent)" /> {toast}</div>
      )}
    </div>
  );
}

function SubmissionCard({ s, analyst, onDecide, viewerOrg }) {
  const tlp = TLP[s.tlp];
  const sevColor = { low: "#5C6883", medium: "#D89614", high: "#E0713C", critical: "#C0392B" }[s.severity];
  const showOrg = s.allowDisclosure || analyst || s.org === viewerOrg;
  return (
    <div className="stripe-card">
      <div className="stripe" style={{ background: tlp.color }} />
      <div className="stripe-body">
        <div className="stripe-top">
          <span className="id-mono">{s.id}</span>
          <span className="tlp-badge" style={{ color: tlp.color, background: tlp.color + "20" }}>{tlp.label}</span>
          <span className="type-pill">{s.type}</span>
          <span style={{ display: "flex", alignItems: "center", fontSize: 10.5, color: "var(--text-dim)" }}>
            <span className="sev-dot" style={{ background: sevColor }} />{s.severity}
          </span>
        </div>
        <div className="value-mono">{s.value}</div>
        <div className="desc-text">{s.desc}</div>
        <div className="meta-row">
          <span><Clock size={11} style={{ verticalAlign: -1 }} /> {s.ts}</span>
          {showOrg ? (
            <span className="org-tag"><Users size={11} style={{ verticalAlign: -1 }} /> {s.org}</span>
          ) : (
            <span className="locked"><EyeOff size={11} /> source withheld</span>
          )}
        </div>
        {analyst && (
          <div className="actions">
            <button className="btn btn-primary" onClick={() => onDecide(s.id, "approved")}><CheckCircle2 size={13} /> Approve & disseminate</button>
            <button className="btn btn-reject" onClick={() => onDecide(s.id, "rejected")}><XCircle size={13} /> Reject</button>
          </div>
        )}
      </div>
    </div>
  );
}
