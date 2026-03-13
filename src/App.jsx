// src/App.jsx — Routage Client / Admin
import { useState } from "react";
import ClientForm from "./ClientForm";
import AdminPanel from "./AdminPanel";

export default function App() {
  const [mode, setMode] = useState("client"); // client | login | admin
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);

  const handleLogin = async () => {
    if (!pin) { setPinError("Veuillez saisir votre code PIN."); return; }
    setPinLoading(true);
    setPinError("");
    try {
      const res = await fetch("/api/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "auth", pin }),
      });
      const data = await res.json();
      if (data.success) {
        setMode("admin");
      } else {
        setPinError("Code PIN incorrect. Veuillez réessayer.");
      }
    } catch {
      setPinError("Erreur de connexion. Vérifiez votre connexion internet.");
    }
    setPinLoading(false);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&display=swap');
    :root{
      --navy:#0D1B2A; --gold:#C9A84C; --gl:#F5D78E; --cream:#FAF7F2;
      --gray:#8B8B8B; --lt:#E8E4DC; --red:#C0392B; --green:#27AE60;
    }
    *{box-sizing:border-box}
    body{margin:0;font-family:'Source Serif 4',serif;background:var(--cream);color:var(--navy)}

    /* ── APP SHELL ── */
    .app{min-height:100vh;display:flex;flex-direction:column}
    .topbar{background:var(--navy);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px;position:relative}
    .tlogo{font-family:'Playfair Display',serif;font-size:20px;color:var(--gold);letter-spacing:3px}
    .tsub{font-size:10px;color:#fff;opacity:.45;letter-spacing:2px;text-transform:uppercase}
    .tagent{text-align:right;font-size:10px}
    .tagent strong{color:var(--gold);font-family:'Playfair Display',serif;font-size:13px;display:block}
    .tagent span{color:#fff;opacity:.55}
    .bar{height:3px;background:linear-gradient(90deg,var(--navy),var(--gold),var(--gl),var(--gold),var(--navy))}

    /* ── FORM COMMUN ── */
    .tabs{background:#fff;border-bottom:1px solid var(--lt);display:flex;overflow-x:auto}
    .tab{flex:1;min-width:80px;padding:13px 6px;text-align:center;font-size:10px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;color:var(--gray);border-bottom:3px solid transparent;transition:all .2s;white-space:nowrap}
    .tab.active{color:var(--gold);border-bottom-color:var(--gold);font-weight:600}
    .tab.done{color:var(--navy);border-bottom-color:var(--navy)}
    .main{flex:1;padding:28px 20px;max-width:860px;margin:0 auto;width:100%}
    .pagetitle{font-family:'Playfair Display',serif;font-size:20px;color:var(--navy);margin-bottom:22px;border-bottom:1px solid var(--lt);padding-bottom:10px}
    .pagetitle span{color:var(--gold)}
    .card{background:#fff;box-shadow:0 2px 16px rgba(13,27,42,.07);margin-bottom:20px;overflow:hidden}
    .card-hdr{background:var(--navy);padding:12px 20px;display:flex;align-items:center;gap:10px}
    .card-ico{width:26px;height:26px;background:var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--navy);flex-shrink:0}
    .card-ttl{font-family:'Playfair Display',serif;color:var(--gold);font-size:13px;letter-spacing:2px;text-transform:uppercase}
    .card-body{padding:20px}
    .sub-ttl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);border-left:3px solid var(--gold);padding-left:8px;margin-bottom:12px;font-weight:600}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
    .f{display:flex;flex-direction:column;gap:3px}
    .f label{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--gray);font-weight:600}
    .f input,.f select,.f textarea{border:1px solid var(--lt);padding:9px 11px;font-family:'Source Serif 4',serif;font-size:13px;color:var(--navy);background:var(--cream);transition:all .2s;outline:none;border-radius:1px;width:100%}
    .f input:focus,.f select:focus,.f textarea:focus{border-color:var(--gold);background:#fff;box-shadow:0 0 0 3px rgba(201,168,76,.1)}
    .f textarea{resize:vertical;min-height:70px}
    .full{grid-column:1/-1}
    .tot{background:var(--navy);color:var(--gold);padding:10px 14px;display:flex;justify-content:space-between;font-family:'Playfair Display',serif;font-size:12px;margin-top:6px}
    .rg{display:flex;flex-wrap:wrap;gap:10px}
    .ro{display:flex;align-items:center;gap:5px;cursor:pointer;font-size:13px}
    .ro input{width:15px;height:15px;accent-color:var(--gold);cursor:pointer;flex-shrink:0}
    .dvd{height:1px;background:var(--lt);margin:16px 0}
    .cr-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 28px;gap:8px;align-items:end;margin-bottom:8px}
    .pt-row{display:grid;grid-template-columns:2fr 2fr 1fr 28px;gap:8px;align-items:end;margin-bottom:8px}
    .btn-add{background:none;border:1px dashed var(--gold);color:var(--gold);padding:7px 14px;font-size:10px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;transition:all .2s;font-family:'Source Serif 4',serif}
    .btn-add:hover{background:var(--gold);color:var(--navy)}
    .btn-del{background:none;border:none;color:var(--red);font-size:17px;cursor:pointer;padding:0;line-height:1;flex-shrink:0}
    .navbtns{display:flex;justify-content:space-between;margin-top:28px;gap:10px}
    .btn-nav{padding:11px 28px;font-family:'Playfair Display',serif;font-size:13px;letter-spacing:1px;cursor:pointer;transition:all .2s;border:none}
    .btn-prev{background:transparent;border:1px solid var(--navy);color:var(--navy)}
    .btn-prev:hover{background:var(--navy);color:var(--gold)}
    .btn-next{background:var(--gold);color:var(--navy);padding:11px 24px;font-family:'Playfair Display',serif;font-size:13px;cursor:pointer;border:none;transition:all .2s;letter-spacing:1px}
    .btn-next:hover{background:var(--navy);color:var(--gold)}
    .btn-submit{background:var(--green);color:#fff;border:none;padding:14px 40px;font-family:'Playfair Display',serif;font-size:15px;letter-spacing:1px;cursor:pointer;transition:all .2s;border-radius:2px}
    .btn-submit:hover{background:#1E8449}
    .btn-submit:disabled{opacity:.6;cursor:not-allowed}
    .status-box{padding:12px 18px;border-radius:2px;margin-bottom:14px;font-size:13px}
    .st-loading{background:#EBF5FF;border-left:4px solid #3498DB;color:#1A5276}
    .st-success{background:#EAFAF1;border-left:4px solid var(--green);color:#1E8449}
    .st-error{background:#FDEDEC;border-left:4px solid var(--red);color:var(--red)}
    .info-box{background:#FFF8E8;border:1px solid var(--gold);padding:10px 14px;font-size:11px;margin-bottom:14px;border-radius:2px;color:#856404;line-height:1.6}
    .badge{display:inline-block;padding:2px 8px;background:rgba(201,168,76,.15);color:var(--gold);font-size:10px;letter-spacing:1px;text-transform:uppercase;border-radius:1px;white-space:nowrap}
    .env-table{display:flex;flex-direction:column;gap:8px}
    .env-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--cream);border:1px solid var(--lt)}
    .env-key{font-family:monospace;font-size:12px;background:#0D1B2A;color:#C9A84C;padding:2px 8px;border-radius:2px;flex-shrink:0}
    .env-desc{font-size:12px;color:var(--gray);flex:1}
    .env-badge{font-size:10px;padding:2px 8px;border-radius:2px;flex-shrink:0}
    .env-badge.required{background:#FDEDEC;color:var(--red)}
    .env-badge.optional{background:#EAFAF1;color:var(--green)}

    /* ── SUCCESS PAGE ── */
    .success-page{min-height:60vh;display:flex;align-items:center;justify-content:center;padding:40px 20px}
    .success-card{background:#fff;padding:40px;max-width:500px;text-align:center;box-shadow:0 4px 30px rgba(13,27,42,.1)}
    .success-icon{font-size:48px;margin-bottom:16px}
    .success-card h2{font-family:'Playfair Display',serif;font-size:22px;color:var(--navy);margin-bottom:12px}
    .success-card p{font-size:14px;color:var(--gray);margin-bottom:8px;line-height:1.6}
    .success-contact{margin-top:24px;padding:16px;background:var(--navy);color:#fff;text-align:left}
    .success-contact strong{color:var(--gold);font-family:'Playfair Display',serif;font-size:15px;display:block;margin-bottom:4px}
    .success-contact span{display:block;font-size:12px;opacity:.8;margin-bottom:2px}

    /* ── LOGIN ── */
    .login-page{min-height:80vh;display:flex;align-items:center;justify-content:center;padding:40px 20px}
    .login-card{background:#fff;padding:40px;max-width:400px;width:100%;box-shadow:0 4px 30px rgba(13,27,42,.1)}
    .login-title{font-family:'Playfair Display',serif;font-size:22px;color:var(--navy);margin-bottom:6px;text-align:center}
    .login-sub{font-size:12px;color:var(--gray);text-align:center;margin-bottom:28px}
    .pin-input{text-align:center;font-size:22px;letter-spacing:8px;border:2px solid var(--lt);padding:14px;width:100%;font-family:'Playfair Display',serif;outline:none;transition:border-color .2s}
    .pin-input:focus{border-color:var(--gold)}
    .pin-error{color:var(--red);font-size:12px;text-align:center;margin-top:8px}
    .btn-login{width:100%;background:var(--gold);color:var(--navy);border:none;padding:14px;font-family:'Playfair Display',serif;font-size:14px;letter-spacing:1px;cursor:pointer;margin-top:16px;transition:all .2s}
    .btn-login:hover{background:var(--navy);color:var(--gold)}
    .btn-login:disabled{opacity:.6;cursor:not-allowed}

    /* ── ADMIN LAYOUT ── */
    .admin-layout{display:flex;min-height:calc(100vh - 63px)}
    .admin-sidebar{width:220px;background:var(--navy);flex-shrink:0;display:flex;flex-direction:column}
    .sidebar-brand{padding:20px 16px;border-bottom:1px solid rgba(201,168,76,.2)}
    .sidebar-logo{font-family:'Playfair Display',serif;font-size:18px;color:var(--gold);letter-spacing:3px}
    .sidebar-sub{font-size:9px;color:#fff;opacity:.4;letter-spacing:2px;text-transform:uppercase;margin-top:2px}
    .sidebar-nav{flex:1;padding:12px 0}
    .nav-item{display:flex;align-items:center;gap:10px;padding:12px 16px;cursor:pointer;color:rgba(255,255,255,.6);transition:all .2s;font-size:13px}
    .nav-item:hover{background:rgba(201,168,76,.1);color:#fff}
    .nav-item.active{background:rgba(201,168,76,.15);color:var(--gold);border-left:3px solid var(--gold)}
    .nav-icon{font-size:16px;flex-shrink:0}
    .nav-label{font-size:13px}
    .sidebar-footer{padding:16px;border-top:1px solid rgba(201,168,76,.2)}
    .agent-info strong{color:var(--gold);font-size:12px;display:block;font-family:'Playfair Display',serif}
    .agent-info span{color:#fff;opacity:.5;font-size:10px}
    .btn-logout{width:100%;margin-top:10px;background:transparent;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.6);padding:8px;font-size:11px;cursor:pointer;transition:all .2s;font-family:'Source Serif 4',serif}
    .btn-logout:hover{border-color:var(--red);color:var(--red)}
    .admin-content{flex:1;overflow-y:auto;background:var(--cream)}
    .admin-page{padding:28px 28px;max-width:1000px}
    .page-title{font-family:'Playfair Display',serif;font-size:24px;color:var(--navy);margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid var(--lt)}
    .section-title{font-family:'Playfair Display',serif;font-size:16px;color:var(--navy);margin:24px 0 12px}

    /* ── STATS ── */
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
    .stat-card{background:#fff;padding:20px;box-shadow:0 2px 12px rgba(13,27,42,.06);transition:all .2s}
    .stat-card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(13,27,42,.1)}
    .stat-icon{font-size:24px;margin-bottom:8px}
    .stat-value{font-family:'Playfair Display',serif;font-size:22px;color:var(--gold);font-weight:700}
    .stat-label{font-size:11px;color:var(--gray);text-transform:uppercase;letter-spacing:1px;margin-top:4px}

    /* ── TABLE ── */
    .fiches-table{background:#fff;box-shadow:0 2px 12px rgba(13,27,42,.06);margin-bottom:20px;overflow:hidden}
    .table-header{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr 1fr 1fr 1fr;gap:8px;padding:10px 16px;background:var(--navy);color:var(--gold);font-size:10px;letter-spacing:1px;text-transform:uppercase;font-weight:600}
    .table-row{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr 1fr 1fr 1fr;gap:8px;padding:12px 16px;border-bottom:1px solid var(--lt);font-size:12px;cursor:pointer;transition:background .2s;align-items:center}
    .table-row:hover{background:#FFF8E8}
    .table-row.selected{background:rgba(201,168,76,.08);border-left:3px solid var(--gold)}
    .row-name{font-weight:600;color:var(--navy)}
    .row-budget{color:var(--gold);font-weight:600;font-family:'Playfair Display',serif}
    .row-actions{display:flex;gap:4px}
    .btn-action{background:none;border:1px solid var(--lt);padding:4px 8px;cursor:pointer;font-size:14px;transition:all .2s;color:var(--navy);border-radius:1px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
    .btn-action:hover{border-color:var(--gold);background:#FFF8E8}
    .btn-refresh{background:var(--gold);color:var(--navy);border:none;padding:8px 16px;font-size:12px;cursor:pointer;font-family:'Playfair Display',serif;letter-spacing:1px;transition:all .2s}
    .btn-refresh:hover{background:var(--navy);color:var(--gold)}

    /* ── FICHE DETAIL ── */
    .fiche-detail{background:#fff;padding:20px;box-shadow:0 2px 12px rgba(13,27,42,.06);border-left:4px solid var(--gold)}
    .detail-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:12px}
    .detail-grid div{display:flex;flex-direction:column;gap:2px}
    .detail-lbl{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--gray);font-weight:600}

    .loading-msg{text-align:center;color:var(--gray);padding:40px;font-style:italic}
    .empty-msg{text-align:center;color:var(--gray);padding:40px;background:#fff;border:1px dashed var(--lt)}

    /* ── ADMIN ACCESS BUTTON (discret) ── */
    .admin-hint{position:fixed;bottom:16px;right:16px;z-index:100}
    .admin-hint-btn{background:rgba(13,27,42,.08);border:1px solid rgba(13,27,42,.1);padding:6px 12px;font-size:10px;color:var(--gray);cursor:pointer;border-radius:20px;transition:all .2s;letter-spacing:1px}
    .admin-hint-btn:hover{background:var(--navy);color:var(--gold)}

    @media(max-width:768px){
      .admin-sidebar{width:60px}
      .nav-label,.sidebar-brand .sidebar-sub,.agent-info span,.btn-logout,.sidebar-logo{display:none}
      .sidebar-brand{padding:12px 8px}
      .nav-item{padding:14px;justify-content:center}
      .stats-grid{grid-template-columns:1fr 1fr}
      .table-header,.table-row{grid-template-columns:2fr 1fr 1fr 1fr}
      .table-header span:nth-child(3),.table-header span:nth-child(4),.table-header span:nth-child(5),
      .table-row span:nth-child(3),.table-row span:nth-child(4),.table-row span:nth-child(5){display:none}
      .detail-grid{grid-template-columns:1fr 1fr}
    }
    @media(max-width:600px){
      .g2,.g3{grid-template-columns:1fr}
      .cr-row{grid-template-columns:1fr 1fr}
      .pt-row{grid-template-columns:1fr 1fr}
      .stats-grid{grid-template-columns:1fr 1fr}
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="tlogo">SEXTANT</div>
            <div className="tsub">France</div>
          </div>
          <div className="tagent">
            <strong>Franck Fidi</strong>
            <span>Agent Mandataire • Martinique • 06 96 93 80 99</span>
          </div>
        </div>
        <div className="bar" />

        {/* ── MODE CLIENT ── */}
        {mode === "client" && (
          <>
            <ClientForm />
            {/* Bouton discret pour accéder à l'admin */}
            <div className="admin-hint">
              {!showAdminHint ? (
                <button className="admin-hint-btn" onClick={() => setShowAdminHint(true)}>
                  espace agent
                </button>
              ) : (
                <button className="admin-hint-btn" style={{ background: "var(--navy)", color: "var(--gold)" }} onClick={() => setMode("login")}>
                  🔐 Connexion agent
                </button>
              )}
            </div>
          </>
        )}

        {/* ── MODE LOGIN ── */}
        {mode === "login" && (
          <div className="login-page">
            <div className="login-card">
              <div className="login-title">Espace Agent</div>
              <div className="login-sub">Saisissez votre code PIN administrateur</div>
              <input
                className="pin-input"
                type="password"
                maxLength={8}
                value={pin}
                onChange={e => setPin(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••"
                autoFocus
              />
              {pinError && <div className="pin-error">{pinError}</div>}
              <button className="btn-login" onClick={handleLogin} disabled={pinLoading}>
                {pinLoading ? "⏳ Vérification…" : "🔐 Accéder au panel"}
              </button>
              <button
                style={{ width: "100%", background: "none", border: "none", color: "var(--gray)", fontSize: 12, marginTop: 12, cursor: "pointer" }}
                onClick={() => { setMode("client"); setPin(""); setPinError(""); setShowAdminHint(false); }}
              >
                ← Retour au formulaire client
              </button>
            </div>
          </div>
        )}

        {/* ── MODE ADMIN ── */}
        {mode === "admin" && (
          <AdminPanel onLogout={() => { setMode("client"); setPin(""); setShowAdminHint(false); }} />
        )}

      </div>
    </>
  );
}
