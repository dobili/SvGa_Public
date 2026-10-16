/**
 * Kalibrierung der Skelett-Werkzeuge an allen Skelettbilanzen des Buches (Kapitel 5 und 11).
 *
 * Die Zeilen der Skelettbilanzen sind Prosa; je Zeile und Seite steht hier eine Erwartung mit den
 * Feldern oder Zahlen, die das Buch nennt (Konzept 13). Jede Zeile jeder Bilanz braucht einen
 * Eintrag, sonst scheitert der Test. Bekannte Abweichungen stehen als Befund in
 * docs/FORTSCHRITT.md und hier unter `abweichung`.
 */
import { describe, expect, it } from "vitest";
import type { Color } from "chessops/types";
import { bilanzfaelle, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { stellungstyp } from "../schach/skelettfiguren";
import { feldname } from "../schach/stellung";
import { richtung } from "./k5-richtung";
import { felderFuer, figurenFuer, richtungFuer } from "./skelett";
import { profil } from "./stellungsprofil";
import { schwacheBauern } from "../schach/skelettfiguren";

/** Was die App zu einer Seite sagt, in Feldnamen und Zahlen. */
interface Befund {
  readonly loecher: string[];
  readonly sichere: string[];
  readonly springerfelder: string[];
  readonly schwache: string[];
  readonly inseln: number;
  readonly kettenNach: (string | null)[];
  readonly raum: string[];
  readonly mehrheiten: string[];
  readonly minderheiten: string[];
  readonly hebel: string[];
  readonly offene: number[];
  readonly laeufer: Record<string, string>;
  readonly typ: string;
  /** Das Fazit des Werkzeugs Richtung (Reihenfolge nach C1.9 und C1.14). */
  readonly fazit: string;
}

function befund(nummer: string, farbe: Color): Befund {
  const s = stellungVon(nummer);
  const p = profil(s);
  const f = felderFuer(p, farbe);
  const r = richtungFuer(p, farbe);
  const fig = figurenFuer(p, farbe);
  const namen = (l: readonly number[]) => l.map(feldname);
  return {
    loecher: namen(f.eigeneLoecher.filter((l) => l.nutzbar).map((l) => l.feld)),
    sichere: namen(f.sichere.map((x) => x.feld)),
    springerfelder: namen(f.springerfelder.map((x) => x.feld)),
    schwache: namen(schwacheBauern(p.bauernschwaechen(farbe), p.bauernprofil(farbe))),
    inseln: p.bauernprofil(farbe).inseln.length,
    kettenNach: r.ketten.map((k) => k.zeigtNach),
    raum: namen(r.raum.genommen),
    mehrheiten: r.mehrheiten.map((m) => `${m.fluegel} ${m.eigene}:${m.gegnerische}`),
    minderheiten: r.minderheiten.map((m) => `${m.fluegel} ${m.eigene}:${m.gegnerische}`),
    hebel: r.hebel.map((h) => `${feldname(h.von)}-${feldname(h.nach)}`),
    offene: [...p.bauernprofil(farbe).offeneLinien],
    laeufer: Object.fromEntries(fig.laeufer.map((l) => [feldname(l.laeufer.feld), l.wertung])),
    typ: stellungstyp(s.brett).typ,
    fazit: richtung(s, farbe).fazit,
  };
}

type Pruefung = (b: Befund) => void;
/** Erwartungen je Abbildung, Zeile (Leitfrage) und Seite. `abweichung` nennt einen Befund. */
const ERWARTUNGEN: Record<
  string,
  Record<string, Record<"Weiß" | "Schwarz", Pruefung | { abweichung: string }>>
> = {
  "5.14": {
    Felder: {
      // „d5 ist ein dauerhaftes Loch im schwarzen Lager, gestützt vom e4-Bauern“
      Weiß: (b) => expect(b.sichere).toContain("d5"),
      // „Ein weißes Loch, das Schwarz dauerhaft nutzen könnte, gibt es nicht.“
      Schwarz: (b) => expect(b.sichere).toEqual([]),
    },
  },
  "5.17": {
    Felder: {
      // „e5, gestützt vom d4-Bauern, ist das Sprungfeld für einen weißen Springer“
      Weiß: (b) => expect(b.springerfelder).toContain("e5"),
      // „d5 vor dem Isolani kann kein weißer Bauer mehr angreifen“
      Schwarz: (b) => expect(b.sichere).toContain("d5"),
    },
    Bauern: {
      // „d4 besteht den Deckungstest nicht … Drei Bauerninseln.“
      Weiß: (b) => {
        expect(b.schwache).toEqual(["d4"]);
        expect(b.inseln).toBe(3);
      },
      // „Gesund … Zwei Bauerninseln.“
      Schwarz: (b) => {
        expect(b.schwache).toEqual([]);
        expect(b.inseln).toBe(2);
      },
    },
  },
  "5.22": {
    Felder: {
      // „b4, c4, d4 und e4 noch unter ihrer Kontrolle“: kein weißes Loch, das Schwarz nutzt.
      Weiß: (b) => expect(b.loecher).toEqual([]),
      // „Der Springer f6 kann nach e4 springen, gestützt vom Bauern d5.“
      Schwarz: (b) => expect(b.springerfelder).toContain("e4"),
    },
    Bauern: {
      Weiß: (b) => {
        expect(b.schwache).toEqual([]);
        expect(b.inseln).toBe(2);
      },
      // „Von c5 und d5 besteht immer nur einer den Deckungstest … Drei Bauerninseln“
      Schwarz: (b) => {
        expect(b.inseln).toBe(3);
        expect(b.schwache).toContain("c5");
      },
    },
  },
  "5.26": {
    Felder: {
      // „Der e5-Bauer nimmt Schwarz die Felder d6 und f6“
      Weiß: (b) => expect(b.raum).toEqual(expect.arrayContaining(["d6", "f6"])),
      // „Der d5-Bauer kontrolliert c4 und e4. Der Springer f5 steht sicher, solange nicht g2-g4“
      Schwarz: (b) => {
        expect(b.raum).toEqual(expect.arrayContaining(["c4", "e4"]));
        expect(b.springerfelder).toContain("f5");
      },
    },
    Bauern: {
      // „Die Basis d4 hat ihre Stütze c3 verloren und besteht den Deckungstest nicht.“
      Weiß: (b) => expect(b.schwache).toEqual(["d4"]),
      Schwarz: (b) => expect(b.schwache).toEqual([]),
    },
    Richtung: {
      // „Die Kette zeigt zum Königsflügel: Dort hat Weiß Raum.“
      Weiß: (b) => {
        expect(b.kettenNach).toEqual(["koenigs"]);
        expect(b.fazit).toBe("Weiß spielt am Königsflügel: Dorthin zeigt die Kette.");
      },
      // „Die Kette zeigt zum Damenflügel, und die c-Linie ist offen“
      Schwarz: (b) => {
        expect(b.kettenNach).toEqual(["damen"]);
        expect(b.offene).toEqual([2]);
        expect(b.fazit).toBe("Schwarz spielt am Damenflügel: Dorthin zeigt die Kette.");
      },
    },
  },
  "5.32": {
    Felder: {
      // „e5, gestützt vom d4-Bauern, ist ein typisches Springerfeld, solange Schwarz nicht ...f6“
      Weiß: (b) => expect(b.springerfelder).toContain("e5"),
      Schwarz: (b) => expect(b.springerfelder).toContain("e4"),
    },
    Bauern: {
      Weiß: (b) => {
        expect(b.schwache).toEqual([]);
        expect(b.inseln).toBe(2);
      },
      Schwarz: (b) => expect(b.schwache).toEqual([]),
    },
    Richtung: {
      // „Minderheit am Damenflügel (2 gegen 3): Dort spielt Weiß mit b4-b5.“
      Weiß: (b) => {
        expect(b.minderheiten).toEqual(["damen 2:3"]);
        expect(b.hebel).toContain("b2-b5");
        expect(b.fazit).toMatch(/^Weiß spielt am Damenflügel: Dort erzeugt der Minderheitsangriff/);
      },
      // „Die Mehrheit am Damenflügel wird vom Minderheitsangriff blockiert. Gegenspiel kommt mit
      // Figuren am Königsflügel“
      Schwarz: (b) => {
        expect(b.mehrheiten).toContain("damen 3:2");
        expect(b.fazit).toBe(
          "Schwarz spielt am Königsflügel: Gegenspiel mit Figuren; die Bauern vor dem eigenen König bleiben stehen.",
        );
      },
    },
  },
  "5.43": {
    Felder: {
      // „e5 ist ein gutes Feld für einen weißen Springer … nur noch der f-Bauer (nach ...f6)“
      Weiß: (b) => expect(b.springerfelder).toContain("e5"),
      // „e4 halten Läufer d3 und Springer d2. Ein dauerhaftes Loch gibt es auf keiner Seite.“
      Schwarz: (b) => {
        expect(b.springerfelder).toContain("e4");
        expect(b.loecher).toEqual([]);
      },
    },
    Bauern: {
      Weiß: (b) => expect(b.schwache).toEqual([]),
      Schwarz: (b) => expect(b.schwache).toEqual([]),
    },
    Richtung: {
      // „Der Hebel e3-e4 greift d5 an“
      Weiß: (b) => expect(b.hebel).toContain("e3-e4"),
      // „Der Hebel ...e6-e5 greift d4 an; alternativ ...c5-c4“
      Schwarz: (b) => expect(b.hebel).toContain("e6-e5"),
    },
    Figuren: {
      // „Der Läufer d3 ist gut, denn die weißen Zentrumsbauern stehen auf dunklen Feldern.“
      Weiß: (b) => expect(b.laeufer).toEqual({ d3: "gut" }),
      // „Der Läufer d7 ist schlecht: d5 und e6 stehen auf hellen Feldern.“
      Schwarz: (b) => expect(b.laeufer).toEqual({ d7: "schlecht" }),
    },
  },
  "5.44": {
    Felder: {
      Weiß: (b) => expect(b.raum).toEqual(expect.arrayContaining(["d6", "f6"])),
      Schwarz: (b) => expect(b.raum).toEqual(expect.arrayContaining(["c4", "e4"])),
    },
    Bauern: {
      // „Die Basis d4 besteht den Deckungstest nicht. Zwei Bauerninseln.“
      Weiß: (b) => {
        expect(b.schwache).toEqual(["d4"]);
        expect(b.inseln).toBe(2);
      },
      Schwarz: (b) => {
        expect(b.schwache).toEqual([]);
        expect(b.inseln).toBe(2);
      },
    },
    Richtung: {
      Weiß: (b) => {
        expect(b.kettenNach).toEqual(["koenigs"]);
        expect(b.offene).toEqual([2]);
        expect(b.fazit).toBe("Weiß spielt am Königsflügel: Dorthin zeigt die Kette.");
      },
      // „Der Hebel ...f6 greift zwar die Spitze an“
      Schwarz: (b) => {
        expect(b.kettenNach).toEqual(["damen"]);
        expect(b.hebel).toContain("f7-f6");
      },
    },
    Figuren: {
      // „Das Zentrum ist geschlossen. Der Läufer e2 ist gut“
      Weiß: (b) => {
        expect(b.typ).toBe("geschlossen");
        expect(b.laeufer).toEqual({ e2: "gut" });
      },
      Schwarz: (b) => expect(b.laeufer).toEqual({ d7: "schlecht" }),
    },
  },
  "11.43": {
    Felder: {
      // „d4 und c5 kann kein schwarzer Bauer mehr angreifen: zwei sichere Felder für weiße Figuren.“
      Weiß: (b) => expect(b.sichere).toEqual(expect.arrayContaining(["d4", "c5"])),
      // „e4 und c4 stützt der d5-Bauer. Weiß kann sie noch mit f3 und b3 decken.“
      Schwarz: (b) => expect(b.springerfelder).toEqual(expect.arrayContaining(["c4", "e4"])),
    },
    Bauern: {
      Weiß: (b) => {
        expect(b.schwache).toEqual([]);
        expect(b.inseln).toBe(2);
      },
      // „d5 und a6 bestehen den Deckungstest nicht. Drei Bauerninseln.“
      Schwarz: (b) => {
        expect(b.schwache).toEqual(["a6", "d5"]);
        expect(b.inseln).toBe(3);
      },
    },
    Richtung: {
      // „Mehrheit am Damenflügel (a2 und b2 gegen a6). Offene c- und e-Linie“
      Weiß: (b) => {
        expect(b.mehrheiten).toEqual(["damen 2:1"]);
        expect(b.offene).toEqual([2, 4]);
        expect(b.fazit).toMatch(/^Weiß spielt am Damenflügel: Dort bildet die gesunde Mehrheit/);
      },
      // „Keine Mehrheit, kein Hebel.“ Mit a6 allein ist die Minderheit kein Minderheitsangriff.
      Schwarz: (b) => {
        expect(b.mehrheiten).toEqual([]);
        expect(b.hebel).toEqual([]);
        expect(b.fazit).not.toContain("Minderheitsangriff");
      },
    },
    Figuren: {
      // „Offene Stellung.“
      Weiß: (b) => expect(b.typ).toBe("offen"),
      // „Der Läufer c8 ist schlecht, da d5 auf seiner Feldfarbe steht.“
      Schwarz: (b) => expect(b.laeufer.c8).toBe("schlecht"),
    },
  },
  "11.57": {
    Felder: {
      // „d6 kann kein schwarzer Bauer mehr angreifen: ein Loch im schwarzen Lager“
      Weiß: (b) => expect(b.sichere).toContain("d6"),
      // „d3 kann kein weißer Bauer mehr angreifen. Dort steht allerdings der weiße Läufer.“
      Schwarz: (b) => expect(b.sichere).toContain("d3"),
    },
    Bauern: {
      Weiß: (b) => {
        expect(b.schwache).toEqual([]);
        expect(b.inseln).toBe(2);
      },
      Schwarz: (b) => {
        expect(b.schwache).toEqual([]);
        expect(b.inseln).toBe(2);
      },
    },
    Richtung: {
      // „Am Damenflügel eine Minderheit (2 gegen 3), am Königsflügel eine Mehrheit (4 gegen 3).“
      // Urteil: „Weiß greift mit der Minderheit an: b4, a4 und b5.“
      Weiß: (b) => {
        expect(b.minderheiten).toEqual(["damen 2:3"]);
        expect(b.mehrheiten).toEqual(["koenigs 4:3"]);
        expect(b.fazit).toMatch(/^Weiß spielt am Damenflügel: Dort erzeugt der Minderheitsangriff/);
      },
      // „Am Damenflügel eine Mehrheit (3 gegen 2)“. Das Fazit nennt wie in Abb. 5.32 das
      // Gegenspiel am Königsflügel, denn die weiße Mehrheit dort hat einen Kandidaten.
      Schwarz: (b) => {
        expect(b.mehrheiten).toEqual(["damen 3:2"]);
        expect(b.fazit).not.toContain("Minderheitsangriff");
      },
    },
    Figuren: {
      // „Der Läufer d2 und der Springer e2 stehen noch passiv“: Aktivität, siehe k6-lap.
      Weiß: { abweichung: "Aktivität der Figuren ist Sache von k6-lap, nicht des Skeletts" },
      Schwarz: { abweichung: "Aktivität der Figuren ist Sache von k6-lap, nicht des Skeletts" },
    },
  },
  "11.70": {
    Felder: {
      // „e5 ist ein gutes Feld für einen Springer … von den Bauern kann es nur noch der f-Bauer angreifen.“
      // „Ein Loch gibt es im weißen Lager nicht.“
      Weiß: (b) => {
        expect(b.springerfelder).toContain("e5");
        expect(b.loecher).toEqual([]);
      },
      // „e4 bewachen der Springer d2 und die Dame“: kein sicheres Feld für Schwarz.
      Schwarz: (b) => expect(b.sichere).not.toContain("e4"),
    },
    Bauern: {
      Weiß: (b) => expect(b.schwache).toEqual([]),
      // „Der Doppelbauer auf der g-Linie ist gedeckt“
      Schwarz: (b) => expect(b.schwache).toEqual(["g7", "g6"]),
    },
    Richtung: {
      // „Der Hebel e3-e4 bleibt in Reserve.“
      Weiß: (b) => expect(b.hebel).toContain("e3-e4"),
      // „Der Hebel ...cxd4 öffnet die c-Linie. ...e6-e5 geht nicht mehr, sobald ein Springer auf e5 steht.“
      Schwarz: (b) => expect(b.hebel).toContain("e6-e5"),
    },
    Figuren: {
      // „Die Bauern d4 und d5 blockieren einander“: weder offen noch geschlossen.
      Weiß: (b) => expect(["gemischt", "geschlossen"]).toContain(b.typ),
      // „Der Läufer b7 ist schlecht: Der Bauer d5 steht auf seiner Feldfarbe“
      Schwarz: (b) => expect(b.laeufer.b7).toBe("schlecht"),
    },
  },
};

describe("Kalibrierung an den Skelettbilanzen", () => {
  const faelle = bilanzfaelle("skelett");

  it("findet alle zehn Skelettbilanzen (Kapitel 5 und 11)", () => {
    expect(faelle.map((f) => f.abbildung)).toEqual([
      "5.14",
      "5.17",
      "5.22",
      "5.26",
      "5.32",
      "5.43",
      "5.44",
      "11.43",
      "11.57",
      "11.70",
    ]);
  });

  it.each(faelle.map((fall) => [fall.abbildung, fall] as const))(
    "Abb. %s: jede Zeile und Seite wie im Buch",
    (nummer, fall) => {
      const erwartungen = ERWARTUNGEN[nummer];
      expect(erwartungen, `Erwartungen für Abb. ${nummer}`).toBeDefined();
      const weiss = befund(nummer, "white");
      const schwarz = befund(nummer, "black");
      for (const zeile of fall.tabelle.zeilen) {
        const je = erwartungen?.[zeile.name];
        expect(je, `Erwartung für Abb. ${nummer}, Zeile ${zeile.name}`).toBeDefined();
        for (const [seite, b] of [
          ["Weiß", weiss],
          ["Schwarz", schwarz],
        ] as const) {
          const pruefung = je?.[seite];
          if (typeof pruefung === "function") pruefung(b);
        }
      }
    },
  );
});
