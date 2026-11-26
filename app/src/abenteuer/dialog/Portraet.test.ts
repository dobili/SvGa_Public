// Porträts im Dialog (Q17-2): Dateinamen und für jeden Sprecher der Dialoge ein Bild. Dazu die
// Dauerprüfung vom 25.11.2026 (Befund des Autors: „immer wieder“ kein Porträt): Jede Zeile mit
// Sprecher findet in jeder ihrer Stimmungen ein Bild in der Suchreihe von Portraet.tsx, im Paket,
// das der Paketbau gerade gebaut hat (mit privatem Paket Blätter und Großbilder, sonst die SVG).
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { blattpfad } from "./portraetblatt";
import { ersatzpfad, grossePortraets, portraetpfad } from "./portraetpfad";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
/**
 * Sprecher, die schon reden, aber noch kein Porträt haben (Hauptchat, 13.11.2026: Porträts kommen
 * später aus einer anderen Quelle; bis dahin zeigt die App keines). Name steht in den Spieltexten.
 */
const NOCH_OHNE_PORTRAET = new Set([
  "ada",
  "silas",
  "kettering",
  "dunmore",
  "ivy",
  "jonah",
  // Lockport und Bahndamm (Lektorat Akt 2, 17.11.2026): sprechen jetzt mit eigener Zeile statt als Erzähler.
  "imogen",
  "ruben",
  "henrik",
  "rosalind",
  // Kellner im Kaffeehaus London 1851 (25.11.2026): eigene Figur von 1851, das Porträt des
  // modernen Kellners mit Fliege passte nicht. Sein Porträtblatt liegt seit 26.11.2026 im privaten
  // Paket (blatt/kellner-london.png); eine SVG für das öffentliche Paket hat er nicht.
  "kellnerLondon",
]);

const APP = new URL("../../../", import.meta.url);
/** Sprecher ohne Porträt: der Erzähler und der Held (er spricht nie mit Kopf). */
const OHNE_KOPF = new Set(["erzaehler", "held"]);
/** Wie RIVALE_SPRECHER und RIVALIN_SPRECHER in regeln/rivalform.ts. */
const RIVALE = "victor";
const RIVALIN = "victoria";

/** Alle Paare aus Sprecher und Stimmung in den Dialogen, als „sprecher:stimmung“. */
function sprecherUndStimmungen(): Set<string> {
  const ordner = new URL("dialoge/de/", INHALTE);
  const paare = new Set<string>();
  for (const datei of readdirSync(ordner).filter((d) => d.endsWith(".ink"))) {
    for (const zeile of readFileSync(new URL(datei, ordner), "utf8").split("\n")) {
      const sprecher = /#sprecher:([A-Za-z]+)/.exec(zeile)?.[1];
      if (!sprecher || OHNE_KOPF.has(sprecher)) continue;
      const stimmung = /#stimmung:([A-Za-z]+)/.exec(zeile)?.[1] ?? "";
      paare.add(`${sprecher}:${stimmung}`);
      if (sprecher === RIVALE) paare.add(`${RIVALIN}:${stimmung}`);
    }
  }
  return paare;
}

/**
 * Die Pfade des gebauten Pakets (public/abenteuer/paket.json, PNG liegt dort als WebP); ohne
 * gebautes Paket die Quellen in inhalte/abenteuer (dann nur die SVG).
 */
function paketpfade(): ReadonlySet<string> {
  const verzeichnis = new URL("public/abenteuer/paket.json", APP);
  if (existsSync(verzeichnis)) {
    const paket = JSON.parse(readFileSync(verzeichnis, "utf8")) as { dateien: { pfad: string }[] };
    return new Set(paket.dateien.map((d) => d.pfad));
  }
  const svg = readdirSync(new URL("portraets/", INHALTE)).map((d) => `portraets/${d}`);
  return new Set(svg);
}

/** Wie die Suchreihe in Portraet.tsx (suche): erstes vorhandenes Bild oder null. */
function findeBild(pfade: ReadonlySet<string>, sprecher: string, stimmung: string): string | null {
  const da = (p: string) => pfade.has(p) || pfade.has(p.replace(/\.png$/, ".webp"));
  const pfad = portraetpfad(sprecher, stimmung || null);
  const grund = portraetpfad(sprecher, null);
  const blatt = blattpfad(sprecher, stimmung || null);
  const kandidaten = [
    ...grossePortraets(pfad),
    ...(pfade.has("daten/portraetblatt.json") ? [blatt] : []),
    ersatzpfad(sprecher),
    pfad.replace(/\.svg$/, ".png"),
    pfad,
    grund.replace(/\.svg$/, ".png"),
    grund,
  ];
  return kandidaten.find(da) ?? null;
}

/**
 * Sprecher, die auch mit privatem Paket nur das alte Ersatzgesicht (Sprechbogen oder SVG) zeigen:
 * Sie haben keine eigene Figur in figuren-neu, aus der skripte/ersatzportraets.mjs ein Porträt
 * baut (Stand 25.11.2026). Die Liste schrumpft nur.
 */
