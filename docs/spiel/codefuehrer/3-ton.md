# Codeführer: Ton

Musik, Dauergeräusche, einzelne Klänge und erzeugte Motive. Der Code liegt in
`app/src/abenteuer/ton/`. Die Tondateien liegen im privaten Repository und kommen als
Nachladepaket je Akt; fehlt eine Datei, bleibt es still.

## Schichten

1. **`tonplan.ts`**: reine Logik ohne Web Audio. Was soll klingen? Musik und Dauergeräusch je
   Karte (`musik`, `geraeusch` in `orte.json`), Wechsel durch Dialogtags, einmalige Klänge,
   Lautstärken.
2. **`tonregie.ts`**: hält die Lage und sagt dem Spieler, was klingen soll. Oberwelt, Dialog und
   Ansichten rufen nur diese Funktionen auf.
3. **`tonspieler.ts`**: spielt mit Web Audio, je eine Spur für Musik und Dauergeräusch mit
   Überblenden, dazu einmalige Klänge.
4. **`motive.ts`** und **`motivspieler.ts`**: kurze Motive, die der Browser selbst erzeugt
   (Oszillator, Hüllkurve, Filter), wie die Zugtöne der App.

## Weiteres

- `klangquelle.ts`: Musik mit Reichweite um ein Ding der Karte.
- `tonangaben.ts`: Stücke, die nur einmal spielen, und Anhebung leiser Geräusche.
- `vorabladen.ts`: Musik der Nachbarkarten vorab laden.
- `untertitel.ts`, `untertiteltext.ts`, `Untertitelzeile.tsx`: Geräusche als Text
  („[Tür knarrt]“) für alle, die ohne Ton spielen.
- Nachladen des Tons: `paket/aktton.ts`; Anzeige in `anbindung/Ladestand.tsx` und
  `anbindung/Aktton.tsx`.

## Dateinamen

Die Kennung wird zum Dateinamen: camelCase wird kebab-case, ein Punkt bleibt
(`ambrose.lassMich` → `musik/ambrose.lass-mich.m4a`).
