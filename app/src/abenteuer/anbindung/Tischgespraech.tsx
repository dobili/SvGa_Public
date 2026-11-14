/**
 * Das Tischgespräch in der Partie (docs/spiel/29_Tischgespraech.md, Abschnitte 3 und 4): Der
 * Gegner sagt ab und zu etwas zu dem, was am Brett geschieht, je nach Temperament; Ambrose spricht
 * unten zum Rückstand und zur Zeitnot. Dazu sprechen die Karten, die schon vor der Partie gespielt
 * wurden (Schmeichelei), und das Ende der Partie.
 *
 * Rolle im Gesamtbild: Teil der Spielhülle (anbindung/PartieHuelle.tsx), zeichnet selbst nichts;
 * die Zeilen gehen in die gemeinsame Sprechblase (anbindung/Tischblase.tsx) und weichen dort jedem
 * geschriebenen Moment und jedem Spruch. Wer wann spricht, sagt regeln/tischgespraech.ts aus dem
 * Verlauf und der Kennung der Partie; was er sagt, anbindung/tischtexte.ts.
 * Grundsatz: Nur, was in dieser Sitzung geschieht, wird besprochen; eine alte Partie aus „Meine
 * Partien“ bleibt still. Ambrose fehlt, wo regeln/abwesenheit.ts es sagt, und im Finale.
 * Abhängigkeiten: regeln/tischgespraech.ts, regeln/schutzengel.ts, anbindung/tischtexte.ts,
 * anbindung/tischsprecher.ts, anbindung/spruchkarte.ts, anbindung/partieergebnis.ts.
 */
import { useEffect, useMemo, useRef } from "react";
import { stellungen, type Partie } from "../../spiel/partie";
import { restzeit } from "../../spiel/uhr";
import type { Gegnerdaten } from "../daten/laden";
import { schutzengelGesperrt } from "../regeln/schutzengel";
import {
  temperamentVon,
  tischplan,
  zufallSprichtBei,
  type Tischzeile,
} from "../regeln/tischgespraech";
import { useAbenteuerstand } from "./dienste";
import { gegnerName, sprecherAusPfad } from "./huellentexte";
import { ausgangAus } from "./partieergebnis";
import { spruchzeilen } from "./spruchkarte";
import { useTischblasen, type Blasensteuerung } from "./tischkontext";
import type { Vorrang } from "./tischblasen";
import { ambrosezeile, gegnerzeile, heldenzeile } from "./tischsprecher";
import { ambrosetext, tischtext, type Stimme } from "./tischtexte";
import { useGegnerliste } from "./useGegnerliste";

/** Unter so viel Restzeit (ms) ist der Held in Zeitnot (Abschnitt 3). */
const ZEITNOT_MS = 30_000;
/** Temperament, wenn die Partie keinen Gegner aus gegner.json hat. */
const OHNE_PROFIL: Stimme = { kennung: "", temperament: "herzlich" };
const SCHMEICHELEI = "schmeichelei";

/** Schon gesagte Zeilen je Partie in dieser Sitzung (Neuladen wiederholt nichts Gezeigtes). */
const gesagt = new Set<string>();

/** Wer am Tisch sitzt: Stimme, Porträt, Name, ob Ambrose da ist. */
interface Tischrunde {
  readonly partie: Partie;
  readonly stimme: Stimme;
  readonly gegner: Gegnerdaten | undefined;
  readonly sprecher: string | null;
  readonly name: string;
  readonly ambroseDa: boolean;
  readonly blasen: Blasensteuerung;
}

/** Sagt eine Zeile des Gegners oder Ambroses, höchstens einmal je Schlüssel und Sitzung. */
function sage(
  runde: Tischrunde,
  wer: "gegner" | "ambrose",
  ereignis: string,
  angaben: { schluessel: string; nutzung: number; vorrang: Vorrang },
): void {
  if (gesagt.has(angaben.schluessel) || (wer === "ambrose" && !runde.ambroseDa)) return;
  const id = runde.partie.id;
  const text =
    wer === "ambrose"
      ? ambrosetext(ereignis, angaben.nutzung, id)
      : tischtext(runde.stimme, ereignis, angaben.nutzung, id);
  if (!text) return;
  gesagt.add(angaben.schluessel);
  const zeile = {
    schluessel: angaben.schluessel,
    vorrang: angaben.vorrang,
    testid: "abenteuer-tischgespraech",
  };
  runde.blasen.zeige(
    wer === "ambrose"
      ? ambrosezeile(text, zeile)
      : gegnerzeile(text, runde.sprecher, runde.name, zeile),
  );
}

/** Wie oft dieselbe Stimme vorher im Plan zum selben Ereignis sprach. */
function nutzungIm(plan: readonly Tischzeile[], zeile: Tischzeile): number {
  return plan.filter(
    (z) =>
      z.halbzug < zeile.halbzug && z.sprecher === zeile.sprecher && z.ereignis === zeile.ereignis,
  ).length;
}

/** Spricht zu den Zeilen des Plans, die genau mit dem letzten Halbzug fällig werden. */
function sprichZumHalbzug(runde: Tischrunde, plan: readonly Tischzeile[], ab: number): void {
  const letzter = runde.partie.zuege.length;
  if (letzter <= ab || runde.partie.ende) return;
  for (const zeile of plan.filter((z) => z.halbzug === letzter)) {
    sage(runde, zeile.sprecher, zeile.ereignis, {
      schluessel: `${runde.partie.id}:${letzter}:${zeile.sprecher}`,
      nutzung: nutzungIm(plan, zeile),
      vorrang: "tisch",
    });
  }
}

