/**
 * Aufgabenrunde des Schach-Abenteuers in der App (Regelwerk R30 bis R32, Entscheidung A7):
 * Buchübungen und Motivaufgaben aus den Trainern der App, gespielt im Rundenrahmen des
 * Taktiktrainers, am Ende das Ergebnis je Aufgabe in den Spielstand und zurück in die Stadt.
 *
 * Rolle im Gesamtbild: Zusatzansicht „abenteuer-aufgaben“ (Vollbild) mit dem Auftrag aus dem
 * Spielstand (`laufendeAufgaben`). Buchübungen sind die Aufgaben des Taktiktrainers mit
 * `herkunft.uebung`; Motivaufgaben kommen aus den Lichess-Zusatzaufgaben (Themen wie „haengend“,
 * „matt1“) oder dem Taktiktrainer (Motive, „mattbilder“) in der Zielschwierigkeit. Die Runde
 * zählt für die App wie eine Taktikrunde (R32: Wiederholung, Tagesprotokoll). Die Regeln des
 * Spiels (Bestehen, zweite Runde) kennt diese Datei nicht; sie liefert nur die Antworten.
 * Abhängigkeiten: ui/trainer (Rundenrahmen, useRunde, Taktikaufgabe), training/taktiktrainer.ts,
 * training/zusatzaufgaben.ts, anbindung/dienste.ts (Spielstand), schnittstelle/aufgaben.ts.
 * Erinnerungen (Auftrag mit `erinnerung`) spielen statt der Runde das Zugerraten einer
 * Klassikerpartie (ErinnerungsRunde.tsx, docs/spiel/08, F1).
 * Sonderfall: Taktikaufgaben melden nur richtig oder falsch; „mit Hilfe“ (halber Punkt) bleibt
 * den Buchübungen der App vorbehalten und kommt hier noch nicht vor.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { ladeZusatzaufgaben } from "../../daten/laden";
import { ladeTaktik } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { aendere } from "../../speicher/speicher";
import type { Antwortergebnis } from "../../training/wiederholung";
import { useDaten } from "../../ui/komponenten/bausteine/useDaten";
import { Rundenrahmen } from "../../ui/trainer/Rundenrahmen";
import { Taktikaufgabe } from "../../ui/trainer/Taktikaufgabe";
import { useRunde, type Runde } from "../../ui/trainer/useRunde";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import { ANSICHT_ABENTEUER } from "../schnittstelle/modul";
import { tSpiel } from "../texte/texte";
import { useAbenteuerstand } from "./dienste";
import { ErinnerungsRunde } from "./ErinnerungsRunde";
import { rundenaufgaben, type Rundenaufgabe } from "./rundenaufgaben";

/** Die Runde selbst; eigene Komponente, damit `useRunde` die fertige Aufgabenliste bekommt. */
function Runde({
  auftrag,
  aufgaben,
  beiEnde,
}: {
  auftrag: Aufgabenauftrag;
  aufgaben: readonly Rundenaufgabe[];
  beiEnde: (ergebnisse: readonly Antwortergebnis[], sekunden: number) => void;
}) {
  const runde = useRunde("taktik", aufgaben.length);
  const ergebnisse = useRef<Antwortergebnis[]>([]);
  const gemeldet = useRef(false);
  useEffect(() => {
    if (!runde.fertig || gemeldet.current) return;
    gemeldet.current = true;
    beiEnde(ergebnisse.current, runde.sekunden ?? 0);
  }, [runde.fertig, runde.sekunden, beiEnde]);
  if (runde.fertig) {
    return (
      <section className="karte" data-testid="abenteuer-aufgaben-ende">
        <h2 className="karte-titel">{t("trainer.rundeFertig")}</h2>
        <p>{t("trainer.ergebnis", { richtig: runde.richtig, anzahl: runde.anzahl })}</p>
        <ZurueckKnopf />
      </section>
    );
  }
  const aktuelle = aufgaben[runde.index];
  if (!aktuelle) return <p className="hinweis">{t("trainer.keineAufgaben")}</p>;
  // Die Antwort der Aufgabe geht zuerst ins Protokoll der Runde, dann in die Zählung der App.
  const mitProtokoll: Runde = {
    ...runde,
    beantworte: (richtig) => {
      if (runde.ergebnis === null) ergebnisse.current[runde.index] = richtig ? "richtig" : "falsch";
      runde.beantworte(richtig);
    },
  };
  return (
    <Rundenrahmen kennung="taktik" runde={mitProtokoll} nochmal={() => {}} zurAuswahl={null}>
      <div key={runde.index} className="trainer-aufgabe">
        {aktuelle.art === "zusatz" ? (
          <Taktikaufgabe
            aufgabe={aktuelle.aufgabe.aufgabe}
            runde={mitProtokoll}
            motivAbfragen={false}
            zusatz={{
              themenname: t(`zusatzaufgaben.thema.${aktuelle.aufgabe.thema}`),
              vorher: aktuelle.aufgabe.vorher,
            }}
          />
        ) : (
          <Taktikaufgabe
            aufgabe={aktuelle.aufgabe}
            runde={mitProtokoll}
            motivAbfragen={aktuelle.motivAbfragen}
          />
        )}
      </div>
      <p className="hinweis">
        {t("abenteuer.aufgaben.steller", { steller: tSpiel(auftrag.steller) })}
      </p>
    </Rundenrahmen>
  );
}

