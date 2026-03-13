// src/ClientForm.jsx
import { useState } from "react";

const STEPS = ["Identité", "Projet", "Financement", "Revenus & Charges"];

const initialForm = {
  m_nom: "", m_prenom: "", m_email: "", m_tel: "", m_dob: "", m_lieu_naissance: "",
  m_employeur: "", m_profession: "", m_anciennete: "",
  f_nom: "", f_prenom: "", f_email: "", f_tel: "", f_dob: "", f_lieu_naissance: "",
  f_employeur: "", f_profession: "", f_anciennete: "",
  situation: "", nb_enfants: "", ages_enfants: "", domicile: "",
  divorce_instance: false, divorce_date: "",
  type_projet: "", lieu_acquisition: "", vendeur: "", type_vente: "",
  compromis_signe: "", stade: "Projet", nature_bien: "", objet_bien: "",
  prix_acquisition: "", prix_construction: "", montant_travaux: "", frais_notaire: "",
  pret_demande: "", duree_pret: "", apport_personnel: "", pret_employeur: "", banque: "",
  rfr_m: "", salaire_m: "", autres_revenus_m: "",
  rfr_f: "", salaire_f: "", autres_revenus_f: "",
  loyer_actuel: "", pension_alimentaire: "",
  credits: [{ nature: "", mensualite: "", fin_pret: "", capital_restant: "" }],
  commentaires: "",
};

