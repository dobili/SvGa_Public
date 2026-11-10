/**
 * Der Spielstand beim Start einer Partie aus der Oberwelt: Karten mit Zeitpunkt „vorher“ wirken
 * (Vorgabe ändert die Startstellung, Schmeichelei das Profil), Verbrauchskarten werden abgezogen,
 * Position, laufende Partie, Wertung und Partiekarten kommen in den Stand (Regelwerk R24, R26).
 *
 * Rolle im Gesamtbild: Reine Logik für usePartiestart.ts (getestet in partiestart.test.ts),
 * ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 3).
 * Abhängigkeiten: regeln/karten.ts, regeln/wertung.ts, regeln/zeitkarten.ts, oberwelt/auftraege.ts.
 */
import { GRUNDSTELLUNG } from "../anbindung/partiestart";
import { vorgabeFen } from "../regeln/karten";
import { zaehltFuerA } from "../regeln/wertung";
import { spruecheErlaubt } from "../regeln/zeitkarten";
import type { Kartenspiel, Kartensorte } from "../schnittstelle/karten";
import type { Partieauftrag } from "../schnittstelle/partie";
import type { Abenteuerstand, Weltposition } from "../schnittstelle/spielstand";
import { mitSchmeichelei, sichtbarerZustand } from "./auftraege";

/** Was die Karten „vorher“ aus dem Deck machen. */
interface Vorherwirkung {
  readonly auftrag: Partieauftrag;
  readonly startstellung: Partieauftrag["startstellung"];
  readonly gespielt: readonly Kartenspiel[];
  readonly karten: Abenteuerstand["karten"];
}

/** Karten mit Zeitpunkt „vorher“: Sprüche nur gegen Straßengegner (docs/spiel/10, S2). */
function wendeVorherAn(
  aktuell: Abenteuerstand,
  begegnung: Partieauftrag,
  deck: readonly string[],
  schonGespielt: readonly Kartenspiel[],
  sorten: readonly Kartensorte[],
): Vorherwirkung {
  let auftrag = begegnung;
  let startstellung = auftrag.startstellung;
  const gegnerfarbe = auftrag.farbe === "white" ? "black" : "white";
  const gespielt: Kartenspiel[] = [...schonGespielt];
  let karten = aktuell.karten;
  for (const kennung of deck) {
    const sorte = sorten.find((s) => s.kennung === kennung);
    if (!sorte || sorte.zeitpunkt !== "vorher") continue;
    if (sorte.spruch_art && !spruecheErlaubt(auftrag.profil.rolle)) continue;
    if (sorte.wirkung.art === "schmeichelei") auftrag = mitSchmeichelei(auftrag, aktuell);
    if (sorte.wirkung.art === "vorgabe") {
      const fen = startstellung.art === "fen" ? startstellung.fen : GRUNDSTELLUNG;
      const neu = vorgabeFen(fen, sorte.wirkung.feld, gegnerfarbe);
      if (neu) startstellung = { art: "fen", fen: neu };
    }
    gespielt.push({ kennung, stufe: sorte.stufe, halbzug: 0 });
    if (sorte.art === "verbrauch") {
      karten = karten
        .map((k) => (k.kennung === kennung ? { ...k, anzahl: k.anzahl - 1 } : k))
        .filter((k) => k.anzahl > 0);
    }
  }
  return { auftrag, startstellung, gespielt, karten };
}

/**
 * Stand und Auftrag für die App beim Start einer Partie. Vorgaben zählen als gespielt
 * (Halbzug 0) und fehlen deshalb im verbleibenden Deck; freie Karten kommen dazu.
 * Beispiel: Deck [„vorgabeF7“], Begegnung Jo → Startstellung ohne den Bauern f7 des Gegners,
 * gespielt [{ vorgabeF7, Halbzug 0 }], Deck im Stand leer.
 */
export function partiestart(
  aktuell: Abenteuerstand,
  begegnung: Partieauftrag,
  deck: readonly string[],
  schonGespielt: readonly Kartenspiel[],
  sorten: readonly Kartensorte[],
  position: Weltposition,
): { readonly stand: Abenteuerstand; readonly auftrag: Partieauftrag } {
  const v = wendeVorherAn(aktuell, begegnung, deck, schonGespielt, sorten);
  const auftrag = v.auftrag;
  const stand: Abenteuerstand = {
    ...aktuell,
    karten: v.karten,
    position,
    laufendePartie: auftrag.kennung,
    // Für die Abenteuerwertung (R2, R38): Zielstärke vor dem Zustandsfaktor und ob sie zählt.
    laufendeWertung: {
      zielElo: auftrag.staerke.zielElo,
      zaehlt: zaehltFuerA(auftrag),
      zustand: sichtbarerZustand(auftrag),
    },
    partiekarten: {
      deck: [
        ...deck.filter((k) => !v.gespielt.some((g) => g.kennung === k)),
        ...(auftrag.freieKarten ?? []).filter((k) => !deck.includes(k)),
      ],
      ...(auftrag.freieKarten ? { frei: auftrag.freieKarten } : {}),
      gespielt: v.gespielt,
      wiedereinstieg: auftrag.format.art === "wiedereinstieg",
      letzterHalbzug: null,
      gegner: auftrag.profil.kennung,
      uhr: auftrag.uhr,
    },
  };
  return { stand, auftrag: { ...auftrag, startstellung: v.startstellung, deck: { karten: deck } } };
}
