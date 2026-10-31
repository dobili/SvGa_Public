/**
 * Profilkarte „Deine Extras“ (Gamifizierung P7): alle freischaltbaren Extras nach Art, freie zum
 * Wählen, gesperrte als Silhouette mit ihrer Bedingung („Ab Stufe 5“).
 *
 * Rolle im Gesamtbild: Steht im Profil unter „Dein Fortschritt“ (profilkarten.ts). Die Liste und
 * die Regeln kommen aus training/extras.ts, die Wahl je Art aus extrawahl.ts. Brett und Figuren
 * lassen sich auch in den Einstellungen wählen; dort stehen dieselben Sperren. Nie wegnehmen
 * (E8): Ein gewähltes Extra bleibt gewählt, auch wenn die Bedingung gerade nicht erfüllt ist.
 * Abhängigkeiten: training/extras.ts, extrawahl.ts, extralage.ts, extratexte.ts, i18n, lucide-react.
 */
import { Lock } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { bedingungErfuellt, EXTRAARTEN, extrasDerArt, type Extra } from "../../../training/extras";
import { bedingungstext, extraname } from "./extratexte";
import { useExtralage } from "./extralage";
import { extrawahl, useGewaehlteExtras } from "./extrawahl";

/** Größe des Schlosses auf gesperrten Kacheln. */
const SCHLOSSGROESSE = 14;

/** Eine Kachel: Bild, Name und Knopf (frei) oder Schloss mit Bedingung (gesperrt). */
function Extrakachel({
  extra,
  frei,
  gewaehlt,
}: {
  extra: Extra;
  frei: boolean;
  gewaehlt: boolean;
}) {
  const wahl = extrawahl(extra.art);
  const name = extraname(extra);
  const offen = frei || gewaehlt;
  const ohne = wahl?.ohne ?? null;
  const ablegen = gewaehlt && ohne !== null;
  const knopftext = t(ablegen ? "extras.ablegen" : gewaehlt ? "extras.gewaehlt" : "extras.waehlen");
  return (
    <li
      className={`extrakachel${offen ? "" : " extrakachel-gesperrt"}`}
      data-testid={`extra-${extra.kennung}`}
    >
      <img className="extrakachel-bild" src={`${import.meta.env.BASE_URL}${extra.bild}`} alt="" />
      <span className="extrakachel-name">{name}</span>
      {offen ? (
        <button
          type="button"
          className="knopf-zweit"
          aria-pressed={gewaehlt}
          aria-label={`${name}: ${knopftext}`}
          disabled={gewaehlt && !ablegen}
          onClick={() => wahl?.waehle(ablegen && ohne !== null ? ohne : extra.wert)}
        >
          {knopftext}
        </button>
      ) : (
        <span className="extrakachel-bedingung">
          <Lock size={SCHLOSSGROESSE} aria-hidden="true" />
          {bedingungstext(extra.bedingung)}
        </span>
      )}
    </li>
  );
}

/** Die Karte mit allen Extras, je Art eine Reihe. */
export function ExtrasKarte() {
  const lage = useExtralage();
  const gewaehlt = useGewaehlteExtras();
  return (
    <section className="karte extraskarte" data-testid="extras">
      <h2 className="karte-titel">{t("extras.karte.titel")}</h2>
      <p className="hinweis">{t("extras.karte.einleitung")}</p>
      {EXTRAARTEN.map((art) => (
        <div key={art} className="extrareihe">
          <h3 className="extrareihe-titel">{t(extrawahl(art)?.titel ?? "extras.karte.titel")}</h3>
          <ul className="extraliste">
            {extrasDerArt(art).map((extra) => (
              <Extrakachel
                key={extra.kennung}
                extra={extra}
                frei={bedingungErfuellt(extra.bedingung, lage)}
                gewaehlt={gewaehlt[art] === extra.wert}
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
