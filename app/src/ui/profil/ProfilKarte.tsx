/**
 * Kopf der Profilseite mit Porträt und Namen des Lesers (Wunsch des Autors vom 25.10.2026);
 * „Name und Porträt“ öffnet den Editor in derselben Karte.
 *
 * Rolle im Gesamtbild: Ganz oben im Profil (bildschirme/Ich.tsx). Ohne Namen und Bild lädt ein
 * Satz dazu ein; beides ist freiwillig. Dieselben Angaben erscheinen in Partie, Partienliste und
 * PGN (spieler.ts).
 * Abhängigkeiten: ProfilEditor, Spielerbild, spieler.ts, i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { ProfilEditor } from "./ProfilEditor";
import { Spielerbild } from "./Spielerbild";
import { useSpielerprofil } from "./spieler";

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
            {leer && <span className="hinweis">{t("profil.einladung")}</span>}
            {/* Unter dem Namen, damit ein langer Name nicht mitten im Wort umbricht. */}
            <button type="button" className="knopf-zweit" onClick={() => setzeOffen(true)}>
              {t("profil.bearbeiten")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
