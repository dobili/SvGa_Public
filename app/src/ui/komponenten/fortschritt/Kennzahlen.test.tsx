/**
 * Tests der drei Kennzahlen-Kacheln im Profil (0.3.43, Befund des Autors 31.10.2026): Zahl und
 * Zeile je Kachel, Null leiser, ohne jede Zahl gar nichts.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Kennzahlen } from "./Kennzahlen";

describe("Kennzahlen im Profil", () => {
  it("zeigt drei Kacheln mit Zahl und Zeile, die Null leiser", () => {
    const html = renderToStaticMarkup(<Kennzahlen uebungen={2} durchgaenge={8} warum={0} />);
    expect(html.match(/class="kennzahl[ "]/g)).toHaveLength(3);
    expect(html).toContain('<span class="kennzahl-zahl">2</span>');
    expect(html).toContain('<span class="kennzahl-zahl">8</span>');
    expect(html).toContain("Trainer-Durchgänge");
    expect(html.match(/kennzahl leer/g)).toHaveLength(1);
  });

  it("zeigt nichts, solange alle drei Zahlen null sind", () => {
    expect(renderToStaticMarkup(<Kennzahlen uebungen={0} durchgaenge={0} warum={0} />)).toBe("");
  });
});
