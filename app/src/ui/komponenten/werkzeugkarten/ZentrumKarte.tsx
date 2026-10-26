/**
 * Engine-Teil des Werkzeugs k2-zielbilanz in der Werkzeugkarte: Hängt ein angegriffener
 * Zentrumsbauer wirklich?
 *
 * Rolle im Gesamtbild: Entscheidung des Autors zu C1.1 und C1.2 (16.10.2026). Die Zielbilanz
 * zählt jeden Zentrumsbauern und nennt einen, den der Gegner am Zug laut Abtauschrechnung mit
 * Gewinn schlagen könnte, nur „angegriffen“. Danach rechnet die Engine kurz nach, ob der Schlag
 * auch nach der besten Antwort Material bringt (engine/zentrumsschlag.ts), und schreibt das
 * Ergebnis hierher: „Engine: Sxe4 gewinnt den Bauern e4 nicht: 3... Sxe4 4. De2 …“ (Abb. 2.40)
 * oder „Engine: Der Bauer d5 hängt wirklich: 11. Lxd5 …“ mit „Zentrum nur teils“ (Abb. 2.29).
 * Wie GegnerKarte als `zusatz` in der Werkzeugkarte, weil die Rechnung einige Sekunden dauert.
 * Abhängigkeiten: engine/zentrumsschlag.ts, engine/engineDienst.ts, schach/zielbilanz.ts,
 * schach/notation.ts, i18n.
 */
import { useEffect, useMemo, useState } from "react";
import { aufzaehlung, farbname } from "../../../analyse/texte";
import { AuftragAbgebrochen, engine } from "../../../engine/engineDienst";
import { pruefeZentrumsschlag, type Zentrumsschlag } from "../../../engine/zentrumsschlag";
import { sprache, t } from "../../../i18n/sprache";
import { Angriffskarte } from "../../../schach/angriffskarte";
import { zugfolgeAlsText } from "../../../schach/notation";
import { feldname, gegner, type Stellung } from "../../../schach/stellung";
import { zentrumMitEngine, zielbilanz, type Zentrumspruefung } from "../../../schach/zielbilanz";

/** Rechenzeit je angegriffenem Bauern: kurz, die Widerlegungen sind fünf bis sieben Halbzüge tief. */
const PRUEFZEIT_MS = 2000;
/** So viele Halbzüge zeigt die Karte: der Schlag und fünf Züge danach (Abb. 2.40 bis 5. Dxe4 d6). */
const HALBZUEGE_FOLGE = 6;

type Zustand =
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly pruefungen: readonly (Zentrumsschlag | null)[] }
  | { readonly art: "fehler"; readonly meldung: string };

/** Prüft die Felder nacheinander (die Engine rechnet immer nur einen Auftrag). */
async function pruefeAlle(
  fen: string,
  felder: readonly string[],
): Promise<(Zentrumsschlag | null)[]> {
  const ergebnisse: (Zentrumsschlag | null)[] = [];
  for (const feld of felder)
    ergebnisse.push(await pruefeZentrumsschlag(engine, fen, feld, PRUEFZEIT_MS));
  return ergebnisse;
}

/** Der Satz zu einem Bauern, mit Schlag und Folge in der Notation des Buches. */
function satz(stellung: Stellung, feld: string, p: Zentrumsschlag | null): string {
  if (!p || !stellung.regeln) return t("zielbilanz.engine.keinSchlag", { feld });
  const folge = zugfolgeAlsText(
    stellung.regeln,
    [p.schlag, ...p.folge],
    sprache(),
    HALBZUEGE_FOLGE,
  );
  if (p.haengt) return t("zielbilanz.engine.haengt", { feld, folge });
  const zug = zugfolgeAlsText(stellung.regeln, [p.schlag], sprache()).replace(/^\d+\.+\s/, "");
  return t("zielbilanz.engine.nicht", { zug, feld, folge });
}

/** Rechnet die Prüfungen für die Felder, sobald es welche gibt; ohne Felder bleibt es still. */
function useZentrumspruefung(fen: string, felder: readonly string[]): Zustand {
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet" });
  useEffect(() => {
    if (felder.length === 0) return;
    let aktiv = true;
    pruefeAlle(fen, felder)
      .then((pruefungen) => {
        if (aktiv) setzeZustand({ art: "fertig", pruefungen });
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeZustand({ art: "fehler", meldung });
      });
    return () => {
      aktiv = false;
    };
  }, [fen, felder]);
  return zustand;
}

/** Ein Satz je Bauer, dazu die Wertung des Zentrums nach dem Urteil der Engine. */
function Urteil({
  stellung,
  zentrum,
  pruefungen,
}: {
  stellung: Stellung;
  zentrum: Zentrumspruefung;
  pruefungen: readonly (Zentrumsschlag | null)[];
}) {
  const haengen = zentrum.angegriffen.filter((_, i) => pruefungen[i]?.haengt === true);
  const wertung = zentrumMitEngine(zentrum, haengen) === "teils" ? "teils" : "ja";
  return (
    <>
      {zentrum.angegriffen.map(feldname).map((feld, i) => (
        <p key={feld}>{satz(stellung, feld, pruefungen[i] ?? null)}</p>
      ))}
      <p>
        {t(`zielbilanz.engine.wertung.${wertung}`, { farbe: farbname(gegner(stellung.amZug)) })}
      </p>
    </>
  );
}

/**
 * Prüft die angegriffenen Zentrumsbauern der Seite, die nicht am Zug ist, und zeigt das Urteil.
 *
 * Eingaben: Stellung. Ausgabe: ein Abschnitt der Werkzeugkarte, oder nichts, wenn kein
 * Zentrumsbauer angegriffen ist. Beispiel: Abb. 2.24 (Schwarz am Zug): „Engine: Sxe4 gewinnt den
 * Bauern e4 nicht: 6... Sxe4 7. dxc5 …“.
 * Sonderfälle: Ein abgebrochener Auftrag (anderes Werkzeug gewählt) bleibt still.
 */
export function ZentrumKarte({ stellung }: { stellung: Stellung }) {
  const seite = gegner(stellung.amZug);
  const zentrum = useMemo(
    () =>
      zielbilanz(stellung.brett, new Angriffskarte(stellung.brett), seite, stellung.amZug).zentrum,
    [stellung, seite],
  );
  const felder = useMemo(() => zentrum.angegriffen.map(feldname), [zentrum]);
  const zustand = useZentrumspruefung(stellung.fen, felder);
  if (felder.length === 0) return null;
  return (
    <div className="zentrum-engine" aria-live="polite" data-testid="zentrum-engine">
      <h3>{t("zielbilanz.engine.titel", { farbe: farbname(seite) })}</h3>
      {zustand.art === "rechnet" && (
        <p className="lade">
          <span className="ladepunkt" aria-hidden="true" />{" "}
          {t("zielbilanz.engine.rechnet", { felder: aufzaehlung(felder) })}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">{t("zielbilanz.engine.fehler", { meldung: zustand.meldung })}</p>
      )}
      {zustand.art === "fertig" && (
        <Urteil stellung={stellung} zentrum={zentrum} pruefungen={zustand.pruefungen} />
      )}
    </div>
  );
}
