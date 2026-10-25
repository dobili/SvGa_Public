/**
 * Startpunkt der App: Schriften und Stil laden, Service Worker anmelden, Speicher laden, React
 * starten.
 *
 * Rolle im Gesamtbild: Wird von index.html geladen. Alles Weitere beginnt in app/App.tsx.
 * Abhängigkeiten: React, app/.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { wendeSchriftgroesseAn } from "./app/schriftgroesse";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-400-italic.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/source-sans-3/latin-700.css";
import "@fontsource/source-serif-4/latin-600.css";
import "./ui/stil/basis.css";
import "./ui/stil/ergaenzungen.css";
import "./ui/stil/zugleiste.css";
import "./ui/stil/kapitel.css";
import "./ui/stil/nachschlagen.css";
import "./ui/stil/speicher.css";
import "./ui/stil/vorbereitet.css";
import "./ui/stil/spiel.css";
import "./ui/stil/uebung.css";
import "./ui/stil/bausteine.css";
import "./ui/stil/gegnerbild.css";
import "./ui/stil/symbole.css";
import "./ui/stil/abstimmung.css";
import "./ui/stil/fehlerprofil.css";
import "./ui/stil/spielwahl.css";
import "./ui/stil/breit.css";
import "./ui/stil/brett.css";
import "./ui/stil/tour.css";
import "./ui/stil/auswertung.css";
import { App } from "./app/App";
import { Fehlergrenze } from "./app/Fehlergrenze";
import { starteOffline } from "./app/offline";
import { starteSprache } from "./app/sprachwahl";
import { lade } from "./speicher/speicher";

starteOffline();
// Die Nutzerdaten laden im Hintergrund; bis dahin gilt der vorläufige Stand (speicher.ts).
void lade();

/** Zeichnet die App in #wurzel. */
function zeichneApp(): void {
  const wurzel = document.getElementById("wurzel");
  if (!wurzel) {
    throw new Error("Element #wurzel fehlt in index.html");
  }
  // Schriftgröße des Geräts (Merker) vor dem ersten Zeichnen, falls das Skript in index.html fehlte.
  wendeSchriftgroesseAn();
  createRoot(wurzel).render(
    <StrictMode>
      <Fehlergrenze>
        <App />
      </Fehlergrenze>
    </StrictMode>,
  );
  // Die App steht: Der Hinweis für zu alte Geräte (index.html, 19.10.2026) wird nicht gebraucht.
  document.getElementById("startproblem")?.remove();
}

// Zuerst die Sprache: Alle Texte und der Datenordner hängen an ihr. Eine gewählte weitere Sprache
// lädt erst ihre Sprachdatei (V4); gezeichnet wird danach, damit nichts kurz deutsch erscheint.
void starteSprache().then(zeichneApp);
