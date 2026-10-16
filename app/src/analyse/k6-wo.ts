/**
 * Werkzeug k6-wo: Planfrage 1, „Wo spiele ich?“. Zentrum und Könige, die fünf Lagen der Tabelle
 * in Kapitel 6 von oben nach unten, Bauernzüge bis zum ersten Hebel bei entgegengesetzten
 * Rochaden, die drei Bedingungen für den Königsangriff bei gleichseitiger Rochade.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Gold: eigener Sturm. Rot: gegnerischer Sturm. Grau:
 * Zielfeld im Bauernschild. Zählung E, Bedingungen N.“).
 * Abhängigkeiten: planlage.ts, planfragen.ts, i18n.
 * Buchbezug: Kapitel 6, „Frage 1: Wo spiele ich?“ (Abb. 6.2 bis 6.11).
 */
import type { Color } from "chessops/types";
import { t } from "../i18n/sprache";
import { feldname, type Stellung } from "../schach/stellung";
import { planlage, type Lage, type Planlage } from "./planlage";
import { gegenschlagtext, sturmtext, unruhigesErgebnis, woText } from "./planfragen";
import { felderText, fluegelname, linienname } from "./skelett";
import { profil } from "./stellungsprofil";
import { aufzaehlung, farbname } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Zeilen zu Zentrum und Königen (die drei Dinge, von denen die Antwort abhängt). */
function lagezeilen(l: Planlage): string[] {
  const verkeilt = l.typ.verkeilt.map((v) => `${feldname(v.weiss)}/${feldname(v.schwarz)}`);
  const zentrum = t("wo.zentrum", {
    typ: t(`figuren.typname.${l.typ.typ}`),
    verkeilt: verkeilt.length > 0 ? t("wo.verkeilt", { paare: verkeilt.join(", ") }) : "",
  });
  const { eigen, gegner: seiner, art } = l.koenige;
  const koenige =
    eigen && seiner
      ? t(`wo.koenige.${art}`, { eigen: feldname(eigen.koenig), gegner: feldname(seiner.koenig) })
      : t("wo.koenige.keine");
  return [zentrum, koenige];
}

/** Zeile zur Lage 1 (geschlossen) oder 2 (offen). */
function zentrumslage(l: Planlage, lage: Lage): string {
  if (lage === "geschlossen") {
    return l.kette?.zeigtNach
      ? t("wo.lage.geschlossen", {
          kette: l.kette.kette.glieder.map(feldname).join("–"),
          fluegel: fluegelname(l.kette.zeigtNach),
        })
      : t("wo.lage.geschlossenOhneKette");
  }
  const z = l.zentrumshebel[0];
  return t("wo.lage.offen", {
    hebel: z ? gegenschlagtext(z, "wo.gegenschlag") : t("wo.gegenschlagKeiner"),
  });
}

/** Zeilen zur Lage 3: Wer öffnet zuerst? */
function sturmzeilen(l: Planlage): string[] {
  const zeilen = [
    l.sturm.eigen
      ? t("wo.sturm.eigen", { sturm: sturmtext(l.sturm.eigen) })
      : t("wo.sturm.eigenKeiner"),
    l.sturm.gegner
      ? t("wo.sturm.gegner", { sturm: sturmtext(l.sturm.gegner) })
      : t("wo.sturm.gegnerKeiner"),
  ];
  if (l.linienZumKoenig.length > 0)
    zeilen.push(t("wo.sturm.linien", { linien: aufzaehlung(l.linienZumKoenig.map(linienname)) }));
  return zeilen;
}

/** Zeilen zur Lage 4: die drei Bedingungen als Checkliste. */
function bedingungszeilen(l: Planlage): string[] {
  const b = l.bedingungen;
  if (!b) return [];
  const ja = (erfuellt: boolean) => t(erfuellt ? "wo.ja" : "wo.nein");
  const sektor = b.sektor;
  const ziel = b.ziele[0];
  return [
    t("wo.bedingung.zentrum", { wertung: ja(b.zentrumFest) }),
    t("wo.bedingung.uebermacht", {
      wertung: ja(b.uebermacht),
      angreifer: sektor?.angreiferListe.length ?? 0,
      verteidiger: sektor?.verteidiger.length ?? 0,
    }),
    t("wo.bedingung.ziel", {
      wertung: ja(b.ziele.length > 0 || b.haken.length > 0),
      text: ziel
        ? t("wo.ziel.nurKoenig", {
            feld: feldname(ziel.feld),
            angreifer: felderText(ziel.angreifer),
          })
        : b.haken.length > 0
          ? t("wo.ziel.haken", { felder: felderText(b.haken) })
          : t("wo.ziel.keins"),
    }),
  ];
}

