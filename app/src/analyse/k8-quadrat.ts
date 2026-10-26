/**
 * Werkzeug k8-quadrat: Die Regel des Quadrats für jeden Freibauern, mit Zugrecht und Doppelschritt.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Quadratregel (einschließlich Zugrecht und
 * Doppelschritt). Grau: Quadrat, Gold/Rot: König“): Gold, wenn der König den Bauern einholt, Rot,
 * wenn der Bauer durchläuft.
 * Abhängigkeiten: schach/quadrat.ts, i18n.
 * Buchbezug: Kapitel 8, „Holt der König ihn ein? Die Regel des Quadrats“ (Abb. 8.35, 8.36) und
 * der Schachtipp zu den Grenzen der Regel. Nach den Entscheidungen des Autors vom 16.10.2026:
 * kein Urteil, wenn der eigene König den Bauern begleitet (C1.23, Abb. 8.19) oder verbundene
 * Freibauern sich schützen (C1.21, Abb. 8.50); der Bauer, der mit dem nächsten Zug zum
 * Freibauern wird, kommt zuerst (C1.22, Abb. 8.46).
 */
import type { Color, Square } from "chessops/types";
import { t } from "../i18n/sprache";
import {
  freibauernBeider,
  kommenderFreibauer,
  quadrat,
  type KommenderFreibauer,
  type Quadrat,
} from "../schach/quadrat";
import { feldAusName, feldname, gegner, type Stellung } from "../schach/stellung";
import { farbname, zugtext, zugzahl } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Zeilen zum Weg des Bauern: Doppelschritt, Schritte, Quadrat, Zugrecht (geschrumpftes Quadrat). */
function wegzeilen(q: Quadrat): string[] {
  const zeilen: string[] = [];
  if (q.doppelschritt) zeilen.push(t("quadrat.doppelschritt"));
  zeilen.push(
    t("quadrat.weg", {
      start: feldname(q.start),
      ziel: feldname(q.umwandlungsfeld),
      schritte: zugzahl(q.schritte),
    }),
  );
  zeilen.push(t("quadrat.quadrat", { von: feldname(q.start), bis: feldname(q.seiteEnde) }));
  if (q.nachZug) {
    zeilen.push(
      t("quadrat.zugrecht", {
        farbe: farbname(q.farbe),
        von: feldname(q.nachZug.start),
        bis: feldname(q.nachZug.seiteEnde),
      }),
    );
  }
  return zeilen;
}

/** Zeile zum gegnerischen König: betritt er das Quadrat? Bei einer Ausnahme kein Urteil. */
function koenigszeile(q: Quadrat): string {
  if (q.ausnahme === "begleitet") return t("quadrat.begleitet");
  if (q.ausnahme === "verbunden") {
    return t("quadrat.verbunden");
  }
  if (q.koenigGegner === null) return t("quadrat.ohneKoenig");
  const werte = { koenig: feldname(q.koenigGegner), farbe: farbname(gegner(q.farbe)) };
  return t(q.haeltAuf ? "quadrat.haelt" : "quadrat.haeltNicht", werte);
}

/** Gold, wenn der König einholt, rot, wenn der Bauer läuft; ohne Urteil keine Farbe. */
function urteilsfarbe(q: Quadrat): "gold" | "rot" | null {
  if (q.ausnahme !== null) return null;
  return q.haeltAuf ? "gold" : "rot";
}

/** Der Befund zu einem Freibauern. */
function befund(q: Quadrat): Befund {
  // Begleitet der König den Bauern, sagt die Ausnahme schon, was der Vorbehalt sagen würde.
  const vorbehalte = q.vorbehalte.filter(
    (v) => !(q.ausnahme === "begleitet" && v === "eigenerKoenig"),
  );
  return {
    kennung: `bauer-${feldname(q.bauer)}`,
    art: "E",
    titel: t("quadrat.bauer", { farbe: farbname(q.farbe), bauer: feldname(q.bauer) }),
    zeilen: [
      ...wegzeilen(q),
      koenigszeile(q),
      ...vorbehalte.map((v) => t(`quadrat.vorbehalt.${v}`)),
    ],
    farbe: urteilsfarbe(q),
  };
}

/** Der Befund zum Bauern, der mit dem nächsten Zug zum Freibauern wird (Abb. 8.46: a6). */
function befundKommend(kommend: KommenderFreibauer, q: Quadrat): Befund {
  const grund = befund(q);
  return {
    ...grund,
    kennung: `kommend-${feldname(kommend.bauer)}`,
    titel: t("quadrat.kommendTitel", {
      farbe: farbname(q.farbe),
      zug: zugtext(kommend.san),
    }),
    zeilen: [t("quadrat.kommend", { zug: zugtext(kommend.san) }), ...grund.zeilen],
  };
}

/** Gold der Weg des Bauern, Grau die übrigen Seiten des Quadrats, der König Gold oder Rot. */
function markierungen(q: Quadrat): Markierung[] {
  const pfeil = (farbe: "gold" | "grau", von: Square, nach: Square): Markierung => ({
    typ: "pfeil",
    farbe,
    von: feldname(von),
    nach: feldname(nach),
  });
  const marken: Markierung[] = [pfeil("gold", q.bauer, q.umwandlungsfeld)];
  if (q.start !== q.seiteStart) {
    marken.push(pfeil("grau", q.start, q.seiteStart));
    marken.push(pfeil("grau", q.seiteStart, q.seiteEnde));
    marken.push(pfeil("grau", q.umwandlungsfeld, q.seiteEnde));
  }
  if (q.koenigGegner !== null) {
    marken.push({ typ: "feld", farbe: urteilsfarbe(q) ?? "grau", feld: feldname(q.koenigGegner) });
  }
  return marken;
}

