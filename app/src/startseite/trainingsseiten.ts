/**
 * Baut die statischen Seiten „Training zu diesem Kapitel“ der Website aus
 * inhalte/de/training/*.json (Entscheidung des Autors, 15./16.10.2026).
 *
 * Rolle im Gesamtbild: Die Kästen „Training zu diesem Kapitel“ und der Werkzeugkasten aus
 * Kapitel 12 verweisen auf Webangebote, die sich ändern; deshalb stehen sie auf der Website unter
 * festen Adressen (/training/kap00/ bis /training/kap12/, /training/werkzeugkasten/, Übersicht
 * /training/), und das Buch druckt nur Link und QR-Code. vite.config.ts ruft diese Funktionen
 * beim Start auf und legt die Seiten in app/training/ ab (erzeugt, nicht im Repository); danach
 * baut Vite sie wie die Startseite, setzt die Texte aus de.json ein und lädt den Stil.
 * Ein Abbildungsverweis öffnet die Abbildung in der App (/app/#abb-6.20).
 * Abhängigkeiten: keine (reine Funktionen, auch unter Node in vite.config.ts).
 */

/** Ein Teil des Textes, wie ihn pipeline/training.py schreibt (wie die Bildunterschriften). */
export interface Trainingsteil {
  readonly art: string;
  readonly text: string;
  readonly stil?: string;
  readonly abbildung?: string;
  readonly ziel?: string;
}

export type Trainingsblock =
  | { readonly art: "absatz"; readonly teile: readonly Trainingsteil[] }
  | { readonly art: "klein"; readonly teile: readonly Trainingsteil[] }
  | { readonly art: "liste"; readonly punkte: readonly (readonly Trainingsteil[])[] }
  | {
      readonly art: "tabelle";
      readonly kopf: readonly (readonly Trainingsteil[])[];
      readonly zeilen: readonly (readonly (readonly Trainingsteil[])[])[];
      readonly unterschrift: readonly Trainingsteil[];
    };

export interface Trainingsseite {
  readonly kapitel?: number;
  readonly titel: string;
  readonly adresse: string;
  readonly bloecke: readonly Trainingsblock[];
  readonly stand: string;
}

const STELLEN_KAPITEL = 2;

/** HTML-sicherer Text. */
export function maskiere(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Adresse der Trainingsseite eines Kapitels: 7 → „/training/kap07/“. */
export function kapiteladresse(kapitel: number): string {
  return `/training/kap${String(kapitel).padStart(STELLEN_KAPITEL, "0")}/`;
}

/**
 * Ein Textteil als HTML.
 *
 * Beispiel aus Kapitel 6: Verweis „Abb. 6.20“ → Link in die App (/app/#abb-6.20), Zug „8... Se7“ →
 * <span class="zug">, „lichess.org“ → externer Link, der in einem neuen Fenster öffnet.
 */
export function teilHtml(teil: Trainingsteil): string {
  const text = maskiere(teil.text);
  if (teil.art === "verweis" && teil.abbildung)
    return `<a class="abb-verweis" href="/app/#abb-${maskiere(teil.abbildung)}">${text}</a>`;
  if (teil.art === "zug") return `<span class="zug">${text}</span>`;
  if (teil.art === "link" && teil.ziel) {
    const extern = teil.ziel.startsWith("https://");
    const ziel = maskiere(teil.ziel);
    return extern
      ? `<a href="${ziel}" target="_blank" rel="noopener noreferrer">${text}</a>`
      : `<a href="${ziel}">${text}</a>`;
  }
  if (teil.stil === "fett") return `<strong>${text}</strong>`;
  if (teil.stil === "kursiv") return `<em>${text}</em>`;
  return text;
}

function teileHtml(teile: readonly Trainingsteil[]): string {
  return teile.map(teilHtml).join("");
}

/** Ein Block als HTML: Absatz, Kleingedrucktes, Liste oder Tabelle (mit Querscrollen am Handy). */
export function blockHtml(block: Trainingsblock): string {
  if (block.art === "absatz") return `<p>${teileHtml(block.teile)}</p>`;
  if (block.art === "klein") return `<p class="hinweis">${teileHtml(block.teile)}</p>`;
  if (block.art === "liste")
    return `<ul>${block.punkte.map((p) => `<li>${teileHtml(p)}</li>`).join("")}</ul>`;
  const kopf = block.kopf.map((z) => `<th scope="col">${teileHtml(z)}</th>`).join("");
  // Auf schmalen Bildschirmen steht jede Zeile als Kärtchen; die Spaltennamen kommen aus data-spalte.
  const spalte = (i: number) => maskiere((block.kopf[i] ?? []).map((t) => t.text).join(""));
  const zelle = (z: readonly Trainingsteil[], i: number) =>
    `<td data-spalte="${spalte(i)}">${teileHtml(z)}</td>`;
  const zeilen = block.zeilen.map((zeile) => `<tr>${zeile.map(zelle).join("")}</tr>`).join("");
  // Die Unterschrift steht unter der Tabelle (als Absatz, damit sie auch im Kärtchen-Satz passt).
  return (
    `<div class="tabelle-rahmen"><table class="trainingstabelle">` +
    `<thead><tr>${kopf}</tr></thead><tbody>${zeilen}</tbody></table>` +
    `<p class="tabellenunterschrift">${teileHtml(block.unterschrift)}</p></div>`
  );
}

/** Datum wie im Buch: „2026-10-16“ → „16.10.2026“; anderes bleibt, wie es ist. */
export function datumDeutsch(iso: string): string {
  const teile = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return teile ? `${teile[3]}.${teile[2]}.${teile[1]}` : iso;
}
