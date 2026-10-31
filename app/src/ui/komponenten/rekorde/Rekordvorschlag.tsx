/**
 * Ein Vorschlag der Karte „Deine Rekorde“ (Profil neu, Entwurf R1): Zeichen, Name, ein kurzer Satz
 * und der Knopf „Los“, der dorthin führt, wo man den Rekord aufstellt.
 *
 * Rolle im Gesamtbild: Eigene Datei, damit Rekordtafel.tsx klein bleibt. Der Satz steht in
 * „profil.rekorde.vorschlag.<k>“ (ein Test prüft ihn für jede Art in REKORDARTEN). „Höchste
 * Wertung“ sagt vor der zehnten gewerteten Partie, wie viele Partien noch fehlen, statt „noch
 * keiner“ (Wunsch des Autors, 31.10.2026).
 * Abhängigkeiten: rekordvorschlaege.ts, rekordtexte.ts, training/rekorde.ts (Typ), Speicher, i18n.
 */
import type { LucideIcon } from "lucide-react";
import type { Ansicht } from "../../../app/stapel";
import { istTextschluessel, t, tZahl } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import type { Rekordart } from "../../../training/rekorde";
import { rekordname } from "./rekordtexte";
import {
  partienBisWertung,
  REKORD_WERTUNG,
  REKORDZEICHEN_GROESSE,
  rekordzeichen,
} from "./rekordvorschlaege";

/** Das Zeichen einer Rekordart in seinem Kästchen (auch für die erreichten Rekorde). */
export function Rekordkaestchen({ zeichen: Zeichen }: { zeichen: LucideIcon }) {
  return (
    <span className="rekord-zeichen" aria-hidden="true">
      <Zeichen size={REKORDZEICHEN_GROESSE} />
    </span>
  );
}

/** Der Satz zum Vorschlag; „Höchste Wertung“ vor der zehnten Partie mit den fehlenden Partien. */
function useVorschlagssatz(kennung: string): string | null {
  const fehlen = useSpeicher((z) => partienBisWertung(z.daten));
  if (kennung === REKORD_WERTUNG && fehlen > 0) {
    return tZahl("profil.rekorde.wertungRest", fehlen, { anzahl: fehlen });
  }
  const schluessel = `profil.rekorde.vorschlag.${kennung}`;
  return istTextschluessel(schluessel) ? t(schluessel) : null;
}

/**
 * Eine Zeile mit Knopf „Los“ (ohne Ziel kein Knopf).
 * Beispiel: „Taktik auf Zeit · Wie viele Aufgaben schaffst du in 3 Minuten?“ [Los].
 */
export function Rekordvorschlag({
  art,
  oeffne,
}: {
  art: Rekordart;
  oeffne: (ziel: Ansicht) => void;
}) {
  const satz = useVorschlagssatz(art.kennung);
  const ziel = art.versuchen;
  const name = rekordname(art.kennung);
  return (
    <li className="rekord-vorschlag" data-testid={`rekord-${art.kennung}`}>
      <Rekordkaestchen zeichen={rekordzeichen(art.kennung)} />
      <span className="rekord-text">
        <span className="rekordname">{name}</span>
        {satz && <span className="hinweis">{satz}</span>}
      </span>
      {ziel && (
        <button
          type="button"
          className="knopf-zweit rekord-los"
          aria-label={t("profil.rekorde.losName", { name })}
          onClick={() => oeffne(ziel)}
        >
          {t("profil.rekorde.los")}
        </button>
      )}
    </li>
  );
}
