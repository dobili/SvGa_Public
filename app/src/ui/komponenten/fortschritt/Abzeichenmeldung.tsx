/**
 * Meldung, wenn ein Abzeichen verdient oder eine neue Stufe erreicht ist.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung, freigegeben 30.10.2026): beim Erreichen
 * eine kleine Meldung, ohne Druck. Sie erscheint wie die Gratulation zu einem vollen Ring
 * (Ringfeier.tsx, die sie nach ihren eigenen Gratulationen zeigt), aber schlichter: ohne Feuerwerk
 * und ohne Ton, eine Karte mit den neuen Abzeichen und „Weiter“. Mehrere neue Abzeichen auf einmal
 * (etwa beim ersten Start nach dem Update, wenn schon vieles erreicht ist) stehen auf einer Karte,
 * damit nicht eine Meldung nach der anderen kommt. Beim ersten Start merkt sie die erreichte Stufe
 * still: Ein Aufstieg wird erst ab dann gemeldet.
 * Abhängigkeiten: abzeichenstand.ts, abzeichen.ts, erfahrung.ts, bausteine/Abzeichenbild.tsx,
 * i18n.
 */
import { useEffect } from "react";
import { t } from "../../../i18n/sprache";
import { Abzeichenbild } from "../bausteine/Abzeichenbild";
import { ABZEICHEN, ABZEICHENZEICHEN, abzeichenname, abzeichenbedingung } from "./abzeichen";
import { merkeErsteStufe, merkeGefeiert, useAbzeichenstand } from "./abzeichenstand";

/** Höchstens so viele Bilder auf der Karte; die Namen stehen alle darunter. */
const HOECHSTENS_BILDER = 6;

/** Bilder der neuen Abzeichen (höchstens sechs) oder, nur bei neuer Stufe, das Stufenzeichen. */
function Meldungsbilder({
  neue,
  stufenname,
}: {
  neue: readonly (typeof ABZEICHEN)[number][];
  stufenname: string;
}) {
  return (
    <div className="abzeichenmeldung-bilder">
      {neue.length === 0 && (
        <Abzeichenbild
          symbol={ABZEICHENZEICHEN}
          beschriftung={stufenname}
          klasse="abzeichenbild-gross"
        />
      )}
      {neue.slice(0, HOECHSTENS_BILDER).map((a) => (
        <Abzeichenbild
          key={a.kennung}
          symbol={a.symbol}
          kennung={a.kennung}
          beschriftung={t("abzeichen.verdient", { name: abzeichenname(a.kennung) })}
          klasse={neue.length === 1 ? "abzeichenbild-gross" : ""}
        />
      ))}
    </div>
  );
}

/**
 * Die Meldung zu allen neuen Abzeichen und zur neuen Stufe; „Weiter“ merkt sie als gefeiert.
 * Beispiel: erste Partie beendet → „Neues Abzeichen: Erste Partie“.
 */
export function Abzeichenmeldung() {
  const stand = useAbzeichenstand();
  const ungemerkt = stand?.stufeUngemerkt ?? false;
  const nummer = stand?.stufe.nummer ?? 0;
  useEffect(() => {
    if (ungemerkt) merkeErsteStufe(nummer);
  }, [ungemerkt, nummer]);
  if (!stand || stand.still || (stand.neu.length === 0 && !stand.neueStufe)) return null;
  const neue = ABZEICHEN.filter((a) => stand.neu.includes(a.kennung));
  const stufenname = t(`erfahrung.stufe.${stand.stufe.kennung}`);
  const titel =
    neue.length === 0
      ? t("abzeichenmeldung.stufeTitel")
      : t(neue.length === 1 ? "abzeichenmeldung.titelEins" : "abzeichenmeldung.titel");
  return (
    <div
      className="gruppen-gratulation"
      role="dialog"
      aria-modal="true"
      data-testid="abzeichenmeldung"
    >
      <div className="gruppen-gratulation-karte">
        <Meldungsbilder neue={neue} stufenname={stufenname} />
        <h2>{titel}</h2>
        <ul className="abzeichenmeldung-liste">
          {neue.map((a) => (
            <li key={a.kennung}>
              <strong>{abzeichenname(a.kennung)}</strong>
              {": "}
              {abzeichenbedingung(a.kennung)}
            </li>
          ))}
        </ul>
        {stand.neueStufe && (
          <p>{t("abzeichenmeldung.stufe", { nummer: stand.stufe.nummer, name: stufenname })}</p>
        )}
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => merkeGefeiert(stand.neu, stand.stufe.nummer)}
        >
          {t("abzeichenmeldung.weiter")}
        </button>
      </div>
    </div>
  );
}
