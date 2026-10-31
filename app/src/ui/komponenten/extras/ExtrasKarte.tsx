/**
 * Profilkarte „Deine Extras“ (Gamifizierung P7, neu gestaltet nach Entwurf E1 „Ankleide“ am
 * 31.10.2026): oben die Vorschau „So siehst du gerade aus“, darunter je Art ein Reiter mit
 * Kacheln; Antippen legt an, erneutes Antippen oder „… ablegen“ legt ab.
 *
 * Rolle im Gesamtbild: Steht im Profil unter „Dein Fortschritt“ (profilkarten.ts). Die Liste und
 * die Regeln kommen aus training/extras.ts, die Wahl je Art aus extrawahl.ts. Die Reiter entstehen
 * aus `EXTRAARTEN` (nur Arten mit Extras): Eine neue Art erscheint von selbst. Brett und Figuren
 * lassen sich auch in den Einstellungen wählen; dort stehen dieselben Sperren. Nie wegnehmen
 * (E8): Ein gewähltes Extra bleibt gewählt (und zählt als frei), auch wenn die Bedingung gerade
 * nicht erfüllt ist.
 * Abhängigkeiten: training/extras.ts, extrawahl.ts, extralage.ts, extratexte.ts, Extrabuehne.tsx,
 * Extrakachel.tsx, bausteine/Reiter.tsx, profil/spieler.ts, i18n, lucide-react.
 */
import { CircleHelp, X } from "lucide-react";
import { useState } from "react";
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
import { Reiter } from "../bausteine/Reiter";
import { Extrabuehne } from "./Extrabuehne";
import { Extrakachel, type Kachelzustand } from "./Extrakachel";
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

/** Die Kacheln einer Art und darunter „… ablegen“, solange ein Extra dieser Art angelegt ist. */
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
  const profil = useSpielerprofil();
  const einstellungen = useEinstellungen();
  const extras = extrasDerArt(art);
  const angelegt = extras.some((e) => gewaehlt[art] === e.wert);
  const lege = (wert: string) => wahl?.waehle(wert);
  return (
    <div role="tabpanel" aria-label={reitertext(art)} className="extrasneu-auswahl">
      <ul className="extrasneu-kacheln">
        {extras.map((extra) => {
          const zustand = zustandVon(extra, gewaehlt, lage);
          return (
            <Extrakachel
              key={extra.kennung}
              extra={extra}
              zustand={zustand}
              lage={lage}
              kontext={{ profil, einstellungen }}
              beiTipp={() => lege(zustand === "angelegt" ? (wahl?.ohne ?? "") : extra.wert)}
            />
          );
        })}
      </ul>
      {angelegt && wahl && (
        <button type="button" className="extrasneu-ablegen" onClick={() => lege(wahl.ohne)}>
          <X size={ZEICHENGROESSE} aria-hidden="true" />
          {t("extrasneu.ablegen", { art: reitertext(art) })}
        </button>
      )}
    </div>
  );
}

/** Die Karte: Kopf mit Zähler, Vorschau, Reiter je Art, Kacheln, Hinweis. */
export function ExtrasKarte() {
  const lage = useExtralage();
  const gewaehlt = useGewaehlteExtras();
  const arten = EXTRAARTEN.filter((a) => extrasDerArt(a).length > 0);
  const [art, setzeArt] = useState<Extraart>(arten[0] ?? "rahmen");
  const frei = EXTRAS.filter((e) => zustandVon(e, gewaehlt, lage) !== "gesperrt").length;
  return (
    <section className="karte extraskarte" data-testid="extras">
      <div className="extrasneu-kopf">
        <h2 className="karte-titel">{t("extras.karte.titel")}</h2>
        <span className="hinweis" data-testid="extras-zaehler">
          {t("extrasneu.zaehler", { frei, gesamt: EXTRAS.length })}
        </span>
      </div>
      <p className="hinweis">{t("extrasneu.einleitung")}</p>
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
      <p className="hinweis extrasneu-fuss">
        <CircleHelp size={ZEICHENGROESSE} aria-hidden="true" />
        {t("extrasneu.hinweis")}
      </p>
    </section>
  );
}
