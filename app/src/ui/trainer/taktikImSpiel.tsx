/**
 * Rückmeldungen der Taktikaufgaben im Schach-Abenteuer für Kinder (Spieltest „einstieg“, R4,
 * 15.11.2026): Lob nach jedem richtigen Teilzug, nach „Ich komme nicht drauf“ ein Satz ohne „Fast“
 * oder „Nicht ganz“ (die Lösung zeigen Pfeile, ui/trainer/loesungspfeile.ts).
 *
 * Rolle im Gesamtbild: Bausteine für ui/trainer/Taktikaufgabe.tsx, die nur gelten, wenn die Aufgabe
 * in einer Runde des Abenteuers läuft (useImSpiel, imSpiel.ts). Der Taktiktrainer der Buch-App
 * zeigt weiter Notation, Verlust laut Engine und Warnsignal-Kürzel; dort ändert sich nichts.
 * Warum: Ein Kind hielt einen richtigen ersten Zug für falsch, weil nach der Antwort des Gegners
 * nichts kam.
 * Abhängigkeiten: ui/trainer/imSpiel.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import { useSpielanzeige } from "./imSpiel";

/**
 * Eine Rückmeldung im Stil des Spiels (Sprechblase), ohne die Vorsilbe „Richtig!“ oder „Nicht
 * ganz.“ der Antwortmeldung. Ohne Spielanzeige die schlichte Meldung der App.
 * Beispiel: nach dem richtigen ersten Zug einer Gabel → „Gut! Der Gegner hat geantwortet. …“.
 */
function Spielmeldung({ richtig, text }: { richtig: boolean; text: string }) {
  const anzeige = useSpielanzeige();
  if (anzeige?.meldung) return anzeige.meldung(richtig, text);
  return (
    <p className={`meldung ${richtig ? "gut" : "schlecht"}`} role="status">
      {text}
    </p>
  );
}

/** Lob nach einem richtigen Teilzug (der Gegner hat schon geantwortet). */
export function Teilzuglob() {
  return <Spielmeldung richtig text={t("imSpiel.teilzug")} />;
}

/** Statt „Nicht ganz. Lösung: …“ nach „Ich komme nicht drauf“: Die Pfeile zeigen den Weg. */
export function Loesungshinweis() {
  return <Spielmeldung richtig={false} text={t("imSpiel.loesungPfeile")} />;
}
