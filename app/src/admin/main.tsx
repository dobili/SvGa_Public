/**
 * Einstieg der Seite /admin/ (R57).
 *
 * Rolle im Gesamtbild: Eigene kleine React-Seite neben der App (eigener Eintrag in
 * vite.config.ts), mit Schriften und Farben der App.
 * Abhängigkeiten: React, src/admin/Dashboard.tsx, ui/stil/basis.css.
 */
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/source-serif-4/latin-600.css";
import "../ui/stil/basis.css";
import "./admin.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Dashboard } from "./Dashboard";

const wurzel = document.getElementById("admin");
if (wurzel) {
  createRoot(wurzel).render(
    <StrictMode>
      <main className="admin">
        <Dashboard />
      </main>
    </StrictMode>,
  );
}
