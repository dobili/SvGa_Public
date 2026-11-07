/**
 * Profilkarte „Dein Aussehen“ (bis 7.11.2026 „Deine Extras“; Gamifizierung P7, neu gestaltet nach
 * Entwurf E1 „Ankleide“ am 31.10.2026): oben die Vorschau „So siehst du gerade aus“, darunter je
 * Art ein Reiter mit Kacheln; Antippen legt an, erneutes Antippen oder „… ablegen“ legt ab.
 *
 * Rolle im Gesamtbild: Steht im Profil unter „Dein Fortschritt“ (profilkarten.ts). Die Liste und
 * die Regeln kommen aus training/extras.ts, die Wahl je Art aus extrawahl.ts. Die Reiter entstehen
 * aus `EXTRAARTEN` (nur Arten mit Extras): Eine neue Art erscheint von selbst. Seit „Aussehen im
 * Profil“ (Wunsch des Autors, 7.11.2026) ist dies die einzige Stelle für Brett und Figuren: Vor
 * den Extras stehen alle immer freien Bretter und Figurensätze (`grundwerte` in extrawahl.ts),
 * unter den Kacheln eine Zusatzzeile der Art (Koordinaten). Die Einstellungen führen mit einem
 * Knopf hierher (aussehenssprung.ts: Reiter wählen, Karte ins Bild rücken). Nie wegnehmen
 * (E8): Ein gewähltes Extra bleibt gewählt (und zählt als frei), auch wenn die Bedingung gerade
 * nicht erfüllt ist. Weniger Text P15 (31.10.2026): Einleitung und Hinweis im ⓘ der Überschrift.
 * Abhängigkeiten: Infoblase, training/extras.ts, extrawahl.ts, extralage.ts, extratexte.ts, Extrabuehne.tsx,
 * Extrakachel.tsx, bausteine/Reiter.tsx, profil/spieler.ts, i18n, lucide-react.
 */
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEinstellungen } from "../../../app/einstellungen";
import { t } from "../../../i18n/sprache";
import {
  bedingungErfuellt,
  EXTRAARTEN,
  EXTRAS,
  extrasDerArt,
  type Extra,
  type Extraart,
  type Extralage,
} from "../../../training/extras";
import { useSpielerprofil } from "../../profil/spieler";
import { MitInfoblase } from "../bausteine/Infoblase";
import { Reiter } from "../bausteine/Reiter";
import { Extrabuehne } from "./Extrabuehne";
import { loescheAussehenssprung, offenerAussehenssprung } from "./aussehenssprung";
import { Extrakachel, Grundkachel, type Kachelzustand } from "./Extrakachel";
import { useExtralage } from "./extralage";
import { reitertext } from "./extratexte";
import { extrawahl, useGewaehlteExtras } from "./extrawahl";

/** Größe der kleinen Zeichen (Ablegen, Hinweis). */
const ZEICHENGROESSE = 16;

type Gewaehlt = Readonly<Record<string, string>>;

/** Zustand einer Kachel aus Wahl und Lage. */
function zustandVon(extra: Extra, gewaehlt: Gewaehlt, lage: Extralage): Kachelzustand {
  if (gewaehlt[extra.art] === extra.wert) return "angelegt";
  return bedingungErfuellt(extra.bedingung, lage) ? "frei" : "gesperrt";
}

