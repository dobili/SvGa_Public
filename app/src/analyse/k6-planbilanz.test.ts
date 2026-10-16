/**
 * Kalibrierung von k6-planbilanz an den Planbilanzen des Buches (Abb. 6.20 und 11.34), je Zeile
 * und Seite, wie bei den Skelettbilanzen. Bekannte Abweichungen stehen als Befund in
 * docs/FORTSCHRITT.md und hier als Kommentar.
 */
import { describe, expect, it } from "vitest";
import {
  alleAbbildungen,
  bilanzfaelle,
  ladeKapitel,
  stellungVon,
} from "../schach/buchabbildungen.testhilfe";
import { stellungAusFen } from "../schach/stellung";
import { planbilanz } from "./k6-planbilanz";

type Pruefung = (weiss: string, schwarz: string) => void;
const ERWARTUNGEN: Record<string, Record<string, Pruefung>> = {
  "6.20": {
    // „Am Damenflügel: Die Kette e4–d5 zeigt dorthin. Der Hebel c4-c5 greift die Basis d6 an.“ /
    // „Am Königsflügel: Die Kette e5–d6 zeigt dorthin. Der Hebel ...f5 greift die Basis e4 an.“
    "Wo spiele ich?": (w, s) => {
      expect(w).toBe(
        "Weiß: Am Damenflügel: Die Kette e4–d5 zeigt dorthin (Hebel c4–c5 gegen die Basis d6)",
      );
      expect(s).toBe(
        "Schwarz: Am Königsflügel: Die Kette d6–e5 zeigt dorthin (Hebel f7–f5 gegen die Basis e4)",
      );
    },
    // „Schwarz will mit ...f5 den Bauern e4 angreifen … Weiß muss e4 stützen.“ /
    // „Weiß will mit c5 und cxd6 die c-Linie öffnen.“
    "Was will mein Gegner?": (w, s) => {
      expect(w).toBe("Weiß: Schwarz will mit f7–f5 die Basis e4 angreifen; Weiß muss e4 sichern");
      expect(s).toBe(
        "Schwarz: Weiß will mit c4–c5 die Basis d6 angreifen; Schwarz muss d6 sichern",
      );
    },
    // „Der Läufer c1 steht noch zu Hause“ / „Der Springer f6 muss dem f-Bauern Platz machen; der
    // Läufer c8 steht noch zu Hause.“ (Platz machen für den Hebel: Befund, nennt k5-richtung)
    "Welche Figur?": (w, s) => {
      expect(w).toBe("Weiß: Läufer c1 nach e3");
      expect(s).toContain("Läufer c8");
    },
  },
  "11.34": {
    // „Am Königsflügel. Der Bauer g6 ist der Haken, an dem der h-Bauer die h-Linie öffnet.“ /
    // „Am Damenflügel, auf der halboffenen c-Linie. Dort steht auch der weiße König.“
    "Wo spiele ich?": (w, s) => {
      expect(w).toBe("Weiß: Am Königsflügel, gegen den König: Sturm h4–h5 in 1 Zug gegen g6");
      expect(s).toBe(
        "Schwarz: Am Damenflügel, gegen den König: Sturm a7–a3 in 3 Zügen gegen b2; Linien zum König: c-Linie",
      );
    },
    // „Schwarz will auf c3 die Qualität opfern (...Txc3)“: ein Figurenopfer, das nur die Engine
    // sieht (Befund). / „Weiß will die h-Linie öffnen … Der Springer f6 muss h7 decken.“
    "Was will mein Gegner?": (w, s) => {
      expect(w).toContain("Weiß muss b2 sichern");
      expect(s).toBe(
        "Schwarz: Weiß will stürmen: h4–h5 in 1 Zug gegen g6; Schwarz muss g6 sichern",
      );
    },
    // „Der Springer d4 … auf e2 deckt er c3. Der Läufer e3 gehört nach h6.“ / „Die Dame d8 gehört
    // nach a5, der Turm f8 auf die c-Linie.“ Beides ist Planwissen; die Zählung nennt andere
    // Figuren (Befund in FORTSCHRITT).
    "Welche Figur?": (w, s) => {
      expect(w).toBe("Weiß: Springer c3 nach d5");
      expect(s).toContain("Läufer g7");
    },
  },
};

