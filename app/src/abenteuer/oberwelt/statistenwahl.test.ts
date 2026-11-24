/**
 * Tests für statistenwahl.ts: Bild eines Statisten nach der Rolle (Kartenblick M05, 24.11.2026).
 * Die Probe statistenwahl.probe.json schreibt die Pipeline (statistenrolle.py --probe) aus echten
 * Szenen; stimmt die App damit überein, zeigen Vorschau und Spiel dasselbe Bild.
 */
import { describe, expect, it } from "vitest";
import probe from "./statistenwahl.probe.json";
import rollen from "./statistenrollen.json";
import {
  kennbild,
  NAH,
  statistengeschlecht,
  statistenrolle,
  streuwert,
  waehleStatistenbilder,
  type Statistenangabe,
} from "./statistenwahl";

/** Ein Statist ohne eigenes Bild auf einem Feld. */
function statist(name: string, x: number, y: number, mehr: Partial<Statistenangabe> = {}) {
  return { name, feld: { x, y }, tun: "", bild: null, rolle: null, sitzt: false, ...mehr };
}

const BAUHELM = "statist.arbeiter";

describe("statistenrolle", () => {
  it("findet die Rolle im Namen, das längste Wort gewinnt", () => {
    expect(statistenrolle("empfangsdame")).toBe("konzern");
    expect(statistenrolle("kantinenkoch")).toBe("koch");
    expect(statistenrolle("kellnerin")).toBe("service");
    expect(statistenrolle("kellner")).toBe("kellner");
    expect(statistenrolle("rentnerPicknick")).toBe("senior");
    expect(statistenrolle("rentnerinnen")).toBe("seniorin");
    expect(statistenrolle("stegbauer")).toBe("bau");
    expect(statistenrolle("bauer")).toBe("land");
    // Kinderwagen ist kein Kind, ein Radfahrer kein Fahrer in Arbeitskleidung.
    expect(statistenrolle("mutterMitKinderwagen")).toBe("alltag");
    expect(statistenrolle("radfahrer")).toBe("unterwegs");
  });

  it("sieht erst danach ins tun, sonst gilt der Alltag", () => {
    expect(statistenrolle("mundharmonika", "spielt leise Mundharmonika")).toBe("musik");
    expect(statistenrolle("zuschauer", "sitzt mit Kapuze am Klapptisch")).toBe("jugend");
    expect(statistenrolle("lena", "fotografiert das Wasserloch")).toBe("unterwegs");
    expect(statistenrolle("zuschauer", "schaut gebannt auf die Bretter")).toBe("alltag");
  });

  it("nimmt die Eigenschaft rolle vor allen Wörtern, eine unbekannte zählt nicht", () => {
    expect(statistenrolle("finn", "angelt Flaschen aus dem Becken")).toBe("wasser");
    expect(statistenrolle("finn", "angelt Flaschen aus dem Becken", "kind")).toBe("kind");
    expect(statistenrolle("passanten", "gehen vorbei", "historisch")).toBe("historisch");
    expect(statistenrolle("kellner", "", "gibtesnicht")).toBe("kellner");
  });
});

describe("statistengeschlecht und kennbild", () => {
  it("liest das Geschlecht am Kopf des Namens", () => {
    expect(statistengeschlecht("fotografin")).toBe("w");
    expect(statistengeschlecht("wanderinBeimEssen")).toBe("w");
    expect(statistengeschlecht("frauMitBesen")).toBe("w");
    expect(statistengeschlecht("alterHerr")).toBe("m");
    expect(statistengeschlecht("zuschauer")).toBe("m");
    expect(statistengeschlecht("kinder")).toBeNull();
    expect(statistengeschlecht("touristen")).toBeNull();
  });

  it("kennt hinter alten Vorratsbögen den Typ", () => {
    expect(kennbild("statist-07")).toBe("statist.kindA");
    expect(kennbild("statist-18")).toBe("statist.studentin");
    expect(kennbild("statist-41")).toBe("statist-41");
    expect(kennbild("otis")).toBe("otis");
    expect(rollen.vorrat).toHaveLength(40);
  });
});

