// src/AdminPanel.jsx
import { useState, useEffect } from "react";

export default function AdminPanel({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiche, setSelectedFiche] = useState(null);
  const [setupPageId, setSetupPageId] = useState("");
  const [setupStatus, setSetupStatus] = useState(null);
  const [setupMsg, setSetupMsg] = useState("");
  const [gmailTo, setGmailTo] = useState("");
  const [gmailSubject, setGmailSubject] = useState("Fiche Découverte Immobilière");
  const [gmailBody, setGmailBody] = useState("");
  const [partenaires, setPartenaires] = useState([{ nom: "", email: "", role: "" }]);

  const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n || 0);

  // Chargement des fiches au démarrage
  useEffect(() => {
    if (activeMenu === "dashboard" || activeMenu === "fiches") {
      loadFiches();
    }
  }, [activeMenu]);

  const loadFiches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notion?action=list");
      const data = await res.json();
      if (data.results) {
        setFiches(data.results);
      }
    } catch {
      console.error("Erreur chargement fiches");
    }
    setLoading(false);
  };

  const setupNotion = async () => {
    if (!setupPageId) {
      setSetupStatus("error");
      setSetupMsg("Veuillez entrer l'ID de la page Notion parent.");
      return;
    }
    setSetupStatus("loading");
    setSetupMsg("Création de la base de données Notion en cours…");
    try {
      const res = await fetch("/api/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup", pageId: setupPageId }),
      });
      const data = await res.json();
      if (data.id) {
        setSetupStatus("success");
        setSetupMsg(`✅ Base créée avec succès ! ID : ${data.id}\n\nCopiez cet ID et ajoutez-le comme variable d'environnement NOTION_DB_ID dans Vercel.`);
      } else {
        setSetupStatus("error");
        setSetupMsg("Erreur : " + (data.message || JSON.stringify(data)));
      }
    } catch (e) {
      setSetupStatus("error");
      setSetupMsg("Erreur de connexion : " + e.message);
    }
  };

  // Extraction des propriétés d'une fiche Notion
  const getProp = (fiche, key, type = "text") => {
    const prop = fiche.properties?.[key];
    if (!prop) return "—";
    if (type === "title") return prop.title?.[0]?.plain_text || "—";
    if (type === "select") return prop.select?.name || "—";
    if (type === "rich_text") return prop.rich_text?.[0]?.plain_text || "—";
    if (type === "number") return prop.number || 0;
    if (type === "email") return prop.email || "—";
    if (type === "phone") return prop.phone_number || "—";
    if (type === "date") return prop.date?.start || "—";
    if (type === "status") return prop.status?.name || "—";
    return "—";
  };

  const printFichePDF = (fiche) => {
    const nom = getProp(fiche, "Nom", "title");
    const lieu = getProp(fiche, "Lieu", "rich_text");
    const type = getProp(fiche, "Type de projet", "select");
    const budget = getProp(fiche, "Budget total", "number");
    const email = getProp(fiche, "Email", "email");
    const tel = getProp(fiche, "Téléphone", "phone");
    const date = getProp(fiche, "Date soumission", "date");
    const nature = getProp(fiche, "Nature du bien", "select");
    const vendeur = getProp(fiche, "Vendeur", "rich_text");
    const salaire = getProp(fiche, "Salaire mensuel total", "number");
    const apport = getProp(fiche, "Apport personnel", "number");

    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Serif+4:wght@300;400;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Source Serif 4',serif;color:#0D1B2A;font-size:10px;background:#fff}
.hdr{background:#0D1B2A;color:#C9A84C;padding:14px 20px;display:flex;justify-content:space-between;align-items:center}
.hdr h1{font-family:'Playfair Display',serif;font-size:18px;letter-spacing:3px}
.bar{height:3px;background:linear-gradient(90deg,#0D1B2A,#C9A84C,#F5D78E,#C9A84C,#0D1B2A)}
.sec{margin:10px 18px}.st{font-family:'Playfair Display',serif;font-size:11px;color:#C9A84C;border-bottom:1px solid #C9A84C;padding-bottom:3px;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px}
.f{display:flex;flex-direction:column;margin-bottom:6px}.lbl{font-size:8px;color:#888;text-transform:uppercase;letter-spacing:.5px}
.val{font-size:11px;border-bottom:1px solid #ddd;padding-bottom:2px;min-height:16px}
.tot{background:#0D1B2A;color:#C9A84C;padding:6px 10px;font-family:'Playfair Display',serif;font-size:11px;display:flex;justify-content:space-between;margin-top:6px}
</style></head><body>
<div class="hdr">
  <div><div style="font-size:8px;letter-spacing:3px;margin-bottom:4px">SEXTANT FRANCE</div><h1>FICHE DÉCOUVERTE</h1></div>
  <div style="text-align:right;font-size:9px">
    <strong style="color:#C9A84C;font-family:'Playfair Display',serif;font-size:13px;display:block">Franck Fidi</strong>
    <span style="color:#fff;opacity:.6">Agent Mandataire Martinique<br>06 96 93 80 99<br>franck.fidi@sextantfrance.fr</span>
  </div>
</div>
<div class="bar"></div>
<div class="sec"><div class="st">Identification</div>
  <div class="g2">
    <div class="f"><span class="lbl">Nom complet</span><span class="val">${nom}</span></div>
    <div class="f"><span class="lbl">Date de soumission</span><span class="val">${date}</span></div>
    <div class="f"><span class="lbl">Email</span><span class="val">${email}</span></div>
    <div class="f"><span class="lbl">Téléphone</span><span class="val">${tel}</span></div>
  </div>
</div>
<div class="sec"><div class="st">Projet</div>
  <div class="g2">
    <div class="f"><span class="lbl">Type de projet</span><span class="val">${type}</span></div>
    <div class="f"><span class="lbl">Lieu d'acquisition</span><span class="val">${lieu}</span></div>
    <div class="f"><span class="lbl">Nature du bien</span><span class="val">${nature}</span></div>
    <div class="f"><span class="lbl">Vendeur</span><span class="val">${vendeur}</span></div>
  </div>
</div>
<div class="sec"><div class="st">Finances</div>
  <div class="g2">
    <div class="f"><span class="lbl">Budget total projet</span><span class="val">${fmt(budget)}</span></div>
    <div class="f"><span class="lbl">Apport personnel</span><span class="val">${fmt(apport)}</span></div>
    <div class="f"><span class="lbl">Revenus mensuels (foyer)</span><span class="val">${fmt(salaire)}/mois</span></div>
  </div>
  <div class="tot"><span>BUDGET TOTAL</span><span>${fmt(budget)}</span></div>
</div>
<div class="bar" style="margin-top:20px"></div>
<div style="text-align:center;font-size:8px;color:#aaa;padding:5px;font-style:italic">Document confidentiel — Sextant France • Franck Fidi • RSAC 387 683 048</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const openGmailForFiche = (fiche) => {
    const nom = getProp(fiche, "Nom", "title");
    const type = getProp(fiche, "Type de projet", "select");
    const lieu = getProp(fiche, "Lieu", "rich_text");
    const budget = getProp(fiche, "Budget total", "number");
    const to = [gmailTo, ...partenaires.map(p => p.email)].filter(Boolean).join(",");
    const subject = gmailSubject || `Fiche Découverte — ${nom}`;
    const body = gmailBody || `Bonjour,\n\nVeuillez trouver ci-joint la fiche découverte de :\n\nClient : ${nom}\nType : ${type}\nLieu : ${lieu}\nBudget : ${fmt(budget)}\n\nCordialement,\nFranck Fidi\nSextant France — Martinique\n06 96 93 80 99`;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  // ── STATS ──
  const totalBudget = fiches.reduce((s, f) => s + (getProp(f, "Budget total", "number") || 0), 0);
  const fichesCeMois = fiches.filter(f => {
    const d = getProp(f, "Date soumission", "date");
    if (d === "—") return false;
    const now = new Date();
    const fd = new Date(d);
    return fd.getMonth() === now.getMonth() && fd.getFullYear() === now.getFullYear();
  }).length;

  // ── MENU ──
  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Tableau de bord" },
    { id: "fiches", icon: "📋", label: "Fiches clients" },
    { id: "envoi", icon: "✉️", label: "Envoi Gmail" },
    { id: "setup", icon: "⚙️", label: "Configuration Notion" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">SEXTANT</div>
          <div className="sidebar-sub">Administration</div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div key={item.id} className={`nav-item ${activeMenu === item.id ? "active" : ""}`} onClick={() => setActiveMenu(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="agent-info">
            <strong>Franck Fidi</strong>
            <span>Agent Mandataire</span>
          </div>
          <button className="btn-logout" onClick={onLogout}>⬅ Déconnexion</button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="admin-content">

        {/* ── DASHBOARD ── */}
        {activeMenu === "dashboard" && (
          <div className="admin-page">
            <h1 className="page-title">Tableau de bord</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{fiches.length}</div>
                <div className="stat-label">Fiches totales</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{fichesCeMois}</div>
                <div className="stat-label">Ce mois-ci</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">{fmt(totalBudget)}</div>
                <div className="stat-label">Volume total projets</div>
              </div>
              <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveMenu("fiches")}>
                <div className="stat-icon">🔍</div>
                <div className="stat-value">→</div>
                <div className="stat-label">Voir toutes les fiches</div>
              </div>
            </div>

            <h2 className="section-title">Dernières fiches reçues</h2>
            {loading ? (
              <div className="loading-msg">⏳ Chargement des fiches…</div>
            ) : fiches.length === 0 ? (
              <div className="empty-msg">Aucune fiche pour le moment. Partagez le lien client à vos prospects !</div>
            ) : (
              <div className="fiches-table">
                <div className="table-header">
                  <span>Client</span><span>Type</span><span>Lieu</span><span>Budget</span><span>Date</span><span>Actions</span>
                </div>
                {fiches.slice(0, 5).map(f => (
                  <div key={f.id} className="table-row">
                    <span className="row-name">{getProp(f, "Nom", "title")}</span>
                    <span><span className="badge">{getProp(f, "Type de projet", "select")}</span></span>
                    <span>{getProp(f, "Lieu", "rich_text")}</span>
                    <span className="row-budget">{fmt(getProp(f, "Budget total", "number"))}</span>
                    <span>{getProp(f, "Date soumission", "date")}</span>
                    <span className="row-actions">
                      <button className="btn-action" onClick={() => { setSelectedFiche(f); setActiveMenu("fiches"); }} title="Voir">👁</button>
                      <button className="btn-action" onClick={() => printFichePDF(f)} title="PDF">📄</button>
                      <button className="btn-action" onClick={() => { setSelectedFiche(f); setActiveMenu("envoi"); }} title="Gmail">✉️</button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FICHES CLIENTS ── */}
        {activeMenu === "fiches" && (
          <div className="admin-page">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 className="page-title" style={{ margin: 0 }}>Fiches Clients</h1>
              <button className="btn-refresh" onClick={loadFiches}>🔄 Actualiser</button>
            </div>
            {loading ? (
              <div className="loading-msg">⏳ Chargement…</div>
            ) : fiches.length === 0 ? (
              <div className="empty-msg">Aucune fiche. Partagez le lien client à vos prospects !</div>
            ) : (
              <>
                <div className="fiches-table">
                  <div className="table-header">
                    <span>Client</span><span>Type</span><span>Lieu</span><span>Budget</span><span>Revenus/mois</span><span>Date</span><span>Actions</span>
                  </div>
                  {fiches.map(f => (
                    <div key={f.id} className={`table-row ${selectedFiche?.id === f.id ? "selected" : ""}`} onClick={() => setSelectedFiche(f)}>
                      <span className="row-name">{getProp(f, "Nom", "title")}</span>
                      <span><span className="badge">{getProp(f, "Type de projet", "select")}</span></span>
                      <span>{getProp(f, "Lieu", "rich_text")}</span>
                      <span className="row-budget">{fmt(getProp(f, "Budget total", "number"))}</span>
                      <span>{fmt(getProp(f, "Salaire mensuel total", "number"))}</span>
                      <span>{getProp(f, "Date soumission", "date")}</span>
                      <span className="row-actions" onClick={e => e.stopPropagation()}>
                        <button className="btn-action" onClick={() => printFichePDF(f)} title="Exporter PDF">📄</button>
                        <button className="btn-action" onClick={() => { setSelectedFiche(f); setActiveMenu("envoi"); }} title="Envoyer par Gmail">✉️</button>
                        <a className="btn-action" href={f.url} target="_blank" rel="noreferrer" title="Voir dans Notion">🔗</a>
                      </span>
                    </div>
                  ))}
                </div>

                {selectedFiche && (
                  <div className="fiche-detail">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)" }}>
                        {getProp(selectedFiche, "Nom", "title")}
                      </h3>
                      <button className="btn-action" onClick={() => setSelectedFiche(null)}>✕</button>
                    </div>
                    <div className="detail-grid">
                      <div><span className="detail-lbl">Email</span><span>{getProp(selectedFiche, "Email", "email")}</span></div>
                      <div><span className="detail-lbl">Téléphone</span><span>{getProp(selectedFiche, "Téléphone", "phone")}</span></div>
                      <div><span className="detail-lbl">Type de projet</span><span>{getProp(selectedFiche, "Type de projet", "select")}</span></div>
                      <div><span className="detail-lbl">Lieu</span><span>{getProp(selectedFiche, "Lieu", "rich_text")}</span></div>
                      <div><span className="detail-lbl">Nature du bien</span><span>{getProp(selectedFiche, "Nature du bien", "select")}</span></div>
                      <div><span className="detail-lbl">Vendeur</span><span>{getProp(selectedFiche, "Vendeur", "rich_text")}</span></div>
                      <div><span className="detail-lbl">Budget total</span><span className="row-budget">{fmt(getProp(selectedFiche, "Budget total", "number"))}</span></div>
                      <div><span className="detail-lbl">Apport personnel</span><span>{fmt(getProp(selectedFiche, "Apport personnel", "number"))}</span></div>
                      <div><span className="detail-lbl">Revenus mensuels</span><span>{fmt(getProp(selectedFiche, "Salaire mensuel total", "number"))}</span></div>
                      <div><span className="detail-lbl">Date soumission</span><span>{getProp(selectedFiche, "Date soumission", "date")}</span></div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <button className="btn-next" onClick={() => printFichePDF(selectedFiche)}>📄 Exporter PDF</button>
                      <button className="btn-next" style={{ background: "var(--navy)" }} onClick={() => { setActiveMenu("envoi"); }}>✉️ Envoyer par Gmail</button>
                      <a className="btn-next" style={{ background: "#9747FF", textDecoration: "none" }} href={selectedFiche.url} target="_blank" rel="noreferrer">🔗 Voir dans Notion</a>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── ENVOI GMAIL ── */}
        {activeMenu === "envoi" && (
          <div className="admin-page">
            <h1 className="page-title">Envoi par Gmail</h1>
            {selectedFiche && (
              <div className="info-box" style={{ marginBottom: 20 }}>
                📋 Fiche sélectionnée : <strong>{getProp(selectedFiche, "Nom", "title")}</strong>
              </div>
            )}
            <div className="card">
              <div className="card-hdr"><div className="card-ico">✉️</div><div className="card-ttl">Destinataires</div></div>
              <div className="card-body">
                <div className="g2">
                  <div className="f"><label>Destinataire principal</label><input type="email" value={gmailTo} onChange={e => setGmailTo(e.target.value)} placeholder="notaire@cabinet.fr" /></div>
                  <div className="f"><label>Objet</label><input value={gmailSubject} onChange={e => setGmailSubject(e.target.value)} /></div>
                </div>
                <div className="dvd" />
                <div className="sub-ttl">Partenaires en copie</div>
                {partenaires.map((p, i) => (
                  <div key={i} className="pt-row">
                    <div className="f"><label>Nom</label><input value={p.nom} onChange={e => { const a = [...partenaires]; a[i].nom = e.target.value; setPartenaires(a); }} placeholder="Maître Dupont" /></div>
                    <div className="f"><label>Email</label><input type="email" value={p.email} onChange={e => { const a = [...partenaires]; a[i].email = e.target.value; setPartenaires(a); }} placeholder="email@cabinet.fr" /></div>
                    <div className="f"><label>Rôle</label>
                      <select value={p.role} onChange={e => { const a = [...partenaires]; a[i].role = e.target.value; setPartenaires(a); }}>
                        <option value="">— Rôle —</option>
                        {["Notaire", "Gestionnaire de patrimoine", "Banquier", "Avocat", "Expert-comptable", "Courtier"].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <button className="btn-del" onClick={() => setPartenaires(p => p.filter((_, idx) => idx !== i))}>×</button>
                  </div>
                ))}
                <button className="btn-add" onClick={() => setPartenaires(p => [...p, { nom: "", email: "", role: "" }])}>+ Ajouter un partenaire</button>
                <div className="dvd" />
                <div className="f"><label>Message personnalisé (optionnel)</label><textarea value={gmailBody} onChange={e => setGmailBody(e.target.value)} placeholder="Laissez vide pour message automatique…" /></div>
                <div style={{ marginTop: 16 }}>
                  {selectedFiche ? (
                    <button className="btn-next" onClick={() => openGmailForFiche(selectedFiche)}>✉️ Ouvrir Gmail avec cette fiche</button>
                  ) : (
                    <div className="empty-msg">Sélectionnez d'abord une fiche dans la liste des clients.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CONFIGURATION NOTION ── */}
        {activeMenu === "setup" && (
          <div className="admin-page">
            <h1 className="page-title">Configuration Notion</h1>
            <div className="card">
              <div className="card-hdr"><div className="card-ico">📋</div><div className="card-ttl">Créer la base de données automatiquement</div></div>
              <div className="card-body">
                <div className="info-box">
                  💡 Cette action crée automatiquement la base de données "📋 Fiches Découverte — Sextant" dans votre Notion avec toutes les colonnes nécessaires.<br /><br />
                  <strong>Prérequis :</strong><br />
                  1. Avoir configuré <code>NOTION_TOKEN</code> dans Vercel<br />
                  2. Créer une page vide dans Notion et récupérer son ID depuis l'URL<br />
                  3. Partager cette page avec votre intégration Notion
                </div>
                <div className="f" style={{ marginTop: 16 }}>
                  <label>ID de la page Notion parent (où créer la base)</label>
                  <input value={setupPageId} onChange={e => setSetupPageId(e.target.value)} placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
                {setupStatus && (
                  <div className={`status-box st-${setupStatus}`} style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{setupMsg}</div>
                )}
                <button className="btn-next" style={{ marginTop: 16 }} onClick={setupNotion} disabled={setupStatus === "loading"}>
                  {setupStatus === "loading" ? "⏳ Création…" : "🚀 Créer la base Notion"}
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-hdr"><div className="card-ico">🔑</div><div className="card-ttl">Variables d'environnement requises</div></div>
              <div className="card-body">
                <p style={{ fontSize: 13, marginBottom: 16, color: "var(--gray)" }}>Ces variables doivent être configurées dans Vercel → Settings → Environment Variables</p>
                <div className="env-table">
                  {[
                    { key: "NOTION_TOKEN", desc: "Token d'intégration Notion (commence par secret_)", required: true },
                    { key: "NOTION_DB_ID", desc: "ID de la base de données Fiches Découverte", required: true },
                    { key: "ADMIN_PIN", desc: "Code PIN pour accéder au panel admin (défaut : 1234)", required: false },
                  ].map(v => (
                    <div key={v.key} className="env-row">
                      <code className="env-key">{v.key}</code>
                      <span className="env-desc">{v.desc}</span>
                      <span className={`env-badge ${v.required ? "required" : "optional"}`}>{v.required ? "Requis" : "Optionnel"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
