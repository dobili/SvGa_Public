/**
 * Werkzeug k8-schluesselfelder: Die Schlüsselfelder der Freibauern und wo die Könige dazu stehen.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Schlüsselfelder des Bauern. Gold“). Die App zeigt
 * zusätzlich die Schlüsselfelder der gegnerischen Freibauern in Rot (Präzisierung: Dort darf der
 * gegnerische König nicht hin).
 * Abhängigkeiten: schach/schluesselfelder.ts, schach/bauernschwaechen.ts, schach/kpk.ts, i18n.
 * Buchbezug: Kapitel 8, „Schlüsselfelder: Wohin der König will“ (Abb. 8.25 bis 8.31).
 */
import type { Color, Square } from "chessops/types";
import { t } from "../i18n/sprache";
import { eigeneReihe } from "../schach/bauernprofil";
import { bauernschwaechen } from "../schach/bauernschwaechen";
import { kpkErgebnis } from "../schach/kpk";
import {
  schluesselfelder,
  schluesselstand,
  sechsteReihe,
  type Schluesselfelder,
  type Schluesselstand,
} from "../schach/schluesselfelder";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { aufzaehlung, farbname, zugtext, zugzahl } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Felder je Reihe: Das Feld vor einem weißen Bauern liegt acht Indizes weiter. */
const LINIEN = 8;

/** Ein Freibauer mit seinen Schlüsselfeldern und dem Stand der Könige. */
interface Fall {
  readonly sf: Schluesselfelder;
  readonly stand: Schluesselstand;
  readonly eigen: boolean;
}

/** Zeile zur Tabelle des Buches: welche Felder und warum. */
function felderzeile(sf: Schluesselfelder): string {
  return t(`schluessel.art.${sf.art}`, {
    reihe: eigeneReihe(sf.bauer, sf.farbe) + 1,
    felder: aufzaehlung(sf.felder.map(feldname)),
  });
}

/** Zeile zum Stand der Könige: besetzt, erreichbar oder Abstände. */
function standzeile(fall: Fall): string {
  const { stand, sf } = fall;
  if (stand.besetzt !== null) {
    return t("schluessel.besetzt", { farbe: farbname(sf.farbe), koenig: feldname(stand.besetzt) });
  }
  if (stand.erreichbar.length > 0) {
    const zuege = stand.erreichbar.map((feld) => zugtext(`K${feldname(feld)}`));
    return t("schluessel.erreichbar", { farbe: farbname(sf.farbe), zuege: aufzaehlung(zuege) });
  }
  if (stand.abstandEigen === null || stand.abstandGegner === null)
    return t("schluessel.ohneKoenig");
  return t("schluessel.abstand", {
    farbe: farbname(sf.farbe),
    eigen: zugzahl(stand.abstandEigen),
    gegner: farbname(gegner(sf.farbe)),
    fremd: zugzahl(stand.abstandGegner),
  });
}

/** Zeilen zu den Sonderfällen: Randbauer und Bauer auf der 6. Reihe. */
function sonderzeilen(stellung: Stellung, sf: Schluesselfelder): string[] {
  const zeilen: string[] = [];
  if (sf.art === "rand") zeilen.push(t("schluessel.randbauer"));
  const sechste = sechsteReihe(stellung, sf.bauer, sf.farbe);
  if (sechste) {
    zeilen.push(
      t(sechste.mitSchach ? "schluessel.sechste.mitSchach" : "schluessel.sechste.ohneSchach"),
    );
    if (!sechste.mitSchach && stellung.amZug !== sf.farbe) {
      zeilen.push(
        t("schluessel.sechste.verteidiger", {
          felder: aufzaehlung(sechste.schachfelder.map(feldname)),
        }),
      );
    }
  }
  return zeilen;
}

/** Die Fälle beider Seiten, die eigene zuerst. */
function faelle(stellung: Stellung, eigen: Color): Fall[] {
  const liste: Fall[] = [];
  for (const farbe of [eigen, gegner(eigen)]) {
    for (const bauer of bauernschwaechen(stellung.brett, farbe).freibauern) {
      const sf = schluesselfelder(bauer.feld, farbe);
      liste.push({ sf, stand: schluesselstand(stellung, sf), eigen: farbe === eigen });
    }
  }
  return liste;
}

/** Gold die eigenen Schlüsselfelder und der Königszug dorthin, Rot die des Gegners. */
function markierungen(liste: readonly Fall[], koenig: Square | undefined): Markierung[] {
  const marken: Markierung[] = [];
  for (const fall of liste) {
    const farbe = fall.eigen ? "gold" : "rot";
    for (const feld of fall.sf.felder) marken.push({ typ: "feld", farbe, feld: feldname(feld) });
    if (fall.eigen && koenig !== undefined) {
      for (const ziel of fall.stand.erreichbar) {
        marken.push({ typ: "pfeil", farbe: "gold", von: feldname(koenig), nach: feldname(ziel) });
      }
    }
  }
  return marken;
}

/** Der Befund zu einem Freibauern. */
function befund(stellung: Stellung, fall: Fall): Befund {
  const { sf } = fall;
  return {
    kennung: `${fall.eigen ? "eigen" : "gegner"}-${feldname(sf.bauer)}`,
    art: "E",
    titel: t("schluessel.bauer", { farbe: farbname(sf.farbe), bauer: feldname(sf.bauer) }),
    zeilen: [felderzeile(sf), standzeile(fall), ...sonderzeilen(stellung, sf)],
    farbe: fall.eigen ? "gold" : "rot",
  };
}

