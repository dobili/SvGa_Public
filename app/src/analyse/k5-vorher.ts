/**
 * Werkzeug k5-vorher: Skelett-Röntgen „Vorher“. Was ein Bauernzug vorn gewinnt, hinten für immer
 * aufgibt und welchen der vier Gründe er erfüllt.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Bei jedem Bauernzug: welche Felder er neu kontrolliert
 * und welche Felder dahinter kein Bauer mehr kontrollieren kann. Gold: neu kontrollierte Felder.
 * Rot: dauerhaft aufgegebene Felder.“). Geprüft wird der geplante Zug (in der Abbildung der
 * nächste Zug im Buch), wenn er ein Bauernzug ist, sonst der letzte Zug der Zugleiste.
 * Abhängigkeiten: schach/bauernzug.ts, schach/todsuenden.ts (Verlauf), i18n.
 * Buchbezug: Kapitel 5, „Das Grundgesetz der Bauern“ (Abb. 5.1, 5.2) und Schritt 0 des
 * Skelett-Röntgens („Vorher: Was gewinnt er vorn, und was gibt er hinten für immer auf?“).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { makeSanAndPlay, parseSan } from "chessops/san";
import { t } from "../i18n/sprache";
import { bauernzug, type Bauernzug } from "../schach/bauernzug";
import { feldname, stellungAusFen, type Stellung } from "../schach/stellung";
import type { Verlauf } from "../schach/todsuenden";
import { felderText } from "./skelett";
import { figurenname, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

const ANZAHL_GRUENDE = 4;

/** Der geprüfte Bauernzug mit seiner Herkunft. */
interface Pruefzug {
  readonly zug: Bauernzug;
  readonly stellung: Stellung;
  readonly herkunft: "buch" | "letzter";
}

