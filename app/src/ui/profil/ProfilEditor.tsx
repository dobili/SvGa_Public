/**
 * Name und Porträt des Lesers bearbeiten (seit 0.2.140, Wunsch des Autors vom 25.10.2026).
 *
 * Rolle im Gesamtbild: Öffnet sich in der Profilkarte (ProfilKarte.tsx). Oben die Vorschau mit
 * Name (bleibt beim Scrollen stehen), darunter die Porträtwahl (Portraetwahl.tsx, dieselbe wie
 * bei eigenen Bots). Erst „Speichern“ schreibt in den Speicher; „Abbrechen“ verwirft den Entwurf.
 * Abhängigkeiten: speicher/profil.ts, Portraetwahl, Spielerbild, i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { MAX_PROFILNAME, type Spielerprofil } from "../../speicher/profil";
import { aendere } from "../../speicher/speicher";
import { Knopfsymbol } from "../komponenten/Knopfsymbol";
import { Portraetwahl } from "./Portraetwahl";
import { usePortraetwahl } from "./portraetwahlZustand";
import { Spielerbild } from "./Spielerbild";

/**
 * Der Editor. `start`: das gespeicherte Profil; `beiFertig`: nach Speichern oder Abbrechen.
 * Beispiel: Name „Dana“, Porträt „Selbst gestalten“, Zufällig, Speichern.
 */
export function ProfilEditor({
  start,
  beiFertig,
}: {
  start: Spielerprofil;
  beiFertig: () => void;
}) {
  const [name, setzeName] = useState(start.name);
  const wahl = usePortraetwahl(start.bild);
  const entwurf: Spielerprofil = {
    name: name.trim(),
    bild: wahl.bild,
  };
  const speichere = () => {
    void aendere((d) => ({ ...d, profil: entwurf }));
    beiFertig();
  };
  return (
    <div className="profileditor" data-testid="profileditor">
      <div className="profileditor-vorschau">
        <Spielerbild profil={entwurf} />
        <label className="profileditor-name">
          <span className="einstellung-name">{t("profil.name")}</span>
          <input
            className="suchfeld"
            value={name}
            maxLength={MAX_PROFILNAME}
            autoComplete="nickname"
            onChange={(e) => setzeName(e.target.value)}
          />
        </label>
      </div>
      <Portraetwahl zustand={wahl} titel={t("profil.bild")} />
      <div className="knopfreihe">
        <button type="button" className="knopf-haupt" onClick={speichere}>
          <Knopfsymbol art="speichern" />
          {t("profil.speichern")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiFertig}>
          {t("spielen.editor.abbrechen")}
        </button>
      </div>
    </div>
  );
}
