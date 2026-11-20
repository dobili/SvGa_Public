/**
 * Tests der Anzeige ohne Ambrose (regeln/abwesenheit.ts: Tiefpunkt, nach dem Abschied): Rückmeldung
 * der Rätsel ohne sein Porträt und seinen Namen, Kartenblick ohne „Ambrose:“, Hinweisknopf
 * „Hinweis“ statt „Ambrose fragen“, Kipppunkt nach der Partie ohne seinen Namen. Server-Renderer.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import kartendatei from "../../../../inhalte/abenteuer/karten.json";
import { OhneMentorKontext, useHinweistext } from "../../ui/trainer/imSpiel";
import { Partieergebniskarte } from "../oberwelt/Ergebniskarten";
import type { Kartensorte } from "../schnittstelle/karten";
import type { Kipppunkt, Partieergebnis } from "../schnittstelle/partie";
import { Kartenblick } from "./Kartenblick";
import { Raetselmeldung } from "./Raetselanzeige";
import { ratgeberDerRunde } from "./useRaetselanzeige";

const ABSCHIED = { tiefpunktGesehen: true, versoehnungGesehen: true, abschiedGesehen: true };
const TIEFPUNKT = { tiefpunktGesehen: true };
const SAM = "figur.sam.name";
const AMBROSE = "figur.ambrose.name";

describe("Rückmeldung der Rätsel", () => {
  it("spricht mit Ambrose, solange er da ist", () => {
    expect(ratgeberDerRunde(SAM, {})).toEqual({
      sprecher: "ambrose",
      name: "Ambrose",
      geist: true,
    });
    expect(ratgeberDerRunde(AMBROSE, {}).sprecher).toBe("ambrose");
  });

  it("spricht ohne ihn mit dem, der die Aufgaben stellt", () => {
    for (const variablen of [TIEFPUNKT, ABSCHIED]) {
      expect(ratgeberDerRunde(SAM, variablen)).toEqual({
        sprecher: "sam",
        name: "Sam",
        geist: false,
      });
    }
  });

  it("steht in Ambroses Erinnerungen ohne ihn ohne Namen und Porträt da", () => {
    const ratgeber = ratgeberDerRunde(AMBROSE, ABSCHIED);
    expect(ratgeber).toEqual({ sprecher: null, name: "", geist: false });
    const html = renderToStaticMarkup(
      <Raetselmeldung richtig text="Richtig! Lösung: Dxf7#" ratgeber={ratgeber} />,
    );
    expect(html).toContain("Richtig! Lösung: Dxf7#");
    expect(html).not.toContain("Ambrose");
    expect(html).not.toContain("<strong>");
    expect(html).not.toContain("<img");
  });
});

describe("Kartenblick", () => {
  const sorte = (kartendatei.karten as unknown as Kartensorte[]).find(
    (k) => k.kennung === "abzaehlen",
  );
  const zeichne = (ambroseDa: boolean) =>
    renderToStaticMarkup(
      <Kartenblick
        sorte={sorte as Kartensorte}
        ansicht="hell"
        grund={null}
        spielbar
        ambroseDa={ambroseDa}
        beiAusspielen={() => undefined}
        beiZurueck={() => undefined}
      />,
    );

  it("nennt Ambrose vor der Erklärung nur, wenn er da ist", () => {
    expect(zeichne(true)).toContain("<strong>Ambrose:</strong>");
    expect(zeichne(false)).not.toContain("Ambrose:");
    expect(zeichne(false)).toContain("abenteuer-kartenblick-erklaerung");
  });
});

describe("Hinweisknopf der Rätsel", () => {
  function Knopf() {
    return <button type="button">{useHinweistext()}</button>;
  }

  it("heißt ohne Ambrose „Hinweis“", () => {
    expect(renderToStaticMarkup(<Knopf />)).toContain("Ambrose fragen");
    const ohne = renderToStaticMarkup(
      <OhneMentorKontext value={true}>
        <Knopf />
      </OhneMentorKontext>,
    );
    expect(ohne).toBe('<button type="button">Hinweis</button>');
  });
});

describe("Kipppunkt nach der Partie", () => {
  const ergebnis = { ausgang: "niederlage" } as unknown as Partieergebnis;
  const kipppunkt = { halbzug: 24 } as unknown as Kipppunkt;
  const zeichne = (punkt: Kipppunkt | "suche", ohneAmbrose: boolean) =>
    renderToStaticMarkup(
      <Partieergebniskarte
        ergebnis={ergebnis}
        gegner="Sam"
        club={null}
        neueNadel={null}
        kipppunkt={punkt}
        ohneAmbrose={ohneAmbrose}
        beiWiedereinstieg={() => undefined}
        beiWeiter={() => undefined}
      />,
    );

  it("ist mit Ambrose sein Satz", () => {
    expect(zeichne(kipppunkt, false)).toContain(
      "Ambrose: „Hier ist es passiert. Noch einmal von hier?",
    );
    expect(zeichne("suche", false)).toContain("Ambrose sieht sich die Partie an");
  });

  it("nennt ihn ohne ihn nicht und bietet den Wiedereinstieg weiter an", () => {
    const html = zeichne(kipppunkt, true);
    expect(html).not.toContain("Ambrose");
    expect(html).toContain("In Zug 13 ist sie gekippt.");
    expect(html).toContain("abenteuer-wiedereinstieg");
    expect(zeichne("suche", true)).not.toContain("Ambrose");
  });
});
