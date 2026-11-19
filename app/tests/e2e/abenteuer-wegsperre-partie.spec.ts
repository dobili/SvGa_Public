/**
 * Schach-Abenteuer, die Partien an den Wegsperren S15 bis S17 wirklich gespielt
 * (docs/spiel/32_Wegsperren.md, Regelwerk R13a „Endspiel gewinnen“ und R13b „Vorteil
 * herausarbeiten“): Ein Spieler mit Stockfish (abenteuer-zugwahl.ts) zieht auf dem Brett der
 * Spielhülle bis zur Wertung, einmal auf Sieg, einmal auf Remis, einmal auf Niederlage.
 *
 * Geprüft wird die ganze Kette: erzählter Einstieg, Zähler der restlichen Züge, Ende der Partie
 * durch die Wertung nach genau den vereinbarten Zügen, der Satz „nachher“ zum Ausgang, das
 * Gespräch mit der Truppe am Übergang und ob der Übergang danach offen ist. An S15 und S16 öffnen
 * Sieg und Remis für immer, an S17 nur der Sieg (Entscheidung vom 18.11.2026: „Endspiel gewinnen“
 * heißt so; ein Remis bei etwa +3 zu Beginn ist kein Bestehen). Ein Fehlversuch (Niederlage, an
 * S17 auch Remis) kostet nichts, zählt genau einmal und lässt den Übergang zu; der dritte öffnet
 * auch (Notausgang). Jede Verzweigung von S17 mit festem Ausgang prüft zusätzlich
 * src/abenteuer/dialog/wegsperre-s17.test.ts.
 * Der Ausgang hängt von den Zügen des Gegners ab (Maia, Tagesform, Zufall; nicht festlegbar).
 * Verfehlt der Spieler sein Ziel (etwa Sieg statt Remis, weil der Gegner im letzten Zug etwas
 * einstellt), prüft der Test die Kette für den wirklichen Ausgang und vermerkt das im Bericht; nur
 * die Niederlage muss gelingen. Dafür verliert der Spieler mit großem Abstand (VERLUSTWERT): Am
 * 18.11.2026 stand er nur eine Figur schlechter, der Gegner stellte im letzten Zug die Dame ein,
 * und die Wertung gab den Sieg (Fehlversuch in GitHub Actions).
 * Laufzeit: Eine Partie dauert etwa 35 Sekunden. Im gewöhnlichen Lauf kommt deshalb jeder Ausgang
 * und jedes Format (Vorteil, Endspiel) genau so oft vor wie nötig, das sind vier Partien; mit
 * WEGSPERREN_ALLE=1 laufen alle sechs.
 * Abhängigkeiten: abenteuer-wegsperren.ts (Tabelle, Schritte), abenteuer-zugwahl.ts (Spieler).
 */
import { expect, test, type Page } from "@playwright/test";
import { liesSpeicherImBrowser, starteMitStand } from "./abenteuer-affe";
import {
  dateiname,
  fehlversuchssatz,
  foto,
  FOTO_MASSSTAB,
  geheZumRand,
  istFehlversuch,
  kachel,
  klickeDurch,
  SPERREN,
  standVor,
  uebergangskachel,
  type Ausgang,
  type Sperre,
} from "./abenteuer-wegsperren";
import {
  beendeSpielerDesProzesses,
  BESTER_ZUG,
  liesPartieImBrowser,
  SCHLECHTESTER_ZUG,
  schnellerZug,
  spielerDesProzesses,
  stellungNach,
  tippeZug,
  type Partiestand,
  type Zugwaehler,
} from "./abenteuer-zugwahl";

/**
 * Zielwert des Spielers, der verlieren will: etwa Dame und Leichtfigur weniger, aber kein Matt.
 * Der Abstand zur Schwelle ist mit Absicht groß: Stellt der Gegner im letzten Zug die Dame ein
 * (danach kann der Spieler nichts mehr ausgleichen), bleibt es eine Niederlage.
 */
const VERLUSTWERT = -12;
/** Nach so vielen Fehlversuchen lässt die Truppe durch (Notausgang). */
const NOTAUSGANG = 3;
/** So lange dürfen Gegnerzug und Wertung der Engine im Browser dauern. */
const ENGINE_FRIST = 45_000;
/** Pause auf dem Übergangsfeld, bevor der Schritt in den Durchgang wieder zählt (RUHEBILDER). */
const RUHE_MS = 800;

