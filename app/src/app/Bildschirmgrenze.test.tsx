/**
 * Tests für die Fehlergrenze um jeden Bildschirm (V7, Nutzungsprüfung 25.10.2026).
 *
 * Die Tests laufen in Node ohne Browser. React fängt Fehler beim Zeichnen nur im Browser mit einer
 * Grenze ab (der Server-Renderer kennt keine Fehlergrenzen); deshalb gehen die Tests den Weg von
 * React Schritt für Schritt: Das Kind wirft, getDerivedStateFromError nimmt den Fehler auf, render
 * zeigt die Absturzseite. Den Weg im echten Browser prüft tests/e2e/absturz.spec.ts.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Bildschirmgrenze, type Grenzzustand } from "./Bildschirmgrenze";

/** Ein Bildschirm, der absichtlich beim Zeichnen wirft. */
function WerfendesKind(): never {
  throw new TypeError("eintraege is not iterable");
}

/** Lässt das Kind zeichnen wie React und gibt den geworfenen Fehler zurück. */
function fehlerVon(zeichnen: () => unknown): Error {
  try {
    zeichnen();
  } catch (fehler) {
    if (fehler instanceof Error) return fehler;
  }
  throw new Error("Das Kind hat nicht geworfen");
}

function grenzeMitFehler(beiZurueck = vi.fn()) {
  const grenze = new Bildschirmgrenze({
    children: <WerfendesKind />,
    beiZurueck,
    schluessel: "nachschlagen|2|glossar",
  });
  const aufgenommen = Bildschirmgrenze.getDerivedStateFromError(fehlerVon(WerfendesKind));
  grenze.state = { ...grenze.state, ...aufgenommen };
  return { grenze, beiZurueck };
}

describe("Bildschirmgrenze", () => {
  it("zeigt ohne Fehler den Bildschirm selbst", () => {
    const kind = <p>Glossar</p>;
    const grenze = new Bildschirmgrenze({ children: kind, beiZurueck: vi.fn(), schluessel: "a" });
    expect(grenze.render()).toBe(kind);
  });

  it("zeigt nach einem werfenden Kind die freundliche Seite mit Zurück und Melden", () => {
    const { grenze } = grenzeMitFehler();
    const seite = renderToStaticMarkup(<>{grenze.render()}</>);
    expect(seite).toContain("Hier ist etwas schiefgegangen.");
    expect(seite).toContain("Dein Fortschritt ist gespeichert.");
    expect(seite).toContain(">Zurück</button>");
    expect(seite).toContain(">Fehler melden</button>");
    // Die technische Meldung steht eingeklappt in einer Aufklappzeile.
    expect(seite).toMatch(/<details[^>]*><summary>Technische Meldung<\/summary>.*not iterable/);
    // Das Häkchen für die Geräteangaben ist da (wie im Formular „Fehler melden“).
    expect(seite).toContain('type="checkbox"');
  });

  it("gibt „Zurück“ an die Navigation weiter", () => {
    const { grenze, beiZurueck } = grenzeMitFehler();
    const seite = grenze.render() as { props: { beiZurueck: () => void } };
    seite.props.beiZurueck();
    expect(beiZurueck).toHaveBeenCalledOnce();
  });

  it("beginnt bei einem anderen Bildschirm ohne Fehler, beim selben nicht", () => {
    const { grenze } = grenzeMitFehler();
    const zustand: Grenzzustand = grenze.state;
    const gleich = { children: null, beiZurueck: vi.fn(), schluessel: zustand.schluessel };
    expect(Bildschirmgrenze.getDerivedStateFromProps(gleich, zustand)).toBeNull();
    const anders = { ...gleich, schluessel: "nachschlagen|1|nachschlagen" };
    expect(Bildschirmgrenze.getDerivedStateFromProps(anders, zustand)).toEqual({
      fehler: null,
      komponenten: "",
      schluessel: "nachschlagen|1|nachschlagen",
    });
  });
});
