/**
 * Blatt aus der Liste „Varianten“: eine Variante umbenennen und kommentieren oder löschen, ohne
 * sie zu öffnen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): „Es wäre auch gut, wenn man in der Liste der
 * Varianten selber auf Editieren, Löschen oder sowas drücken könnte.“ Variantenkarte.tsx zeigt je
 * Eintrag ✎ und 🗑; beide öffnen dieses Blatt. „Bearbeiten“ ändert Name und Kommentar erst mit
 * „Speichern“ (nichts wird nebenbei gespeichert), „Löschen“ fragt einmal nach. Geschrieben wird
 * über `aendere` mit dem aktuellen Stand (Abgleich der Tabs, speicher.ts).
 * Abhängigkeiten: spielstart/Blatt.tsx, training/variationen.ts, speicher, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { aendere } from "../../../speicher/speicher";
import {
  KOMMENTAR_HOECHSTENS,
  mitVariation,
  ohneVariation,
  TITEL_HOECHSTENS,
  type Variation,
} from "../../../training/variationen";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { Blatt } from "../spielstart/Blatt";

/** Was das Blatt gerade zeigt. */
export type Listenaktion = "bearbeiten" | "loeschen";

/** Schreibt Name und Kommentar; an einer Grenze bleibt der Speicher, wie er war. */
function speichereTexte(v: Variation, titel: string, kommentar: string): void {
  const neu = { ...v, titel, kommentar, geaendert: new Date().toISOString() };
  void aendere((daten) => {
    const ergebnis = mitVariation(daten.variationen, neu);
    return "liste" in ergebnis ? { ...daten, variationen: ergebnis.liste } : daten;
  });
}

/** Löscht die Variante aus dem Speicher. */
function loescheVariante(id: string): void {
  void aendere((daten) => ({ ...daten, variationen: ohneVariation(daten.variationen, id) }));
}

/** Name und Kommentar mit „Speichern“ und „Abbrechen“. */
function Bearbeiten({ v, fertig }: { v: Variation; fertig: () => void }) {
  const [titel, setzeTitel] = useState(v.titel);
  const [kommentar, setzeKommentar] = useState(v.kommentar);
  return (
    <div className="variantenblatt">
      <label className="feld">
        <span>{t("varianten.blatt.name")}</span>
        <input
          type="text"
          maxLength={TITEL_HOECHSTENS}
          value={titel}
          onChange={(e) => setzeTitel(e.target.value)}
        />
      </label>
      <label className="feld">
        <span>{t("varianten.blatt.kommentar")}</span>
        <textarea
          maxLength={KOMMENTAR_HOECHSTENS}
          value={kommentar}
          onChange={(e) => setzeKommentar(e.target.value)}
        />
      </label>
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => {
            speichereTexte(v, titel, kommentar);
            fertig();
          }}
        >
          {t("varianten.speichern")}
        </button>
        <button type="button" className="knopf-zweit" onClick={fertig}>
          {t("loeschen.nein")}
        </button>
      </div>
    </div>
  );
}

/** Die Nachfrage vor dem Löschen. */
function Loeschfrage({ v, fertig }: { v: Variation; fertig: () => void }) {
  return (
    <div className="nachfrage" role="alertdialog" aria-label={t("varianten.loeschen")}>
      <p>{t("varianten.loeschenFrageTitel", { titel: v.titel || t("varianten.ohneTitel") })}</p>
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-gefahr"
          onClick={() => {
            loescheVariante(v.id);
            fertig();
          }}
        >
          <Knopfsymbol art="loeschen" />
          {t("varianten.loeschenJa")}
        </button>
        <button type="button" className="knopf-zweit" onClick={fertig}>
          {t("loeschen.nein")}
        </button>
      </div>
    </div>
  );
}

/** Das Blatt; ohne Aktion geschlossen. */
export function Listenblatt({
  v,
  aktion,
  schliessen,
}: {
  v: Variation;
  aktion: Listenaktion | null;
  schliessen: () => void;
}) {
  return (
    <Blatt
      titel={t(aktion === "loeschen" ? "varianten.loeschen" : "varianten.blatt.titel")}
      offen={aktion !== null}
      schliessen={schliessen}
      testid="variantenlistenblatt"
      kinder={
        aktion === "loeschen" ? (
          <Loeschfrage v={v} fertig={schliessen} />
        ) : (
          <Bearbeiten v={v} fertig={schliessen} />
        )
      }
    />
  );
}
