/**
 * Bildschirm „Karte“: der ganze Baum einer Variante als verschiebbare, zoombare Karte.
 *
 * Rolle im Gesamtbild: Notiz des Autors zur Baum-Ansicht (1.11.2026): „Zusätzlich eine auf einer
 * extra Seite öffnende Darstellung des Baums als in alle Richtungen scrollbare Karte/Mindmap“.
 * Geöffnet über den Knopf „Karte“ der Variante (Variante.tsx); Wert der Ansicht ist die Kennung
 * der Variante (ein Entwurf wird vorher gespeichert). Oben Knöpfe zum Zoomen, „Alles zeigen“, „Zur
 * Stellung“ und der Wechsel zur Liste; an jedem Abzweig ein kleines Brett mit den blauen Pfeilen (Kartenliste.tsx, zugänglich für Tastatur und
 * Bildschirmleser); darunter eine kurze Legende der Zeichen. Ein Tipp auf einen Zug merkt ihn als
 * gezeigte Stellung und kehrt zur Variante zurück, die dort weitermacht.
 * Eingetragen in app/zusatzansichten.ts unter „variantenkarte“.
 * Abhängigkeiten: schach/baumlayout.ts, komponenten/varianten (Kartenflaeche, Kartenliste,
 * variantenwert), speicher, Navigation, i18n, lucide-react.
 */