function ZurueckKnopf() {
  const { navigiere } = useNavigation();
  return (
    <button
      type="button"
      className="knopf-haupt"
      data-testid="abenteuer-aufgaben-zurueck"
      onClick={() => navigiere({ bildschirm: "zusatz", kennung: ANSICHT_ABENTEUER })}
    >
      {t("partie.zurueckZurStadt")}
    </button>
  );
}

/** Die Zusatzansicht; `wert` ist die Kennung des Auftrags im Spielstand. */
export function AufgabenAnsicht({ wert }: { readonly wert: string | null }) {
  const stand = useAbenteuerstand();
  const [auftrag] = useState(() =>
    stand?.laufendeAufgaben?.kennung === wert ? stand.laufendeAufgaben : null,
  );
  const taktik = useDaten(ladeTaktik, "trainer-taktik");
  const zusaetze = useDaten(ladeZusatzaufgaben, "zusatzaufgaben");
  const aufgaben = useMemo(
    () =>
      auftrag && taktik.art === "fertig" && zusaetze.art === "fertig"
        ? rundenaufgaben(auftrag, taktik.wert.aufgaben, zusaetze.wert)
        : null,
    [auftrag, taktik, zusaetze],
  );
  const beiEnde = (ergebnisse: readonly Antwortergebnis[], sekunden: number) => {
    if (!auftrag) return;
    void aendere((d) => ({
      ...d,
      abenteuer: d.abenteuer
        ? {
            ...d.abenteuer,
            aufgabenergebnis: {
              kennung: auftrag.kennung,
              ergebnisse: Array.from(
                { length: auftrag.erinnerung ? 1 : (aufgaben?.length ?? 0) },
                (_, i) => ergebnisse[i] ?? "falsch",
              ),
              sekunden,
            },
          }
        : d.abenteuer,
    }));
  };
  return (
    <div className="bildschirm bildschirm-abenteuer-aufgaben" data-testid="abenteuer-aufgaben">
      <h1 className="karte-titel">
        {t("abenteuer.aufgaben.titel", { steller: auftrag ? tSpiel(auftrag.steller) : "" })}
      </h1>
      {!auftrag && (
        <section className="karte">
          <p className="fehlertext">{t("abenteuer.aufgaben.keinAuftrag")}</p>
          <ZurueckKnopf />
        </section>
      )}
      {auftrag?.erinnerung && (
        <ErinnerungsRunde
          erinnerung={auftrag.erinnerung}
          beiEnde={beiEnde}
          zurueck={<ZurueckKnopf />}
        />
      )}
      {auftrag && !auftrag.erinnerung && (taktik.art === "laedt" || zusaetze.art === "laedt") && (
        <p className="lade">{t("abenteuer.aufgaben.laedt")}</p>
      )}
      {auftrag && !auftrag.erinnerung && aufgaben && aufgaben.length === 0 && (
        <section className="karte">
          <p className="hinweis">{t("trainer.keineAufgaben")}</p>
          <ZurueckKnopf />
        </section>
      )}
      {auftrag && !auftrag.erinnerung && aufgaben && aufgaben.length > 0 && (
        <Runde auftrag={auftrag} aufgaben={aufgaben} beiEnde={beiEnde} />
      )}
    </div>
  );
}
