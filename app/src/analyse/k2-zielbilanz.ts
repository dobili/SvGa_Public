/**
 * Werkzeug k2-zielbilanz: die Zielbilanz aus Kapitel 2 für beide Seiten (Zentrum, Entwicklung,
 * Königssicherheit), je mit ja, teils oder nein wie die Tabellen im Buch.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2 („Zielbilanz mit drei Prüfungen“). Hervorhebungen:
 * Rot unentwickelte Leichtfiguren und ein König in der Mitte, Gold erfüllte Ziele
 * (Zentrumsbauern, rochierter König mit Schild), Grau angegriffene Zentrumsbauern und die übrigen
 * Zentrumsfelder. Ob ein angegriffener Zentrumsbauer wirklich hängt, prüft danach die Engine
 * (ui/komponenten/ZentrumKarte.tsx, seit 0.2.33, C1.1).
 * Abhängigkeiten: schach/zielbilanz.ts, analyse/stellungsprofil.ts, i18n.
 * Buchbezug: Kapitel 2, „Die Zielbilanz“; kalibriert an allen Zielbilanzen des Kapitels.
 */
import type { Color, Square } from "chessops/types";
import { t, tZahl } from "../i18n/sprache";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { zielbilanz, type Wertung, type Zielbilanz } from "../schach/zielbilanz";
import { zielmarkierungen } from "./bilanzmarkierungen";
import { profil } from "./stellungsprofil";
import { aufzaehlung, farbname, figurenname } from "./texte";
import type { Befund, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Die drei Ziele jeder Eröffnung (Kapitel 1). */
const ANZAHL_ZIELE = 3;

/** Felder als „d4, e4 und d5“. */
function felder(liste: readonly Square[]): string {
  return aufzaehlung(liste.map(feldname));
}

/** Die drei Ziele in Buchreihenfolge. */
type Ziel = "zentrum" | "entwicklung" | "koenig";

function zeile(ziel: Ziel, wertung: Wertung, text: string): string {
  return t("zielbilanz.zeile", {
    ziel: t(`zielbilanz.ziel.${ziel}`),
    wertung: t(`zielbilanz.wertung.${wertung}`),
    text,
  });
}

/**
 * Begründung der Zentrumsprüfung, etwa „Bauer im Zentrum: d4 und e4; e4 ist angegriffen“.
 * Ob ein angegriffener Bauer wirklich hängt, schreibt die Engine darunter (ZentrumKarte.tsx).
 */
function zentrumstext(z: Zielbilanz["zentrum"]): string {
  if (z.bauern.length > 0) {
    const bauern = tZahl("zielbilanz.zentrum.bauern", z.bauern.length, {
      felder: felder(z.bauern),
    });
    if (z.angegriffen.length === 0) return bauern;
    const zusatz = z.angegriffen.length === 1 ? "angegriffen" : "angegriffenMehrere";
    return `${bauern}; ${t(`zielbilanz.zentrum.${zusatz}`, { felder: felder(z.angegriffen) })}`;
  }
  if (z.kontrolliert.length > 0) {
    return t("zielbilanz.zentrum.figuren", { felder: felder(z.kontrolliert) });
  }
  return t("zielbilanz.zentrum.keins");
}

function entwicklungstext(e: Zielbilanz["entwicklung"]): string {
  if (e.offen.length === 0) return t("zielbilanz.entwicklung.alle");
  return t("zielbilanz.entwicklung.offen", {
    figuren: aufzaehlung(e.offen.map(figurenname)),
  });
}

function koenigstext(k: Zielbilanz["koenig"]): string {
  if (k.koenig === null) return t("zielbilanz.koenig.fehlt");
  const feld = feldname(k.koenig);
  if (!k.rochiert) return t("zielbilanz.koenig.mitte", { feld });
  if (k.vorgerueckt) return t("zielbilanz.koenig.vorgerueckt", { feld });
  if (k.wertung === "ja") return t("zielbilanz.koenig.schild", { felder: felder(k.schild) });
  return tZahl("zielbilanz.koenig.gelockert", k.schild.length, { anzahl: k.schild.length });
}

/** Ein Befund je Seite mit den drei Zeilen, wie eine Spalte der Tabelle im Buch. */
function befund(bilanz: Zielbilanz): Befund {
  const { zentrum, entwicklung, koenig } = bilanz;
  // Zentrumskontrolle durch Figuren ist eine Einschätzung (Pflichtenheft 6.2: „N“).
  const nurFiguren = zentrum.bauern.length === 0 && zentrum.kontrolliert.length > 0;
  return {
    kennung: bilanz.farbe,
    art: nurFiguren ? "N" : "E",
    titel: farbname(bilanz.farbe),
    zeilen: [
      zeile("zentrum", zentrum.wertung, zentrumstext(zentrum)),
      zeile("entwicklung", entwicklung.wertung, entwicklungstext(entwicklung)),
      zeile("koenig", koenig.wertung, koenigstext(koenig)),
    ],
    farbe: null,
  };
}

/** Wie viele der drei Ziele eine Seite ganz erreicht hat. */
function erreicht(bilanz: Zielbilanz): number {
  return [bilanz.zentrum, bilanz.entwicklung, bilanz.koenig].filter((p) => p.wertung === "ja")
    .length;
}

function fazit(eigen: Zielbilanz, andere: Zielbilanz): string {
  const zahl = (b: Zielbilanz) => ({ farbe: farbname(b.farbe), anzahl: erreicht(b) });
  if (erreicht(eigen) === ANZAHL_ZIELE && erreicht(andere) === ANZAHL_ZIELE)
    return t("zielbilanz.fazit.beide");
  return t("zielbilanz.fazit.stand", {
    erste: t("zielbilanz.fazit.seite", zahl(eigen)),
    zweite: t("zielbilanz.fazit.seite", zahl(andere)),
  });
}

/**
 * Prüft die drei Eröffnungsziele für beide Seiten.
 *
 * Warum: Kapitel 2, „Direkt nach der Schlussstellung prüft eine kleine Tabelle Ziel für Ziel,
 * was beide Seiten erreicht haben.“ Die App macht diese Tabelle für jede Stellung.
 * Eingaben: Stellung und eigene Seite. Ausgabe: je Seite ein Befund mit drei Zeilen, Weiß zuerst
 * wie in der Tabelle des Buches. Beispiel: Abb. 2.76 (Angenommenes Damengambit, Abb. 2.71): Weiß ja, teils, ja;
 * Schwarz teils, nein, nein.
 * Sonderfälle: Lehrbilder ohne König bekommen bei der Königsprüfung „nein“ (König fehlt).
 */
export function zielbilanzWerkzeug(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const karte = profil(stellung).angriffskarte;
  const meine = zielbilanz(stellung.brett, karte, eigen, stellung.amZug);
  const seine = zielbilanz(stellung.brett, karte, gegner(eigen), stellung.amZug);
  // Wie die Tabelle im Buch: Weiß zuerst, gleich wer am Zug ist (Nachtest des Autors, 0.2.26).
  const [weiss, schwarz] = eigen === "white" ? [meine, seine] : [seine, meine];
  const befunde = [befund(weiss), befund(schwarz)];
  return {
    werkzeug: "k2-zielbilanz",
    art: befunde.some((b) => b.art === "N") ? "N" : "E",
    ueberschrift: t("zielbilanz.titel"),
    befunde,
    fazit: fazit(weiss, schwarz),
    // Nur die Seite der Sicht wird markiert (0.2.28), seit 0.2.29 ausführlicher.
    markierungen: zielmarkierungen(meine, stellung.brett),
    stufen: [[eigen], [eigen, gegner(eigen)], [eigen, gegner(eigen)]],
    regel: t("werkzeug.k2-zielbilanz.regel"),
  };
}

/** Das Werkzeug k2-zielbilanz in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k2Zielbilanz: Werkzeug = {
  id: "k2-zielbilanz",
  kapitel: 2,
  name: "werkzeug.k2-zielbilanz.name",
  regel: "werkzeug.k2-zielbilanz.regel",
  erklaerung: "werkzeug.k2-zielbilanz.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => zielbilanzWerkzeug(stellung, perspektive),
};
