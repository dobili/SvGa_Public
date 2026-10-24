/**
 * Ampel der Prüfungen im Dashboard (R57, Stufe 2, Punkt 9): neuester Bericht mit Verlauf je
 * Punkt und die letzten Läufe.
 *
 * Rolle im Gesamtbild: Teil von src/admin/main.tsx. Rot und Gelb stehen oben, damit der Autor
 * auf dem Handy zuerst sieht, was zu tun ist; grüne Punkte sind eingeklappt.
 * Abhängigkeiten: src/admin/schnittstelle.ts, src/admin/texte.ts.
 */
import type { Lauf, PunktMitVerlauf, Uebersicht } from "./schnittstelle";
import { mit, TEXTE, zeitText } from "./texte";

const REIHENFOLGE: Record<PunktMitVerlauf["ampel"], number> = {
  rot: 0,
  gelb: 1,
  info: 2,
  gruen: 3,
};

/** Links zu Läufen nur auf GitHub (kein „javascript:“ o. Ä. aus einem Bericht). */
const istLaufLink = (adresse: string | null): adresse is string =>
  adresse !== null && adresse.startsWith("https://github.com/");

function Punkt({ punkt }: { punkt: PunktMitVerlauf }) {
  return (
    <li className={`admin-punkt admin-ampel-${punkt.ampel}`} data-testid={`punkt-${punkt.id}`}>
      <span className="admin-lampe" aria-label={punkt.ampel} />
      <div>
        <div className="admin-punkt-titel">
          {punkt.gruppe}: {punkt.titel}
        </div>
        {punkt.text && <div className="admin-punkt-text">{punkt.text}</div>}
        <div className="admin-leise">
          {mit(TEXTE.seit, { zeit: zeitText(punkt.seit) })}
          {punkt.ampel !== "gruen" &&
            ` · ${punkt.zuletztGruen ? mit(TEXTE.zuletztGruen, { zeit: zeitText(punkt.zuletztGruen) }) : TEXTE.nieGruen}`}
        </div>
      </div>
    </li>
  );
}

function Laeufe({ laeufe }: { laeufe: Lauf[] }) {
  return (
    <details className="admin-karte">
      <summary>{TEXTE.letzteLaeufe}</summary>
      <ul className="admin-liste">
        {laeufe.map((l) => (
          <li key={l.zeit}>
            {zeitText(l.zeit)} – {mit(TEXTE.rotGelb, { rot: l.rot, gelb: l.gelb })}
            {istLaufLink(l.lauf) && (
              <>
                {" · "}
                <a href={l.lauf} target="_blank" rel="noreferrer">
                  {TEXTE.zumLauf}
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Die Karte „Prüfungen“. */
export function Pruefungen({ uebersicht }: { uebersicht: Uebersicht }) {
  const bericht = uebersicht.neuesterBericht;
  if (!bericht) {
    return (
      <section className="admin-karte">
        <h2>{TEXTE.pruefungen}</h2>
        <p>{TEXTE.keinBericht}</p>
      </section>
    );
  }
  const sortiert = [...bericht.punkte].sort((a, b) => REIHENFOLGE[a.ampel] - REIHENFOLGE[b.ampel]);
  const gruen = sortiert.filter((p) => p.ampel === "gruen");
  const auffaellig = sortiert.filter((p) => p.ampel !== "gruen");
  return (
    <section className="admin-karte" data-testid="pruefungen">
      <h2>{TEXTE.pruefungen}</h2>
      <p className="admin-leise">
        {mit(TEXTE.berichtVom, { zeit: zeitText(bericht.zeit) })}
        {istLaufLink(bericht.lauf) && (
          <>
            {" · "}
            <a href={bericht.lauf} target="_blank" rel="noreferrer">
              {TEXTE.zumLauf}
            </a>
          </>
        )}
      </p>
      <ul className="admin-punkte">
        {auffaellig.map((p) => (
          <Punkt key={p.id} punkt={p} />
        ))}
      </ul>
      {gruen.length > 0 && (
        <details>
          <summary>{`${gruen.length} grün`}</summary>
          <ul className="admin-punkte">
            {gruen.map((p) => (
              <Punkt key={p.id} punkt={p} />
            ))}
          </ul>
        </details>
      )}
      {uebersicht.laeufe.length > 0 && <Laeufe laeufe={uebersicht.laeufe} />}
    </section>
  );
}