describe("k6-planbilanz", () => {
  const faelle = bilanzfaelle("plan");

  it("findet beide Planbilanzen (Kapitel 6 und 11)", () => {
    expect(faelle.map((f) => f.abbildung)).toEqual(["6.20", "11.34"]);
  });

  it.each(faelle.map((fall) => [fall.abbildung, fall] as const))(
    "Abb. %s: jede Zeile und Seite wie im Buch",
    (nummer, fall) => {
      const e = planbilanz(stellungVon(nummer), "white");
      const kennung: Record<string, string> = {
        "Wo spiele ich?": "wo",
        "Was will mein Gegner?": "gegner",
        "Welche Figur?": "figur",
      };
      for (const zeile of fall.tabelle.zeilen) {
        const pruefung = ERWARTUNGEN[nummer]?.[zeile.name];
        expect(pruefung, `Erwartung für Abb. ${nummer}, Zeile ${zeile.name}`).toBeDefined();
        const befund = e.befunde.find((b) => b.kennung === kennung[zeile.name]);
        expect(befund).toBeDefined();
        pruefung?.(befund?.zeilen[0] ?? "", befund?.zeilen[1] ?? "");
      }
    },
  );

  it("Abb. 6.20: der Plan in einem Satz und der Verweis auf die Planbilanz des Buches", () => {
    const bilanz = ladeKapitel(6).bilanzen.find((b) => b.art === "plan" && b.abbildung === "6.20");
    const e = planbilanz(stellungVon("6.20"), "white", bilanz);
    expect(e.befunde.find((b) => b.kennung === "plan")?.zeilen[0]).toBe(
      "Weiß: „Ich nutze die Richtung meiner Kette zum Damenflügel, greife die Basis d6 an und sichere e4.“",
    );
    const buch = e.befunde.find((b) => b.kennung === "buch");
    expect(buch?.art).toBe("V");
    expect(buch?.titel).toBe("Planbilanz im Buch");
    // Seit 0.2.27 nur ein Verweis, kein Buchtext (Entscheidung des Autors vom 15.10.2026).
    expect(buch?.zeilen).toEqual([
      "Vergleiche deine Planbilanz mit der Planbilanz im Buch bei Abb. 6.20.",
    ]);
    expect(planbilanz(stellungVon("6.20"), "white").befunde.some((b) => b.kennung === "buch")).toBe(
      false,
    );
  });

  // C1.16: In unruhigen Stellungen keine Planbilanz, nur der Hinweis.
  it("Abb. 6.32: Schwarz steht im Schach, die Planbilanz sagt nur „Erst das Schach beantworten“", () => {
    const e = planbilanz(stellungVon("6.32"), "black");
    expect(e.befunde.map((b) => b.kennung)).toEqual(["unruhe"]);
    expect(e.fazit).toBe(
      "Schwarz steht im Schach: Erst das Schach beantworten; Planfragen gelten in ruhigen Stellungen.",
    );
  });

  // C1.15: In der Planbilanz nennt „Welche Figur?“ das Eindringen auf die 7. Reihe.
  it("Abb. 6.17: Welche Figur? Der vordere Turm dringt nach d7 ein", () => {
    const figur = planbilanz(stellungVon("6.17"), "white").befunde.find(
      (b) => b.kennung === "figur",
    );
    expect(figur?.zeilen[0]).toBe(
      "Weiß: Die Türme stehen verdoppelt auf der offenen d-Linie: Turm d2 dringt nach d7 auf die 7. Reihe ein, Turm d1 deckt ihn",
    );
  });

  it("keine doppelten Wörter in den Sätzen (Abb. 6.27, 6.28: „d-Linie-Linie“, „Sturm kein Sturm“)", () => {
    for (const abbildung of alleAbbildungen().filter((a) => a.kapitel >= 6)) {
      const stellung = stellungAusFen(abbildung.fen);
      if (!stellung.ok || !stellung.wert.regeln) continue;
      for (const farbe of ["white", "black"] as const) {
        const text = planbilanz(stellung.wert, farbe)
          .befunde.flatMap((b) => [b.titel, ...b.zeilen])
          .join(" ");
        expect(text, `Abb. ${abbildung.id}`).not.toMatch(/Linie-Linie|Sturm kein Sturm/);
      }
    }
  });
});