/** So lange versucht der Test, während der Wertung noch einen Zug zu tippen. */
const TIPPFRIST_MS = 400;
/**
 * Näher als so viele Bauern an einer Schwelle der Wertung gilt die Gegenprobe nicht: Die Engine im
 * Browser rechnet nach Zeit, die des Spielers nach Tiefe; in scharfen Stellungen liegen sie leicht
 * einen Bauern auseinander.
 */
const SCHWELLENABSTAND = 1.5;
/** So oft sieht der Test im Speicher nach, ob der Gegner gezogen hat (ms). */
const NACHSEHEN_MS = 100;
/** Mit WEGSPERREN_ALLE=1 laufen auch die Partien, die keinen neuen Ausgang und kein neues Format bringen. */
const ALLE_PARTIEN = process.env.WEGSPERREN_ALLE === "1";

/**
 * Ein Fall: welche Sperre, welches Ziel, mit welchem Zielwert der Spieler zieht und wie viele
 * Fehlversuche schon gezählt sind (Variable „…Niederlagen“).
 */
interface Fall {
  readonly sperre: Sperre;
  readonly ziel: Ausgang;
  readonly zielwert: number;
  readonly niederlagen?: number;
  /** Läuft nur mit WEGSPERREN_ALLE=1 (Ausgang und Format deckt schon ein anderer Fall). */
  readonly nurVollstaendig?: boolean;
}

const FAELLE: readonly Fall[] = [
  { sperre: SPERREN.s15, ziel: "sieg", zielwert: BESTER_ZUG },
  { sperre: SPERREN.s16, ziel: "remis", zielwert: SPERREN.s16.remiswert, nurVollstaendig: true },
  // Verliert die Wertung nach zwölf Zügen; die Sperre bleibt zu.
  { sperre: SPERREN.s16, ziel: "niederlage", zielwert: VERLUSTWERT },
  { sperre: SPERREN.s17, ziel: "sieg", zielwert: BESTER_ZUG, nurVollstaendig: true },
  // Hält nur Remis: An S17 bleibt die Sperre zu, und der Versuch zählt.
  { sperre: SPERREN.s17, ziel: "remis", zielwert: SPERREN.s17.remiswert },
  // Lässt sich mattsetzen (Ende nach den Regeln statt durch die Wertung); der dritte Fehlversuch.
  { sperre: SPERREN.s17, ziel: "niederlage", zielwert: SCHLECHTESTER_ZUG, niederlagen: 2 },
];

/** Die Variablen der Truppe aus dem gespeicherten Spielstand. */
async function variablen(seite: Page): Promise<Record<string, unknown>> {
  const stand = (await seite.evaluate(liesSpeicherImBrowser)).abenteuer;
  return (stand?.dialogvariablen ?? {}) as Record<string, unknown>;
}

/**
 * Drückt am Übergangsfeld in den Durchgang und klickt alles weg, was kommt; gibt die Texte. Mit
 * `bild` entsteht vorher ein Foto des ersten Fensters (nur mit FOTO_ORDNER).
 */
async function druecke(seite: Page, sperre: Sperre, wahl?: string, bild?: string): Promise<string> {
  await seite.waitForTimeout(RUHE_MS);
  await seite.keyboard.down(sperre.taste);
  const fenster = seite.getByTestId("abenteuer-dialog");
  const schild = seite.getByTestId("abenteuer-ortsschild");
  await expect(fenster.or(schild.filter({ hasText: sperre.zielschild }))).toBeVisible({
    timeout: 15000,
  });
  await seite.keyboard.up(sperre.taste);
  if (bild) await foto(seite, bild);
  return klickeDurch(seite, wahl);
}

/** Vom Übergang bis ans Brett: Gespräch, „Eine Stellung.“, Deck, erzählter Einstieg. */
async function beginnePartie(seite: Page, sperre: Sperre): Promise<void> {
  const dialog = seite.getByTestId("abenteuer-dialog");
  await geheZumRand(seite, sperre);
  await seite.keyboard.down(sperre.taste);
  await expect(dialog).toContainText(sperre.erste, { timeout: 15000 });
  await seite.keyboard.up(sperre.taste);
  const los = seite.getByTestId("abenteuer-deck-los");
  await klickeDurch(seite, "„Eine Stellung.“", los);
  await los.click();
  const einstieg = seite.getByTestId("abenteuer-erzaehlung");
  await expect(einstieg).toContainText(sperre.einstieg, { timeout: 30000 });
  await expect(seite.getByTestId("abenteuer-kurzform")).toContainText(`Noch ${sperre.zuege} Züge`);
  await foto(seite, `partie_${dateiname(sperre)}_0_einstieg`);
  await seite.getByTestId("abenteuer-erzaehlung-weiter").click();
  await expect(einstieg).toBeHidden();
}

