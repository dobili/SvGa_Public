/**
 * Aufträge der Oberwelt an die App (Regelwerk R12, R14, R15, R30, R31): Partieauftrag zu einer
 * Begegnung, Wiedereinstieg am Kipppunkt und Aufgabenauftrag zu einer Runde.
 *
 * Rolle im Gesamtbild: Reine Funktionen über Spieldaten und Spielstand, ausgelagert aus
 * oberwelt/Oberwelt.tsx; die Oberwelt ruft sie, wenn ein Dialog eine Partie oder Runde anstößt
 * oder die Ergebniskarte den Wiedereinstieg anbietet.
 * Abhängigkeiten: regeln/gegnerstaerke.ts, regeln/aufgaben.ts, anbindung/partiestart.ts.
 * Beispiel: `auftragFuer("mapleFalls.ersteLektion", daten, stand)` → Profil Ambrose, gerechnete
 * Stärke aus Profil, Zustand (abgelenkt, überheblich) und Abenteuerwertung A, Farbe nach der
 * Begegnung.
 */
import { farbeAus } from "../anbindung/partiestart";
import type { Gegnerdaten, Spieldaten } from "../daten/laden";
import { motivanzahl, schwierigkeitAus, schwierigkeitDesVersuchs } from "../regeln/aufgaben";
import { POST_GAME_AUFSCHLAG, gerechneteStaerke } from "../regeln/gegnerstaerke";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import type { Gegnerprofil, Gegnerrolle, Gegnerzustand } from "../schnittstelle/gegnerprofil";
import type { Kartenspiel, Kartensorte } from "../schnittstelle/karten";
import type { Kipppunkt, Partieauftrag, Partieergebnis } from "../schnittstelle/partie";
import type { Abenteuerstand, Partiekarten } from "../schnittstelle/spielstand";

/** Ein Gegnerprofil aus den Spieldaten (die Formen stimmen, das Schema hat sie geprüft). */
function profilAus(daten: Gegnerdaten): Gegnerprofil {
  return daten as unknown as Gegnerprofil;
}

/** Überheblichkeit je verlorener Partie und ihre Grenze (Regelwerk R9). */
const UEBERHEBLICH_JE_NIEDERLAGE = 0.15;
const UEBERHEBLICH_MAX = 1.6;
/** Rollen, die nach Niederlagen des Lesers überheblich werden (R9). */
const UEBERHEBLICHE_ROLLEN: readonly Gegnerrolle[] = ["clubchef", "clubmitglied", "turnier"];

/**
 * Faktor „überheblich“ (R9): verlorene Partien gegen diesen Gegner seit dem letzten Sieg oder
 * Remis, aus dem Protokoll gezählt; ein verlorener Wiedereinstieg zählt nicht extra, Abbrüche
 * zählen nicht. Für Straße und Story immer 1.
 */
export function ueberheblichkeit(
  stand: Abenteuerstand,
  gegner: string,
  rolle: Gegnerrolle,
): number {
  if (!UEBERHEBLICHE_ROLLEN.includes(rolle)) return 1;
  let niederlagen = 0;
  for (const eintrag of [...stand.protokoll].reverse()) {
    if (eintrag.gegner !== gegner) continue;
    const ausgang = eintrag.ergebnis.ausgang;
    if (ausgang === "sieg" || ausgang === "remis") break;
    if (ausgang === "niederlage" && !eintrag.wiedereinstieg) niederlagen++;
  }
  return Math.min(UEBERHEBLICH_MAX, 1 + UEBERHEBLICH_JE_NIEDERLAGE * niederlagen);
}

/**
 * Der sichtbare Zustand eines Gegners vor der Partie (R8, R9): abgelenkt mit seinem Grund, sonst
 * überheblich, sonst null. Textschlüssel für die Kartenleiste der App.
 */
