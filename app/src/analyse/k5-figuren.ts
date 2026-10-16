/**
 * Werkzeug k5-figuren: Leitfrage 4 des Skelett-Röntgens. Stellungstyp, gute und schlechte Läufer,
 * Zielfelder für Springer und Türme, Tauschfrage.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Stellungstyp (offen, halboffen, geschlossen, beweglich),
 * guter und schlechter Läufer nach Zahl der eigenen Bauern auf seiner Feldfarbe, Zielfelder für
 * Springer und Türme. Rot: schlechter Läufer. Gold: Zielfelder.“) mit den Regeln aus 6.6.
 * Abhängigkeiten: analyse/skelett.ts (schach/skelettfiguren.ts), i18n.
 * Buchbezug: Kapitel 5, „Leitfrage 4: Figuren“ (Abb. 5.35 bis 5.43); kalibriert an den
 * Figuren-Zeilen der Skelettbilanzen.
 */
import type { Color } from "chessops/types";
import { t } from "../i18n/sprache";
import {
  stellungstyp,
  type Figurenbefund,
  type Laeuferbefund,
  type Stellungstyp,
} from "../schach/skelettfiguren";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { felderText, figurenFuer, linienname, richtungFuer } from "./skelett";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { farbname } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

function laeuferzeile(l: Laeuferbefund): string {
  const grund =
    l.aufSeinerFarbe.length > 0 || l.aufAndererFarbe.length > 0
      ? t("figuren.laeuferGrund", {
          eigene: l.aufSeinerFarbe.length > 0 ? felderText(l.aufSeinerFarbe) : t("figuren.keine"),
          farbe: t(`figuren.feldfarbe.${l.feldfarbe}`),
          andere: l.aufAndererFarbe.length,
        })
      : t("figuren.laeuferOhne");
  const aktiv = l.wertung === "schlecht" && l.vorDerKette;
  return t("figuren.laeufer", {
    feld: feldname(l.laeufer.feld),
    wertung: t(aktiv ? "figuren.wertung.schlechtAberAktiv" : `figuren.wertung.${l.wertung}`),
    grund,
    passiv: l.passiv ? t("figuren.passiv") : "",
  });
}

function zielzeilen(f: Figurenbefund): string[] {
  const springer =
    f.springerfelder.length > 0
      ? t("figuren.springer", { felder: felderText(f.springerfelder) })
      : t("figuren.springerKeine");
  const tuerme =
    f.turmlinien.length > 0
      ? t("figuren.tuerme", {
          linien: f.turmlinien
            .map((l) =>
              l.offen
                ? t("figuren.linieOffen", { linie: linienname(l.linie) })
                : t("figuren.linieHalboffen", {
                    linie: linienname(l.linie),
                    ziel: l.ziel === null ? "" : feldname(l.ziel),
                  }),
            )
            .join(", "),
        })
      : t("figuren.tuermeKeine");
  return [springer, tuerme];
}

/** Tauschfrage: Wer die Schwäche hat, behält Figuren; wer mehr Raum hat, meidet den Abtausch. */
function tauschzeilen(p: Stellungsprofil, farbe: Color, f: Figurenbefund): string[] {
  const zeilen: string[] = [];
  if (f.eigeneSchwaechen.length > 0)
    zeilen.push(t("figuren.tausch.eigene", { felder: felderText(f.eigeneSchwaechen) }));
  if (f.gegnerSchwaechen.length > 0)
    zeilen.push(t("figuren.tausch.gegner", { felder: felderText(f.gegnerSchwaechen) }));
  const mein = richtungFuer(p, farbe).raum.genommen.length;
  const sein = richtungFuer(p, gegner(farbe)).raum.genommen.length;
  if (mein > sein) zeilen.push(t("figuren.tausch.mehrRaum"));
  else if (mein < sein) zeilen.push(t("figuren.tausch.wenigerRaum"));
  return zeilen.length > 0 ? zeilen : [t("figuren.tausch.offen")];
}

function befundFuer(p: Stellungsprofil, farbe: Color): { befund: Befund; f: Figurenbefund } {
  const f = figurenFuer(p, farbe);
  const zeilen = [
    ...(f.laeufer.length > 0 ? f.laeufer.map(laeuferzeile) : [t("figuren.keinLaeufer")]),
    ...zielzeilen(f),
    ...tauschzeilen(p, farbe, f),
  ];
  return { befund: { kennung: farbe, art: "E", titel: farbname(farbe), zeilen, farbe: null }, f };
}

function typbefund(typ: Stellungstyp, befund: ReturnType<typeof stellungstyp>): Befund {
  const zeilen = [t(`figuren.typtext.${typ}`)];
  if (befund.verkeilt.length > 0) {
    zeilen.push(
      t("figuren.verkeilt", {
        paare: befund.verkeilt.map((v) => `${feldname(v.weiss)}/${feldname(v.schwarz)}`).join(", "),
      }),
    );
  }
  if (befund.duo)
    zeilen.push(
      t("figuren.duo", {
        farbe: farbname(befund.duo.farbe),
        felder: felderText(befund.duo.felder),
      }),
    );
  return {
    kennung: "typ",
    art: "E",
    titel: t("figuren.typ", { typ: t(`figuren.typname.${typ}`) }),
    zeilen,
    farbe: null,
  };
}

/**
 * Rot die schlechten Läufer, Gold die Zielfelder der Springer und ein farblich schlechter Läufer,
 * der aktiv vor der eigenen Kette steht (Abb. 5.40: „Gold: Der Läufer f4 steht vor der Pyramide“).
 */
function markierungen(f: Figurenbefund): Markierung[] {
  return [
    ...f.laeufer
      .filter((l) => l.wertung === "schlecht")
      .map((l): Markierung => ({
        typ: "feld",
        farbe: l.vorDerKette ? "gold" : "rot",
        feld: feldname(l.laeufer.feld),
      })),
    ...f.springerfelder.map((s): Markierung => ({ typ: "feld", farbe: "gold", feld: feldname(s) })),
  ];
}

/**
 * Beantwortet Leitfrage 4 für beide Seiten.
 *
 * Warum: „Welche Figuren passen zu diesem Skelett – und was tausche ich?“ (Kapitel 5).
 * Eingaben: Stellung, eigene Seite. Ausgabe: Stellungstyp und ein Befund je Seite.
 * Beispiel: Abb. 5.43 (London): „Läufer d3: gut“, „Läufer d7: schlecht“; Abb. 5.37: offen.
 */
export function figuren(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const typ = stellungstyp(stellung.brett);
  const mein = befundFuer(p, eigen);
  const sein = befundFuer(p, gegner(eigen));
  return {
    werkzeug: "k5-figuren",
    art: "E",
    ueberschrift: t("figuren.titel"),
    befunde: [typbefund(typ.typ, typ), mein.befund, sein.befund],
    fazit: t("figuren.fazit", {
      typ: t(`figuren.typname.${typ.typ}`),
      satz: t(`figuren.typsatz.${typ.typ}`),
    }),
    markierungen: markierungen(mein.f),
    stufen: [
      ["typ", eigen],
      ["typ", eigen, gegner(eigen)],
      ["typ", eigen, gegner(eigen)],
    ],
    regel: t("werkzeug.k5-figuren.regel"),
  };
}

/** Das Werkzeug k5-figuren in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k5Figuren: Werkzeug = {
  id: "k5-figuren",
  kapitel: 5,
  name: "werkzeug.k5-figuren.name",
  regel: "werkzeug.k5-figuren.regel",
  erklaerung: "werkzeug.k5-figuren.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => figuren(stellung, perspektive),
};