/** Das Fazit zum ersten Freibauern, beim kommenden mit dem Zug davor. */
function fazit(q: Quadrat, kommend: KommenderFreibauer | null): string {
  if (q.ausnahme === "begleitet") return t("quadrat.begleitet");
  if (q.ausnahme === "verbunden") {
    return t("quadrat.verbunden");
  }
  const werte = {
    bauer: feldname(q.bauer),
    farbe: farbname(gegner(q.farbe)),
    zug: kommend ? zugtext(kommend.san) : "",
  };
  if (kommend)
    return t(q.haeltAuf ? "quadrat.fazitKommendHaelt" : "quadrat.fazitKommendLaeuft", werte);
  return t(q.haeltAuf ? "quadrat.fazitHaelt" : "quadrat.fazitLaeuft", werte);
}

/** Markierungen; beim kommenden Freibauern beginnt der goldene Weg am Feld vor dem Zug. */
function markierungenMitZug(q: Quadrat, kommend: KommenderFreibauer | null): Markierung[] {
  const marken = markierungen(q);
  if (!kommend) return marken;
  return marken.map((m) =>
    m.typ === "pfeil" && m.farbe === "gold" ? { ...m, von: feldname(kommend.von) } : m,
  );
}

/** Die Freibauern in Reihenfolge: ein angetippter zuerst, dann die eigenen, dann die des Gegners. */
function reihenfolge(stellung: Stellung, eigen: Color, feld?: string): Square[] {
  const bauern = freibauernBeider(stellung, eigen).map((b) => b.feld);
  const getippt = feld ? feldAusName(feld) : null;
  if (getippt === null || !bauern.includes(getippt)) return bauern;
  return [getippt, ...bauern.filter((b) => b !== getippt)];
}

/**
 * Wendet die Quadratregel auf alle Freibauern an; Markierungen für den ersten (oder angetippten).
 *
 * Warum: Regel 6 in der schnellen Form des Buches; die Vorbehalte des Schachtipps stehen dabei.
 * Eingaben: Stellung, eigene Seite, angetipptes Feld (freiwillig), nächster Zug (freiwillig, SAN
 * englisch). Ausgabe: je Freibauer ein Befund. Beispiel: Abb. 8.35 (Weiß am Zug): Quadrat b4–f8;
 * nach 1. b5 schrumpft es auf b5–e8, das der König g5 nicht erreicht, Weiß gewinnt. Abb. 8.36
 * (Schwarz am Zug): Er tritt in b4–f8 ein, remis. Abb. 8.46 mit dem Buchzug a6: Nach a6 läuft der
 * Bauer durch.
 * Sonderfälle: ohne Freibauern ein Hinweis; wird mit dem nächsten Zug ein Bauer zum Freibauern,
 * steht er zuerst (sein Quadrat in der Stellung nach dem Zug, sofern kein Feld angetippt ist).
 */
export function quadratregel(
  stellung: Stellung,
  eigen: Color,
  feld?: string,
  zug?: string,
): Werkzeugergebnis {
  const kommend = feld ? null : kommenderFreibauer(stellung, zug);
  const quadrate = reihenfolge(stellung, eigen, feld).map((bauer) => quadrat(stellung, bauer));
  const qKommend = kommend ? quadrat(kommend.stellung, kommend.bauer) : null;
  const alle = qKommend ? [qKommend, ...quadrate] : quadrate;
  const befunde: Befund[] =
    alle.length > 0
      ? [
          ...(kommend && qKommend ? [befundKommend(kommend, qKommend)] : []),
          ...quadrate.map(befund),
        ]
      : [
          {
            kennung: "keine",
            art: "E",
            titel: t("quadrat.keineTitel"),
            zeilen: [t("quadrat.keinFreibauer")],
            farbe: null,
          },
        ];
  const erstes = alle[0];
  const kennungen = befunde.map((b) => b.kennung);
  return {
    werkzeug: "k8-quadrat",
    art: "E",
    ueberschrift: t("quadrat.titel"),
    befunde,
    fazit: erstes ? fazit(erstes, kommend) : t("quadrat.keinFreibauer"),
    markierungen: erstes ? markierungenMitZug(erstes, kommend) : [],
    stufen: [kennungen.slice(0, 1), kennungen, kennungen],
    regel: t("werkzeug.k8-quadrat.regel"),
  };
}

/** Das Werkzeug k8-quadrat in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k8Quadrat: Werkzeug = {
  id: "k8-quadrat",
  kapitel: 8,
  name: "werkzeug.k8-quadrat.name",
  regel: "werkzeug.k8-quadrat.regel",
  erklaerung: "werkzeug.k8-quadrat.erklaerung",
  art: "E",
  braucht: ["stellung", "zug"],
  berechne: ({ stellung, perspektive, feld, zug }) =>
    quadratregel(stellung, perspektive, feld, zug),
};