export default function ClientForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null); // null | loading | success | error
  const [msg, setMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const setCredit = (i, f, v) => {
    const credits = [...form.credits];
    credits[i] = { ...credits[i], [f]: v };
    setForm(p => ({ ...p, credits }));
  };
  const addCredit = () => setForm(p => ({ ...p, credits: [...p.credits, { nature: "", mensualite: "", fin_pret: "", capital_restant: "" }] }));
  const removeCredit = (i) => setForm(p => ({ ...p, credits: p.credits.filter((_, idx) => idx !== i) }));

  const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n || 0);
  const totalCout = () => [form.prix_acquisition, form.prix_construction, form.montant_travaux, form.frais_notaire].reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const totalFin = () => [form.pret_demande, form.apport_personnel, form.pret_employeur].reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const totalRevM = () => (parseFloat(form.salaire_m) || 0) + (parseFloat(form.autres_revenus_m) || 0);
  const totalRevF = () => (parseFloat(form.salaire_f) || 0) + (parseFloat(form.autres_revenus_f) || 0);

  const handleSubmit = async () => {
    if (!form.m_nom || !form.m_prenom || !form.m_email) {
      setStatus("error");
      setMsg("Veuillez remplir au minimum : Nom, Prénom et Email de Monsieur.");
      return;
    }
    setStatus("loading");
    setMsg("Envoi de votre fiche en cours…");
    try {
      const res = await fetch("/api/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", data: form }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMsg("Votre fiche a bien été transmise. Nous vous contacterons très prochainement.");
        setSubmitted(true);
      } else {
        setStatus("error");
        setMsg("Erreur : " + (data.error || "Veuillez réessayer."));
      }
    } catch {
      setStatus("error");
      setMsg("Erreur de connexion. Vérifiez votre connexion internet et réessayez.");
    }
  };

  // ── COMPOSANTS ──
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

  // Page de succès
  if (submitted) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Fiche transmise avec succès !</h2>
          <p>Merci <strong>{form.m_prenom} {form.m_nom}</strong>,</p>
          <p>Votre fiche découverte a bien été reçue. Franck Fidi vous contactera dans les meilleurs délais.</p>
          <div className="success-contact">
            <strong>Franck Fidi</strong>
            <span>Agent Mandataire Sextant France — Martinique</span>
            <span>📞 06 96 93 80 99</span>
            <span>✉️ franck.fidi@sextantfrance.fr</span>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    // 0 — Identité
    <div key="id">
      <div className="card">
        <div className="card-hdr"><div className="card-ico">M</div><div className="card-ttl">Monsieur</div></div>
        <div className="card-body">
          <div className="g3">
            <F label="Nom *" id="mn" value={form.m_nom} onChange={v => set("m_nom", v)} placeholder="DUPONT" />
            <F label="Prénom *" id="mp" value={form.m_prenom} onChange={v => set("m_prenom", v)} placeholder="Jean" />
            <F label="Téléphone" id="mt" type="tel" value={form.m_tel} onChange={v => set("m_tel", v)} placeholder="0696 00 00 00" />
            <F label="Email *" id="me" type="email" value={form.m_email} onChange={v => set("m_email", v)} placeholder="jean@mail.fr" />
            <F label="Date de naissance" id="md" type="date" value={form.m_dob} onChange={v => set("m_dob", v)} />
            <F label="Lieu de naissance" id="ml" value={form.m_lieu_naissance} onChange={v => set("m_lieu_naissance", v)} placeholder="Ville" />
            <F label="Employeur" id="mep" value={form.m_employeur} onChange={v => set("m_employeur", v)} />
            <F label="Profession" id="mpr" value={form.m_profession} onChange={v => set("m_profession", v)} />
            <F label="Ancienneté" id="man" value={form.m_anciennete} onChange={v => set("m_anciennete", v)} placeholder="5 ans" />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr"><div className="card-ico">F</div><div className="card-ttl">Madame <span style={{ fontSize: 10, opacity: 0.6 }}>(si applicable)</span></div></div>
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
            <F label="Domicile actuel" id="dom" value={form.domicile} onChange={v => set("domicile", v)} placeholder="Adresse" />
            <F label="Nombre d'enfants à charge" id="nb" type="number" value={form.nb_enfants} onChange={v => set("nb_enfants", v)} />
            <F label="Âges des enfants" id="ages" value={form.ages_enfants} onChange={v => set("ages_enfants", v)} placeholder="3, 7, 12 ans" />
          </div>
          {form.situation === "Divorcé(e)" && (
            <div className="g2" style={{ marginTop: 12 }}>
              <div className="f"><label><input type="checkbox" checked={form.divorce_instance} onChange={e => set("divorce_instance", e.target.checked)} style={{ width: 15, marginRight: 6 }} /> En instance de divorce</label></div>
              <F label="Jugement du" id="divd" type="date" value={form.divorce_date} onChange={v => set("divorce_date", v)} />
            </div>
          )}
        </div>
      </div>
    </div>,

    // 1 — Projet
    <div key="proj">
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>🏠</div><div className="card-ttl">Projet Immobilier</div></div>
        <div className="card-body">
          <div className="sub-ttl">Type & Stade du projet</div>
          <div className="g2" style={{ marginBottom: 16 }}>
            <RG label="Destination" value={form.type_projet} onChange={v => set("type_projet", v)} options={["Résidence principale", "Investissement locatif", "Résidence secondaire", "Autre"]} />
            <RG label="Stade" value={form.stade} onChange={v => set("stade", v)} options={["Projet", "Offre d'achat", "Compromis signé"]} />
          </div>
          <div className="dvd" />
          <div className="sub-ttl">Localisation</div>
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

    // 2 — Financement
    <div key="fin">
      <div className="card">
        <div className="card-hdr"><div className="card-ico">€</div><div className="card-ttl">Coût du Projet</div></div>
        <div className="card-body">
          <div className="g2">
            <F label="Prix d'acquisition (€)" id="pa" type="number" value={form.prix_acquisition} onChange={v => set("prix_acquisition", v)} placeholder="0" />
            <F label="Prix construction (€)" id="pc" type="number" value={form.prix_construction} onChange={v => set("prix_construction", v)} placeholder="0" />
            <F label="Montant travaux (€)" id="tr" type="number" value={form.montant_travaux} onChange={v => set("montant_travaux", v)} placeholder="0" />
            <F label="Frais de notaire (€)" id="fn2" type="number" value={form.frais_notaire} onChange={v => set("frais_notaire", v)} placeholder="0" />
          </div>
          <div className="tot"><span>TOTAL PROJET</span><span>{fmt(totalCout())}</span></div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>🏦</div><div className="card-ttl">Financement</div></div>
        <div className="card-body">
          <div className="g2">
            <F label="Prêt demandé (€)" id="pd" type="number" value={form.pret_demande} onChange={v => set("pret_demande", v)} placeholder="0" />
            <F label="Durée (années)" id="dur" type="number" value={form.duree_pret} onChange={v => set("duree_pret", v)} placeholder="20" />
            <F label="Apport personnel (€)" id="ap" type="number" value={form.apport_personnel} onChange={v => set("apport_personnel", v)} placeholder="0" />
            <F label="Prêt employeur (€)" id="pe2" type="number" value={form.pret_employeur} onChange={v => set("pret_employeur", v)} placeholder="0" />
            <F label="Banque" id="bq" value={form.banque} onChange={v => set("banque", v)} placeholder="Nom de la banque" full />
          </div>
          <div className="tot"><span>TOTAL FINANCEMENT</span><span>{fmt(totalFin())}</span></div>
        </div>
      </div>
    </div>,

    // 3 — Revenus & Charges
    <div key="rev">
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>📊</div><div className="card-ttl">Revenus</div></div>
        <div className="card-body">
          <div className="sub-ttl">Monsieur</div>
          <div className="g3">
            <F label="Revenu Fiscal de Référence (€)" id="rfm" type="number" value={form.rfr_m} onChange={v => set("rfr_m", v)} placeholder="0" />
            <F label="Salaire net mensuel (€)" id="sm" type="number" value={form.salaire_m} onChange={v => set("salaire_m", v)} placeholder="0" />
            <F label="Autres revenus (€)" id="arm" type="number" value={form.autres_revenus_m} onChange={v => set("autres_revenus_m", v)} placeholder="0" />
          </div>
          <div className="tot"><span>TOTAL / mois</span><span>{fmt(totalRevM())}</span></div>
          <div className="dvd" />
          <div className="sub-ttl">Madame</div>
          <div className="g3">
            <F label="Revenu Fiscal de Référence (€)" id="rff" type="number" value={form.rfr_f} onChange={v => set("rfr_f", v)} placeholder="0" />
            <F label="Salaire net mensuel (€)" id="sf" type="number" value={form.salaire_f} onChange={v => set("salaire_f", v)} placeholder="0" />
            <F label="Autres revenus (€)" id="arf" type="number" value={form.autres_revenus_f} onChange={v => set("autres_revenus_f", v)} placeholder="0" />
          </div>
          <div className="tot"><span>TOTAL / mois</span><span>{fmt(totalRevF())}</span></div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr"><div className="card-ico" style={{ fontSize: 13 }}>💳</div><div className="card-ttl">Charges</div></div>
        <div className="card-body">
          <div className="g2" style={{ marginBottom: 14 }}>
            <F label="Loyer actuel (€/mois)" id="loy" type="number" value={form.loyer_actuel} onChange={v => set("loyer_actuel", v)} placeholder="0" />
            <F label="Pension alimentaire (€/mois)" id="pen" type="number" value={form.pension_alimentaire} onChange={v => set("pension_alimentaire", v)} placeholder="0" />
          </div>
          <div className="sub-ttl">Crédits en cours</div>
          {form.credits.map((c, i) => (
            <div key={i} className="cr-row">
              <F label="Nature" id={`cn${i}`} value={c.nature} onChange={v => setCredit(i, "nature", v)} placeholder="Auto, conso…" />
              <F label="Mensualité (€)" id={`cm${i}`} type="number" value={c.mensualite} onChange={v => setCredit(i, "mensualite", v)} placeholder="0" />
              <F label="Fin de prêt" id={`cf${i}`} type="date" value={c.fin_pret} onChange={v => setCredit(i, "fin_pret", v)} />
              <F label="Capital restant" id={`cc${i}`} type="number" value={c.capital_restant} onChange={v => setCredit(i, "capital_restant", v)} placeholder="0" />
              <button className="btn-del" onClick={() => removeCredit(i)}>×</button>
            </div>
          ))}
          <button className="btn-add" onClick={addCredit}>+ Ajouter un crédit</button>
          <div className="dvd" />
          <div className="f">
            <label>Commentaires libres</label>
            <textarea value={form.commentaires} onChange={e => set("commentaires", e.target.value)} placeholder="Informations complémentaires, situation particulière…" />
          </div>
        </div>
      </div>

      {/* Bouton d'envoi final */}
      {status && (
        <div className={`status-box st-${status}`}>{msg}</div>
      )}
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <button className="btn-submit" onClick={handleSubmit} disabled={status === "loading"}>
          {status === "loading" ? "⏳ Envoi en cours…" : "✅ Valider et envoyer ma fiche"}
        </button>
        <p style={{ fontSize: 11, color: "var(--gray)", marginTop: 8 }}>
          Vos informations sont transmises directement à Franck Fidi, agent Sextant France.
        </p>
      </div>
    </div>
  ];

  return (
    <>
      <div className="tabs">
        {STEPS.map((s, i) => (
          <div key={s} className={`tab ${i === step ? "active" : i < step ? "done" : ""}`} onClick={() => i < step && setStep(i)}>
            {i < step ? "✓ " : ""}{s}
          </div>
        ))}
      </div>
      <div className="main">
        <div className="pagetitle">
          Fiche Découverte — <span>{form.m_prenom || "Votre dossier"}{form.m_nom ? " " + form.m_nom : ""}</span>
          {form.f_nom && <span style={{ fontSize: 15, color: "var(--gray)" }}> & {form.f_prenom} {form.f_nom}</span>}
        </div>
        {steps[step]}
        <div className="navbtns">
          {step > 0 && <button className="btn-nav btn-prev" onClick={() => setStep(s => s - 1)}>← Précédent</button>}
          {step < STEPS.length - 1 && <button className="btn-nav btn-next" style={{ marginLeft: "auto" }} onClick={() => setStep(s => s + 1)}>Suivant →</button>}
        </div>
      </div>
    </>
  );
}