/**
 * Sonderfall 6. Reihe im Fazit (C1.20): Die Bauernseite ist am Zug, und der Bauer kommt ohne
 * Schach auf die 7. Reihe. Ausgabe: das Zielfeld des Bauernzugs (Abb. 8.29: „e7“) oder null.
 * Regel: Kapitel 8, „Sonderfall: Bauer auf der 6. Reihe“ (Abb. 8.29: „Weiß am Zug gewinnt nur
 * mit 1. e7!“).
 * Sonderfälle: nur im reinen Bauernendspiel und nicht beim Randbauern (Randbauer-Ausnahme, etwa
 * Abb. 9.41); bei König und Bauer gegen König bestätigt die Endspieldatenbank den Gewinn.
 */
function sechsteReiheZug(stellung: Stellung, fall: Fall): string | null {
  const { sf } = fall;
  const { regeln, brett } = stellung;
  const sechste = sechsteReihe(stellung, sf.bauer, sf.farbe);
  if (!sechste || sechste.mitSchach || stellung.amZug !== sf.farbe || !regeln) return null;
  const nurBauern = brett.occupied.diff(brett.king).diff(brett.pawn).isEmpty();
  if (!nurBauern || sf.art === "rand") return null;
  const vor = sf.bauer + (sf.farbe === "white" ? LINIEN : -LINIEN);
  if (!regeln.dests(sf.bauer).has(vor)) return null;
  const danach = regeln.clone();
  danach.play({ from: sf.bauer, to: vor });
  return kpkErgebnis(danach.board, danach.turn) === "remis" ? null : feldname(vor);
}

/** Fazit: der stärkste Stand der eigenen Seite. */
function fazit(stellung: Stellung, liste: readonly Fall[], eigen: Color): string {
  const eigene = liste.filter((fall) => fall.eigen);
  const fremder = liste.find((fall) => !fall.eigen);
  if (eigene.length === 0) {
    if (!fremder) return t("schluessel.fazitKeiner", { farbe: farbname(eigen) });
    // Auch aus Sicht des Verteidigers gilt der Sonderfall 6. Reihe (Abb. 8.29, Schwarz, 0.2.66).
    const zug = sechsteReiheZug(stellung, fremder);
    const farbe = farbname(fremder.sf.farbe);
    return zug ? t("schluessel.fazitSechste", { farbe, zug: zugtext(zug) }) : standzeile(fremder);
  }
  for (const fall of eigene) {
    const zug = sechsteReiheZug(stellung, fall);
    if (zug) return t("schluessel.fazitSechste", { farbe: farbname(eigen), zug: zugtext(zug) });
  }
  const besetzt = eigene.find((fall) => fall.stand.besetzt !== null);
  if (besetzt) return t("schluessel.fazitBesetzt", { farbe: farbname(eigen) });
  const erreichbar = eigene.find((fall) => fall.stand.erreichbar.length > 0);
  if (erreichbar) {
    return t("schluessel.fazitErreichbar", {
      farbe: farbname(eigen),
      zuege: aufzaehlung(erreichbar.stand.erreichbar.map((f) => zugtext(`K${feldname(f)}`))),
    });
  }
  return t("schluessel.fazitFern", { farbe: farbname(eigen) });
}

/**
 * Bestimmt die Schlüsselfelder aller Freibauern und den Stand der Könige dazu.
 *
 * Warum: „Gelingt es dem König der angreifenden Seite, ein Schlüsselfeld seines Freibauern zu
 * besetzen, gewinnt er, ganz gleich, wer am Zug ist.“ Eingaben: Stellung, eigene Seite.
 * Beispiel: Abb. 8.27 (Weiß am Zug): Bauer d2, Schlüsselfelder c4, d4, e4, erreichbar mit Kc4,
 * Kd4 oder Ke4. Abb. 8.28 (Schwarz am Zug): dieselben Felder, der weiße König ist nicht am Zug.
 * Sonderfälle: ohne Freibauern ein Hinweis; Bauer auf der 7. Reihe ohne Felder („rechne konkret“);
 * greift der Sonderfall 6. Reihe, nennt das Fazit den Bauernzug (Abb. 8.29: „Weiß gewinnt mit e7“).
 */
export function schluessel(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const liste = faelle(stellung, eigen);
  const befunde: Befund[] =
    liste.length > 0
      ? liste.map((fall) => befund(stellung, fall))
      : [
          {
            kennung: "keine",
            art: "E",
            titel: t("schluessel.keineTitel"),
            zeilen: [t("schluessel.keinFreibauer")],
            farbe: null,
          },
        ];
  const kennungen = befunde.map((b) => b.kennung);
  const eigene = kennungen.filter((k) => !k.startsWith("gegner"));
  return {
    werkzeug: "k8-schluesselfelder",
    art: "E",
    ueberschrift: t("schluessel.titel"),
    befunde,
    fazit: fazit(stellung, liste, eigen),
    markierungen: markierungen(liste, stellung.brett.kingOf(eigen)),
    stufen: [eigene, kennungen, kennungen],
    regel: t("werkzeug.k8-schluesselfelder.regel"),
  };
}

/** Das Werkzeug k8-schluesselfelder in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k8Schluesselfelder: Werkzeug = {
  id: "k8-schluesselfelder",
  kapitel: 8,
  name: "werkzeug.k8-schluesselfelder.name",
  regel: "werkzeug.k8-schluesselfelder.regel",
  erklaerung: "werkzeug.k8-schluesselfelder.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => schluessel(stellung, perspektive),
};
