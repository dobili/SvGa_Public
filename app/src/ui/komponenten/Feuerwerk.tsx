/**
 * Feuerwerk hinter der Gratulation des Gruppenmodus (seit 0.2.144, Wunsch des Autors 25.10.2026:
 * „ein bisschen mehr feierlich … eine Art Feuerwerk“).
 *
 * Rolle im Gesamtbild: Reine Zierde ohne Inhalt (für Vorlesehilfen verborgen). Mehrere Raketen
 * steigen an festen Stellen auf und zerplatzen in Funken in den Farben der App (Gold, Creme,
 * helles Navy); alles mit CSS-Animationen (ui/stil/feuerwerk.css), ohne Bibliothek. Wer im System
 * „Bewegung reduzieren“ eingestellt hat, sieht nur ein ruhiges, kurzes Aufleuchten.
 * Abhängigkeiten: ui/stil/feuerwerk.css.
 */
import type { CSSProperties } from "react";

/** Raketen: waagrechte Lage (Anteil der Breite), Höhe des Platzens (Anteil), Verzögerung (s). */
const RAKETEN: readonly (readonly [number, number, number])[] = [
  [0.2, 0.28, 0],
  [0.78, 0.22, 0.35],
  [0.5, 0.15, 0.7],
  [0.32, 0.36, 1.1],
  [0.68, 0.32, 1.45],
  [0.15, 0.18, 1.9],
  [0.85, 0.4, 2.2],
];
const FUNKEN = 14;
const VOLLKREIS = 360;
const FARBEN = ["var(--gold)", "var(--creme)", "#9fb8e6", "#f2d27a"] as const;
const PROZENT = 100;

/** Das Feuerwerk: sieben Raketen mit je vierzehn Funken. */
export function Feuerwerk() {
  return (
    <div className="feuerwerk" aria-hidden="true">
      {RAKETEN.map(([x, y, verzoegerung], r) => (
        <span
          key={r}
          className="feuerwerk-rakete"
          style={
            {
              "--x": `${x * PROZENT}%`,
              "--y": `${y * PROZENT}%`,
              "--verzoegerung": `${verzoegerung}s`,
              "--farbe": FARBEN[r % FARBEN.length],
            } as CSSProperties
          }
        >
          {Array.from({ length: FUNKEN }, (_, f) => (
            <span
              key={f}
              className="feuerwerk-funke"
              style={{ "--winkel": `${(VOLLKREIS * f) / FUNKEN}deg` } as CSSProperties}
            />
          ))}
        </span>
      ))}
    </div>
  );
}
