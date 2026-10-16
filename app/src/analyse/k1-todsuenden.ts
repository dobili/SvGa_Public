/**
 * Werkzeug k1-todsuenden: die vier Todsünden der Eröffnungsphase aus Kapitel 1.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2 („verfrühte Dame, Materialgier bei
 * Entwicklungsrückstand, Randbauernzüge ohne Anlass, König zu lange in der Mitte. Braucht die
 * Zugfolge“). Die Zugfolge kommt aus der Zugleiste; ohne Zugfolge prüft das Werkzeug nur den
 * König in der Mitte. Rot: die betroffene Figur oder der Bauer. Art N. Die App nennt nur
 * mögliche Todsünden (Kandidaten), die der Leser prüft: Manchmal ist etwa das frühe Herausholen
 * der Dame sinnvoll (Wunsch des Autors zu C2.3, 16.10.2026; Hinweis oben in der Karte).
 * Abhängigkeiten: schach/todsuenden.ts, i18n.
 * Buchbezug: Kapitel 1, „Die vier Todsünden der Eröffnungsphase“ (Abb. 1.8, 1.12, 1.13).
 */
import type { Color } from "chessops/types";
import { t } from "../i18n/sprache";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import type { Eroeffnungsindex } from "../schach/eroeffnungsindex";
import { todsuenden, type Suendenfund, type Verlauf } from "../schach/todsuenden";
import { farbname, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** „3... Df6“: Zugnummer mit Punkten wie im Buch. */
function zugAngabe(fund: Suendenfund): string {
  if (!fund.san) return "";
  const punkte = fund.farbe === "white" ? "." : "...";
  return `${fund.zugnummer}${punkte} ${zugtext(fund.san)}: `;
}

function zeile(fund: Suendenfund): string {
  return `${zugAngabe(fund)}${t(`todsuenden.${fund.art}`, { anzahl: fund.zuHause, zuege: fund.zugnummer })}`;
}

function befund(funde: readonly Suendenfund[], farbe: Color, kennung: string): Befund {
  const eigene = funde.filter((f) => f.farbe === farbe);
  return {
    kennung,
    art: "N",
    titel: farbname(farbe),
    zeilen: eigene.length > 0 ? eigene.map(zeile) : [t("todsuenden.keine")],
    farbe: eigene.length > 0 ? "rot" : null,
  };
}

/** Rot die betroffene Figur, wenn sie noch auf dem Feld steht. */
function markierungen(funde: readonly Suendenfund[], stellung: Stellung): Markierung[] {
  return funde
    .filter((f) => stellung.brett.get(f.feld)?.color === f.farbe)
    .map((f) => ({ typ: "feld", farbe: "rot", feld: feldname(f.feld) }));
}

/**
 * Prüft die Zugfolge bis zur gezeigten Stellung auf die vier Todsünden.
 *
 * Warum: Die Todsünden sind die häufigsten Eröffnungsfehler von Anfängern (Kapitel 1).
 * Eingaben: Stellung, eigene Seite, Zugfolge (ohne sie: nur die Stellung), Eröffnungsindex
 * (Buchzüge ohne Fragezeichen sind keine Sünde). Ausgabe: je Seite die
 * gefundenen möglichen Sünden mit Zug. Beispiel: Abb. 1.8: „3... Df6: mögliche verfrühte Dame“.
 */
export function todsuendenWerkzeug(
  stellung: Stellung,
  eigen: Color,
  verlauf?: Verlauf,
  eroeffnungen?: Eroeffnungsindex,
): Werkzeugergebnis {
  const funde = todsuenden(
    verlauf ?? { startFen: stellung.fen, zuege: [] },
    eroeffnungen?.buchzuege,
  );
  const fazit =
    funde.length === 0
      ? t("todsuenden.fazit.keine")
      : funde.length === 1
        ? t("todsuenden.fazit.eine")
        : t("todsuenden.fazit.gefunden", { anzahl: funde.length });
  return {
    werkzeug: "k1-todsuenden",
    art: "N",
    ueberschrift: t("todsuenden.titel"),
    befunde: [befund(funde, eigen, "eigen"), befund(funde, gegner(eigen), "gegner")],
    fazit: verlauf && verlauf.zuege.length > 0 ? fazit : `${fazit} ${t("todsuenden.ohneZuege")}`,
    markierungen: markierungen(funde, stellung),
    stufen: [["eigen"], ["eigen", "gegner"], ["eigen", "gegner"]],
    regel: t("werkzeug.k1-todsuenden.regel"),
    hinweis: t("todsuenden.hinweis"),
  };
}

/** Das Werkzeug k1-todsuenden in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k1Todsuenden: Werkzeug = {
  id: "k1-todsuenden",
  kapitel: 1,
  name: "werkzeug.k1-todsuenden.name",
  regel: "werkzeug.k1-todsuenden.regel",
  erklaerung: "werkzeug.k1-todsuenden.erklaerung",
  art: "N",
  braucht: ["stellung", "verlauf", "eroeffnungen"],
  berechne: ({ stellung, perspektive, verlauf, eroeffnungen }) =>
    todsuendenWerkzeug(stellung, perspektive, verlauf, eroeffnungen),
};
