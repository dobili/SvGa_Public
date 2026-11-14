/**
 * Die Spielhülle: der Rahmen für alles, was außerhalb der Oberwelt spielt (Partie, Aufgabenrunde),
 * im Aussehen des Spiels statt im Aussehen der App (docs/spiel/18_Spielhuelle.md, Abschnitt 3).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (10.11.2026): Die App rechnet im Hintergrund, zu sehen ist
 * nur, was die Aufgabe der Geschichte braucht. Die Hülle zeichnet den Kopf (Porträt der Figur, ihr
 * Name, der Ort) und den Pixelrahmen; den Inhalt hängen PartieHuelle.tsx und AufgabenAnsicht.tsx
 * ein. Navigation, Kopfzeile und Leiste der App kommen hier nicht vor.
 * Abhängigkeiten: anbindung/pixelrahmen.ts, dialog/Portraet.tsx, texte/texte.ts, anbindung/dienste.ts.
 */
import type { ReactNode } from "react";
import "../abenteuer.css";
import "../huelle.css";
import { Portraet } from "../dialog/Portraet";
import { tSpiel } from "../texte/texte";
import { useAbenteuerstand } from "./dienste";
import { useKopfstimmung } from "./tischkontext";
import { usePixelrahmen } from "./pixelrahmen";

/** Name des Ortes, an dem der Held steht („Maple Falls, Hauptstraße“); leer ohne Spielstand. */
function useOrtsname(): string {
  const karte = useAbenteuerstand()?.position.karte;
  if (!karte) return "";
  const text = tSpiel(`ort.${karte}`);
  // Ein fehlender Text käme als Schlüssel zurück; dann lieber nichts zeigen.
  return text === `ort.${karte}` ? "" : text;
}

/**
 * Der Rahmen der Hülle.
 * Eingaben: Name der Figur (Gegner oder wer die Aufgaben stellt), ihre Sprecherkennung für das
 * Porträt („sam“, „coachDelgado“ oder „coach-delgado“; null ohne Bild),
 * Testkennung des Wurzelelements, zusätzliche Klasse (etwa für Blindschach), der Inhalt.
 * Beispiel: Partie gegen Skater Jo auf der Hauptstraße → Kopf „Skater Jo / Maple Falls,
 * Hauptstraße“, darunter Brett und Uhren.
 */
export function Huelle({
  figur,
  sprecher,
  testid,
  klasse = "",
  children,
}: {
  readonly figur: string;
  readonly sprecher: string | null;
  readonly testid: string;
  readonly klasse?: string;
  readonly children: ReactNode;
}) {
  const pixelrahmen = usePixelrahmen();
  const ort = useOrtsname();
  // Spricht die Figur oben in der Blase, zeigt der Kopf sie in derselben Stimmung (docs/spiel/29).
  const stimmung = useKopfstimmung(sprecher);
  return (
    <div
      className={`bildschirm abenteuer-huelle ${pixelrahmen?.klasse ?? ""} ${klasse}`}
      style={pixelrahmen?.stil}
      data-testid={testid}
    >
      <header className="abenteuer-huelle-kopf" data-testid="abenteuer-huelle-kopf">
        {sprecher && <Portraet sprecher={sprecher} stimmung={stimmung} />}
        <div>
          <p className="abenteuer-huelle-figur">{figur}</p>
          {ort && <p className="abenteuer-huelle-ort">{ort}</p>}
        </div>
      </header>
      <div className="abenteuer-huelle-inhalt">{children}</div>
    </div>
  );
}
