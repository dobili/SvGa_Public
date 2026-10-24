/**
 * Meldungen der Leser im Dashboard (R57, Stufe 2, Punkte 10 bis 13): Liste je Status, Angaben,
 * Status setzen, Doppelte zusammenfassen, Notiz.
 *
 * Rolle im Gesamtbild: Teil von src/admin/main.tsx. Standard ist die Ansicht „Offen“ (neu und in
 * Arbeit); die anderen Status sind über Reiter erreichbar.
 * Abhängigkeiten: src/admin/schnittstelle.ts, src/admin/texte.ts.
 */
import { useState } from "react";
import { aendereMeldung, type GespeicherteMeldung, type Meldestatus } from "./schnittstelle";
import { ARTEN, STATUSNAMEN, TEXTE, zeitText } from "./texte";

const ANGABEN = ["version", "geraet", "bildschirm", "sprache", "abbildung", "seite"] as const;
const ANSICHTEN: readonly (Meldestatus | null)[] = [
  null,
  "neu",
  "in_arbeit",
  "erledigt",
  "kein_fehler",
  "doppelt",
];

/** Eine Meldung mit Bearbeitung. */
function Meldung({
  meldung,
  nachAenderung,
}: {
  meldung: GespeicherteMeldung;
  nachAenderung: () => void;
}) {
  const [status, setzeStatus] = useState<Meldestatus>(meldung.status);
  const [notiz, setzeNotiz] = useState(meldung.notiz ?? "");
  const [doppeltVon, setzeDoppeltVon] = useState(meldung.doppelt_von?.toString() ?? "");
  const [rueckmeldung, setzeRueckmeldung] = useState("");
  const speichere = async () => {
    try {
      await aendereMeldung(meldung.id, {
        status,
        notiz,
        ...(status === "doppelt" ? { doppeltVon: Number(doppeltVon) } : {}),
      });
      setzeRueckmeldung(TEXTE.gespeichert);
      nachAenderung();
    } catch (grund) {
      setzeRueckmeldung(String(grund));
    }
  };
  return (
    <li
      className={`admin-karte admin-meldung admin-art-${meldung.art}`}
      data-testid={`meldung-${meldung.id}`}
    >
      <div className="admin-leise">
        Nr. {meldung.id} · {ARTEN[meldung.art]} · {zeitText(meldung.zeit)}
      </div>
      <p className="admin-meldetext">{meldung.text}</p>
      <dl className="admin-angaben">
        {ANGABEN.filter((f) => meldung[f]).map((f) => (
          <div key={f}>
            <dt>{TEXTE.felder[f]}</dt>
            <dd>{meldung[f]}</dd>
          </div>
        ))}
      </dl>
      {meldung.stellung && (
        <details>
          <summary>{TEXTE.felder.stellung}</summary>
          <pre className="admin-stellung">{meldung.stellung}</pre>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(meldung.stellung ?? "")}
          >
            {TEXTE.stellungKopieren}
          </button>
        </details>
      )}
      <div className="admin-bearbeiten">
        <select
          value={status}
          onChange={(e) => setzeStatus(e.target.value as Meldestatus)}
          aria-label="Status"
        >
          {Object.entries(STATUSNAMEN).map(([wert, name]) => (
            <option key={wert} value={wert}>
              {name}
            </option>
          ))}
        </select>
        {status === "doppelt" && (
          <label>
            {TEXTE.doppeltVon}{" "}
            <input
              inputMode="numeric"
              value={doppeltVon}
              onChange={(e) => setzeDoppeltVon(e.target.value)}
              size={5}
            />
          </label>
        )}
        <textarea
          placeholder={TEXTE.notiz}
          aria-label={TEXTE.notiz}
          value={notiz}
          onChange={(e) => setzeNotiz(e.target.value)}
          rows={2}
        />
        <button type="button" onClick={() => void speichere()}>
          {TEXTE.speichern}
        </button>
        {rueckmeldung && <span role="status">{rueckmeldung}</span>}
      </div>
    </li>
  );
}

/** Die Karte „Meldungen“ mit Reitern je Status. */
export function Meldungen({
  ansicht,
  waehleAnsicht,
  meldungen,
  nachAenderung,
}: {
  ansicht: Meldestatus | null;
  waehleAnsicht: (ansicht: Meldestatus | null) => void;
  meldungen: GespeicherteMeldung[] | null;
  nachAenderung: () => void;
}) {
  return (
    <section className="admin-karte" data-testid="meldungen">
      <h2>{TEXTE.meldungen}</h2>
      <div className="admin-reiter" role="tablist">
        {ANSICHTEN.map((a) => (
          <button
            key={a ?? "offen"}
            type="button"
            role="tab"
            aria-selected={a === ansicht}
            onClick={() => waehleAnsicht(a)}
          >
            {a ? STATUSNAMEN[a] : TEXTE.offen}
          </button>
        ))}
      </div>
      {meldungen === null && <p>{TEXTE.laden}</p>}
      {meldungen?.length === 0 && <p>{TEXTE.keineMeldungen}</p>}
      <ul className="admin-meldungen">
        {meldungen?.map((m) => (
          <Meldung key={`${m.id}-${m.status}`} meldung={m} nachAenderung={nachAenderung} />
        ))}
      </ul>
    </section>
  );
}
