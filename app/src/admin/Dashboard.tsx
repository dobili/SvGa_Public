/**
 * Das Dashboard /admin/ (R57): Kopf, Einrichtung, Aufgabe für Claude, Prüfungen, Meldungen;
 * seit 0.3.12 mit den Reitern „Übersicht“ und „Wiki“ (Paket D, Wiki.tsx).
 *
 * Rolle im Gesamtbild: Von src/admin/main.tsx gezeigt. Lädt die Übersicht und die Meldungen der
 * gewählten Ansicht und lädt nach jeder Änderung neu.
 * Abhängigkeiten: React, src/admin/*.
 */
import { useEffect, useState } from "react";
import { aufgabeFuerClaude } from "./aufgabe";
import { Meldungen } from "./Meldungen";
import { Pruefungen } from "./Pruefungen";
import {
  Abruffehler,
  ladeMeldungen,
  ladeUebersicht,
  type GespeicherteMeldung,
  type Meldestatus,
  type Uebersicht,
} from "./schnittstelle";
import { mit, TEXTE } from "./texte";
import { Wiki } from "./Wiki";

const KEIN_ZUGANG = [401, 403];

function Einrichtung({ eingerichtet }: { eingerichtet: Uebersicht["eingerichtet"] }) {
  return (
    <p className="admin-leise">
      {TEXTE.eingerichtet}:{" "}
      {(Object.keys(TEXTE.einrichtung) as (keyof Uebersicht["eingerichtet"])[]).map((art) => (
        <span key={art} className={`admin-chip ${eingerichtet[art] ? "an" : "aus"}`}>
          {eingerichtet[art] ? "✓" : "–"} {TEXTE.einrichtung[art]}
        </span>
      ))}
    </p>
  );
}

/** Knopf „Aufgabe für Claude“: lädt die offenen Meldungen und kopiert den Auftrag. */
function Aufgabe({ uebersicht }: { uebersicht: Uebersicht }) {
  const [text, setzeText] = useState<string | null>(null);
  const erstelle = async () => {
    const offene = await ladeMeldungen(null);
    const auftrag = aufgabeFuerClaude(uebersicht.neuesterBericht?.punkte ?? [], offene) ?? "–";
    setzeText(auftrag);
    await navigator.clipboard.writeText(auftrag).catch(() => undefined);
  };
  return (
    <section className="admin-karte">
      <button type="button" className="admin-hauptknopf" onClick={() => void erstelle()}>
        {TEXTE.aufgabe}
      </button>
      <p className="admin-leise">{TEXTE.aufgabeHinweis}</p>
      {text && (
        <textarea
          className="admin-auftrag"
          readOnly
          value={text}
          rows={10}
          aria-label={TEXTE.aufgabe}
        />
      )}
    </section>
  );
}

/** Das ganze Dashboard; lädt Übersicht und Meldungen der gewählten Ansicht. */
export function Dashboard() {
  const [uebersicht, setzeUebersicht] = useState<Uebersicht | null>(null);
  const [ansicht, setzeAnsicht] = useState<Meldestatus | null>(null);
  const [meldungen, setzeMeldungen] = useState<GespeicherteMeldung[] | null>(null);
  const [fehler, setzeFehler] = useState<number | null>(null);
  const [reiter, setzeReiter] = useState<"uebersicht" | "wiki">("uebersicht");
  // Jeder Tipp auf „Neu laden“ und jede Änderung zählt hoch und löst das Laden neu aus.
  const [ladung, setzeLadung] = useState(0);
  const lade = () => setzeLadung((n) => n + 1);
  useEffect(() => {
    let aktiv = true;
    Promise.all([ladeUebersicht(), ladeMeldungen(ansicht)])
      .then(([u, m]) => {
        if (!aktiv) return;
        setzeUebersicht(u);
        setzeMeldungen(m);
        setzeFehler(null);
      })
      .catch((grund: unknown) => {
        if (aktiv) setzeFehler(grund instanceof Abruffehler ? grund.status : 0);
      });
    return () => {
      aktiv = false;
    };
  }, [ansicht, ladung]);
  if (fehler !== null) {
    return (
      <p className="admin-karte">
        {KEIN_ZUGANG.includes(fehler) ? TEXTE.keinZugang : mit(TEXTE.fehler, { status: fehler })}
      </p>
    );
  }
  if (!uebersicht) return <p className="admin-karte">{TEXTE.laden}</p>;
  return (
    <>
      <header className="admin-kopf">
        <h1>{TEXTE.titel}</h1>
        <button type="button" onClick={lade}>
          {TEXTE.neuLaden}
        </button>
      </header>
      <p className="admin-leise">{mit(TEXTE.angemeldet, { wer: uebersicht.wer })}</p>
      <div className="admin-reiter" role="group">
        {(["uebersicht", "wiki"] as const).map((r) => (
          <button key={r} type="button" aria-pressed={reiter === r} onClick={() => setzeReiter(r)}>
            {TEXTE.reiter[r]}
          </button>
        ))}
      </div>
      {reiter === "wiki" ? (
        <Wiki />
      ) : (
        <Uebersichtsteil
          uebersicht={uebersicht}
          ansicht={ansicht}
          setzeAnsicht={setzeAnsicht}
          setzeMeldungen={setzeMeldungen}
          meldungen={meldungen}
          lade={lade}
        />
      )}
    </>
  );
}

/** Der Reiter „Übersicht“: Einrichtung, Aufgabe, Prüfungen, Meldungen (wie vor 0.3.12). */
function Uebersichtsteil({
  uebersicht,
  ansicht,
  setzeAnsicht,
  setzeMeldungen,
  meldungen,
  lade,
}: {
  uebersicht: Uebersicht;
  ansicht: Meldestatus | null;
  setzeAnsicht: (a: Meldestatus | null) => void;
  setzeMeldungen: (m: GespeicherteMeldung[] | null) => void;
  meldungen: GespeicherteMeldung[] | null;
  lade: () => void;
}) {
  return (
    <>
      <Einrichtung eingerichtet={uebersicht.eingerichtet} />
      <Aufgabe uebersicht={uebersicht} />
      <Pruefungen uebersicht={uebersicht} />
      <Meldungen
        ansicht={ansicht}
        waehleAnsicht={(a) => {
          setzeMeldungen(null);
          setzeAnsicht(a);
        }}
        meldungen={meldungen}
        nachAenderung={lade}
      />
    </>
  );
}