export function sichtbarerZustand(
  auftrag: Pick<Partieauftrag, "profil" | "zustand">,
): { gegner: string; grund: string } | null {
  if (auftrag.zustand.grund) return { gegner: auftrag.profil.name, grund: auftrag.zustand.grund };
  if (auftrag.zustand.ueberheblich > 1) {
    return { gegner: auftrag.profil.name, grund: "zustand.ueberheblich" };
  }
  return null;
}

/** So überheblich macht die Schmeichelei (wie zwei verlorene Partien, Regelwerk R9). */
export const SCHMEICHELEI_UEBERHEBLICH = 1.3;

/**
 * Schmeichelei vor der Partie (docs/spiel/11, S7): Der Gegner wird mindestens so überheblich wie
 * nach zwei Niederlagen des Lesers; die Stärke wird mit dem neuen Zustand neu gerechnet.
 * Beispiel: Skater Jo, nicht überheblich → ueberheblich 1,3, Häufigkeit der Fehler höher.
 */
export function mitSchmeichelei(auftrag: Partieauftrag, stand: Abenteuerstand): Partieauftrag {
  const zustand = {
    ...auftrag.zustand,
    ueberheblich: Math.max(auftrag.zustand.ueberheblich, SCHMEICHELEI_UEBERHEBLICH),
  };
  const staerke = gerechneteStaerke(
    auftrag.profil,
    zustand,
    { aktuell: stand.wertung, eingang: stand.eingangswertung },
    stand.handlung.durchlauf >= 2 ? POST_GAME_AUFSCHLAG : 0,
  );
  return { ...auftrag, zustand, staerke };
}

/** Zustand eines Gegners aus dem Spielstand; ohne Eintrag normal. */
function zustandAus(stand: Abenteuerstand, gegner: string, rolle: Gegnerrolle): Gegnerzustand {
  const figur = stand.figuren.find((f) => f.kennung === gegner);
  return {
    haeufigkeitsfaktor: figur?.abgelenkt?.faktor ?? 1,
    grund: figur?.abgelenkt?.grund ?? null,
    analysiert: figur?.analysiert ?? false,
    ueberheblich: ueberheblichkeit(stand, gegner, rolle),
  };
}

/** Baut den Partieauftrag einer Begegnung; null, wenn die Spieldaten sie nicht kennen. */
export function auftragFuer(
  begegnung: string,
  daten: Spieldaten,
  stand: Abenteuerstand,
): Partieauftrag | null {
  const b = daten.begegnungen.find((x) => x.kennung === begegnung);
  const gegner = b && daten.gegner.find((g) => g.kennung === b.gegner);
  if (!b || !gegner) return null;
  const profil = profilAus(gegner);
  const zustand = zustandAus(stand, gegner.kennung, profil.rolle);
  // Bezugswerte A und E aus dem Spielstand (R2, R3); zweiter Durchlauf +300 (R10).
  const staerke = gerechneteStaerke(
    profil,
    zustand,
    { aktuell: stand.wertung, eingang: stand.eingangswertung },
    stand.handlung.durchlauf >= 2 ? POST_GAME_AUFSCHLAG : 0,
  );
  return {
    kennung: `${begegnung}#${Date.now().toString(36)}`,
    begegnung,
    profil,
    zustand,
    staerke,
    farbe: farbeAus(b.farbe, Math.random),
    format: b.format,
    startstellung: b.startstellung,
    deck: { karten: [] },
    kartenErlaubt: b.kartenErlaubt,
    zaehltFuerApp: b.zaehltFuerApp ?? b.startstellung.art === "grundstellung",
    uhr: typeof b.zeit === "object" ? b.zeit : null,
    zeitwahl: b.zeit === "wahl",
  };
}

