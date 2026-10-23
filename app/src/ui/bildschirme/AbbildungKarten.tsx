/**
 * Karten unter dem Brett der Abbildung: Kacheln des gewählten Werkzeugs, Engine-Kacheln,
 * Warum-Fragen, Knöpfe, Unterschrift und Fundstelle.
 *
 * Rolle im Gesamtbild: Teil des Abbildung-Bildschirms (Abbildung.tsx); seit 0.2.90 eigene Datei,
 * damit Abbildung.tsx unter 400 Zeilen bleibt (Konzept 12).
 * Abhängigkeiten: analyse, engine, ui/komponenten (Werkzeug- und Engine-Karten), Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import type { Werkzeugergebnis } from "../../analyse/werkzeug";
import type { Abbildung as AbbildungDaten, Kapitel } from "../../daten/laden";
import type { LetzterZug } from "../../engine/letzterzug";
import { t } from "../../i18n/sprache";
import type { Stellung } from "../../schach/stellung";
import { spielbar } from "../../spiel/partie";
import { AntwortenKarte } from "../komponenten/AntwortenKarte";
import { EngineKarte } from "../komponenten/EngineKarte";
import { Erklaerkarte } from "../komponenten/Erklaerkarte";
import { FalleKarte } from "../komponenten/FalleKarte";
import { RuheKarte } from "../komponenten/RuheKarte";
import { Unterschrift } from "../komponenten/Unterschrift";
import type { Enginemarkierungen } from "../komponenten/useEngineMarkierungen";
import { useErklaerung } from "../komponenten/useErklaerung";
import type { Fallenstand } from "../komponenten/useFalle";
import type { Sicht } from "../komponenten/useSicht";
import { WarumFragen } from "../komponenten/WarumFrage";
import { Werkzeugkarte } from "../komponenten/Werkzeugkarte";
import type { Werkzeugwahl } from "../komponenten/Werkzeugleiste";
import { Werkzeugzusatz } from "../komponenten/Werkzeugzusatz";
import { hatSicht } from "../komponenten/werkzeugergebnis";

/**
 * Karten unter dem Brett: zuerst die Kacheln des gewählten Werkzeugs (Werkzeugergebnis und die
 * Engine-Kacheln), dann die Warum-Fragen, dann Unterschrift und Fundstelle (Wunsch des Autors
 * nach dem Test von 0.2.26).
 */
export function Karten({
  kapitel,
  abbildung,
  hier,
  stellung,
  wahl,
  ergebnis,
  falle,
  gegnerplan,
  erzwingend,
  ruhe,
  enginebrett,
  letzterZug,
  naechsterZug,
  sicht,
}: {
  kapitel: Kapitel;
  abbildung: AbbildungDaten;
  hier: AbbildungDaten | null;
  stellung: Stellung;
  wahl: Werkzeugwahl | null;
  ergebnis: Werkzeugergebnis | null;
  falle: Fallenstand;
  gegnerplan: Enginemarkierungen;
  erzwingend: Enginemarkierungen;
  ruhe: Enginemarkierungen;
  enginebrett: Enginemarkierungen;
  letzterZug: LetzterZug | null;
  naechsterZug: string | null;
  sicht: Sicht;
}) {
  const { navigiere } = useNavigation();
  const erklaerung = useErklaerung(wahl);
  return (
    <div className="abbildung-karten">
      {erklaerung.sichtbar && (wahl === "zaehlen" || wahl === "ziehen") && (
        <Erklaerkarte werkzeug={wahl} ausblenden={erklaerung.ausblenden} />
      )}
      {wahl === "zaehlen" && !ergebnis && !erklaerung.sichtbar && (
        <p className="hinweis">{t("abbildung.tippeFeld")}</p>
      )}
      {ergebnis && (
        <Werkzeugkarte
          key={ergebnis.werkzeug}
          ergebnis={ergebnis}
          sicht={hatSicht(ergebnis.werkzeug) ? sicht : null}
          zusatz={
            // Engine in derselben Karte: „Gegner?“ (Vorschlag D4), „Erzwingende Züge“ (B1),
            // Nachrechnung der Zentrumsbauern bei der Zielbilanz (C1.1).
            <Werkzeugzusatz
              wahl={wahl}
              stellung={stellung}
              eigen={sicht.farbe}
              zug={naechsterZug ?? undefined}
              beiGegnerplan={gegnerplan.setzeMarkierungen}
              beiErzwingend={erzwingend.setzeMarkierungen}
            />
          }
        />
      )}
      {!stellung.regeln && <p className="hinweis">{t("abbildung.lehrbild")}</p>}
      {wahl === "engine" && stellung.regeln && (
        <EngineKarte
          key={stellung.fen}
          stellung={stellung}
          letzterZug={letzterZug}
          beiMarkierungen={enginebrett.setzeMarkierungen}
        />
      )}
      {wahl === "k4-prueffragen" && stellung.regeln && naechsterZug && (
        <AntwortenKarte
          key={`${stellung.fen} ${naechsterZug}`}
          stellung={stellung}
          geplant={naechsterZug}
        />
      )}
      {wahl === "k7-ruhe" && stellung.regeln && (
        <RuheKarte
          key={stellung.fen}
          stellung={stellung}
          beiMarkierungen={ruhe.setzeMarkierungen}
        />
      )}
      {falle.angebot && (
        <FalleKarte
          key={`${stellung.fen} ${falle.angebot.uci}`}
          stellung={stellung}
          angebot={falle.angebot}
          beiMarkierungen={falle.setzeMarkierungen}
        />
      )}
      <WarumFragen hier={hier} />
      {stellung.regeln && spielbar(stellung.fen) && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() =>
            navigiere({
              bildschirm: "spielen",
              startFen: stellung.fen,
              ...(hier ? { abbildung: hier.id } : {}),
            })
          }
        >
          {t("abbildung.gegenEngine")}
        </button>
      )}
      {hier && hier.id !== abbildung.id && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => navigiere({ bildschirm: "abbildung", nummer: hier.id })}
        >
          {t("abbildung.andereOeffnen", { nummer: hier.id })}
        </button>
      )}
      <Unterschrift
        nummer={abbildung.id}
        teile={abbildung.unterschrift}
        beiVerweis={(nummer) => navigiere({ bildschirm: "abbildung", nummer })}
      />
      {abbildung.abschnitt && (
        <p className="fundstelle">
          {t("abbildung.fundstelle", {
            kapitel: kapitel.kapitel,
            abschnitt: `${abbildung.abschnitt.nummer} ${abbildung.abschnitt.titel}`,
          })}
        </p>
      )}
    </div>
  );
}
