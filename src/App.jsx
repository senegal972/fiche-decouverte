import { useState } from "react";

const SECTIONS = ["Identité", "Projet", "Financement", "Revenus & Charges", "Envoi"];

const initialForm = {
  m_nom: "", m_prenom: "", m_email: "", m_tel: "", m_dob: "", m_lieu_naissance: "",
  m_employeur: "", m_profession: "", m_anciennete: "",
  f_nom: "", f_prenom: "", f_email: "", f_tel: "", f_dob: "", f_lieu_naissance: "",
  f_employeur: "", f_profession: "", f_anciennete: "",
  situation: "", nb_enfants: "", ages_enfants: "", domicile: "",
  divorce_instance: false, divorce_date: "",
  type_projet: "", lieu_acquisition: "", vendeur: "", type_vente: "",
  compromis_signe: "", stade: "projet", nature_bien: "", objet_bien: "",
  prix_acquisition: "", prix_construction: "", montant_travaux: "", frais_notaire: "",
  pret_demande: "", duree_pret: "", apport_personnel: "", pret_employeur: "", banque: "",
  rfr_m: "", salaire_m: "", autres_revenus_m: "",
  rfr_f: "", salaire_f: "", autres_revenus_f: "",
  loyer_actuel: "", pension_alimentaire: "",
  credits: [{ nature: "", mensualite: "", fin_pret: "", capital_restant: "" }],
  commentaires: "",
  notion_db_id: "", notion_db_name: "Fiches Découverte",
  gmail_to: "", gmail_subject: "Fiche Découverte Immobilière", gmail_body: "",
  partenaires: [{ nom: "", email: "", role: "" }],
};

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const setCredit = (i, field, value) => {
    const credits = [...form.credits];
    credits[i] = { ...credits[i], [field]: value };
    setForm(f => ({ ...f, credits }));
  };
  const addCredit = () => setForm(f => ({ ...f, credits: [...f.credits, { nature: "", mensualite: "", fin_pret: "", capital_restant: "" }] }));
  const removeCredit = (i) => setForm(f => ({ ...f, credits: f.credits.filter((_, idx) => idx !== i) }));

  const setPartenaire = (i, field, value) => {
    const partenaires = [...form.partenaires];
    partenaires[i] = { ...partenaires[i], [field]: value };
    setForm(f => ({ ...f, partenaires }));
  };
  const addPartenaire = () => setForm(f => ({ ...f, partenaires: [...f.partenaires, { nom: "", email: "", role: "" }] }));
  const removePartenaire = (i) => setForm(f => ({ ...f, partenaires: f.partenaires.filter((_, idx) => idx !== i) }));

  const totalCout = () => [form.prix_acquisition, form.prix_construction, form.montant_travaux, form.frais_notaire].reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const totalFinancement = () => [form.pret_demande, form.apport_personnel, form.pret_employeur].reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const totalRevM = () => (parseFloat(form.salaire_m) || 0) + (parseFloat(form.autres_revenus_m) || 0);
  const totalRevF = () => (parseFloat(form.salaire_f) || 0) + (parseFloat(form.autres_revenus_f) || 0);
  const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n || 0);

  const buildSummary = () => `FICHE DÉCOUVERTE IMMOBILIÈRE — Sextant France
Agent : Franck Fidi | 97200 Fort-de-France | 06 96 93 80 99

━━━ IDENTITÉ ━━━
Monsieur : ${form.m_prenom} ${form.m_nom} | Né le ${form.m_dob} à ${form.m_lieu_naissance}
Email : ${form.m_email} | Tél : ${form.m_tel}
Profession : ${form.m_profession} — ${form.m_employeur} (${form.m_anciennete})
${form.f_nom ? `\nMadame : ${form.f_prenom} ${form.f_nom} | Née le ${form.f_dob} à ${form.f_lieu_naissance}\nEmail : ${form.f_email} | Tél : ${form.f_tel}\nProfession : ${form.f_profession} — ${form.f_employeur} (${form.f_anciennete})` : ""}
Situation : ${form.situation} | Enfants : ${form.nb_enfants} (${form.ages_enfants}) | Domicile : ${form.domicile}

━━━ PROJET ━━━
Type : ${form.type_projet} | Lieu : ${form.lieu_acquisition} | Vendeur : ${form.vendeur}
Type de vente : ${form.type_vente} | Nature : ${form.nature_bien} | Bien : ${form.objet_bien}
Stade : ${form.stade}${form.compromis_signe ? ` | Compromis le ${form.compromis_signe}` : ""}

━━━ COÛT DU PROJET ━━━
Prix d'acquisition : ${fmt(form.prix_acquisition)}
Prix construction : ${fmt(form.prix_construction)}
Montant travaux : ${fmt(form.montant_travaux)}
Frais de notaire : ${fmt(form.frais_notaire)}
TOTAL : ${fmt(totalCout())}

━━━ FINANCEMENT ━━━
Prêt demandé : ${fmt(form.pret_demande)} sur ${form.duree_pret} ans
Apport personnel : ${fmt(form.apport_personnel)}
Prêt employeur : ${fmt(form.pret_employeur)}
Banque : ${form.banque}
TOTAL FINANCEMENT : ${fmt(totalFinancement())}

━━━ REVENUS ━━━
Monsieur — RFR : ${fmt(form.rfr_m)} | Salaire : ${fmt(form.salaire_m)}/mois | Autres : ${fmt(form.autres_revenus_m)} | TOTAL : ${fmt(totalRevM())}/mois
${form.f_nom ? `Madame  — RFR : ${fmt(form.rfr_f)} | Salaire : ${fmt(form.salaire_f)}/mois | Autres : ${fmt(form.autres_revenus_f)} | TOTAL : ${fmt(totalRevF())}/mois` : ""}

━━━ CHARGES ━━━
Loyer actuel : ${fmt(form.loyer_actuel)}/mois | Pension alimentaire : ${fmt(form.pension_alimentaire)}/mois
${form.credits.filter(c => c.nature).map(c => `${c.nature} : ${fmt(c.mensualite)}/mois (fin: ${c.fin_pret}, CRD: ${fmt(c.capital_restant)})`).join("\n")}

━━━ COMMENTAIRES ━━━
${form.commentaires}`.trim();

  const sendToNotion = async () => {
    if (!form.notion_db_id) {
      setStatus("error");
      setStatusMsg("⚠️ Veuillez renseigner l'ID de votre base Notion ci-dessous.");
      return;
    }
    setStatus("loading");
    setStatusMsg("⏳ Connexion à Notion en cours…");

    const prompt = `Tu dois créer une nouvelle page dans la base de données Notion avec l'ID: "${form.notion_db_id}".

Titre de la page : "${form.m_prenom} ${form.m_nom}${form.f_nom ? ' & ' + form.f_prenom + ' ' + form.f_nom : ''} — ${form.type_projet || 'Projet immobilier'}"

Ajoute les propriétés suivantes si elles existent dans la base (adapte aux colonnes disponibles) :
- Nom : "${form.m_prenom} ${form.m_nom}${form.f_nom ? ' & ' + form.f_prenom + ' ' + form.f_nom : ''}"
- Type : "${form.type_projet}"
- Lieu : "${form.lieu_acquisition}"
- Statut : "Nouveau"
- Téléphone : "${form.m_tel}"
- Email : "${form.m_email}"
- Budget : ${totalCout()}
- Date : aujourd'hui

Ajoute tout le contenu suivant dans le corps de la page en blocks de texte bien structurés :

${buildSummary()}

Réponds uniquement avec "SUCCESS" si la page a été créée, sinon explique l'erreur précisément.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
          mcp_servers: [{ type: "url", url: "https://mcp.notion.com/mcp", name: "notion" }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      if (text.includes("SUCCESS") || text.toLowerCase().includes("créé") || text.toLowerCase().includes("created")) {
        setStatus("success");
        setStatusMsg("✅ Fiche créée avec succès dans Notion !");
      } else {
        setStatus("error");
        setStatusMsg("⚠️ Réponse Notion : " + text.substring(0, 200));
      }
    } catch (e) {
      setStatus("error");
      setStatusMsg("❌ Erreur de connexion. Vérifiez l'ID Notion et votre connexion.");
    }
  };

  const printPDF = () => {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Serif+4:wght@300;400;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Source Serif 4',serif;color:#0D1B2A;font-size:10px;background:#fff}
.hdr{background:#0D1B2A;color:#C9A84C;padding:14px 20px;display:flex;justify-content:space-between;align-items:center}
.hdr h1{font-family:'Playfair Display',serif;font-size:18px;letter-spacing:3px}
.bar{height:3px;background:linear-gradient(90deg,#0D1B2A,#C9A84C,#F5D78E,#C9A84C,#0D1B2A)}
.sec{margin:10px 18px}.st{font-family:'Playfair Display',serif;font-size:11px;color:#C9A84C;border-bottom:1px solid #C9A84C;padding-bottom:3px;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px 14px}
.f{display:flex;flex-direction:column;margin-bottom:4px}.lbl{font-size:8px;color:#888;text-transform:uppercase;letter-spacing:.5px}
.val{font-size:10px;border-bottom:1px solid #ddd;padding-bottom:2px;min-height:14px}
.tot{background:#0D1B2A;color:#C9A84C;padding:5px 10px;font-family:'Playfair Display',serif;font-size:10px;display:flex;justify-content:space-between;margin-top:4px}
table{width:100%;border-collapse:collapse;font-size:9px}th{background:#f0f0f0;padding:3px 5px;text-align:left;font-size:8px;text-transform:uppercase}td{border-bottom:1px solid #eee;padding:3px 5px}
.comment{min-height:35px;border:1px solid #ddd;padding:5px;font-size:9px;margin-top:4px}
</style></head><body>
<div class="hdr">
  <div><div style="font-size:8px;letter-spacing:3px;margin-bottom:4px">SEXTANT FRANCE</div><h1>FICHE DÉCOUVERTE</h1><div style="font-size:8px;color:#fff;opacity:.6;margin-top:2px">PROJET IMMOBILIER</div></div>
  <div style="text-align:right;font-size:9px"><strong style="font-family:'Playfair Display',serif;color:#C9A84C;font-size:13px;display:block">Franck Fidi</strong><span style="color:#fff;opacity:.6">Agent Mandataire Martinique<br>06 96 93 80 99<br>franck.fidi@sextantfrance.fr<br>RSAC 387 683 048</span></div>
</div>
<div class="bar"></div>
<div class="sec"><div class="st">Identité</div>
<div class="g2">
<div><div style="font-weight:600;font-size:9px;margin-bottom:4px">MONSIEUR</div>
<div class="f"><span class="lbl">Nom & Prénom</span><span class="val">${form.m_prenom} ${form.m_nom}</span></div>
<div class="f"><span class="lbl">Email / Téléphone</span><span class="val">${form.m_email} — ${form.m_tel}</span></div>
<div class="f"><span class="lbl">Date & Lieu de naissance</span><span class="val">${form.m_dob} à ${form.m_lieu_naissance}</span></div>
<div class="f"><span class="lbl">Employeur / Profession / Ancienneté</span><span class="val">${form.m_employeur} — ${form.m_profession} (${form.m_anciennete})</span></div></div>
<div><div style="font-weight:600;font-size:9px;margin-bottom:4px">MADAME</div>
<div class="f"><span class="lbl">Nom & Prénom</span><span class="val">${form.f_prenom} ${form.f_nom}</span></div>
<div class="f"><span class="lbl">Email / Téléphone</span><span class="val">${form.f_email} — ${form.f_tel}</span></div>
<div class="f"><span class="lbl">Date & Lieu de naissance</span><span class="val">${form.f_dob} à ${form.f_lieu_naissance}</span></div>
<div class="f"><span class="lbl">Employeur / Profession / Ancienneté</span><span class="val">${form.f_employeur} — ${form.f_profession} (${form.f_anciennete})</span></div></div></div>
<div class="g3" style="margin-top:6px">
<div class="f"><span class="lbl">Situation familiale</span><span class="val">${form.situation}</span></div>
<div class="f"><span class="lbl">Enfants / Âges</span><span class="val">${form.nb_enfants} — ${form.ages_enfants}</span></div>
<div class="f"><span class="lbl">Domicile actuel</span><span class="val">${form.domicile}</span></div></div></div>
<div class="sec"><div class="st">Projet</div><div class="g3">
<div class="f"><span class="lbl">Type de projet</span><span class="val">${form.type_projet}</span></div>
<div class="f"><span class="lbl">Lieu d'acquisition</span><span class="val">${form.lieu_acquisition}</span></div>
<div class="f"><span class="lbl">Stade</span><span class="val">${form.stade}</span></div>
<div class="f"><span class="lbl">Vendeur</span><span class="val">${form.vendeur}</span></div>
<div class="f"><span class="lbl">Type de vente</span><span class="val">${form.type_vente}</span></div>
<div class="f"><span class="lbl">Compromis signé le</span><span class="val">${form.compromis_signe}</span></div>
<div class="f"><span class="lbl">Nature du bien</span><span class="val">${form.nature_bien}</span></div>
<div class="f"><span class="lbl">Type de bien</span><span class="val">${form.objet_bien}</span></div></div></div>
<div class="g2" style="margin:0 18px">
<div class="sec" style="margin:10px 0"><div class="st">Coût du Projet</div>
<div class="f"><span class="lbl">Prix d'acquisition</span><span class="val">${fmt(form.prix_acquisition)}</span></div>
<div class="f"><span class="lbl">Prix construction</span><span class="val">${fmt(form.prix_construction)}</span></div>
<div class="f"><span class="lbl">Travaux</span><span class="val">${fmt(form.montant_travaux)}</span></div>
<div class="f"><span class="lbl">Frais notaire</span><span class="val">${fmt(form.frais_notaire)}</span></div>
<div class="tot"><span>TOTAL</span><span>${fmt(totalCout())}</span></div></div>
<div class="sec" style="margin:10px 0"><div class="st">Financement</div>
<div class="f"><span class="lbl">Prêt demandé / Durée</span><span class="val">${fmt(form.pret_demande)} — ${form.duree_pret} ans</span></div>
<div class="f"><span class="lbl">Apport personnel</span><span class="val">${fmt(form.apport_personnel)}</span></div>
<div class="f"><span class="lbl">Prêt employeur</span><span class="val">${fmt(form.pret_employeur)}</span></div>
<div class="f"><span class="lbl">Établissement bancaire</span><span class="val">${form.banque}</span></div>
<div class="tot"><span>TOTAL FINANCEMENT</span><span>${fmt(totalFinancement())}</span></div></div></div>
<div class="sec"><div class="st">Revenus</div>
<table><tr><th></th><th>Revenu Fiscal de Réf.</th><th>Salaire Net / mois</th><th>Autres revenus</th><th>TOTAL / mois</th></tr>
<tr><td><strong>Monsieur</strong></td><td>${fmt(form.rfr_m)}</td><td>${fmt(form.salaire_m)}</td><td>${fmt(form.autres_revenus_m)}</td><td><strong>${fmt(totalRevM())}</strong></td></tr>
<tr><td><strong>Madame</strong></td><td>${fmt(form.rfr_f)}</td><td>${fmt(form.salaire_f)}</td><td>${fmt(form.autres_revenus_f)}</td><td><strong>${fmt(totalRevF())}</strong></td></tr></table></div>
<div class="sec"><div class="st">Charges</div>
<div class="g2" style="margin-bottom:6px">
<div class="f"><span class="lbl">Loyer actuel</span><span class="val">${fmt(form.loyer_actuel)}/mois</span></div>
<div class="f"><span class="lbl">Pension alimentaire versée</span><span class="val">${fmt(form.pension_alimentaire)}/mois</span></div></div>
<table><tr><th>Nature du crédit</th><th>Mensualité</th><th>Fin de prêt</th><th>Capital Restant Dû</th></tr>
${form.credits.map(c => `<tr><td>${c.nature}</td><td>${fmt(c.mensualite)}</td><td>${c.fin_pret}</td><td>${fmt(c.capital_restant)}</td></tr>`).join("")}</table></div>
<div class="sec"><div class="st">Commentaires</div><div class="comment">${form.commentaires}</div></div>
<div class="bar" style="margin-top:14px"></div>
<div style="text-align:center;font-size:8px;color:#aaa;padding:5px;font-style:italic">Document confidentiel — Sextant France • Franck Fidi • RSAC 387 683 048 Fort-de-France</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const openGmail = () => {
    const body = form.gmail_body ||
      `Bonjour,\n\nVeuillez trouver ci-dessous la fiche découverte de nos clients.\n\n${buildSummary()}\n\nCordialement,\nFranck Fidi\nAgent Mandataire Sextant France — Martinique\n06 96 93 80 99 | franck.fidi@sextantfrance.fr`;
    const to = [form.gmail_to, ...form.partenaires.map(p => p.email)].filter(Boolean).join(",");
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(form.gmail_subject)}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  };

  // ═══════════════════════════════════════════════
  // CSS
  // ═══════════════════════════════════════════════
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&display=swap');
    :root{--navy:#0D1B2A;--gold:#C9A84C;--gl:#F5D78E;--cream:#FAF7F2;--gray:#8B8B8B;--lt:#E8E4DC;--red:#C0392B}
    *{box-sizing:border-box}body{margin:0;font-family:'Source Serif 4',serif;background:var(--cream);color:var(--navy)}
    .app{min-height:100vh;display:flex;flex-direction:column}
    .topbar{background:var(--navy);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px}
    .tlogo{font-family:'Playfair Display',serif;font-size:20px;color:var(--gold);letter-spacing:3px}
    .tsub{font-size:10px;color:#fff;opacity:.45;letter-spacing:2px;text-transform:uppercase}
    .tagent{text-align:right;font-size:10px}
    .tagent strong{color:var(--gold);font-family:'Playfair Display',serif;font-size:13px;display:block}
    .tagent span{color:#fff;opacity:.55}
    .bar{height:3px;background:linear-gradient(90deg,var(--navy),var(--gold),var(--gl),var(--gold),var(--navy))}
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
    .btn-next{background:var(--gold);color:var(--navy)}
    .btn-next:hover{background:var(--navy);color:var(--gold)}
    .act-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px}
    .act{border:1px solid var(--lt);padding:18px;text-align:center;cursor:pointer;transition:all .2s;background:#fff}
    .act:hover{border-color:var(--gold);transform:translateY(-2px);box-shadow:0 4px 18px rgba(201,168,76,.15)}
    .act-ico{font-size:26px;margin-bottom:6px}
    .act-ttl{font-family:'Playfair Display',serif;font-size:13px;color:var(--navy);margin-bottom:3px}
    .act-desc{font-size:10px;color:var(--gray)}
    .status-box{padding:12px 18px;border-radius:2px;margin-bottom:14px;font-size:13px}
    .st-loading{background:#EBF5FF;border-left:4px solid #3498DB;color:#1A5276}
    .st-success{background:#EAFAF1;border-left:4px solid #27AE60;color:#1E8449}
    .st-error{background:#FDEDEC;border-left:4px solid #C0392B;color:#C0392B}
    .info-box{background:#FFF8E8;border:1px solid #C9A84C;padding:10px 14px;font-size:11px;margin-bottom:14px;border-radius:2px;color:#856404;line-height:1.5}
    .preview{background:var(--navy);color:var(--cream);padding:14px;font-size:10px;line-height:1.9;white-space:pre-wrap;border-left:4px solid var(--gold);max-height:180px;overflow-y:auto;font-family:monospace}
    @media(max-width:640px){
      .g2,.g3,.act-grid{grid-template-columns:1fr}
      .cr-row{grid-template-columns:1fr 1fr}
      .pt-row{grid-template-columns:1fr 1fr}
    }
  `;

  // ═══════════════════════════════════════════════
  // COMPOSANTS
  // ═══════════════════════════════════════════════
  const F = ({ label, id, type = "text", value, onChange, placeholder, options, full }) => (
    <div className={"f" + (full ? " full" : "")}>
      <label htmlFor={id}>{label}</label>
      {type === "select" ? (
        <select id={id} value={value} onChange={e => onChange(e.target.value)}>
          <option value="">— Sélectionner —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );

  const RG = ({ label, value, onChange, options }) => (
    <div className="f">
      <label>{label}</label>
      <div className="rg">
        {options.map(o => (
          <label key={o} className="ro">
            <input type="radio" checked={value === o} onChange={() => onChange(o)} />{o}
          </label>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════
  // PAGES
  // ═══════════════════════════════════════════════
  const steps = [
    /* 0 — Identité */
    <div key="identite">
      <div className="card">
        <div className="card-hdr"><div className="card-ico">M</div><div className="card-ttl">Monsieur</div></div>
        <div className="card-body">
          <div className="g3">
            <F label="Nom" id="mn" value={form.m_nom} onChange={v => set("m_nom", v)} placeholder="DUPONT" />
            <F label="Prénom" id="mp" value={form.m_prenom} onChange={v => set("m_prenom", v)} placeholder="Jean" />
            <F label="Téléphone" id="mt" type="tel" value={form.m_tel} onChange={v => set("m_tel", v)} placeholder="0696 00 00 00" />
            <F label="Email" id="me" type="email" value={form.m_email} onChange={v => set("m_email", v)} placeholder="jean@mail.fr" />
            <F label="Date de naissance" id="md" type="date" value={form.m_dob} onChange={v => set("m_dob", v)} />
            <F label="Lieu de naissance" id="ml" value={form.m_lieu_naissance} onChange={v => set("m_lieu_naissance", v)} placeholder="Ville" />
            <F label="Employeur" id="mep" value={form.m_employeur} onChange={v => set("m_employeur", v)} />
            <F label="Profession" id="mpr" value={form.m_profession} onChange={v => set("m_profession", v)} />
            <F label="Ancienneté" id="man" value={form.m_anciennete} onChange={v => set("m_anciennete", v)} placeholder="5 ans" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-ico">F</div><div className="card-ttl">Madame</div></div>
        <div className="card-body">
          <div className="g3">
            <F label="Nom de jeune fille" id="fn" value={form.f_nom} onChange={v => set("f_nom", v)} placeholder="MARTIN" />
            <F label="Prénom" id="fp" value={form.f_prenom} onChange={v => set("f_prenom", v)} placeholder="Marie" />
            <F label="Téléphone" id="ft" type="tel" value={form.f_tel} onChange={v => set("f_tel", v)} placeholder="0696 00 00 00" />
            <F label="Email" id="fe" type="email" value={form.f_email} onChange={v => set("f_email", v)} placeholder="marie@mail.fr" />
            <F label="Date de naissance" id="fd" type="date" value={form.f_dob} onChange={v => set("f_dob", v)} />
            <F label="Lieu de naissance" id="fl" value={form.f_lieu_naissance} onChange={v => set("f_lieu_naissance", v)} placeholder="Ville" />
            <F label="Employeur" id="fep" value={form.f_employeur} onChange={v => set("f_employeur", v)} />
            <F label="Profession" id="fpr" value={form.f_profession} onChange={v => set("f_profession", v)} />
            <F label="Ancienneté" id="fan" value={form.f_anciennete} onChange={v => set("f_anciennete", v)} placeholder="3 ans" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>👨‍👩‍👧</div><div className="card-ttl">Situation Familiale</div></div>
        <div className="card-body">
          <div className="g2">
            <RG label="Situation" value={form.situation} onChange={v => set("situation", v)} options={["Célibataire", "Marié(e)s", "Concubins", "Pacsé(e)s", "Divorcé(e)"]} />
            <F label="Domicile actuel" id="dom" value={form.domicile} onChange={v => set("domicile", v)} placeholder="Adresse complète" />
            <F label="Nombre d'enfants à charge" id="nb" type="number" value={form.nb_enfants} onChange={v => set("nb_enfants", v)} />
            <F label="Âges des enfants" id="ages" value={form.ages_enfants} onChange={v => set("ages_enfants", v)} placeholder="3, 7, 12 ans" />
          </div>
          {form.situation === "Divorcé(e)" && (
            <div className="g2" style={{ marginTop: 12 }}>
              <div className="f"><label><input type="checkbox" checked={form.divorce_instance} onChange={e => set("divorce_instance", e.target.checked)} style={{ width: 15, marginRight: 6 }} /> En instance de divorce</label></div>
              <F label="Jugement de divorce du" id="divd" type="date" value={form.divorce_date} onChange={v => set("divorce_date", v)} />
            </div>
          )}
        </div>
      </div>
    </div>,

    /* 1 — Projet */
    <div key="projet">
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>🏠</div><div className="card-ttl">Projet Immobilier</div></div>
        <div className="card-body">
          <div className="sub-ttl">Type & Stade du projet</div>
          <div className="g2" style={{ marginBottom: 16 }}>
            <RG label="Destination du bien" value={form.type_projet} onChange={v => set("type_projet", v)} options={["Résidence principale", "Investissement locatif", "Résidence secondaire", "Autre"]} />
            <RG label="Stade du projet" value={form.stade} onChange={v => set("stade", v)} options={["Projet", "Offre d'achat", "Compromis signé"]} />
          </div>
          <div className="dvd" />
          <div className="sub-ttl">Localisation & Vendeur</div>
          <div className="g3" style={{ marginBottom: 12 }}>
            <F label="Lieu d'acquisition" id="lieu" value={form.lieu_acquisition} onChange={v => set("lieu_acquisition", v)} placeholder="Ville, quartier" />
            <F label="Vendeur" id="vend" value={form.vendeur} onChange={v => set("vendeur", v)} />
            <F label="Type de vente" id="tvt" value={form.type_vente} onChange={v => set("type_vente", v)} type="select" options={["Gré à gré", "Notariale", "Judiciaire", "Viager", "Succession"]} />
          </div>
          <div style={{ maxWidth: 260 }}>
            <F label="Date du compromis signé" id="comp" type="date" value={form.compromis_signe} onChange={v => set("compromis_signe", v)} />
          </div>
          <div className="dvd" />
          <div className="sub-ttl">Nature du bien</div>
          <div className="g2">
            <RG label="Nature" value={form.nature_bien} onChange={v => set("nature_bien", v)} options={["Ancien", "Ancien + travaux", "Neuf (VEFA)", "Terrain + construction"]} />
            <RG label="Type de bien" value={form.objet_bien} onChange={v => set("objet_bien", v)} options={["Appartement", "Maison", "Villa", "Terrain", "Local commercial"]} />
          </div>
        </div>
      </div>
    </div>,

    /* 2 — Financement */
    <div key="financement">
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>€</div><div className="card-ttl">Coût du Projet</div></div>
        <div className="card-body">
          <div className="g2">
            <F label="Prix d'acquisition ou terrain (€)" id="pa" type="number" value={form.prix_acquisition} onChange={v => set("prix_acquisition", v)} placeholder="0" />
            <F label="Prix projet construction (€)" id="pc" type="number" value={form.prix_construction} onChange={v => set("prix_construction", v)} placeholder="0" />
            <F label="Montant des travaux (€)" id="tr" type="number" value={form.montant_travaux} onChange={v => set("montant_travaux", v)} placeholder="0" />
            <F label="Frais de notaire (€)" id="fn2" type="number" value={form.frais_notaire} onChange={v => set("frais_notaire", v)} placeholder="0" />
          </div>
          <div className="tot"><span>TOTAL PROJET</span><span>{fmt(totalCout())}</span></div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>🏦</div><div className="card-ttl">Plan de Financement</div></div>
        <div className="card-body">
          <div className="g2">
            <F label="Prêt demandé (€)" id="pd" type="number" value={form.pret_demande} onChange={v => set("pret_demande", v)} placeholder="0" />
            <F label="Durée souhaitée (années)" id="dur" type="number" value={form.duree_pret} onChange={v => set("duree_pret", v)} placeholder="20" />
            <F label="Apport personnel (€)" id="ap" type="number" value={form.apport_personnel} onChange={v => set("apport_personnel", v)} placeholder="0" />
            <F label="Prêt employeur (€)" id="pe2" type="number" value={form.pret_employeur} onChange={v => set("pret_employeur", v)} placeholder="0" />
            <F label="Établissement bancaire" id="bq" value={form.banque} onChange={v => set("banque", v)} placeholder="Nom de la banque" full />
          </div>
          <div className="tot"><span>TOTAL FINANCEMENT</span><span>{fmt(totalFinancement())}</span></div>
          {Math.abs(totalCout() - totalFinancement()) > 1 && totalCout() > 0 && (
            <div style={{ marginTop: 8, padding: "8px 12px", background: "#FFF8E8", border: "1px solid #C9A84C", fontSize: 11, color: "#856404" }}>
              ⚠️ Écart de {fmt(Math.abs(totalCout() - totalFinancement()))} entre le coût total et le plan de financement
            </div>
          )}
        </div>
      </div>
    </div>,

    /* 3 — Revenus & Charges */
    <div key="revenus">
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>📊</div><div className="card-ttl">Revenus</div></div>
        <div className="card-body">
          <div className="sub-ttl">Monsieur</div>
          <div className="g3">
            <F label="Revenu Fiscal de Référence (€)" id="rfm" type="number" value={form.rfr_m} onChange={v => set("rfr_m", v)} placeholder="0" />
            <F label="Salaire net mensuel (€)" id="sm" type="number" value={form.salaire_m} onChange={v => set("salaire_m", v)} placeholder="0" />
            <F label="Autres revenus (loyers, pensions…)" id="arm" type="number" value={form.autres_revenus_m} onChange={v => set("autres_revenus_m", v)} placeholder="0" />
          </div>
          <div className="tot"><span>TOTAL Monsieur / mois</span><span>{fmt(totalRevM())}</span></div>
          <div className="dvd" />
          <div className="sub-ttl">Madame</div>
          <div className="g3">
            <F label="Revenu Fiscal de Référence (€)" id="rff" type="number" value={form.rfr_f} onChange={v => set("rfr_f", v)} placeholder="0" />
            <F label="Salaire net mensuel (€)" id="sf" type="number" value={form.salaire_f} onChange={v => set("salaire_f", v)} placeholder="0" />
            <F label="Autres revenus (€)" id="arf" type="number" value={form.autres_revenus_f} onChange={v => set("autres_revenus_f", v)} placeholder="0" />
          </div>
          <div className="tot"><span>TOTAL Madame / mois</span><span>{fmt(totalRevF())}</span></div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>💳</div><div className="card-ttl">Charges Mensuelles</div></div>
        <div className="card-body">
          <div className="g2" style={{ marginBottom: 14 }}>
            <F label="Loyer actuel (€/mois)" id="loy" type="number" value={form.loyer_actuel} onChange={v => set("loyer_actuel", v)} placeholder="0" />
            <F label="Pension alimentaire versée (€/mois)" id="pen" type="number" value={form.pension_alimentaire} onChange={v => set("pension_alimentaire", v)} placeholder="0" />
          </div>
          <div className="sub-ttl">Crédits en cours</div>
          {form.credits.map((c, i) => (
            <div key={i} className="cr-row">
              <F label="Nature du crédit" id={`cn${i}`} value={c.nature} onChange={v => setCredit(i, "nature", v)} placeholder="Auto, conso, immobilier…" />
              <F label="Mensualité (€)" id={`cm${i}`} type="number" value={c.mensualite} onChange={v => setCredit(i, "mensualite", v)} placeholder="0" />
              <F label="Fin de prêt" id={`cf${i}`} type="date" value={c.fin_pret} onChange={v => setCredit(i, "fin_pret", v)} />
              <F label="Capital restant dû" id={`cc${i}`} type="number" value={c.capital_restant} onChange={v => setCredit(i, "capital_restant", v)} placeholder="0" />
              <button className="btn-del" onClick={() => removeCredit(i)}>×</button>
            </div>
          ))}
          <button className="btn-add" onClick={addCredit}>+ Ajouter un crédit</button>
          <div className="dvd" />
          <div className="f full">
            <label>Commentaires & Observations</label>
            <textarea value={form.commentaires} onChange={e => set("commentaires", e.target.value)} placeholder="Informations complémentaires, situation particulière, remarques de l'agent…" />
          </div>
        </div>
      </div>
    </div>,

    /* 4 — Envoi */
    <div key="envoi">
      <div className="card">
        <div className="card-hdr"><div className="card-ico">⚙️</div><div className="card-ttl">Configuration Notion</div></div>
        <div className="card-body">
          <div className="info-box">
            💡 <strong>Comment trouver l'ID de votre base Notion :</strong><br />
            Ouvrez votre base dans Notion → regardez l'URL : <code>notion.so/votre-workspace/<strong>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</strong>?v=…</code><br />
            Copiez les 32 caractères entre le dernier <code>/</code> et le <code>?</code>
          </div>
          <div className="g2">
            <F label="ID de la base Notion" id="nid" value={form.notion_db_id} onChange={v => set("notion_db_id", v)} placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
            <F label="Nom de la base (référence)" id="nnm" value={form.notion_db_name} onChange={v => set("notion_db_name", v)} placeholder="Fiches Découverte" />
          </div>
        </div>
      </div>

      <div className="act-grid">
        <div className="act" onClick={sendToNotion}>
          <div className="act-ico">📋</div>
          <div className="act-ttl">Notion</div>
          <div className="act-desc">Créer la fiche dans votre base</div>
        </div>
        <div className="act" onClick={printPDF}>
          <div className="act-ico">📄</div>
          <div className="act-ttl">PDF</div>
          <div className="act-desc">Générer & imprimer le document</div>
        </div>
        <div className="act" onClick={openGmail}>
          <div className="act-ico">✉️</div>
          <div className="act-ttl">Gmail</div>
          <div className="act-desc">Envoyer aux partenaires</div>
        </div>
      </div>

      {status && <div className={`status-box st-${status}`}>{statusMsg}</div>}

      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>✉️</div><div className="card-ttl">Destinataires & Message</div></div>
        <div className="card-body">
          <div className="g2">
            <F label="Destinataire principal (email)" id="gto" type="email" value={form.gmail_to} onChange={v => set("gmail_to", v)} placeholder="notaire@cabinet.fr" />
            <F label="Objet du message" id="gsub" value={form.gmail_subject} onChange={v => set("gmail_subject", v)} />
          </div>
          <div className="dvd" />
          <div className="sub-ttl">Partenaires — mis en copie</div>
          {form.partenaires.map((p, i) => (
            <div key={i} className="pt-row">
              <F label="Nom du partenaire" id={`pn${i}`} value={p.nom} onChange={v => setPartenaire(i, "nom", v)} placeholder="Maître Dupont" />
              <F label="Email" id={`pe${i}`} type="email" value={p.email} onChange={v => setPartenaire(i, "email", v)} placeholder="contact@cabinet.fr" />
              <F label="Rôle" id={`pr${i}`} value={p.role} onChange={v => setPartenaire(i, "role", v)} type="select" options={["Notaire", "Gestionnaire de patrimoine", "Banquier", "Avocat", "Expert-comptable", "Courtier", "Autre"]} />
              <button className="btn-del" onClick={() => removePartenaire(i)}>×</button>
            </div>
          ))}
          <button className="btn-add" onClick={addPartenaire}>+ Ajouter un partenaire</button>
          <div className="dvd" />
          <div className="f">
            <label>Corps du message personnalisé (optionnel)</label>
            <textarea value={form.gmail_body} onChange={e => set("gmail_body", e.target.value)} placeholder="Laissez vide pour utiliser le message automatique généré à partir de la fiche…" />
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="sub-ttl">Aperçu — Contenu de la fiche</div>
            <div className="preview">{buildSummary()}</div>
          </div>
        </div>
      </div>
    </div>
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
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
        <div className="tabs">
          {SECTIONS.map((s, i) => (
            <div key={s} className={`tab ${i === step ? "active" : i < step ? "done" : ""}`} onClick={() => i <= step && setStep(i)}>
              {i < step ? "✓ " : ""}{s}
            </div>
          ))}
        </div>
        <div className="main">
          <div className="pagetitle">
            Fiche Découverte — <span>{form.m_prenom || "Nouveau client"}{form.m_nom ? " " + form.m_nom : ""}</span>
            {form.f_nom && <span style={{ fontSize: 15, color: "var(--gray)" }}> & {form.f_prenom} {form.f_nom}</span>}
          </div>
          {steps[step]}
          <div className="navbtns">
            {step > 0 && (
              <button className="btn-nav btn-prev" onClick={() => setStep(s => s - 1)}>
                ← Précédent
              </button>
            )}
            {step < SECTIONS.length - 1 && (
              <button className="btn-nav btn-next" style={{ marginLeft: "auto" }} onClick={() => setStep(s => s + 1)}>
                Suivant →
              </button>
            )}
            {step === SECTIONS.length - 1 && (
              <button className="btn-nav btn-next" style={{ marginLeft: "auto" }} onClick={sendToNotion}>
                💾 Sauvegarder dans Notion
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
