/**
 * Vorschau „So siehst du gerade aus“ oben in der Profilkarte „Deine Extras“ (Entwurf E1
 * „Ankleide“, 31.10.2026): Porträt mit Rahmen, Name, Titel, Stufe, darunter ein Mini-Brett in den
 * eigenen Brettfarben mit dem eigenen Figurensatz und eine Zeile je weiterer Art; im Hintergrund
 * Konfetti in den gewählten Farben.
 *
 * Rolle im Gesamtbild: Wer eine Kachel antippt, sieht hier sofort die Wirkung. Welche Arten am
 * Porträt und welche als Zeile erscheinen, sagt `ort` in extrawahl.ts; eine neue Art erscheint
 * als Zeile von selbst. Das Konfetti steht still (kein Effekt, daher ohne Schalter
 * „Feiereffekte“).
 * Abhängigkeiten: extrawahl.ts, extratexte.ts, Extravorschau.tsx, profil/Spielerbild,
 * profil/spieler.ts, fortschritt/abzeichenstand.ts, bausteine/Vorschauwahl, i18n.
 */
import { useEinstellungen } from "../../../app/einstellungen";
import { t } from "../../../i18n/sprache";
import { Spielerbild } from "../../profil/Spielerbild";
import { useSpielerprofil } from "../../profil/spieler";
import { Brettausschnitt, type Vorschaufeld } from "../bausteine/Vorschauwahl";
import { useAbzeichenstand } from "../fortschritt/abzeichenstand";
import { reitertext, wertname } from "./extratexte";
import { EXTRAWAHL } from "./extrawahl";
import { Konfettibild, Titelband } from "./Extravorschau";

/** Seitenlänge des Mini-Bretts in Feldern. */
const SEITE = 4;
/** Figuren auf dem Mini-Brett (Spalte, Reihe von oben links; FEN-Zeichen). */
const FIGUREN: Readonly<Record<string, string>> = {
  "1,0": "k",
  "2,1": "p",
  "1,2": "N",
  "3,3": "K",
};
/** Die 16 Felder des Mini-Bretts, oben links hell wie a8. */
const FELDER: readonly Vorschaufeld[] = Array.from({ length: SEITE * SEITE }, (_, i) => {
  const spalte = i % SEITE;
  const reihe = Math.floor(i / SEITE);
  return {
    spalte,
    reihe,
    hell: (spalte + reihe) % 2 === 0,
    figur: FIGUREN[`${spalte},${reihe}`] ?? "",
  };
});

/** Name, Titel und Stufe neben dem Porträt. */
function Kopfzeilen({ titel }: { titel: string }) {
  const profil = useSpielerprofil();
  const stand = useAbzeichenstand();
  return (
    <div className="extrabuehne-text">
      <strong className="extrabuehne-name">{profil.name || t("profil.ohneName")}</strong>
      <Titelband wert={titel} />
      {stand && (
        <span className="hinweis">
          {t("extrasneu.stufe", {
            nummer: stand.stufe.nummer,
            name: t(`erfahrung.stufe.${stand.stufe.kennung}`),
          })}
        </span>
      )}
    </div>
  );
}

/** Die Vorschau; `gewaehlt` ist der gewählte Wert je Art (useGewaehlteExtras). */
export function Extrabuehne({ gewaehlt }: { gewaehlt: Readonly<Record<string, string>> }) {
  const profil = useSpielerprofil();
  const einstellungen = useEinstellungen();
  const zeilen = EXTRAWAHL.filter((w) => w.ort === "zeile");
  return (
    <div className="extrabuehne" data-testid="extras-buehne">
      <Konfettibild palette={gewaehlt.konfetti ?? "app"} className="extrabuehne-konfetti" />
      <span className="extrabuehne-marke">{t("extrasneu.buehne")}</span>
      <div className="extrabuehne-kopf">
        <span className="extrabuehne-portraet">
          <Spielerbild profil={profil} />
        </span>
        <Kopfzeilen titel={gewaehlt.titel ?? ""} />
      </div>
      <div className="extrabuehne-brett">
        <span className="extrabuehne-minibrett">
          <Brettausschnitt
            farben={einstellungen.brettfarben}
            satz={einstellungen.figurensatz}
            felder={FELDER}
            seite={SEITE}
          />
        </span>
        <dl className="extrabuehne-liste">
          {zeilen.map((w) => (
            <div key={w.art}>
              <dt>{reitertext(w.art)}</dt>
              <dd>{wertname(w.art, gewaehlt[w.art] ?? w.ohne)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
