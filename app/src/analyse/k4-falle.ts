/**
 * Werkzeug k4-falle: Falle oder Köder? Welches Material ist im Angebot?
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2 („Die Engine vergleicht ‚Material nehmen‘ mit dem besten
 * anderen Zug und sagt, ob das Angebot eine Falle ist. Für die Fallen des Buches zusätzlich der
 * Fallencheck aus dem Buch.“). Dieses Werkzeug bestimmt das Angebot; das Urteil der Engine (Art N)
 * rechnet die Karte FalleKarte darunter, weil die Engine Zeit braucht. Rot: Fehlzug, Gold:
 * Rettung (setzt die Karte, sobald die Engine fertig ist). An den Stopp-Momenten des Buches steht
 * nur ein Verweis auf den Fallencheck im Buch, nicht dessen Text (Entscheidung
 * des Autors vom 15.10.2026: keine wörtlichen Buchtexte in den Werkzeugen).
 * Abhängigkeiten: analyse/stellungsprofil.ts (Schläge mit Bilanz), daten (Fallencheck), i18n.
 * Buchbezug: Kapitel 4, „Fallenkabinett“, Stopp-Momente und Fallenchecks.
 */
import { parseSan } from "chessops/san";
import { makeUci } from "chessops/util";
import type { Fallencheck } from "../daten/generiert/kapitel";
import { t } from "../i18n/sprache";
import type { Role } from "chessops/types";
import { gegner, type Stellung } from "../schach/stellung";
import { profil } from "./stellungsprofil";
import { schlagtext, zugtext } from "./texte";
import type { Befund, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Das Material im Angebot: ein Schlag der Seite am Zug. */
export interface Angebot {
  readonly san: string;
  readonly uci: string;
  /** Woher: der nächste Zug im Buch oder ein Schlag mit Gewinn laut Abtauschrechnung (W5). */
  readonly herkunft: "buchzug" | "geschenk";
  /** Gewinn laut Abtauschrechnung, falls bekannt. */
  readonly bilanz: number | null;
  /** Die geschlagene Figur, falls bekannt (für den Text „gewinnt den Läufer“). */
  readonly geschlagen: Role | null;
}

/**
 * Bestimmt das Angebot: der geplante Zug, wenn er schlägt, sonst der Schlag mit dem größten
 * Gewinn laut Abtauschrechnung (W5), sonst null.
 * Beispiel: Abb. 4.11 mit dem nächsten Buchzug Lxf3: Angebot Lxf3 (Buchzug).
 */
export function angebot(stellung: Stellung, geplant?: string): Angebot | null {
  const { regeln } = stellung;
  if (!regeln) return null;
  const zug = geplant ? parseSan(regeln, geplant) : undefined;
  if (zug && "from" in zug && regeln.board[gegner(regeln.turn)].has(zug.to) && geplant) {
    return { san: geplant, uci: makeUci(zug), herkunft: "buchzug", bilanz: null, geschlagen: null };
  }
  const bester = (profil(stellung).schlaegeVon(regeln.turn) ?? []).find((s) => s.bilanz > 0);
  return bester
    ? {
        san: bester.san,
        uci: bester.uci,
        herkunft: "geschenk",
        bilanz: bester.bilanz,
        geschlagen: bester.geschlagen,
      }
    : null;
}

/**
 * Verweis auf den Fallencheck des Buches (Art V). Das Urteil selbst rechnet die Engine in der
 * FalleKarte; der Text des Buches bleibt im Buch, damit die App nichts vorwegnimmt.
 * Beispiel: Abb. 4.2 → „Vergleiche mit dem Fallencheck „Klammerfalle“ im Buch bei Abb. 4.2.“
 */
function befundBuch(check: Fallencheck): Befund {
  const zeile = check.stopp
    ? t("falle.buch.verweis", { name: check.name, abbildung: check.stopp })
    : t("falle.buch.verweisOhneAbb", { name: check.name });
  return {
    kennung: "buch",
    art: "V",
    titel: t("falle.buch.titel"),
    zeilen: [zeile],
    farbe: null,
  };
}

function befundAngebot(a: Angebot | null): Befund {
  const zeile = !a
    ? t("falle.keinAngebot")
    : a.herkunft === "buchzug"
      ? t("falle.angebotBuch", { zug: zugtext(a.san) })
      : t("falle.angebotGeschenk", {
          zug: zugtext(a.san),
          gewinn:
            a.geschlagen && a.bilanz !== null
              ? schlagtext({ geschlagen: a.geschlagen, bilanz: a.bilanz })
              : t("text.gewinntMaterial"),
        });
  return { kennung: "angebot", art: "E", titel: t("falle.angebot"), zeilen: [zeile], farbe: null };
}

/**
 * Bestimmt das Angebot und verweist an den Fallen des Buches auf den Fallencheck im Buch.
 *
 * Warum: „Ob es ein Köder ist, beurteilt erst die Engine“ (Pflichtenheft 6.6, W5); an den Fallen
 * des Buches vergleicht der Leser mit der Prüfung im Buch. Eingaben: Stellung, geplanter Zug,
 * Fallencheck dieser Abbildung (falls es einen gibt). Ausgabe: Angebot und Verweis; das Urteil
 * der Engine folgt in der FalleKarte.
 */
export function falle(stellung: Stellung, geplant?: string, check?: Fallencheck): Werkzeugergebnis {
  const a = angebot(stellung, geplant);
  return {
    werkzeug: "k4-falle",
    art: "N",
    ueberschrift: t("falle.titel"),
    befunde: [befundAngebot(a), ...(check ? [befundBuch(check)] : [])],
    fazit: a ? t("falle.fazit.engine", { zug: zugtext(a.san) }) : t("falle.fazit.nichts"),
    markierungen: [],
    stufen: [["angebot"], ["angebot", "buch"], ["angebot", "buch"]],
    regel: t("werkzeug.k4-falle.regel"),
  };
}

/** Das Werkzeug k4-falle in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k4Falle: Werkzeug = {
  id: "k4-falle",
  kapitel: 4,
  name: "werkzeug.k4-falle.name",
  regel: "werkzeug.k4-falle.regel",
  erklaerung: "werkzeug.k4-falle.erklaerung",
  art: "N",
  braucht: ["stellung", "zug", "fallencheck"],
  berechne: ({ stellung, zug, fallencheck }) => falle(stellung, zug, fallencheck),
};
