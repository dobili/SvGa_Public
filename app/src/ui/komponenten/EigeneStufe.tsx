/**
 * Einstellungen der Kategorie „Eigene Stufe“: Stufen je Phase, erlaubte Fehlerarten, blinde Flecken,
 * Stil im Spinnennetz und der erweiterte Modus mit Reglern auf den Quantilen der Menschen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (24.10.2026): „Eigene Stufe“ bekommt dieselben
 * Einstellungen wie „Eigene Bots“ (GegnerEditor.tsx). Die Werte liegen in den Spielvorlieben des
 * Spielbildschirms (Spielen.tsx, `mit`) und kommen beim Partiebeginn in die Partie
 * (bildschirme/gegnerprofil.ts). Seitdem spielt die eigene Stufe wie ein eigener Bot mit den
 * angehakten Fehlerarten wie Menschen; die angezeigte Zahl ist dann die der gemessenen Stufe mit
 * Zusatzfehlern. Ohne angehakte Fehlerart spielt sie rein, die Zahl ist die der reinen Stufe
 * (engine/botstaerke.ts, staerkeGeschaetzt). Den erweiterten Modus teilt sie sich mit den eigenen
 * Bots, der dafür einen namenlosen eigenen Gegner aus den Vorlieben bekommt. Seit 0.2.129 (DS38,
 * DS39) stehen Stärke, Stil, Fehler und blinde Flecken in Reitern (GegnerReiter.tsx), die Fehler
 * mit einem Stufenschalter je Art (Fehlerprofil.tsx) statt Haken und erweitertem Modus.
 * Abhängigkeiten: StufenWahl, Stilnetz, GegnerReiter, engine/gegner.ts, speicher/partien.ts.
 */
import type { EigenerGegner } from "../../engine/gegner";
import { STIL_NEUTRAL } from "../../engine/stil";
import { hauptstil, mixAusStil } from "../../engine/stile";
import { mitVorlieben, type Spielvorlieben } from "../../speicher/partien";
import { aendere } from "../../speicher/speicher";
import { GegnerReiter } from "./GegnerReiter";
import { Stilnetz } from "./Stilnetz";
import { StufenWahl } from "./StufenWahl";

/** Kennung des namenlosen Gegners, mit dem das Fehlerprofil die eigene Stufe darstellt. */
const STUFE_ALS_GEGNER = "eigene-stufe";

/** Die eigene Stufe als namenloser eigener Gegner (für Fehlerprofil und Flecken). */
function alsGegner(v: Spielvorlieben): EigenerGegner {
  return {
    kennung: STUFE_ALS_GEGNER,
    name: "",
    stufenJePhase: v.stufenJePhase,
    fehlerarten: v.erlaubteFehlerarten,
    blindeFlecken: v.blindeFlecken,
    stil: STIL_NEUTRAL,
    ...(v.reglerstufen ? { reglerstufen: v.reglerstufen } : {}),
    ...(v.haeufigkeit !== undefined ? { haeufigkeit: v.haeufigkeit } : {}),
    ...(v.hoechstverlust ? { hoechstverlust: v.hoechstverlust } : {}),
  };
}

/**
 * Alle Einstellungen der eigenen Stufe. `mit` ändert die Vorlieben des Spielbildschirms; Stil,
 * Haken und Regler kommen zusätzlich gleich in den Speicher, damit sie ein Neuladen auch ohne
 * Partie überstehen (wie die Abhakliste seit 0.2.60).
 */
export function EigeneStufe({
  v,
  mit: mitBildschirm,
}: {
  v: Spielvorlieben;
  mit: (teil: Partial<Spielvorlieben>) => void;
}) {
  const mit = (teil: Partial<Spielvorlieben>) => {
    mitBildschirm(teil);
    void aendere((d) => ({
      ...d,
      spiel: mitVorlieben(d.spiel, { ...d.spiel.vorlieben, ...teil }),
    }));
  };
  const g = alsGegner(v);
  return (
    <GegnerReiter
      g={g}
      setze={(neu) =>
        mit({
          erlaubteFehlerarten: neu.fehlerarten,
          blindeFlecken: neu.blindeFlecken,
          ...(neu.reglerstufen ? { reglerstufen: neu.reglerstufen } : {}),
          ...(neu.haeufigkeit !== undefined ? { haeufigkeit: neu.haeufigkeit } : {}),
          ...(neu.hoechstverlust ? { hoechstverlust: neu.hoechstverlust } : {}),
        })
      }
      staerke={
        <StufenWahl
          stufen={v.stufenJePhase}
          beiWahl={(stufenJePhase) =>
            mitBildschirm({ stufenJePhase, stufe: stufenJePhase.mittelspiel, bot: null })
          }
        />
      }
      stil={
        <Stilnetz
          mix={v.stilmix ?? mixAusStil(v.stilname)}
          beiWahl={(stilmix) => mit({ stilmix, stilname: hauptstil(stilmix) })}
        />
      }
    />
  );
}