/** Die Stellung vor dem letzten Zug des Verlaufs und dieser Zug (SAN), oder null. */
function vorLetztemZug(verlauf: Verlauf): { stellung: Stellung; san: string } | null {
  const letzter = verlauf.zuege.at(-1);
  const setup = parseFen(verlauf.startFen);
  if (letzter === undefined || setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  if (pos.isErr) return null;
  for (const san of verlauf.zuege.slice(0, -1)) {
    const zug = parseSan(pos.value, san);
    if (!zug) return null;
    makeSanAndPlay(pos.value, zug);
  }
  const stellung = stellungAusFen(makeFen(pos.value.toSetup()));
  return stellung.ok ? { stellung: stellung.wert, san: letzter } : null;
}

/** Wählt den Bauernzug: der geplante Zug, sonst der letzte Zug des Verlaufs. */
function pruefzug(stellung: Stellung, geplant?: string, verlauf?: Verlauf): Pruefzug | null {
  const geplanter = geplant ? bauernzug(stellung, geplant) : null;
  if (geplanter) return { zug: geplanter, stellung, herkunft: "buch" };
  const davor = verlauf ? vorLetztemZug(verlauf) : null;
  const letzter = davor ? bauernzug(davor.stellung, davor.san) : null;
  return letzter && davor ? { zug: letzter, stellung: davor.stellung, herkunft: "letzter" } : null;
}

/** Die vier Gründe als Zeilen; `erfuellt` zählt, wie viele zutreffen. */
function gruendeZeilen(z: Bauernzug): { zeilen: string[]; erfuellt: string[] } {
  const g = z.gruende;
  const zeilen: string[] = [];
  const erfuellt: string[] = [];
  if (g.felder.length > 0) {
    zeilen.push(t("vorher.grund.felder.ja", { felder: felderText(g.felder) }));
    erfuellt.push(t("vorher.grundname.felder"));
  } else zeilen.push(t("vorher.grund.felder.nein"));
  if (g.neueSchwaechenGegner.length > 0 || g.beseitigteSchwaechen.length > 0) {
    const teile = [
      ...(g.neueSchwaechenGegner.length > 0
        ? [t("vorher.schwaeche.schafft", { felder: felderText(g.neueSchwaechenGegner) })]
        : []),
      ...(g.beseitigteSchwaechen.length > 0
        ? [t("vorher.schwaeche.beseitigt", { felder: felderText(g.beseitigteSchwaechen) })]
        : []),
    ];
    zeilen.push(t("vorher.grund.schwaeche.ja", { text: teile.join(", ") }));
    erfuellt.push(t("vorher.grundname.schwaeche"));
  } else zeilen.push(t("vorher.grund.schwaeche.nein"));
  if (g.hebelGegen.length > 0) {
    zeilen.push(t("vorher.grund.richtung.ja", { felder: felderText(g.hebelGegen) }));
    erfuellt.push(t("vorher.grundname.richtung"));
  } else zeilen.push(t("vorher.grund.richtung.nein"));
  if (g.geoeffnetFuer.length > 0 || g.luftloch) {
    const figuren = g.geoeffnetFuer.map(figurenname);
    const text = g.luftloch
      ? t("vorher.figur.luftloch")
      : t("vorher.figur.oeffnet", { figuren: felderTextVon(figuren) });
    zeilen.push(t("vorher.grund.figur.ja", { text }));
    erfuellt.push(t("vorher.grundname.figur"));
  } else zeilen.push(t("vorher.grund.figur.nein"));
  return { zeilen, erfuellt };
}

function felderTextVon(namen: readonly string[]): string {
  return namen.length <= 1
    ? namen.join("")
    : `${namen.slice(0, -1).join(", ")}${t("text.und")}${namen.at(-1) ?? ""}`;
}

function markierungen(z: Bauernzug): Markierung[] {
  const feld = (f: number, farbe: "gold" | "rot"): Markierung => ({
    typ: "feld",
    farbe,
    feld: feldname(f),
  });
  return [
    { typ: "pfeil", farbe: "gold", von: feldname(z.von), nach: feldname(z.nach) },
    ...z.neuKontrolliert.map((f) => feld(f, "gold")),
    ...z.aufgegeben.map((f) => feld(f, "rot")),
    ...z.neueLoecher.filter((f) => !z.aufgegeben.includes(f)).map((f) => feld(f, "rot")),
  ];
}

function ohneBauernzug(): Werkzeugergebnis {
  const befund: Befund = {
    kennung: "keiner",
    art: "E",
    titel: t("vorher.keiner.titel"),
    zeilen: [t("vorher.keiner.text")],
    farbe: null,
  };
  return {
    werkzeug: "k5-vorher",
    art: "E",
    ueberschrift: t("vorher.titelOhne"),
    befunde: [befund],
    fazit: t("vorher.keiner.fazit"),
    markierungen: [],
    stufen: [["keiner"], ["keiner"], ["keiner"]],
    regel: t("werkzeug.k5-vorher.regel"),
  };
}

/**
 * Prüft einen Bauernzug nach dem Grundgesetz der Bauern.
 *
 * Eingaben: Stellung, geplanter Zug (SAN englisch, freiwillig), Verlauf (freiwillig).
 * Ausgabe: drei Befunde (vorn, hinten, die vier Gründe), oder der Hinweis, dass kein Bauernzug
 * vorliegt. Beispiel: Grundstellung mit 1. e4: neu d5 und f5 (gold), aufgegeben d3 und f3 (rot),
 * Gründe Felder und Figur (Läufer f1, Dame d1), wie Abb. 5.1 und 5.2.
 */
export function vorher(stellung: Stellung, geplant?: string, verlauf?: Verlauf): Werkzeugergebnis {
  const geprueft = pruefzug(stellung, geplant, verlauf);
  if (!geprueft) return ohneBauernzug();
  const { zug } = geprueft;
  const name = zugtext(zug.san);
  const { zeilen, erfuellt } = gruendeZeilen(zug);
  const befunde: Befund[] = [
    {
      kennung: "vorn",
      art: "E",
      titel: t("vorher.gewinnt", { zug: name }),
      zeilen: [
        zug.neuKontrolliert.length > 0
          ? t("vorher.neu", { felder: felderText(zug.neuKontrolliert) })
          : t("vorher.neuKeine"),
      ],
      farbe: "gold",
    },
    {
      kennung: "hinten",
      art: "E",
      titel: t("vorher.gibtAuf"),
      zeilen: [
        zug.aufgegeben.length > 0
          ? t("vorher.aufgegeben", { felder: felderText(zug.aufgegeben) })
          : t("vorher.aufgegebenKeine"),
        ...(zug.neueLoecher.length > 0
          ? [t("vorher.neueLoecher", { felder: felderText(zug.neueLoecher) })]
          : []),
      ],
      farbe: "rot",
    },
    { kennung: "gruende", art: "E", titel: t("vorher.gruende"), zeilen, farbe: null },
  ];
  const fazit =
    erfuellt.length > 0
      ? t("vorher.fazit", {
          zug: name,
          anzahl: erfuellt.length,
          von: ANZAHL_GRUENDE,
          gruende: felderTextVon(erfuellt),
        })
      : t("vorher.fazitKeiner", { zug: name });
  return {
    werkzeug: "k5-vorher",
    art: "E",
    ueberschrift: t("vorher.titel", {
      zug: name,
      herkunft: t(`vorher.herkunft.${geprueft.herkunft}`),
    }),
    befunde,
    fazit,
    markierungen: markierungen(zug),
    stufen: [
      ["vorn", "hinten"],
      ["vorn", "hinten", "gruende"],
      ["vorn", "hinten", "gruende"],
    ],
    regel: t("werkzeug.k5-vorher.regel"),
  };
}

/** Das Werkzeug k5-vorher in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k5Vorher: Werkzeug = {
  id: "k5-vorher",
  kapitel: 5,
  name: "werkzeug.k5-vorher.name",
  regel: "werkzeug.k5-vorher.regel",
  erklaerung: "werkzeug.k5-vorher.erklaerung",
  art: "E",
  braucht: ["stellung", "zug", "verlauf"],
  berechne: ({ stellung, zug, verlauf }) => vorher(stellung, zug, verlauf),
};