import { List, LocateFixed, Map as Kartensymbol, Maximize2, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { sprache, t } from "../../i18n/sprache";
import { kartenlayout, knotenstelle, type Kartenlayout } from "../../schach/baumlayout";
import { fenAm, type Pfad } from "../../schach/variationsbaum";
import type { Variation } from "../../training/variationen";
import { useSpeicher } from "../../speicher/speicher";
import { MitInfo } from "../komponenten/bausteine/InfoKnopf";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { Kartenflaeche, type Kartensteuerung } from "../komponenten/varianten/Kartenflaeche";
import type { Abzweigbrett } from "../komponenten/varianten/Kartenbrett";
import { Kartenliste } from "../komponenten/varianten/Kartenliste";
import { fortsetzungschips } from "../komponenten/varianten/fortsetzungen";
import { ZOOM } from "../komponenten/varianten/useKartenbewegung";
import {
  ANSICHT_VARIANTE,
  gemerkterPfad,
  merkePfad,
  varianteAnsicht,
} from "../komponenten/varianten/variantenwert";
import "../stil/variantenkarte.css";

const SYMBOL = 18;
/** Kennung des Bildschirms in ZUSATZANSICHTEN. */
export const ANSICHT_VARIANTENKARTE = "variantenkarte";

/** Springt zur Variante an diesen Pfad: zurück, wenn sie darunter liegt, sonst an ihre Stelle. */
function useSprung(id: string) {
  const { stapel, zurueck, ersetze } = useNavigation();
  const darunter = stapel.ansichten.at(-2);
  const zurVariante =
    darunter?.bildschirm === "zusatz" &&
    darunter.kennung === ANSICHT_VARIANTE &&
    darunter.wert === id;
  return (pfad: Pfad) => {
    merkePfad(id, pfad);
    if (zurVariante) zurueck();
    else ersetze(varianteAnsicht(id));
  };
}

/** Ein Knopf mit Symbol über der Karte. */
function Werkzeug(props: {
  name: string;
  tun: () => void;
  children: React.ReactNode;
  an?: boolean;
}) {
  return (
    <button
      type="button"
      className="knopf-symbol kartenwerkzeug"
      aria-label={props.name}
      title={props.name}
      aria-pressed={props.an}
      onClick={props.tun}
    >
      {props.children}
    </button>
  );
}

/** Zoomen, alles zeigen, zur Stellung. */
function Zoomwerkzeuge({
  steuerung,
  aktuell,
}: {
  steuerung: React.RefObject<Kartensteuerung | null>;
  aktuell: number;
}) {
  const werkzeuge = [
    {
      name: t("varianten.karte.kleiner"),
      Symbol: Minus,
      tun: () => steuerung.current?.zoome(1 / ZOOM.schritt),
    },
    {
      name: t("varianten.karte.groesser"),
      Symbol: Plus,
      tun: () => steuerung.current?.zoome(ZOOM.schritt),
    },
    {
      name: t("varianten.karte.ganz"),
      Symbol: Maximize2,
      tun: () => steuerung.current?.einpassen(),
    },
    {
      name: t("varianten.karte.hier"),
      Symbol: LocateFixed,
      tun: () => steuerung.current?.zentriere(aktuell),
    },
  ];
  return werkzeuge.map(({ name, Symbol, tun }) => (
    <Werkzeug key={name} name={name} tun={tun}>
      <Symbol size={SYMBOL} aria-hidden="true" />
    </Werkzeug>
  ));
}

/** Die Knopfleiste: Zoomwerkzeuge (nur bei der Karte) und der Wechsel zwischen Karte und Liste. */
function Werkzeuge({
  steuerung,
  aktuell,
  liste,
  setzeListe,
}: {
  steuerung: React.RefObject<Kartensteuerung | null>;
  aktuell: number;
  liste: boolean;
  setzeListe: (an: boolean) => void;
}) {
  const Wechsel = liste ? Kartensymbol : List;
  return (
    <div
      className="kartenwerkzeuge"
      role="toolbar"
      aria-label={t("varianten.karte.knopf")}
      data-tour="karte-knoepfe"
    >
      {!liste && <Zoomwerkzeuge steuerung={steuerung} aktuell={aktuell} />}
      <button
        type="button"
        className="knopf-zweit kartenwechsel"
        onClick={() => setzeListe(!liste)}
      >
        <Wechsel size={SYMBOL} aria-hidden="true" />{" "}
        {liste ? t("varianten.karte.bild") : t("varianten.karte.liste")}
      </button>
    </div>
  );
}

/** Kurze Legende der Zeichen auf der Karte, mit ⓘ. */
function Zeichenlegende() {
  return (
    <MitInfo
      zeile={
        <p className="kartenlegende hinweis">
          <span className="kl-haupt">{t("varianten.hauptvariante")}</span>
          <span className="kl-eigen">{t("varianten.karte.eigen")}</span>
          <span className="kl-engine">{t("varianten.karte.engine")}</span>
        </p>
      }
      erklaerung={t("varianten.karte.info")}
      thema={t("varianten.karte.knopf")}
    />
  );
}

/**
 * Die Bretter der Abzweige: Stellung und Fortsetzungspfeile je Knoten mit mehr als einer
 * Fortsetzung. Beispiel: Abb. 2.40 → ein Brett nach 3. Sxe5 mit Stern an d7–d6 und „2“ an f6–e4.
 */
function abzweigbretter(variation: Variation, layout: Kartenlayout): Abzweigbrett[] {
  return layout.knoten.flatMap((k, stelle) => {
    if (k.abzweige === 0) return [];
    const fen = fenAm(variation, k.pfad);
    return fen ? [{ stelle, fen, chips: fortsetzungschips(variation, k.pfad, sprache()) }] : [];
  });
}

/** Karte oder Liste einer gespeicherten Variante. */
function Inhalt(props: {
  id: string;
  layout: Kartenlayout;
  bretter: readonly Abzweigbrett[];
  pfad: Pfad;
}) {
  const { id, layout, pfad } = props;
  const springe = useSprung(id);
  const steuerung = useRef<Kartensteuerung>(null);
  const [liste, setzeListe] = useState(false);
  const aktuell = knotenstelle(layout, pfad);
  const waehle = (stelle: number) => springe(layout.knoten[stelle]?.pfad ?? []);
  // Beim Öffnen und nach dem Wechsel von der Liste steht die gezeigte Stellung in der Mitte.
  useEffect(() => {
    if (!liste) steuerung.current?.zentriere(aktuell);
  }, [liste, aktuell]);
  return (
    <>
      <Werkzeuge steuerung={steuerung} aktuell={aktuell} liste={liste} setzeListe={setzeListe} />
      {liste ? (
        <Kartenliste layout={layout} aktuell={aktuell} beiWahl={waehle} />
      ) : (
        <>
          <p className="hinweis kartenhinweis">{t("varianten.karte.hinweis")}</p>
          <Kartenflaeche
            layout={layout}
            bretter={props.bretter}
            aktuell={aktuell}
            anfang={{ x: 0, y: 0, s: 1 }}
            beiWahl={waehle}
            steuerung={steuerung}
            beschriftung={t("varianten.karte.flaeche")}
          />
        </>
      )}
      <Zeichenlegende />
    </>
  );
}

/**
 * Der Bildschirm „Karte“. Eingabe: Kennung der Variante.
 * Sonderfall: Gibt es die Variante nicht (mehr), steht dort ein Hinweis.
 */
export function Variantenkarte({ wert }: { wert: string | null }) {
  const variation = useSpeicher((z) => z.daten.variationen.find((v) => v.id === wert));
  const geladen = useSpeicher((z) => z.geladen);
  // Die Karte beginnt oben, auch wenn die Variante weit unten verlassen wurde (Baum offen).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const layout = useMemo(
    () => (variation ? kartenlayout(variation, sprache(), t("varianten.karte.start")) : null),
    [variation],
  );
  const bretter = useMemo(
    () => (variation && layout ? abzweigbretter(variation, layout) : []),
    [variation, layout],
  );
  const titel = variation
    ? t("varianten.karte.titel", { titel: variation.titel || t("varianten.ohneTitel") })
    : t("varianten.karte.knopf");
  return (
    <div className="bildschirm bildschirm-variantenkarte" data-testid="variantenkarte">
      <Kopfzeile titel={titel} zurueckText={t("varianten.zurueck")} />
      {!geladen && <p className="lade">…</p>}
      {geladen && (!variation || !layout) && <p className="fehlertext">{t("varianten.fehlt")}</p>}
      {variation && layout && (
        <Inhalt
          id={variation.id}
          layout={layout}
          bretter={bretter}
          pfad={gemerkterPfad(variation.id) ?? variation.startpfad}
        />
      )}
    </div>
  );
}
