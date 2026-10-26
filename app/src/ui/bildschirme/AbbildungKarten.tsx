/**
 * Karten unter dem Brett der Abbildung: Kacheln des gewählten Werkzeugs, Engine-Kacheln,
 * Warum-Fragen, Knöpfe, Unterschrift und Fundstelle.
 *
 * Rolle im Gesamtbild: Teil des Abbildung-Bildschirms (Abbildung.tsx); eigene Datei, damit
 * Abbildung.tsx unter 400 Zeilen bleibt (Konzept 12).
 * Abhängigkeiten: analyse, engine, ui/komponenten (Werkzeug- und Engine-Karten), Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import type { Werkzeugergebnis } from "../../analyse/werkzeug";
import type { Abbildung as AbbildungDaten, Kapitel } from "../../daten/laden";
import type { LetzterZug } from "../../engine/letzterzug";
import { t } from "../../i18n/sprache";
import type { Stellung } from "../../schach/stellung";
import { spielbar } from "../../spiel/partie";
import { AntwortenKarte } from "../komponenten/werkzeugkarten/AntwortenKarte";
import { EngineKarte } from "../komponenten/werkzeugkarten/EngineKarte";
import { Erklaerkarte } from "../komponenten/werkzeugkarten/Erklaerkarte";
import { FalleKarte } from "../komponenten/werkzeugkarten/FalleKarte";
import { RuheKarte } from "../komponenten/werkzeugkarten/RuheKarte";
import { Unterschrift } from "../komponenten/abbildung/Unterschrift";
import type { Enginemarkierungen } from "../komponenten/werkzeugkarten/useEngineMarkierungen";
import { useErklaerung } from "../komponenten/werkzeugkarten/useErklaerung";
import type { Fallenstand } from "../komponenten/werkzeugkarten/useFalle";
import type { Sicht } from "../komponenten/werkzeugwahl/useSicht";
import { WarumFragen } from "../komponenten/abbildung/WarumFrage";
import { Werkzeugkarte } from "../komponenten/werkzeugkarten/Werkzeugkarte";
import type { Werkzeugwahl } from "../komponenten/werkzeugwahl/Werkzeugleiste";
import { Werkzeugzusatz } from "../komponenten/werkzeugkarten/Werkzeugzusatz";
import { hatSicht } from "../komponenten/werkzeugwahl/werkzeugergebnis";
import { Meldeformular } from "../komponenten/einstellungen/Meldeformular";
import { APP_VERSION } from "../../app/version";
import { useState } from "react";

/**
 * „Fehler im Buch melden“ unter der Fundstelle (R57, Stufe 2, Punkt 11): schickt Abbildung und
 * Stellung mit, damit der Autor den Befund ohne Rückfrage im LaTeX findet.
 */
function BuchfehlerMelden({ nummer, fen }: { nummer: string; fen: string }) {
  const [offen, setzeOffen] = useState(false);
  if (!offen) {
    return (
      <button type="button" className="knopf-link klein" onClick={() => setzeOffen(true)}>
        {t("abbildung.buchfehler")}
      </button>
    );
  }
  return (
    <Meldeformular
      anfangsart="buch"
      abbildung={nummer}
      stellung={fen}
      angaben={[
        t("abbildung.titel", { nummer }),
        fen,
        t("ich.angabe.version", { wert: APP_VERSION }),
      ].join("\n")}
      beiSchliessen={() => setzeOffen(false)}
    />
  );
}

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
          data-tour="gegen-engine"
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
      <BuchfehlerMelden
        key={hier?.id ?? abbildung.id}
        nummer={hier?.id ?? abbildung.id}
        fen={stellung.fen}
      />
    </div>
  );
}