/** Wartet, bis die Partie im Speicher so weit ist (Gegner hat geantwortet oder Ende). */
async function wartePartie(seite: Page, bis: (p: Partiestand) => boolean): Promise<Partiestand> {
  let stand: Partiestand | null = null;
  await expect
    .poll(
      async () => {
        stand = await seite.evaluate(liesPartieImBrowser);
        return stand !== null && bis(stand);
      },
      { timeout: ENGINE_FRIST, intervals: [NACHSEHEN_MS] },
    )
    .toBe(true);
  if (!stand) throw new Error("Keine Partie im Speicher");
  return stand;
}

/**
 * Spielt die Partie bis zum Ende: je eigener Zug wählen, tippen, auf die Antwort warten; nach
 * dem letzten vereinbarten Zug wertet die Hülle. Ausgabe: die beendete Partie.
 */
async function spielePartie(
  seite: Page,
  spieler: Zugwaehler,
  sperre: Sperre,
  zielwert: number,
): Promise<Partiestand> {
  let stand = await wartePartie(seite, (p) => p.ende === null);
  for (let zug = 0; zug < sperre.zuege && stand.ende === null; zug++) {
    const halbzuege = stand.zuege.length;
    await expect(seite.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
      timeout: ENGINE_FRIST,
    });
    await tippeZug(seite, await spieler.waehle(stellungNach(stand), zielwert));
    stand = await wartePartie(seite, (p) => p.ende !== null || p.zuege.length >= halbzuege + 2);
  }
  // Während die Hülle wertet, ist das Brett zu: Ein schneller weiterer Zug darf nicht zählen
  // (vorher lief die Partie dann einen Zug länger als vereinbart, Befund vom 18.11.2026).
  const zusatz = stand.ende === null ? schnellerZug(stellungNach(stand)) : null;
  if (zusatz) await tippeZug(seite, zusatz, TIPPFRIST_MS).catch(() => undefined);
  return wartePartie(seite, (p) => p.ende !== null);
}

/** Der Ausgang aus Sicht des Lesers (Weiß) aus dem gespeicherten Ende. */
function ausgangAus(stand: Partiestand): Ausgang {
  if (stand.sieger === null) return "remis";
  return stand.sieger === "white" ? "sieg" : "niederlage";
}

/**
 * Der Ausgang, den die Wertung bei diesem Wert geben muss; null, wenn der Wert zu nah an einer
 * Schwelle liegt (die Engine im Browser rechnet nicht auf den Hundertstelbauern gleich).
 * Beispiel: S17 (Endspiel, Sieg ab 3,0), Wert +6,2 → „sieg“; Wert +2,8 → null.
 */
function erwarteterAusgang(sperre: Sperre, wert: number): Ausgang | null {
  const { sieg, remis } = sperre.schwellen;
  if ([sieg, remis].some((schwelle) => Math.abs(wert - schwelle) < SCHWELLENABSTAND)) return null;
  if (wert >= sieg) return "sieg";
  return wert >= remis ? "remis" : "niederlage";
}

test.use(FOTO_MASSSTAB);

// Die Engine des Spielers hält den Prozess offen, bis sie freigegeben ist.
test.afterAll(() => beendeSpielerDesProzesses());

