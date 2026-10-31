/**
 * Kopf der Profilseite mit Porträt und Namen des Lesers (Wunsch des Autors vom 25.10.2026);
 * „Name und Porträt“ öffnet den Editor in derselben Karte.
 *
 * Rolle im Gesamtbild: Ganz oben im Profil (bildschirme/Ich.tsx). Ohne Namen und Bild lädt ein
 * Satz dazu ein; beides ist freiwillig. Dieselben Angaben erscheinen in Partie, Partienliste und
 * PGN (spieler.ts).
 * Seit 0.3.2: Sind Name oder Bild gesetzt, steht statt des Textknopfes ein unauffälliger Stift am
 * Rand der Karte (Wunsch des Autors, 26.10.2026); der Textknopf lädt nur zum ersten Mal ein.
 * Seit P3 (Gamifizierung) steht unter dem Namen der gewählte Titel (themen/Titelzeile.tsx).
 * Abhängigkeiten: ProfilEditor, Spielerbild, spieler.ts, themen/Titelzeile.tsx, i18n.
 */
import { Pencil } from "lucide-react";
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { ProfilEditor } from "./ProfilEditor";
import { Spielerbild } from "./Spielerbild";
import { useSpielerprofil } from "./spieler";
import { Titelzeile } from "../komponenten/themen/Titelzeile";

/** Größe des Stiftes zum Bearbeiten. */
const STIFTGROESSE = 18;

/** Die Karte; geschlossen Bild, Name und Knopf, offen der Editor. */
export function ProfilKarte() {
  const profil = useSpielerprofil();
  const [offen, setzeOffen] = useState(false);
  const leer = !profil.name && !profil.bild;
  return (
    <section className="karte profilkarte" data-testid="profilkarte" data-tour="profil-karte">
      {offen ? (
        <ProfilEditor start={profil} beiFertig={() => setzeOffen(false)} />
      ) : (
        <div className="profilkarte-kopf">
          <Spielerbild profil={profil} />
          <div className="profilkarte-text">
            <strong data-testid="profilname">{profil.name || t("profil.ohneName")}</strong>
            {/* P3: gewählter Titel aus der Meisterschaft („Taktiker“). */}
            <Titelzeile />
            {leer && <span className="hinweis">{t("profil.einladung")}</span>}
            {/* Unter dem Namen, damit ein langer Name nicht mitten im Wort umbricht. */}
            {leer && (
              <button type="button" className="knopf-zweit" onClick={() => setzeOffen(true)}>
                {t("profil.bearbeiten")}
              </button>
            )}
          </div>
          {!leer && (
            <button
              type="button"
              className="knopf-symbol profilkarte-stift"
              aria-label={t("profil.bearbeiten")}
              title={t("profil.bearbeiten")}
              onClick={() => setzeOffen(true)}
            >
              <Pencil size={STIFTGROESSE} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
