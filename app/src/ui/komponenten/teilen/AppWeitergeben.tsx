/**
 * Knopf „App weitergeben“ und sein Blatt (Wunsch des Autors, 8.11.2026): Kinder geben die App per
 * Klick an Freunde weiter, über WhatsApp und andere Messenger oder als QR-Code vom Bildschirm.
 *
 * Rolle im Gesamtbild: Der Knopf steht im Profil unter „Einstellungen“ (dort sucht man, was die
 * eigene App betrifft) und auf der Seite „Über die App“. Das Blatt zeigt oben den großen QR-Code
 * der Installationsseite (offline erzeugt, qr/qrcode.ts), darunter das Teilen-Menü des Geräts
 * (nur wo es eins gibt), WhatsApp, E-Mail und „Link kopieren“, ganz unten die Adresse zum
 * Abschreiben oder Markieren. Keine personenbezogenen Daten, nichts an einen Server.
 * Abhängigkeiten: appweitergeben.ts, QrBild.tsx, auswertung/Blatt.tsx, Knopfsymbol, i18n, lucide.
 */
import { Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { Blatt } from "../auswertung/Blatt";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import {
  kannTeilen,
  kopiereAdresse,
  mailLink,
  teileApp,
  WEITERGABE_ADRESSE,
  whatsappLink,
  type Weitergabe,
} from "./appweitergeben";
import { QrBild } from "./QrBild";

const SYMBOLGROESSE = 20;

/** Satz und Betreff in der Sprache der App. */
function weitergabe(): Weitergabe {
  return {
    betreff: t("weitergeben.betreff"),
    text: t("weitergeben.text"),
    adresse: WEITERGABE_ADRESSE,
  };
}

/** Teilen-Menü (falls vorhanden), WhatsApp, E-Mail, Link kopieren; darunter die Meldung. */
function Wege({ angabe }: { angabe: Weitergabe }) {
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const teile = async () => {
    try {
      await teileApp(angabe);
      setzeMeldung(null);
    } catch (fehler) {
      console.warn("App nicht geteilt:", fehler);
      setzeMeldung(t("teilen.fehler"));
    }
  };
  const kopiere = async () => {
    try {
      await kopiereAdresse(angabe.adresse);
      setzeMeldung(t("weitergeben.kopiert"));
    } catch (fehler) {
      console.warn("Adresse nicht kopiert:", fehler);
      setzeMeldung(t("weitergeben.kopierenFehler"));
    }
  };
  return (
    <div className="blattliste" data-testid="weitergeben-wege">
      {kannTeilen() && (
        <button type="button" className="blattzeile" onClick={() => void teile()}>
          <Share2 size={SYMBOLGROESSE} aria-hidden="true" />
          {t("weitergeben.teilen")}
        </button>
      )}
      <a
        className="blattzeile"
        href={whatsappLink(angabe)}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="weitergeben-whatsapp"
      >
        <MessageCircle size={SYMBOLGROESSE} aria-hidden="true" />
        {t("weitergeben.whatsapp")}
      </a>
      <a className="blattzeile" href={mailLink(angabe)} data-testid="weitergeben-mail">
        <Mail size={SYMBOLGROESSE} aria-hidden="true" />
        {t("weitergeben.mail")}
      </a>
      <button
        type="button"
        className="blattzeile"
        onClick={() => void kopiere()}
        data-testid="weitergeben-kopieren"
      >
        <Copy size={SYMBOLGROESSE} aria-hidden="true" />
        {t("weitergeben.kopieren")}
      </button>
      {meldung && (
        <p className="hinweis" role="status">
          {meldung}
        </p>
      )}
    </div>
  );
}

/** Inhalt des Blattes: QR-Code, Wege, Adresse. */
function Weitergabeblatt() {
  const angabe = weitergabe();
  return (
    <div className="weitergeben">
      <figure className="weitergeben-qr">
        <QrBild
          inhalt={angabe.adresse}
          beschriftung={t("weitergeben.qrBild", { adresse: angabe.adresse })}
        />
        <figcaption>{t("weitergeben.qr")}</figcaption>
      </figure>
      <Wege angabe={angabe} />
      <p className="weitergeben-adresse" data-testid="weitergeben-adresse">
        {angabe.adresse}
      </p>
    </div>
  );
}

/**
 * Der Knopf; öffnet das Blatt.
 * Eingabe: zusätzliche Klasse (im Profil volle Breite wie „Einstellungen“).
 * Beispiel: <AppWeitergebenKnopf klasse="profil-weitergeben" />.
 */
export function AppWeitergebenKnopf({ klasse }: { klasse?: string }) {
  const [offen, setzeOffen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={klasse ? `knopf-zweit ${klasse}` : "knopf-zweit"}
        data-testid="app-weitergeben"
        onClick={() => setzeOffen(true)}
      >
        <Knopfsymbol art="teilen" />
        {t("weitergeben.knopf")}
      </button>
      {offen && (
        <Blatt
          titel={t("weitergeben.titel")}
          testid="weitergeben-blatt"
          beiSchliessen={() => setzeOffen(false)}
          kinder={<Weitergabeblatt />}
        />
      )}
    </>
  );
}
