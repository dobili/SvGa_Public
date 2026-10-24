/**
 * Rahmen der Trainingsseiten: Kopf, Navigation und Fuß als HTML, um die Blöcke aus
 * trainingsseiten.ts herum.
 *
 * Rolle im Gesamtbild: Teil der Website-Seiten „Training zu diesem Kapitel“ (Entscheidung des
 * Autors, 15./16.10.2026). Die Oberflächentexte stehen als Doppelklammer-Schlüssel im HTML; das
 * Vite-Plugin texteInHtml setzt sie aus src/i18n/de.json ein (Regel 6 aus CLAUDE.md). Der Stil
 * kommt wie bei Impressum und Datenschutz über rechtliches.ts.
 * Abhängigkeiten: trainingsseiten.ts.
 */
import {
  type Trainingsblock,
  blockHtml,
  datumDeutsch,
  kapiteladresse,
  maskiere,
  type Trainingsseite,
} from "./trainingsseiten";
import { orteDerUebung } from "./uebungsort";
import { werkzeuglinksHtml } from "./werkzeuglinks";

const WEBSITE = "https://schach-von-grund-auf.com";

/** Kopf jeder Seite: Zeichensatz, Titel, Beschreibung, feste Adresse, Stil. */
function kopf(titel: string, adresse: string, beschreibung: string): string {
  return `<!doctype html>
<!-- ERZEUGTE DATEI aus inhalte/de/training/ (src/startseite/trainingsrahmen.ts); nicht bearbeiten. -->
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="text-scale" content="scale" />
    <meta name="theme-color" content="#16253D" />
    <meta name="description" content="${maskiere(beschreibung)}" />
    <link rel="canonical" href="${WEBSITE}${adresse}" />
    <link rel="icon" href="/symbole/symbol.svg" type="image/svg+xml" />
    <title>${maskiere(titel)} – {{app.titel}}</title>
    <script type="module" src="/src/startseite/rechtliches.ts"></script>
  </head>`;
}

/** Kopfband in Navy mit Überzeile (wie die Startseite des Buches). */
function band(ueberzeile: string, titel: string): string {
  return `
    <header class="startseite-kopf training-kopf">
      <div>
        <p class="ueberzeile">${ueberzeile}</p>
        <h1>${maskiere(titel)}</h1>
      </div>
    </header>`;
}

/** Fuß mit Startseite, App, Impressum und Datenschutz. */
function fuss(): string {
  return `
    <footer class="startseite-fuss">
      <a class="knopf-link klein" href="/">{{training.seite.startseite}}</a>
      <a class="knopf-link klein" href="/app/">{{training.seite.app}}</a>
      <a class="knopf-link klein" href="/impressum/">{{installation.impressum}}</a>
      <a class="knopf-link klein" href="/datenschutz/">{{installation.datenschutz}}</a>
    </footer>`;
}

function seite(kopfHtml: string, bandHtml: string, inhalt: string): string {
  return `${kopfHtml}
  <body>
    <div class="startseite trainingsseite">${bandHtml}
      <main class="startseite-inhalt">${inhalt}
      </main>${fuss()}
    </div>
  </body>
</html>
`;
}

/** Marken „Lichess“, „App“, „Brett“ vor einer Übung (Wunsch des Autors, 19.10.2026). */
function ortsmarken(block: Trainingsblock): string {
  const orte = orteDerUebung(block);
  if (orte.length === 0) return "";
  const marken = orte
    .map((ort) => `<span class="uebungsort uebungsort-${ort}">{{training.ort.${ort}}}</span>`)
    .join(" ");
  return `<p class="uebungsorte" aria-label="{{training.ort.titel}}">${marken}</p>`;
}

/** Blöcke in einer Karte, dazu der Stand der Angaben; mit Ortsmarken nur auf Kapitelseiten. */
function karte(daten: Trainingsseite, mitOrten = false): string {
  // Seit R57 unter jeder Übung der Kapitelseiten die Links zu den genannten Lichess-Werkzeugen.
  const block = (b: Trainingsblock) =>
    mitOrten ? ortsmarken(b) + blockHtml(b) + werkzeuglinksHtml(b) : blockHtml(b);
  return `
        <section class="karte trainingskasten" data-testid="trainingskasten">
          ${daten.bloecke.map(block).join("\n          ")}
          <p class="trainingsstand">{{training.seite.stand}} ${maskiere(datumDeutsch(daten.stand))}</p>
        </section>`;
}

