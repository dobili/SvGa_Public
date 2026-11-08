/**
 * Der Abspann des Schach-Abenteuers (Story-Bibel Akt 4, Technikliste Punkt 7): alle Figuren mit
 * Porträt, die Mitwirkenden und Lizenzen, am Ende Ambroses leiser Gruß als Extra-Abspann.
 *
 * Rolle im Gesamtbild: React-Overlay über der Welt; ein Dialog ruft `zeigeAbspann()`, die
 * Oberwelt zeigt ihn nach dem Dialog. Der Extra-Abspann kommt nur, wenn der Leser im Halbfinale den
 * freien Mentor-Zug nicht gespielt hat (R29, Dokument 02, 2.7: „Held und Ambrose spielen gemeinsam“
 * war nicht nötig).
 * Abhängigkeiten: daten/laden.ts, dialog/Portraet.tsx, texte/texte.ts, app/blattstapel.ts.
 */
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Spieldaten } from "../daten/laden";
import { Portraet } from "../dialog/Portraet";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";

/** Die Bausteine, die das Spiel verwendet (vollständig in docs/spiel/LIZENZEN.md). */
const MITWIRKENDE = [
  "abspann.mitwirkende.buch",
  "abspann.mitwirkende.engine",
  "abspann.mitwirkende.phaser",
  "abspann.mitwirkende.ink",
  "abspann.mitwirkende.portraets",
] as const;

/** Alle Figuren der Welt, je Name einmal, in der Reihenfolge der Orte. */
function figurenDerWelt(daten: Spieldaten): { kennung: string; name: string }[] {
  const gesehen = new Set<string>();
  return daten.orte
    .flatMap((o) => o.figuren)
    .flatMap((f) => {
      const kurz = f.kennung.split(".").at(-1) ?? f.kennung;
      if (gesehen.has(kurz)) return [];
      gesehen.add(kurz);
      return [{ kennung: kurz, name: f.name }];
    });
}

export function Abspann({
  stand,
  daten,
  beiSchliessen,
}: {
  readonly stand: Abenteuerstand;
  readonly daten: Spieldaten;
  readonly beiSchliessen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const extra = stand.dialogvariablen.mentorzugFreiGespielt !== true;
  return (
    <section
      className="abenteuer-menue abenteuer-abspann"
      role="dialog"
      aria-label={tSpiel("abspann.titel")}
      data-testid="abenteuer-abspann"
    >
      <h2>{tSpiel("abspann.titel")}</h2>
      <p>{tSpiel("abspann.held", { name: stand.held.name })}</p>
      <ul className="abenteuer-abspann-figuren">
        {figurenDerWelt(daten).map((f) => (
          <li key={f.kennung}>
            <Portraet sprecher={f.kennung} stimmung={null} />
            <span>{tSpiel(f.name)}</span>
          </li>
        ))}
      </ul>
      <h3>{tSpiel("abspann.mitwirkendeTitel")}</h3>
      <ul>
        {MITWIRKENDE.map((k) => (
          <li key={k}>{tSpiel(k)}</li>
        ))}
      </ul>
      {extra && (
        <p className="abenteuer-abspann-extra" data-testid="abenteuer-abspann-extra">
          {tSpiel("abspann.extra")}
        </p>
      )}
      <button type="button" className="knopf-haupt" onClick={beiSchliessen}>
        {tSpiel("abspann.schliessen")}
      </button>
    </section>
  );
}