/** Zeilen zur Lage 5: gegen die Schwäche. */
function schwaechezeilen(l: Planlage): string[] {
  const fixierte = l.schwaechen.filter((s) => s.fixiert);
  if (fixierte.length === 0) {
    return [
      l.minderheit
        ? t(`wo.schwaeche.${l.minderheit.art}`, { fluegel: fluegelname(l.minderheit.fluegel) })
        : t("wo.schwaeche.keine"),
    ];
  }
  return fixierte.map((s) =>
    t("wo.schwaeche.fixiert", {
      feld: feldname(s.feld),
      grund:
        s.bewacher !== null
          ? t("wo.schwaeche.bewacht", { bauer: feldname(s.bewacher) })
          : t("wo.schwaeche.besetzt"),
    }),
  );
}

function lagebefund(l: Planlage, lage: Lage): Befund {
  const zeilen =
    lage === "geschlossen" || lage === "offen"
      ? [zentrumslage(l, lage)]
      : lage === "verschiedeneFluegel"
        ? sturmzeilen(l)
        : lage === "gleicherFluegel"
          ? bedingungszeilen(l)
          : schwaechezeilen(l);
  const art = lage === "gleicherFluegel" ? "N" : "E";
  return { kennung: lage, art, titel: t(`wo.lagename.${lage}`), zeilen, farbe: null };
}

/** Gold der eigene Sturm oder Hebel, Rot der gegnerische Sturm, Grau Zielfelder im Bauernschild. */
function markierungen(l: Planlage): Markierung[] {
  const liste: Markierung[] = [];
  const pfeil = (von: number, nach: number, farbe: "gold" | "rot"): Markierung => ({
    typ: "pfeil",
    farbe,
    von: feldname(von),
    nach: feldname(nach),
  });
  if (l.lagen.includes("verschiedeneFluegel")) {
    if (l.sturm.eigen) liste.push(pfeil(l.sturm.eigen.bauer, l.sturm.eigen.ziel, "gold"));
    if (l.sturm.gegner) liste.push(pfeil(l.sturm.gegner.bauer, l.sturm.gegner.ziel, "rot"));
  }
  for (const h of l.hebelBasis) liste.push(pfeil(h.von, h.nach, "gold"));
  if (l.antwort.art === "zentrum")
    for (const z of l.zentrumshebel) liste.push(pfeil(z.hebel.von, z.hebel.nach, "gold"));
  for (const z of l.bedingungen?.ziele ?? [])
    liste.push({ typ: "feld", farbe: "grau", feld: feldname(z.feld) });
  for (const s of l.schwaechen.filter((x) => x.fixiert))
    liste.push({ typ: "feld", farbe: "gold", feld: feldname(s.feld) });
  return liste;
}

/**
 * Beantwortet Planfrage 1 für die eigene Seite.
 *
 * Eingaben: Stellung, eigene Seite. Ausgabe: Lage (Zentrum, Könige), je zutreffender Lage ein
 * Befund, Fazit mit dem Ort. Beispiele: Abb. 6.2: „Weiß spielt am Damenflügel“; Abb. 6.6: Weiß
 * 2 Züge, Schwarz 3; Abb. 6.7: alle drei Bedingungen, Ziel h7; Abb. 6.10: gegen c6.
 * Sonderfall: Steht die Seite am Zug im Schach oder hängt ihre Dame, nur der Hinweis (Abb. 6.32).
 */
export function wo(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const unruhig = unruhigesErgebnis(p, "k6-wo", t("wo.titel"), "E");
  if (unruhig) return unruhig;
  const l = planlage(p, eigen);
  const befunde: Befund[] = [
    { kennung: "lage", art: "E", titel: t("wo.lageTitel"), zeilen: lagezeilen(l), farbe: null },
    ...l.lagen.map((lage) => lagebefund(l, lage)),
  ];
  const kennungen = befunde.map((b) => b.kennung);
  return {
    werkzeug: "k6-wo",
    art: "E",
    ueberschrift: t("wo.titel"),
    befunde,
    fazit: t("wo.fazit", { farbe: farbname(eigen), antwort: woText(l) }),
    markierungen: markierungen(l),
    stufen: [kennungen.slice(0, 2), kennungen, kennungen],
    regel: t("werkzeug.k6-wo.regel"),
  };
}

/** Das Werkzeug k6-wo in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k6Wo: Werkzeug = {
  id: "k6-wo",
  kapitel: 6,
  name: "werkzeug.k6-wo.name",
  regel: "werkzeug.k6-wo.regel",
  erklaerung: "werkzeug.k6-wo.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => wo(stellung, perspektive),
};