/** Wer in einer FEN am Zug ist (zweites Feld); fehlt es, Weiß. */
export function amZugIn(fen: string): "white" | "black" {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

/**
 * Darf nach dieser Niederlage ein Wiedereinstieg angeboten werden (Regelwerk R14, Punkte 1, 5,
 * 6)? Nur ganze Partien, nur einmal je Begegnung, nicht nach einem verlorenen Wiedereinstieg.
 */
export function wiedereinstiegMoeglich(
  ergebnis: Partieergebnis,
  begegnung: string,
  daten: Spieldaten,
  stand: Abenteuerstand,
): boolean {
  if (ergebnis.ausgang !== "niederlage") return false;
  const b = daten.begegnungen.find((x) => x.kennung === begegnung);
  if (!b || b.format.art !== "partie") return false;
  if (stand.partiekarten?.wiedereinstieg) return false;
  return !stand.protokoll.some(
    (p) => p.wiedereinstieg && p.ergebnis.kennung.split("#")[0] === begegnung,
  );
}

/**
 * Karten des Wiedereinstiegs (Regelwerk R15): Bis zum Kipppunkt gespielte Karten bleiben
 * gespielt; dauerhafte Karten, die erst danach kamen, kehren ins Deck zurück, verbrauchte nicht.
 */
export function kartenFuerWiedereinstieg(
  vorherige: Partiekarten | null,
  gespielt: readonly Kartenspiel[],
  kipppunkt: Kipppunkt,
  sorten: readonly Kartensorte[],
): { deck: readonly string[]; gespielt: readonly Kartenspiel[] } {
  const bisKipppunkt = gespielt.filter((k) => k.halbzug <= kipppunkt.halbzug);
  const zurueck = gespielt
    .filter((k) => k.halbzug > kipppunkt.halbzug)
    .filter((k) => sorten.find((s) => s.kennung === k.kennung)?.art === "dauerhaft")
    .map((k) => k.kennung);
  const deck = [...new Set([...(vorherige?.deck ?? []), ...zurueck])];
  return { deck, gespielt: bisKipppunkt };
}

/**
 * Baut den Aufgabenauftrag zu einer Runde (Regelwerk R30, R31): Buchübungen und Themen aus
 * runden.json, Umfang aus dem Zeitbudget des Clubs, Schwierigkeit aus der Wertung und dem
 * Versuch. Null, wenn die Runde oder ihr Club fehlt.
 */
export function auftragFuerRunde(
  runde: string,
  daten: Spieldaten,
  stand: Abenteuerstand,
): Aufgabenauftrag | null {
  const r = daten.runden.find((x) => x.kennung === runde);
  const ort = r && daten.orte.find((o) => o.kennung === r.ort);
  if (!r || !ort) return null;
  // Wege haben keinen Club: nur Runden mit fester Zahl (R30a), Budget 0.
  const club = ort.club ?? null;
  if (!club && r.anzahl === undefined) return null;
  const versuch = (stand.runden.find((x) => x.kennung === runde)?.versuche ?? 0) + 1;
  const schwierigkeit = schwierigkeitDesVersuchs(schwierigkeitAus(stand.wertung), versuch);
  const anzahl = motivanzahl(
    {
      buchuebungen: r.buchuebungen,
      themen: r.themen,
      anzahl: r.anzahl ?? null,
      minuten: club?.aufgaben.minuten ?? 0,
      buchuebungenDesClubs: club?.aufgaben.buchuebungen.length ?? 0,
      bloecke: daten.runden.filter((x) => x.ort === r.ort && x.reihe).length,
    },
    schwierigkeit,
  );
  const steller = ort.figuren.find((f) => f.kennung === r.steller);
  // Kein Figurname (Rätseltafel): Textschlüssel nach dem Muster figur.<name>.name.
  const stellername = steller?.name ?? `figur.${r.steller.split(".").pop() ?? r.steller}.name`;
  return {
    kennung: `${runde}#${Date.now().toString(36)}`,
    runde,
    steller: stellername,
    kapitel: club?.kapitel[0] ?? 0,
    buchuebungen: r.buchuebungen,
    themen: r.themen,
    anzahl,
    schwierigkeit,
    versuch,
    zaehltFuerApp: true,
  };
}
