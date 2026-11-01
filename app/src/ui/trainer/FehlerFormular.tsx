/**
 * Formular „In die Fehlerdatenbank“: Fehlerart aus der Gesamt-Checkliste wählen, einen Satz
 * schreiben, speichern.
 *
 * Rolle im Gesamtbild: Fehlerdatenbank (Kapitel 12, AP 13). Dasselbe Formular steht im Trainer
 * (mit einer Stellung als FEN) und im Rückblick einer Partie unter dem Zug, den der Leser
 * eintragen will (Stellung vor dem Zug, gespielter Zug). Die Fehlerarten kommen aus
 * nachschlagen.json (Gesamt-Checkliste, Spalte „Fehlerart“). Aus dem Rückblick kommen Fehlerart
 * und Satz schon als Vorschlag (spiel/fehlervorschlag.ts; Wunsch des Autors, 27.10.2026). Nach
 * dem Speichern führt „Zur Fehlerdatenbank“ gleich dorthin (Wunsch des Autors, 1.11.2026: er
 * fand sie nach „Merken“ nicht wieder).
 * Abhängigkeiten: training/fehlerdatenbank.ts, speicher/speicher.ts, Fehlerfelder, Navigation,
 * i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { zaehleAktivitaet } from "../../speicher/aktivitaet";
import { aendere } from "../../speicher/speicher";
import { mitEintrag, SATZ_HOECHSTENS } from "../../training/fehlerdatenbank";
import { Fehlerfelder, type Fehlerwerte } from "./Fehlerfelder";

/** Neue Kennung für einen Eintrag (Zeit und Zufall genügen für ein Gerät). */
function neueKennung(): string {
  return `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Bestätigung nach dem Speichern, mit Sprung zur Fehlerdatenbank (außer in ihr selbst). */
function Gespeichert({ mitSprung }: { mitSprung: boolean }) {
  const { navigiere } = useNavigation();
  return (
    <p className="meldung gut" role="status" data-testid="fehlerdb-gespeichert">
      {t("fehlerdb.gespeichert")}{" "}
      {mitSprung && (
        <button
          type="button"
          className="knopf-link"
          onClick={() => navigiere({ bildschirm: "trainer", kennung: "fehlerdatenbank" })}
        >
          {t("fehlerdb.oeffnen")}
        </button>
      )}
    </p>
  );
}

/** Legt den Eintrag in den Nutzerdaten an und zählt die Aktivität. */
function legeAn(fen: string, art: number, satz: string, zug?: string): void {
  const eintrag = {
    id: neueKennung(),
    datum: new Date().toISOString(),
    fen,
    satz: satz.trim(),
    fehlerart: art,
    ...(zug ? { zug } : {}),
  };
  void aendere((daten) =>
    zaehleAktivitaet(
      { ...daten, fehler: mitEintrag(daten.fehler, eintrag) },
      "fehler",
      1,
      new Date(),
    ),
  );
}

/**
 * Das Formular. Beispiel: Rückblick, 12... Sxe4?? → Fehlerart „Schach oder Schlag übersehen“,
 * Satz „Dxh7 übersehen“, Speichern → Eintrag mit Stellung vor 12... Sxe4.
 */
export function FehlerFormular({
  fen,
  zug,
  beiGespeichert,
  vorschlagArt = null,
  vorschlagSatz = "",
  mitSprung = true,
}: {
  /** Stellung vor dem Fehler; null, solange keine gültige Stellung angegeben ist. */
  fen: string | null;
  zug?: string;
  beiGespeichert?: () => void;
  /** Vorschlag aus der Auswertung (Rückblick): Kapitel der Fehlerart, Satz; der Leser ändert. */
  vorschlagArt?: number | null;
  vorschlagSatz?: string;
  /** Nach dem Speichern „Zur Fehlerdatenbank“ zeigen (nicht in der Fehlerdatenbank selbst). */
  mitSprung?: boolean;
}) {
  const [werte, setzeWerte] = useState<Fehlerwerte>({
    art: vorschlagArt,
    satz: vorschlagSatz.slice(0, SATZ_HOECHSTENS),
  });
  const [gespeichert, setzeGespeichert] = useState(false);
  const speichern = () => {
    if (fen === null || werte.art === null) return;
    legeAn(fen, werte.art, werte.satz, zug);
    setzeGespeichert(true);
    beiGespeichert?.();
  };
  if (gespeichert) return <Gespeichert mitSprung={mitSprung} />;
  return (
    <div className="fehlerformular" data-testid="fehlerformular">
      <Fehlerfelder
        werte={werte}
        beiAenderung={(teil) => setzeWerte((alt) => ({ ...alt, ...teil }))}
      />
      <button
        type="button"
        className="knopf-haupt"
        disabled={fen === null || werte.art === null}
        onClick={speichern}
      >
        {t("fehlerdb.speichern")}
      </button>
    </div>
  );
}
