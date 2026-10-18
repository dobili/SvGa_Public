/**
 * Startpunkt der App: Schriften und Stil laden, Service Worker anmelden, Speicher laden, React
 * starten.
 *
 * Rolle im Gesamtbild: Wird von index.html geladen. Alles Weitere beginnt in app/App.tsx.
 * Abhängigkeiten: React, app/.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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
import "./ui/stil/breit.css";
import { App } from "./app/App";
import { Fehlergrenze } from "./app/Fehlergrenze";
import { starteOffline } from "./app/offline";
import { lade } from "./speicher/speicher";

starteOffline();
// Die Nutzerdaten laden im Hintergrund; bis dahin gilt der vorläufige Stand (speicher.ts).
void lade();

const wurzel = document.getElementById("wurzel");
if (!wurzel) {
  throw new Error("Element #wurzel fehlt in index.html");
}
createRoot(wurzel).render(
  <StrictMode>
    <Fehlergrenze>
      <App />
    </Fehlergrenze>
  </StrictMode>,
);
