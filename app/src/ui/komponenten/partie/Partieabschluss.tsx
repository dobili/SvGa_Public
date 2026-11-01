/**
 * Abschluss unter der Auswertung: „Neue Partie“, „Teilen“ und bei eigener Stellung „Noch einmal
 * aus derselben Stellung“ (Entwurf F2, Wahl des Autors 31.10.2026).
 *
 * Rolle im Gesamtbild: Die Knöpfe standen bis dahin in der Ergebniskarte über der Auswertung
 * (Partieende.tsx); das Ergebnis selbst steht jetzt als Kopfzeile oben (Ergebniskopf.tsx), die
 * nächsten Schritte am Ende der Seite, wo man nach dem Lesen ankommt. „Teilen“ öffnet ein Blatt
 * mit PGN kopieren und PGN als Datei sichern (PgnTeilen.tsx). Auch in der ruhigen Ansicht da.
 * „Neue Partie“ wechselt in den Bereich „Spielen“ (useOeffne), auch wenn die Partie aus dem Profil
 * geöffnet wurde; so stimmt die Leiste unten (Fehlertest f3, 01.11.2026). „Noch einmal“ legt die
 * Spielseite mit der Stellung auf den Stapel, Zurück führt zur Auswertung.
 * Abhängigkeiten: app/navigationsKontext, spiel/wertung.ts, Blatt.tsx, PgnTeilen.tsx, i18n.
 */
import { useState } from "react";
import { useNavigation, useOeffne } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import type { Zugurteil } from "../../../spiel/auswertung";
import type { Partie } from "../../../spiel/partie";
import { ausGrundstellung } from "../../../spiel/wertung";
import { Blatt } from "../auswertung/Blatt";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { PgnTeilen } from "./PgnTeilen";

/** Die Knöpfe nach dem Ende einer Partie. */
export function Partieabschluss({
  partie,
  urteile,
}: {
  partie: Partie;
  urteile: readonly Zugurteil[];
}) {
  const { navigiere } = useNavigation();
  const oeffne = useOeffne();
  const [teilen, setzeTeilen] = useState(false);
  const { startFen, abbildung } = partie.einstellung;
  const eigeneStellung = !ausGrundstellung(partie);
  return (
    <section className="partieabschluss" data-testid="partieabschluss">
      <div className="partieabschluss-reihe">
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => oeffne({ bildschirm: "spielen" })}
        >
          <Knopfsymbol art="neu" />
          {t("partie.neu")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          aria-haspopup="dialog"
          data-tour="auswertung-pgn"
          onClick={() => setzeTeilen(true)}
        >
          <Knopfsymbol art="teilen" />
          {t("auswertungneu.teilen")}
        </button>
      </div>
      {eigeneStellung && (
        <button
          type="button"
          className="knopf-zweit partieabschluss-nochmal"
          onClick={() =>
            navigiere({ bildschirm: "spielen", startFen, ...(abbildung ? { abbildung } : {}) })
          }
        >
          <Knopfsymbol art="nochmal" />
          {t("partie.nochmal")}
        </button>
      )}
      {teilen && (
        <Blatt
          titel={t("auswertungneu.teilen")}
          testid="teilen-blatt"
          beiSchliessen={() => setzeTeilen(false)}
          kinder={<PgnTeilen partie={partie} urteile={urteile} />}
        />
      )}
    </section>
  );
}