// Wren, Ike und der Fährmann haben seit dem 26.11.2026 ein Porträtblatt (Gemini-Schnittstelle).
const NUR_ERSATZGESICHT = new Set(["greifarm"]);

/** Stufe des gefundenen Bildes: echt (Großbild, Blatt), Figur (Ersatzporträt) oder Ersatzgesicht. */
function stufeVon(pfad: string | null): "echt" | "figur" | "ersatzgesicht" | "keins" {
  if (!pfad) return "keins";
  if (pfad.startsWith("portraets/gross/") || pfad.startsWith("portraets/blatt/")) return "echt";
  return pfad.startsWith("portraets/ersatz/") ? "figur" : "ersatzgesicht";
}

describe("Porträts", () => {
  it("mit privatem Paket zeigt nur NUR_ERSATZGESICHT das alte Ersatzgesicht", () => {
    const pfade = paketpfade();
    // Ohne privates Paket gibt es keine Figuren und keine Ersatzporträts: dann nichts zu prüfen.
    if (![...pfade].some((p) => p.startsWith("portraets/ersatz/"))) return;
    const sprecher = new Set([...sprecherUndStimmungen()].map((p) => p.split(":")[0] ?? ""));
    const alt = [...sprecher].filter(
      (s) => stufeVon(findeBild(pfade, s, "")) === "ersatzgesicht" && !NUR_ERSATZGESICHT.has(s),
    );
    expect(alt).toEqual([]);
  });

  it("jede Zeile mit Sprecher findet in jeder Stimmung ein Porträt im Paket", () => {
    const pfade = paketpfade();
    // Rivalin Victoria (regeln/rivalform.ts): Ihr Blatt liegt nur im privaten Paket; ohne es zeigt
    // der Dialog bewusst kein Porträt statt Victors Gesicht. Geprüft nur mit privatem Paket.
    const mitBlaettern = [...pfade].some((p) => p.startsWith("portraets/blatt/"));
    const ohne = [...sprecherUndStimmungen()]
      .filter((paar) => mitBlaettern || !paar.startsWith(`${RIVALIN}:`))
      .filter((paar) => !NOCH_OHNE_PORTRAET.has(paar.split(":")[0] ?? ""))
      .filter((paar) => {
        const [sprecher = "", stimmung = ""] = paar.split(":");
        return findeBild(pfade, sprecher, stimmung) === null;
      });
    expect(ohne).toEqual([]);
  });

  it("die Liste der Sprecher ohne Porträt schrumpft nur: jeder Eintrag ist noch ohne SVG", () => {
    const veraltet = [...NOCH_OHNE_PORTRAET].filter((s) =>
      existsSync(new URL(portraetpfad(s, null), INHALTE)),
    );
    expect(veraltet).toEqual([]);
  });

  it("bildet den Sprecher auf die Datei ab", () => {
    expect(portraetpfad("coachDelgado", null)).toBe("portraets/coach-delgado.svg");
    expect(portraetpfad("ambrose", "jung")).toBe("portraets/ambrose-jung.svg");
    expect(portraetpfad("ambrose", "froh")).toBe("portraets/ambrose.svg");
    // Fassungen (T4): eigener Dateiname, kebab-case.
    expect(portraetpfad("mira", "lachtOhneSpott")).toBe("portraets/mira-lacht-ohne-spott.svg");
    expect(portraetpfad("ambrose", "muede")).toBe("portraets/ambrose-muede.svg");
    // Große Porträts (64 oder 96 Pixel) gehen vor: WebP, dann PNG, Fassung im Namen.
    expect(grossePortraets("portraets/mira-lacht-ohne-spott.svg")).toEqual([
      "portraets/gross/mira-lacht-ohne-spott.webp",
      "portraets/gross/mira-lacht-ohne-spott.png",
    ]);
  });

  it("jeder Sprecher in den Dialogen hat ein Porträt", () => {
    const ordner = new URL("dialoge/de/", INHALTE);
    const sprecher = new Set<string>();
    for (const datei of readdirSync(ordner).filter((d) => d.endsWith(".ink"))) {
      const text = readFileSync(new URL(datei, ordner), "utf8");
      for (const m of text.matchAll(/#sprecher:([A-Za-z]+)/g)) if (m[1]) sprecher.add(m[1]);
    }
    const fehlen = [...sprecher]
      .filter((s) => s !== "erzaehler" && s !== "held" && !NOCH_OHNE_PORTRAET.has(s))
      .filter((s) => !existsSync(new URL(portraetpfad(s, null), INHALTE)));
    expect(fehlen).toEqual([]);
  });

  it("Sprecher ohne Porträt haben einen Namen in den Spieltexten", () => {
    const texte = JSON.parse(readFileSync(new URL("texte/de.json", INHALTE), "utf8")) as Record<
      string,
      string
    >;
    const ohneName = [...NOCH_OHNE_PORTRAET].filter((s) => !texte[`figur.${s}.name`]);
    expect(ohneName).toEqual([]);
  });
});
