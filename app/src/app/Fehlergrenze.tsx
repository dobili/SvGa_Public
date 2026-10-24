/**
 * Fängt unerwartete Fehler der Oberfläche ab und zeigt eine verständliche Meldung statt einer
 * leeren Seite (Konzept 12: Fehler werden nie verschluckt). Seit R57 (24.10.2026) bietet sie an,
 * die technische Fehlermeldung an den Autor zu schicken (freiwilliger Absturzbericht, nur auf
 * Tipp; Datenschutzerklärung „Meldungen aus der App“).
 * Abhängigkeiten: React, app/melden.ts, i18n.
 */
import { Component, useState, type ErrorInfo, type ReactNode } from "react";
import { t } from "../i18n/sprache";
import { sendeMeldung } from "./melden";

interface Zustand {
  readonly fehler: Error | null;
  readonly komponenten: string;
}

/** Knopf „Fehlerbericht senden“ mit Rückmeldung. */
function Absturzbericht({ text }: { text: string }) {
  const [stand, setzeStand] = useState<"bereit" | "sendet" | "gesendet" | "nicht">("bereit");
  const sende = async () => {
    setzeStand("sendet");
    const ergebnis = await sendeMeldung(
      { art: "absturz", text, seite: window.location.pathname },
      true,
    );
    setzeStand(ergebnis.art === "gesendet" ? "gesendet" : "nicht");
  };
  if (stand === "gesendet" || stand === "nicht") {
    return (
      <p className="hinweis" role="status">
        {t(stand === "gesendet" ? "fehler.berichtGesendet" : "fehler.berichtNicht")}
      </p>
    );
  }
  return (
    <>
      <button
        type="button"
        className="knopf-zweit"
        disabled={stand === "sendet"}
        onClick={() => void sende()}
      >
        {t("fehler.berichtSenden")}
      </button>
      <p className="hinweis klein">{t("fehler.berichtHinweis")}</p>
    </>
  );
}

export class Fehlergrenze extends Component<{ children: ReactNode }, Zustand> {
  override state: Zustand = { fehler: null, komponenten: "" };

  static getDerivedStateFromError(fehler: Error): Partial<Zustand> {
    return { fehler };
  }

  override componentDidCatch(fehler: Error, info: ErrorInfo): void {
    console.error("Fehler in der Oberfläche:", fehler, info.componentStack);
    this.setState({ komponenten: info.componentStack ?? "" });
  }

  override render(): ReactNode {
    const { fehler, komponenten } = this.state;
    if (!fehler) {
      return this.props.children;
    }
    const bericht = [fehler.message, fehler.stack ?? "", komponenten].join("\n\n");
    return (
      <div className="bildschirm">
        <section className="karte" role="alert">
          <h1 className="karte-titel">{t("fehler.titel")}</h1>
          <p className="vorformatiert">{fehler.message}</p>
          <button type="button" className="knopf-haupt" onClick={() => window.location.reload()}>
            {t("fehler.neuLaden")}
          </button>
          <Absturzbericht text={bericht} />
        </section>
      </div>
    );
  }
}
