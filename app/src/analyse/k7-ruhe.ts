/**
 * Werkzeug k7-ruhe: Taktik, Schritt 3. Wann ist die Rechnung fertig? Die vier Prüfpunkte am
 * Ende jeder Variante mit den Anhaltspunkten aus der Stellung (Zwischenschachs des Gegners, der
 * eigene König, die Bilanz) und, wenn der Gegner droht, die fünf Abwehrfragen. Die Engine
 * rechnet in der Karte RuheKarte die Hauptvariante bis zur Ruhe.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Die Engine rechnet bis zur Ruhe und zeigt die
 * Bilanz in Bauerneinheiten. Gold: Hauptvariante in Schritten zu höchstens vier Halbzügen. N.“).
 * Abhängigkeiten: stellungsprofil.ts (Schachs, Drohungen, Schläge, sichere Felder), i18n.
 * Buchbezug: Kapitel 7, „Schritt 3: Wann ist die Rechnung fertig?“ und die Abwehrfragen.
 */
import type { Color, Square } from "chessops/types";
import { t, tZahl } from "../i18n/sprache";
import type { Drohung } from "../schach/drohungen";
import { feldname, FIGURENWERT, gegner, type Stellung } from "../schach/stellung";
import { felderText } from "./skelett";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { aufzaehlung, farbname, schlagtext, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** So viele Zwischenschachs und Drohungen nennt die Karte höchstens. */
const HOECHSTENS = 4;

/** Materialstand aus Sicht einer Farbe in Bauerneinheiten (ohne Könige). */
function material(p: Stellungsprofil, farbe: Color): number {
  let summe = 0;
  for (const s of p.angriffskarte.figuren(farbe)) summe += FIGURENWERT[s.figur.role];
  for (const s of p.angriffskarte.figuren(gegner(farbe))) summe -= FIGURENWERT[s.figur.role];
  return summe;
}

function mitVorzeichen(zahl: number): string {
  if (zahl > 0) return `+${zahl}`;
  return zahl < 0 ? `−${Math.abs(zahl)}` : "0";
}

/** Die vier Prüfpunkte mit Anhaltspunkten: Zwischenschachs des Gegners, eigener König, Zugfolge, Bilanz. */
function pruefpunkte(p: Stellungsprofil, eigen: Color): string[] {
  const feind = gegner(eigen);
  const schachs = (p.schachsVon(feind) ?? []).slice(0, HOECHSTENS).map((s) => zugtext(s.san));
  const drohungen = (p.drohungen(feind) ?? []).filter((d) => d.art === "matt").slice(0, HOECHSTENS);
  return [
    t("ruhe.punkt.antwort", {
      text:
        schachs.length > 0
          ? t("ruhe.zwischenschachs", { zuege: aufzaehlung(schachs) })
          : t("ruhe.keineZwischenschachs"),
    }),
    t("ruhe.punkt.koenig", {
      text:
        drohungen.length > 0
          ? t("ruhe.mattdrohung", { zuege: aufzaehlung(drohungen.map((d) => zugtext(d.zug.san))) })
          : t("ruhe.keineMattdrohung"),
    }),
    t("ruhe.punkt.zugfolge"),
    t("ruhe.punkt.bilanz", { material: mitVorzeichen(material(p, eigen)) }),
  ];
}

/** Die fünf Abwehrfragen zur stärksten gegnerischen Drohung (Kapitel 7, Schritt 3). */
function abwehrfragen(p: Stellungsprofil, eigen: Color, drohung: Drohung): string[] {
  const angreifer = drohung.zug.von;
  const ziel = drohung.zug.nach;
  const schlagen = (p.schlaegeVon(eigen) ?? []).filter((s) => s.nach === angreifer);
  const bedrohte = p.sichereFelder(eigen).find((f) => f.feld === ziel);
  const decker = p.angriffskarte.angreiferVon(ziel, eigen).length;
  const eigeneDrohungen = (p.drohungen(eigen) ?? []).slice(0, HOECHSTENS);
  const eigeneSchachs = (p.schachsVon(eigen) ?? []).slice(0, HOECHSTENS);
  return [
    t("ruhe.abwehr.schlagen", {
      text:
        schlagen.length > 0
          ? t("ruhe.abwehr.schlagenJa", {
              zuege: aufzaehlung(schlagen.map((s) => `${zugtext(s.san)} (${schlagtext(s)})`)),
            })
          : t("ruhe.abwehr.schlagenNein", { figur: feldname(angreifer) }),
    }),
    t("ruhe.abwehr.wegziehen", {
      text:
        bedrohte && drohung.art === "material"
          ? bedrohte.sichere.length > 0
            ? t("ruhe.abwehr.wegziehenJa", { felder: felderText(bedrohte.sichere) })
            : t("ruhe.abwehr.wegziehenNein")
          : t("ruhe.abwehr.wegziehenKoenig"),
    }),
    tZahl("ruhe.abwehr.decken", decker, { anzahl: decker, feld: feldname(ziel) }),
    t("ruhe.abwehr.dazwischen"),
    t("ruhe.abwehr.gegendrohung", {
      text:
        eigeneDrohungen.length > 0
          ? t("ruhe.abwehr.gegendrohungJa", {
              zuege: aufzaehlung(eigeneDrohungen.map((d) => zugtext(d.zug.san))),
            })
          : eigeneSchachs.length > 0
            ? t("ruhe.abwehr.gegendrohungSchach", {
                zuege: aufzaehlung(eigeneSchachs.map((s) => zugtext(s.san))),
              })
            : t("ruhe.abwehr.gegendrohungNein"),
    }),
  ];
}

/** Die stärkste gegnerische Drohung: Matt vor Material, dann die größte Bilanz. */
function staerksteDrohung(p: Stellungsprofil, feind: Color): Drohung | null {
  const alle = p.drohungen(feind) ?? [];
  const matt = alle.find((d) => d.art === "matt");
  if (matt) return matt;
  return (
    [...alle].sort(
      (a, b) =>
        (b.art === "material" ? b.zug.bilanz : 0) - (a.art === "material" ? a.zug.bilanz : 0),
    )[0] ?? null
  );
}

/** Rot die stärkste Drohung des Gegners als Pfeil. */
function markierungen(drohung: Drohung | null): Markierung[] {
  if (!drohung) return [];
  const von: Square = drohung.zug.von;
  return [{ typ: "pfeil", farbe: "rot", von: feldname(von), nach: feldname(drohung.zug.nach) }];
}

/**
 * Die Prüfpunkte am Ende der Rechnung und die Abwehrfragen (ohne Engine).
 *
 * Eingaben: Stellung, eigene Seite. Ausgabe: Prüfpunkte (N), Abwehrfragen zur stärksten
 * gegnerischen Drohung (N). Beispiel: Abb. 7.27 (Schwarz am Zug): Weiß droht Td8+ mit Matt; die
 * Abwehrfragen nennen die Gegendrohung De1+.
 */
export function ruhe(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const feind = gegner(eigen);
  const drohung = stellung.regeln?.isCheck() ? null : staerksteDrohung(p, feind);
  const befunde: Befund[] = [
    {
      kennung: "punkte",
      art: "N",
      titel: t("ruhe.punkteTitel"),
      zeilen: pruefpunkte(p, eigen),
      farbe: null,
    },
  ];
  if (drohung) {
    befunde.push({
      kennung: "abwehr",
      art: "N",
      titel: t("ruhe.abwehrTitel", {
        farbe: farbname(feind),
        drohung:
          drohung.art === "matt"
            ? t("ruhe.drohtMatt", { zug: zugtext(drohung.zug.san) })
            : t("ruhe.drohtMaterial", {
                zug: zugtext(drohung.zug.san),
                gewinn: schlagtext(drohung.zug),
              }),
      }),
      zeilen: abwehrfragen(p, eigen, drohung),
      farbe: "rot",
    });
  }
  return {
    werkzeug: "k7-ruhe",
    art: "N",
    ueberschrift: t("ruhe.titel"),
    befunde,
    fazit: drohung ? t("ruhe.fazitDrohung", { farbe: farbname(feind) }) : t("ruhe.fazit"),
    markierungen: markierungen(drohung),
    stufen: [["punkte"], ["punkte", "abwehr"], ["punkte", "abwehr"]],
    regel: t("werkzeug.k7-ruhe.regel"),
  };
}

/** Das Werkzeug k7-ruhe in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k7Ruhe: Werkzeug = {
  id: "k7-ruhe",
  kapitel: 7,
  name: "werkzeug.k7-ruhe.name",
  regel: "werkzeug.k7-ruhe.regel",
  erklaerung: "werkzeug.k7-ruhe.erklaerung",
  art: "N",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => ruhe(stellung, perspektive),
};
