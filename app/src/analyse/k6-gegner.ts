/**
 * Werkzeug k6-gegner: Planfrage 2, „Was will mein Gegner?“. Sein Plan aus seiner Lage (Hebel,
 * Sturm), was er jetzt droht, was du sichern musst, und die fünf Verteidigungsmittel als
 * Checkliste. Was er spielen würde, wenn er jetzt am Zug wäre, rechnet die Engine in der Karte
 * GegnerKarte darunter (Nullzug).
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Die Engine zeigt, was der Gegner spielen würde, wenn
 * er jetzt am Zug wäre. Dazu die fünf Verteidigungsmittel als Checkliste. Rot: gegnerischer Plan
 * als Pfeil. Art N.“). Abhängigkeiten: planlage.ts, planfragen.ts, k1-angriffsregel.ts
 * (Angriffssektor), stellungsprofil.ts, i18n.
 * Buchbezug: Kapitel 6, „Frage 2: Was will mein Gegner?“ (Abb. 6.12: ...Lb4 verhindert 5. a3)
 * und „Wenn der Angriff schon läuft: die Verteidigungsmittel“ (Abb. 6.13 bis 6.15).
 */
import type { Color, Square } from "chessops/types";
import { t } from "../i18n/sprache";
import type { Drohung } from "../schach/drohungen";
import { feldname, FIGURENWERT, gegner, type Stellung } from "../schach/stellung";
import { sektorGegen } from "./k1-angriffsregel";
import { gegenschlagtext, gegnerText, sichernFelder, unruhigesErgebnis } from "./planfragen";
import { planlage, type Planlage } from "./planlage";
import { felderText, linienname } from "./skelett";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { aufzaehlung, farbname, figurenname, figurkurz, schlagtext, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Ab so vielen Angreifern im Sektor um den eigenen König „läuft der Angriff schon“ (Faustregel: drei). */
const ANGRIFF_LAEUFT_AB = 3;
/** So viele Drohungen des Gegners nennt die Karte höchstens. */
const HOECHSTENS_DROHUNGEN = 4;

function drohungstext(d: Drohung): string {
  if (d.art === "matt") return t("gegner.droht.matt", { zug: zugtext(d.zug.san) });
  return t("gegner.droht.material", { zug: zugtext(d.zug.san), gewinn: schlagtext(d.zug) });
}

/** Was der Gegner jetzt droht (Schach-Röntgen, Frage 3), oder der Hinweis auf das Schach. */
function drohungszeilen(p: Stellungsprofil, feind: Color): string[] {
  const drohungen = p.drohungen(feind);
  if (drohungen === null) return [t("gegner.droht.schach")];
  if (drohungen.length === 0) return [t("gegner.droht.nichts")];
  return drohungen.slice(0, HOECHSTENS_DROHUNGEN).map(drohungstext);
}

/** Mittel 1: eigene Figuren, die den Sektor um den eigenen König mit einem Zug erreichen. */
function heranholbare(p: Stellungsprofil, eigen: Color, sektorfelder: Iterable<Square>): string[] {
  const sektor = new Set(sektorfelder);
  return p
    .sichereFelder(eigen)
    .filter(
      (f) =>
        f.figur.role !== "king" &&
        f.figur.role !== "pawn" &&
        !sektor.has(f.feld) &&
        f.sichere.some((ziel) => sektor.has(ziel)),
    )
    .map((f) => figurkurz({ feld: f.feld, figur: f.figur }));
}

/** Materialstand der eigenen Seite in Bauerneinheiten (ohne Könige), positiv bei Mehrmaterial. */
function materialvorsprung(p: Stellungsprofil, eigen: Color): number {
  let summe = 0;
  for (const stand of p.angriffskarte.figuren(eigen)) summe += FIGURENWERT[stand.figur.role];
  for (const stand of p.angriffskarte.figuren(gegner(eigen)))
    summe -= FIGURENWERT[stand.figur.role];
  return summe;
}

/** Die fünf Verteidigungsmittel mit den Anhaltspunkten aus der Stellung (Kapitel 6). */
function mittelzeilen(
  p: Stellungsprofil,
  eigen: Color,
  eigene: Planlage,
  seine: Planlage,
): string[] {
  const feind = gegner(eigen);
  const sektor = sektorGegen(p, feind);
  const umgebung = p.koenigsumgebung(eigen);
  const linien = (umgebung?.linienZumKoenig ?? []).filter((l) => l.zustand !== "geschlossen");
  const ziele = seine.bedingungen?.ziele ?? [];
  const z = eigene.zentrumshebel[0];
  const angreifer = sektor?.angreiferListe ?? [];
  const dame = angreifer.find((a) => a.figur.role === "queen");
  const vorsprung = materialvorsprung(p, eigen);
  const helfer = sektor ? heranholbare(p, eigen, sektor.felder) : [];
  return [
    t("gegner.mittel.verteidiger", {
      text:
        helfer.length > 0
          ? t("gegner.mittel.verteidigerWer", { figuren: aufzaehlung(helfer) })
          : t("gegner.mittel.verteidigerKeine"),
    }),
    t("gegner.mittel.linie", {
      text:
        ziele.length > 0 || linien.length > 0
          ? t("gegner.mittel.linieWas", {
              felder: ziele.length > 0 ? felderText(ziele.map((x) => x.feld)) : t("gegner.keins"),
              linien:
                linien.length > 0
                  ? aufzaehlung(linien.map((l) => linienname(l.linie)))
                  : t("gegner.keine"),
            })
          : t("gegner.mittel.linieDicht"),
    }),
    t("gegner.mittel.zentrum", {
      text: z ? gegenschlagtext(z, "gegner.mittel.zentrumHebel") : t("gegner.mittel.zentrumKeiner"),
    }),
    t("gegner.mittel.tausch", {
      text:
        angreifer.length > 0
          ? t("gegner.mittel.tauschWen", {
              figuren: aufzaehlung(angreifer.map(figurkurz)),
              dame: dame ? t("gegner.mittel.tauschDame", { figur: figurenname(dame) }) : "",
            })
          : t("gegner.mittel.tauschKeine"),
    }),
    t("gegner.mittel.material", {
      text:
        vorsprung > 0
          ? t("gegner.mittel.materialVoraus", { anzahl: vorsprung })
          : t("gegner.mittel.materialNichts"),
    }),
  ];
}

/** Rot sein Hebel und sein Sturm (sein Plan als Pfeil), Gold der eigene Gegenschlag im Zentrum. */
function markierungen(seine: Planlage, eigene: Planlage): Markierung[] {
  const liste: Markierung[] = [];
  const pfeil = (von: Square, nach: Square, farbe: "rot" | "gold"): Markierung => ({
    typ: "pfeil",
    farbe,
    von: feldname(von),
    nach: feldname(nach),
  });
  for (const h of seine.hebelBasis) liste.push(pfeil(h.von, h.nach, "rot"));
  if (
    seine.sturm.eigen &&
    seine.antwort.art === "fluegel" &&
    seine.antwort.grund === "verschiedeneFluegel"
  )
    liste.push(pfeil(seine.sturm.eigen.bauer, seine.sturm.eigen.ziel, "rot"));
  const z = eigene.zentrumshebel[0];
  if (z) liste.push(pfeil(z.hebel.von, z.hebel.nach, "gold"));
  return liste;
}

/**
 * Beantwortet Planfrage 2 für die eigene Seite (ohne Engine).
 *
 * Eingaben: Stellung, eigene Seite. Ausgabe: sein Plan (N), was er jetzt droht (E), was du
 * sichern musst (N), die fünf Verteidigungsmittel (N). Beispiel: Abb. 6.20, Weiß: „Schwarz will
 * mit f7–f5 die Basis e4 angreifen“, „Sichern: e4“. Abb. 6.13, Schwarz: Weiß droht Lxh7+; Mittel:
 * Linie schließen (h7 deckt nur der König), Gegenschlag im Zentrum f7–f6 gegen e5.
 */
export function gegnerplan(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const unruhig = unruhigesErgebnis(p, "k6-gegner", t("gegner.titel"), "N");
  if (unruhig) return unruhig;
  const feind = gegner(eigen);
  const eigene = planlage(p, eigen);
  const seine = planlage(p, feind);
  const sichern = sichernFelder(eigene, seine);
  const angriffLaeuft = (sektorGegen(p, feind)?.angreiferListe.length ?? 0) >= ANGRIFF_LAEUFT_AB;
  const befunde: Befund[] = [
    {
      kennung: "plan",
      art: "N",
      titel: t("gegner.planTitel"),
      zeilen: [gegnerText(seine)],
      farbe: "rot",
    },
    {
      kennung: "droht",
      art: "E",
      titel: t("gegner.drohtTitel", { farbe: farbname(feind) }),
      zeilen: drohungszeilen(p, feind),
      farbe: null,
    },
    {
      kennung: "sichern",
      art: "N",
      titel: t("gegner.sichernTitel"),
      zeilen: [
        sichern.length > 0
          ? t("gegner.sichern", { felder: felderText(sichern) })
          : t("gegner.sichernNichts"),
        t("gegner.prophylaxe"),
      ],
      farbe: null,
    },
    {
      kennung: "mittel",
      art: "N",
      titel: t(angriffLaeuft ? "gegner.mittelTitelLaeuft" : "gegner.mittelTitel"),
      zeilen: mittelzeilen(p, eigen, eigene, seine),
      farbe: null,
    },
  ];
  return {
    werkzeug: "k6-gegner",
    art: "N",
    ueberschrift: t("gegner.titel"),
    befunde,
    fazit: t("gegner.fazit", {
      plan: gegnerText(seine),
      sichern: sichern.length > 0 ? t("gegner.fazitSichern", { felder: felderText(sichern) }) : "",
    }),
    markierungen: markierungen(seine, eigene),
    stufen: [
      ["plan", "droht"],
      ["plan", "droht", "sichern"],
      ["plan", "droht", "sichern", "mittel"],
    ],
    regel: t("werkzeug.k6-gegner.regel"),
  };
}

/** Das Werkzeug k6-gegner in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k6Gegner: Werkzeug = {
  id: "k6-gegner",
  kapitel: 6,
  name: "werkzeug.k6-gegner.name",
  regel: "werkzeug.k6-gegner.regel",
  erklaerung: "werkzeug.k6-gegner.erklaerung",
  art: "N",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => gegnerplan(stellung, perspektive),
};