for (const fall of FAELLE) {
  const { sperre, ziel } = fall;
  const vorher = fall.niederlagen ?? 0;
  const zusatz = vorher > 0 ? ` (nach ${vorher} Fehlversuchen)` : "";
  test(`Partie an der Wegsperre ${sperre.nr}, Ziel ${ziel}${zusatz}`, async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Laufen mit gehaltener Taste nur in Chromium");
    test.skip(fall.nurVollstaendig === true && !ALLE_PARTIEN, "nur mit WEGSPERREN_ALLE=1");
    test.slow();
    const spieler = spielerDesProzesses();
    await starteMitStand(
      page,
      standVor(sperre, vorher > 0 ? { [`${sperre.stamm}Niederlagen`]: vorher } : {}),
    );
    const bild = `partie_${dateiname(sperre)}_${ziel}`;
    await beginnePartie(page, sperre);
    const ende = await spielePartie(page, spieler, sperre, fall.zielwert);
    const ausgang = ausgangAus(ende);
    test.info().annotations.push({
      type: "Partie",
      description: `Ziel ${ziel}, Ausgang ${ausgang}, Ende ${ende.ende}: ${ende.zuege.join(" ")}`,
    });
    if (ziel === "niederlage") expect(ausgang).toBe("niederlage");
    // Die Wertung beendet die Partie nach genau den vereinbarten Zügen (oder vorher ein Matt).
    if (ende.ende === "ziel" || ende.ende === "zielRemis") {
      expect(ende.zuege).toHaveLength(2 * sperre.zuege);
      // Gegenprobe: Die eigene Engine bewertet die Schlussstellung; liegt ihr Wert klar neben den
      // Schwellen, muss der Ausgang der Hülle dazu passen.
      const wert = await spieler.bewerte(stellungNach(ende));
      test.info().annotations.push({ type: "Schlusswert", description: `${wert} Bauern` });
      const erwartet = erwarteterAusgang(sperre, wert);
      if (erwartet) expect(ausgang, `Wertung bei ${wert} Bauern`).toBe(erwartet);
    }
    // Der Satz „nachher“ passt zum Ausgang, der Zähler ist weg.
    await expect(page.getByTestId("abenteuer-nachwort")).toContainText(sperre.nachher[ausgang]);
    await expect(page.getByTestId("abenteuer-kurzform")).toBeHidden();
    await foto(page, `${bild}_1_ende_${ausgang}`);
    await page.getByTestId("partie-zurueck-zur-stadt").click();
    await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
    // Ergebniskarte, dann die Rückmeldung (oberwelt/nachergebnis.ts, Wunsch des Autors 19.11.2026):
    // Das Gespräch mit der Truppe öffnet sich von selbst; vorher kam es erst beim nächsten Druck
    // auf den Übergang. Der Held steht weiter auf dem Übergangsfeld.
    const gespraech = await klickeDurch(page, "„Nicht jetzt.“");
    expect(await kachel(page)).toBe(uebergangskachel(sperre));
    await foto(page, `${bild}_2_truppe`);

    const schild = page.getByTestId("abenteuer-ortsschild");
    const fehlversuch = istFehlversuch(sperre, ausgang);
    const satz = fehlversuchssatz(sperre, ausgang);
    const oeffnet = !fehlversuch || vorher + 1 >= NOTAUSGANG;
    if (fehlversuch) {
      expect(gespraech).toContain(satz);
      expect(gespraech).not.toContain(sperre.durch);
      if (oeffnet) expect(gespraech).toContain(sperre.genug);
    } else {
      expect(gespraech).toContain(sperre.durch);
    }
    await expect
      .poll(() => variablen(page))
      .toMatchObject({
        [`${sperre.stamm}Durch`]: oeffnet,
        [`${sperre.stamm}Niederlagen`]: vorher + (fehlversuch ? 1 : 0),
        [`${sperre.stamm}Spielt`]: false,
      });
    if (!oeffnet) {
      // Noch einmal an den Übergang: dasselbe Gespräch, der Fehlversuch zählt nicht doppelt.
      await expect(schild).toHaveText(sperre.schild);
      expect(await druecke(page, sperre, "„Nicht jetzt.“")).toContain(satz);
      await expect(schild).toHaveText(sperre.schild);
      expect(await variablen(page)).toMatchObject({
        [`${sperre.stamm}Durch`]: false,
        [`${sperre.stamm}Niederlagen`]: vorher + 1,
      });
      return;
    }
    // Offen: Der nächste Schritt in den Durchgang wechselt die Karte, die Truppe kommt nicht mehr.
    if ((await schild.textContent()) !== sperre.zielschild) {
      const danach = await druecke(page, sperre);
      expect(danach).not.toContain(satz);
      expect(danach).not.toContain(sperre.durch);
    }
    await expect(schild).toHaveText(sperre.zielschild, { timeout: 15000 });
  });
}
