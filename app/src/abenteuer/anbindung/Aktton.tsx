/**
 * Im Spielmenü: Ton aller Akte jetzt laden (Entscheidung des Autors, 13.11.2026). Zeigt, wie viel
 * noch fehlt, und den Fortschritt; ist alles da, nur einen Satz.
 *
 * Rolle im Gesamtbild: Teil der Tonregler (anbindung/Tonregler.tsx). Das Laden selbst macht
 * paket/aktton.ts.
 * Abhängigkeiten: paket/aktton.ts, i18n.
 */
import { useEffect, useState } from "react";
import { t } from "../../i18n/sprache";
import { fehlendeAktbytes, ladeAlleAkte } from "../paket/aktton";

const BYTES_JE_MB = 1024 * 1024;

type Stand =
  | { readonly art: "pruefe" }
  | { readonly art: "fehlt"; readonly bytes: number }
  | { readonly art: "laedt"; readonly anteil: number }
  | { readonly art: "da" }
  | { readonly art: "fehler" };

/** Megabyte, auf eine Stelle gerundet, mindestens 0,1. */
function mb(bytes: number): string {
  return Math.max(0.1, bytes / BYTES_JE_MB).toFixed(1);
}

export function Aktton() {
  const [stand, setzeStand] = useState<Stand>({ art: "pruefe" });
  useEffect(() => {
    let aktiv = true;
    fehlendeAktbytes()
      .then((bytes) => {
        if (aktiv) setzeStand(bytes > 0 ? { art: "fehlt", bytes } : { art: "da" });
      })
      .catch((fehler: unknown) => {
        console.warn("Stand des Akttons unbekannt", fehler);
        if (aktiv) setzeStand({ art: "da" });
      });
    return () => {
      aktiv = false;
    };
  }, []);
  const lade = () => {
    setzeStand({ art: "laedt", anteil: 0 });
    ladeAlleAkte((geladen, gesamt) =>
      setzeStand({ art: "laedt", anteil: gesamt > 0 ? geladen / gesamt : 1 }),
    )
      .then(() => setzeStand({ art: "da" }))
      .catch((fehler: unknown) => {
        console.warn("Ton der Akte nicht geladen", fehler);
        setzeStand({ art: "fehler" });
      });
  };
  if (stand.art === "pruefe" || stand.art === "da") return null;
  if (stand.art === "laedt") {
    return (
      <p className="abenteuer-ton-hinweis" role="status">
        {t("abenteuer.ton.aktLaedt", { prozent: Math.round(stand.anteil * 100) })}
      </p>
    );
  }
  return (
    <button type="button" className="knopf-zweit" data-testid="abenteuer-ton-akte" onClick={lade}>
      {stand.art === "fehler"
        ? t("abenteuer.ton.aktFehler")
        : t("abenteuer.ton.aktLaden", { mb: mb(stand.bytes) })}
    </button>
  );
}