/** Vor- und Rückweg zwischen den Kapiteln, dazu Übersicht und Werkzeugkasten. */
function navigation(vorher: Trainingsseite | null, nachher: Trainingsseite | null): string {
  const kapitellink = (s: Trainingsseite | null, schluessel: string) =>
    s && s.kapitel !== undefined
      ? `<a class="knopf-zweit" href="${kapiteladresse(s.kapitel)}">{{${schluessel}}} ${s.kapitel}</a>`
      : "";
  return `
        <nav class="training-navigation" aria-label="{{training.seite.navigation}}">
          ${kapitellink(vorher, "training.seite.vorher")}
          <a class="knopf-zweit" href="/training/">{{training.seite.uebersicht}}</a>
          ${kapitellink(nachher, "training.seite.nachher")}
        </nav>`;
}

/**
 * Seite eines Kapitels, etwa /training/kap07/ „Kapitel 7: Taktik …“.
 *
 * Eingaben: die Daten des Kapitels, das vorige und das nächste Kapitel (null am Rand).
 * Ausgabe: das vollständige HTML der Seite, noch mit Textschlüsseln.
 */
export function kapitelseite(
  daten: Trainingsseite,
  vorher: Trainingsseite | null,
  nachher: Trainingsseite | null,
): string {
  const titel = `Kapitel ${daten.kapitel ?? ""}: ${daten.titel}`;
  const inhalt = `
        <p class="hinweis training-einleitung">{{training.seite.einleitung}}</p>
        <p class="hinweis training-einleitung">{{training.seite.orte}}</p>${karte(daten, true)}${navigation(vorher, nachher)}`;
  return seite(
    kopf(`{{training.seite.titel}} ${daten.kapitel ?? ""}`, daten.adresse, titel),
    band("{{training.seite.ueberzeile}}", titel),
    inhalt,
  );
}

/** Die Seite „Dein Werkzeugkasten“ (/training/werkzeugkasten/). */
export function werkzeugkastenseite(daten: Trainingsseite): string {
  const inhalt = `${karte(daten)}
        <nav class="training-navigation" aria-label="{{training.seite.navigation}}">
          <a class="knopf-zweit" href="/training/">{{training.seite.uebersicht}}</a>
        </nav>`;
  return seite(
    kopf(daten.titel, daten.adresse, daten.titel),
    band("{{training.seite.ueberzeileWerkzeugkasten}}", daten.titel),
    inhalt,
  );
}

/** Die Übersicht /training/: alle Kapitel und der Werkzeugkasten. */
export function uebersichtsseite(kapitel: readonly Trainingsseite[]): string {
  const eintraege = kapitel
    .map(
      (k) =>
        `<li><a href="${kapiteladresse(k.kapitel ?? 0)}"><span class="training-nummer">${k.kapitel ?? ""}</span> ${maskiere(k.titel)}</a></li>`,
    )
    .join("\n            ");
  const inhalt = `
        <p class="hinweis training-einleitung">{{training.uebersicht.einleitung}}</p>
        <section class="karte">
          <h2 class="karte-titel">{{training.uebersicht.kapitel}}</h2>
          <ul class="trainingsliste" data-testid="trainingsliste">
            ${eintraege}
          </ul>
        </section>
        <section class="karte">
          <h2 class="karte-titel">{{training.uebersicht.werkzeugkasten}}</h2>
          <p>{{training.uebersicht.werkzeugkastenText}}</p>
          <a class="knopf-zweit" href="/training/werkzeugkasten/">{{training.uebersicht.werkzeugkastenLink}}</a>
        </section>`;
  return seite(
    kopf("{{training.uebersicht.titel}}", "/training/", "{{training.uebersicht.titel}}"),
    band("{{app.titel}}", "{{training.uebersicht.titel}}"),
    inhalt,
  );
}