/** Zeitnot: Ambrose immer, der Gegner mit der Wahrscheinlichkeit des Tischs. */
function sprichZurZeitnot(runde: Tischrunde, jetztMs: number): void {
  const p = runde.partie;
  if (!p.uhr || p.ende || restzeit(p.uhr, p.einstellung.eigeneFarbe, jetztMs) >= ZEITNOT_MS) return;
  const basis = `${p.id}:zeitnot`;
  sage(runde, "ambrose", "zeitnot", {
    schluessel: `${basis}:ambrose`,
    nutzung: 0,
    vorrang: "tisch",
  });
  if (zufallSprichtBei(p.id, "zeitnot")) {
    sage(runde, "gegner", "zeitnot", {
      schluessel: `${basis}:gegner`,
      nutzung: 0,
      vorrang: "tisch",
    });
  }
}

/** Das Ende der Partie spricht immer, aber nur, wenn es in dieser Sitzung kam. */
function sprichZumEnde(runde: Tischrunde, liefSchon: boolean): void {
  const ausgang = ausgangAus(runde.partie);
  if (!liefSchon || ausgang === "abgebrochen") return;
  sage(runde, "gegner", ausgang, {
    schluessel: `${runde.partie.id}:ende`,
    nutzung: 0,
    vorrang: "geschrieben",
  });
}

/** Schmeichelei vor der Partie: Der Held schmeichelt unten, der Gegner antwortet oben. */
function sprichZurSchmeichelei(runde: Tischrunde, gespielt: readonly { kennung: string }[]): void {
  const id = runde.partie.id;
  const schluessel = `${id}:schmeichelei`;
  if (!gespielt.some((k) => k.kennung === SCHMEICHELEI) || gesagt.has(schluessel)) return;
  gesagt.add(schluessel);
  const zeilen = spruchzeilen(SCHMEICHELEI, runde.gegner, id, 0);
  const angaben = { schluessel, vorrang: "geschrieben" as const, testid: "abenteuer-spruch" };
  if (zeilen.held) runde.blasen.zeige(heldenzeile(zeilen.held, angaben));
  if (zeilen.antwort) {
    const antwort = { ...angaben, schluessel: `${schluessel}:antwort` };
    runde.blasen.zeige(gegnerzeile(zeilen.antwort, runde.sprecher, runde.name, antwort));
  }
}

/** Der Plan der Partie aus dem Verlauf (fester Zufall je Partie). */
function usePlan(partie: Partie, ambroseDa: boolean): readonly Tischzeile[] {
  return useMemo(() => {
    const verlauf = {
      fens: stellungen(partie),
      vomHelden: partie.zuege.map((z) => z.von === "leser"),
      held: partie.einstellung.eigeneFarbe,
    };
    return tischplan(verlauf, partie.id, ambroseDa);
  }, [partie, ambroseDa]);
}

/**
 * Das Tischgespräch der laufenden Partie. Eingaben: Partie, Uhrzeit des Takts (für die Zeitnot),
 * Kennung des Gegners aus der Begegnung (oder null). Zeichnet nichts.
 * Sonderfälle: ohne Sprechblase (außerhalb der Hülle) still; eine schon beendete Partie bleibt still.
 */
export function Tischgespraech({
  partie,
  jetztMs,
  gegnerkennung,
}: {
  readonly partie: Partie;
  readonly jetztMs: number;
  readonly gegnerkennung: string | null;
}) {
  const stand = useAbenteuerstand();
  const blasen = useTischblasen();
  const gegnerliste = useGegnerliste();
  const gegner = gegnerliste.liste.find((g) => g.kennung === gegnerkennung);
  const begegnung = partie.einstellung.abenteuer?.kennung ?? "";
  const ambroseDa = !schutzengelGesperrt(stand?.dialogvariablen ?? {}, begegnung);
  const plan = usePlan(partie, ambroseDa);
  // Was vor dem Öffnen schon gespielt war, wird nicht mehr besprochen.
  const anfang = useRef({ halbzug: partie.zuege.length, lief: partie.ende === null });
  const runde: Tischrunde | null = blasen && {
    partie,
    stimme: gegner ? { kennung: gegner.kennung, temperament: temperamentVon(gegner) } : OHNE_PROFIL,
    gegner,
    sprecher: sprecherAusPfad(partie.einstellung.abenteuer?.portraet),
    name: gegnerName(partie),
    ambroseDa,
    blasen,
  };
  const uhr = partie.uhr;
  const zeitnot =
    uhr !== null && restzeit(uhr, partie.einstellung.eigeneFarbe, jetztMs) < ZEITNOT_MS;
  useEffect(() => {
    if (!runde || !gegnerliste.geladen) return;
    if (anfang.current.halbzug === 0)
      sprichZurSchmeichelei(runde, stand?.partiekarten?.gespielt ?? []);
    sprichZumHalbzug(runde, plan, anfang.current.halbzug);
    if (zeitnot) sprichZurZeitnot(runde, jetztMs);
    if (partie.ende) sprichZumEnde(runde, anfang.current.lief);
    // Neu nur bei neuem Halbzug, neuem Ende, geladenem Gegner oder beginnender Zeitnot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, partie.ende, gegnerliste.geladen, zeitnot, blasen !== null]);
  return null;
}