describe("waehleStatistenbilder", () => {
  it("wählt nach der Rolle: Empfangsdame, Koch, Angler, Musiker", () => {
    const bilder = waehleStatistenbilder([
      statist("empfangsdame", 0, 0),
      statist("kantinenkoch", 20, 0),
      statist("angler", 40, 0),
      statist("strassenmusiker", 60, 0),
      statist("rentnerin", 80, 0),
    ]);
    expect(bilder).toEqual([
      "statist.konzern",
      "schiffskoch",
      "statist.fischer",
      "statist.musik",
      "statist.rentnerin",
    ]);
  });

  it("behält ein eigenes Bild und ist für denselben Namen immer gleich", () => {
    const einer = [statist("passanten", 3, 3)];
    expect(waehleStatistenbilder(einer)).toEqual(waehleStatistenbilder(einer));
    expect(waehleStatistenbilder([statist("egal", 0, 0, { bild: "statist-07" })])).toEqual([
      "statist-07",
    ]);
    expect(streuwert("passanten")).toBe(streuwert("passanten"));
  });

  it("stellt dasselbe Bild nicht nebeneinander, auch nicht neben ein Bild von Hand", () => {
    const [a, b] = waehleStatistenbilder([statist("rentner", 5, 5), statist("rentner", 7, 5)]);
    expect(a).toBe("statist.rentner");
    expect(b).not.toBe(a);
    // Weiter als NAH auseinander darf es dasselbe Bild sein.
    const fern = waehleStatistenbilder([statist("rentner", 5, 5), statist("rentner", 6 + NAH, 5)]);
    expect(fern).toEqual(["statist.rentner", "statist.rentner"]);
    // statist-10 ist eine Kopie des Rentners.
    const nebenHand = waehleStatistenbilder([
      statist("rentner", 5, 5),
      statist("clubmitglied", 6, 5, { bild: "statist-10" }),
    ]);
    expect(nebenHand[0]).not.toBe("statist.rentner");
  });

  it("wechselt innerhalb einer Rolle ab: Passanten einer Straße sehen verschieden aus", () => {
    const namen = ["passantA", "passantB", "passantC", "passantD", "passantE"];
    const bilder = waehleStatistenbilder(namen.map((name, i) => statist(name, i * 2, 4)));
    expect(new Set(bilder).size).toBe(namen.length);
  });

  it("gibt den Bauhelm nur bei Bauarbeit", () => {
    expect(waehleStatistenbilder([statist("bauarbeiter", 0, 0)])).toEqual([BAUHELM]);
    const andere = ["empfangsdame", "kellner", "passanten", "besucher", "kunde", "gast", "wirt"];
    const viele = Array.from({ length: 60 }, (_, i) => `${andere[i % andere.length]}${i}`);
    const bilder = waehleStatistenbilder(viele.map((name, i) => statist(name, i % 8, i % 5)));
    expect(bilder).not.toContain(BAUHELM);
    for (const regel of rollen.regeln) {
      const mitHelm = [...regel.typen, ...regel.ausweich].includes(BAUHELM);
      expect(mitHelm).toBe(regel.rolle === "bau");
    }
  });

  it("achtet auf das Geschlecht und gibt Sitzenden ein Sitzbild", () => {
    expect(waehleStatistenbilder([statist("besucherin", 0, 0)])[0]).toMatch(
      /^(statist\.studentin|mutter|statist\.jugend|statist\.rentnerin)$/,
    );
    const typen: Record<string, { sitzbild: boolean }> = rollen.typen;
    for (const name of ["gast1", "gast2", "gast3", "zuschauer", "kundin", "wartender"]) {
      const [bild] = waehleStatistenbilder([statist(name, 0, 0, { sitzt: true })]);
      expect(typen[bild ?? ""]?.sitzbild).toBe(true);
    }
  });

  it("nimmt auf Erinnerungskarten (rolle historisch) nur historische Bilder", () => {
    const namen = ["passanten", "kutscher", "schuhputzer", "blumenmaedchen", "gaeste"];
    const bilder = waehleStatistenbilder(
      namen.map((name, i) => statist(name, i * 3, 2, { rolle: "historisch" })),
    );
    const historisch = ["statist.hist", "zeitungsleser", "postreiter", "zeitungsjunge"];
    for (const bild of bilder) expect(historisch).toContain(bild);
  });

  it("nennt nur Bilder, die als Typ beschrieben sind", () => {
    for (const regel of rollen.regeln) {
      expect(regel.typen.length).toBeGreaterThan(0);
      for (const typ of [...regel.typen, ...regel.ausweich]) {
        expect(Object.keys(rollen.typen)).toContain(typ);
      }
    }
  });
});

describe("Probe aus der Pipeline: App und Vorschau wählen dasselbe Bild", () => {
  const MINDESTENS = 50;

  it("rechnet jede Probeszene nach", () => {
    let zahl = 0;
    for (const szene of probe.szenen) {
      const angaben = szene.statisten.map((s) =>
        statist(s.name, s.x, s.y, { tun: s.tun, bild: s.bild, rolle: s.rolle, sitzt: s.sitzt }),
      );
      const erwartet = szene.statisten.map((s) => s.erwartet);
      expect(waehleStatistenbilder(angaben), szene.szene).toEqual(erwartet);
      zahl += angaben.length;
    }
    expect(zahl).toBeGreaterThanOrEqual(MINDESTENS);
  });
});
