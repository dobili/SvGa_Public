/**
 * Verhalten der Startseite des Buches (/) und des Installationsteils (/installieren/).
 *
 * Rolle im Gesamtbild: Die Seiten sind statisches HTML (Suchmaschinen, Vorschau beim Teilen);
 * dieses Skript ergänzt nur, was vom Gerät abhängt (Entscheidung des Autors, 15.10.2026):
 * - die passende Installationsanleitung (iPhone, Mac mit Safari, Knopf für Android/Chrome/Edge,
 *   andere Browser), Konzept 11.1;
 * - den Knopf „App installieren“ über den Installationsdialog des Browsers;
 * - den Fortschritt der Offline-Vorbereitung, denn der Service Worker lädt schon hier alle Dateien
 *   der App vorab („nach der Installation vollständig offline“).
 * Ohne React, damit die Startseite schnell lädt.
 * Abhängigkeiten: app/geraet.ts, app/installieren.ts, app/offlineKern.ts, i18n.
 */
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/source-sans-3/latin-700.css";
import "@fontsource/source-serif-4/latin-600.css";
import "../ui/stil/basis.css";
import "../ui/stil/ergaenzungen.css";
import "./startseite.css";
import { geraet } from "../app/geraet";
import {
  abonniereInstallation,
  hoereAufInstallation,
  installationsstand,
  installiere,
} from "../app/installieren";
import { abonniereOffline, offlineStand, starteOffline } from "../app/offlineKern";
import { t } from "../i18n/sprache";

/** Welche Anleitung zu sehen ist (Werte von data-anleitung im HTML). */
type Anleitung = "knopf" | "iphone" | "mac" | "andere" | "installiert";

/**
 * Wählt die Anleitung für dieses Gerät.
 *
 * Beispiel: iPhone → Schritte über „Teilen“; Android mit Installationsdialog → Knopf.
 * Sonderfall: Ein Browser ohne Installationsdialog und ohne bekannte Anleitung bekommt den Hinweis,
 * Chrome oder Edge zu nehmen oder die App im Browser zu verwenden.
 */
export function anleitungFuer(
  art: ReturnType<typeof geraet>,
  kannInstallieren: boolean,
  installiert: boolean,
): Anleitung {
  if (installiert) return "installiert";
  if (art === "iphone") return "iphone";
  if (art === "mac-safari") return "mac";
  if (art === "anderer" && !kannInstallieren) return "andere";
  return "knopf";
}

function zeigeAnleitung(): void {
  const { kannInstallieren, installiert } = installationsstand();
  const gewaehlt = anleitungFuer(geraet(), kannInstallieren, installiert);
  document.querySelectorAll<HTMLElement>("[data-anleitung]").forEach((element) => {
    element.classList.toggle("sichtbar", element.dataset.anleitung === gewaehlt);
  });
  const knopf = document.querySelector<HTMLButtonElement>("[data-installieren]");
  if (knopf) knopf.disabled = !kannInstallieren;
  const hinweis = document.querySelector<HTMLElement>("[data-android-hinweis]");
  if (hinweis) hinweis.hidden = kannInstallieren;
}

function zeigeFortschritt(): void {
  const { verfuegbar, prozent, bereit } = offlineStand();
  const bereich = document.querySelector<HTMLElement>("[data-fortschritt]");
  if (!bereich) return;
  bereich.hidden = !verfuegbar;
  const text = bereich.querySelector<HTMLElement>("[data-fortschritt-text]");
  const zahl = bereich.querySelector<HTMLElement>("[data-fortschritt-zahl]");
  const balken = bereich.querySelector<HTMLElement>("[data-fortschritt-balken]");
  const leiste = bereich.querySelector<HTMLElement>("[role=progressbar]");
  if (text)
    text.textContent = t(bereit ? "installation.offlineBereit" : "installation.fortschritt");
  if (zahl) zahl.textContent = `${prozent} %`;
  if (balken) balken.style.width = `${prozent}%`;
  leiste?.setAttribute("aria-valuenow", String(prozent));
}

/** Startet das Verhalten, sobald das HTML steht (das Modul lädt verzögert, also danach). */
function starte(): void {
  hoereAufInstallation();
  starteOffline();
  zeigeAnleitung();
  zeigeFortschritt();
  abonniereInstallation(zeigeAnleitung);
  abonniereOffline(zeigeFortschritt);
  document
    .querySelector<HTMLButtonElement>("[data-installieren]")
    ?.addEventListener("click", () => void installiere());
}

if (typeof document !== "undefined") starte();
