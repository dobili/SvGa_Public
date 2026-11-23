# Verdeckung beim Sitzen und Liegen: Sichtprüfung im Spiel (23.11.2026)

Auftrag des Hauptchats (Nacht 23.11.2026): An allen Sitz- und Liegestellen im Spiel mit den echten
Bildern fotografieren, Fehler beheben, vorher und nachher vergleichen. Die Fotos und die
Vergleichsseite liegen nur lokal in `buch/arbeit/verdeckung/fotos/` (Paketbilder, nie ins
öffentliche Repository). Dieser Bericht kommt ohne Bilder aus.

## Verfahren

- Stellen: `python -m pipeline.abenteuer.verdeckung` (312 Stellen, 0 Befunde) und daraus 56 zum
  Fotografieren: je Möbelart und Blickrichtung mindestens zwei, dazu Diner-Theke, Clubraum,
  Wohnzimmer, Parkbank, Wards Sessel, Oma Ruth nachts im Bett, Lucia in der Sternwarte und zwölf
  Stellen hinter Theke, Kasse, Schreibtisch, Marktstand, Boot und Zaun.
- Aufnahme: `app/tests/durchlauf/verdeckungsfoto.spec.ts` (Aufruf im Dateikopf). Je Stelle der
  Stand der Gesamtsimulation zu Beginn des passenden Akts (`aktstand.cjs`), die Spieluhr auf die
  Stunde des Tagesablaufs (Blockbeginn + 1, am zweiten Spieltag), der Held auf einem freien Feld
  nahe der Stelle, ein Foto der ganzen Seite und ein Ausschnitt von sechs Kacheln um die Stelle
  (über die Kamera gerechnet, auch am Kartenrand).
- Prüfpunkte: Rumpf frei bei seitlichem Blick, Beine verdeckt von vorn, Kopf über der Lehne von
  hinten, Kopf frei im Bett, Figur sitzt auf dem Möbel, Größe passt; Tiefe hinter Theken,
  Schreibtischen, Ständen und Zäunen.

## Befunde und Korrekturen

(wird nach dem Nachher-Lauf vervollständigt)