/** Die Kacheln einer Art: erst die immer freien Werte, dann die Extras. */
function Kacheln({ art, gewaehlt, lage }: { art: Extraart; gewaehlt: Gewaehlt; lage: Extralage }) {
  const wahl = extrawahl(art);
  const profil = useSpielerprofil();
  const einstellungen = useEinstellungen();
  const kontext = { profil, einstellungen };
  const lege = (wert: string) => wahl?.waehle(wert);
  return (
    <ul className="extrasneu-kacheln">
      {(wahl?.grundwerte ?? []).map((wert) => (
        <Grundkachel
          key={wert}
          art={art}
          wert={wert}
          gewaehlt={gewaehlt[art] === wert}
          kontext={kontext}
          beiTipp={() => lege(wert)}
        />
      ))}
      {extrasDerArt(art).map((extra) => {
        const zustand = zustandVon(extra, gewaehlt, lage);
        return (
          <Extrakachel
            key={extra.kennung}
            extra={extra}
            zustand={zustand}
            lage={lage}
            kontext={kontext}
            beiTipp={() => lege(zustand === "angelegt" ? (wahl?.ohne ?? "") : extra.wert)}
          />
        );
      })}
    </ul>
  );
}

/** Die Kacheln einer Art, die Zusatzzeile und „… ablegen“, solange ein Extra angelegt ist. */
function Artauswahl({
  art,
  gewaehlt,
  lage,
}: {
  art: Extraart;
  gewaehlt: Gewaehlt;
  lage: Extralage;
}) {
  const wahl = extrawahl(art);
  const angelegt = extrasDerArt(art).some((e) => gewaehlt[art] === e.wert);
  const Zusatz = wahl?.Zusatz;
  return (
    <div role="tabpanel" aria-label={reitertext(art)} className="extrasneu-auswahl">
      <Kacheln art={art} gewaehlt={gewaehlt} lage={lage} />
      {angelegt && wahl && (
        <button type="button" className="extrasneu-ablegen" onClick={() => wahl.waehle(wahl.ohne)}>
          <X size={ZEICHENGROESSE} aria-hidden="true" />
          {t("extrasneu.ablegen", { art: reitertext(art) })}
        </button>
      )}
      {Zusatz && <Zusatz />}
    </div>
  );
}

/** Rückt die Karte nach einem Sprung aus den Einstellungen ins Bild und löscht den Sprung. */
function useSprungInsBild() {
  const karte = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!offenerAussehenssprung()) return;
    karte.current?.scrollIntoView?.({ block: "start" });
    loescheAussehenssprung();
  }, []);
  return karte;
}

/** Die Karte: Kopf mit Zähler, Vorschau, Reiter je Art, Kacheln, Hinweis. */
export function ExtrasKarte() {
  const lage = useExtralage();
  const gewaehlt = useGewaehlteExtras();
  const arten = EXTRAARTEN.filter((a) => extrasDerArt(a).length > 0);
  const [art, setzeArt] = useState<Extraart>(
    () => offenerAussehenssprung() ?? arten[0] ?? "rahmen",
  );
  const karte = useSprungInsBild();
  const frei = EXTRAS.filter((e) => zustandVon(e, gewaehlt, lage) !== "gesperrt").length;
  return (
    <section
      ref={karte}
      className="karte extraskarte"
      data-testid="extras"
      data-tour="profil-extras"
    >
      {/* Weniger Text P15 (31.10.2026): Einleitung und Hinweis stehen im ⓘ der Überschrift. */}
      <MitInfoblase
        zeile={
          <div className="extrasneu-kopf">
            <h2 className="karte-titel">{t("extras.karte.titel")}</h2>
            <span className="hinweis" data-testid="extras-zaehler">
              {t("extrasneu.zaehler", { frei, gesamt: EXTRAS.length })}
            </span>
          </div>
        }
        thema={t("extras.karte.titel")}
        erklaerung={
          <>
            <p>{t("extrasneu.einleitung")}</p>
            <p>{t("extrasneu.hinweis")}</p>
          </>
        }
      />
      <Extrabuehne gewaehlt={gewaehlt} />
      <div className="extrasneu-reiter">
        <Reiter
          name={t("extrasneu.reiterliste")}
          eintraege={arten.map((a) => ({ wert: a, text: reitertext(a) }))}
          gewaehlt={art}
          beiWahl={setzeArt}
        />
      </div>
      <Artauswahl art={art} gewaehlt={gewaehlt} lage={lage} />
    </section>
  );
}
