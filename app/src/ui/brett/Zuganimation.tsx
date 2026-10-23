/**
 * Zuganimation, Zeichnung: Die gezogene Figur gleitet vom Start- zum Zielfeld, mit kurzer,
 * verblassender Spur aus drei Nachbildern; eine geschlagene Figur verblasst darunter.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R37, 23.10.2026). Welche Figuren gleiten und wann,
 * bestimmt useZuganimation.ts; Brett.tsx zeichnet diese Ebene über den Figuren und blendet dort
 * die angekommenen Figuren aus, solange sie gleiten.
 * Abhängigkeiten: useZuganimation.ts, geometrie.ts, Figur.tsx, Web Animations API.
 */
import { useLayoutEffect, useRef } from "react";
import type { Figurensatz } from "../../app/einstellungen";
import { Figur } from "./Figur";
import { feldEcke } from "./geometrie";
import {
  SPUR_ABSTAND_MS,
  SPUR_DURCHSICHT,
  ZUG_ANIMATION_MS,
  type Bewegung,
} from "./useZuganimation";

/** Spielt eine Animation am Element ab, wo der Browser die Web Animations API kennt. */
function spiele(element: Element | null, bilder: Keyframe[], optionen: KeyframeAnimationOptions) {
  if (element && typeof element.animate === "function") element.animate(bilder, optionen);
}

/** Eine gleitende Figur mit ihren Nachbildern und der geschlagenen Figur darunter. */
function Gleiten({
  bewegung,
  gedreht,
  satz,
  farbe,
}: {
  bewegung: Bewegung;
  gedreht: boolean;
  satz: Figurensatz;
  farbe: string;
}) {
  const figur = useRef<SVGGElement>(null);
  const spur = useRef<(SVGGElement | null)[]>([]);
  const opfer = useRef<SVGGElement>(null);
  const start = feldEcke(bewegung.von, gedreht);
  const ziel = feldEcke(bewegung.nach, gedreht);
  useLayoutEffect(() => {
    if (!start || !ziel) return;
    // Im SVG gelten Bildpunkte der CSS-Verschiebung als Einheiten des Brettes.
    const weg = `translate(${start.x - ziel.x}px, ${start.y - ziel.y}px)`;
    const gleiten = { duration: ZUG_ANIMATION_MS, easing: "ease-out", fill: "both" } as const;
    spiele(figur.current, [{ transform: weg }, { transform: "translate(0px, 0px)" }], gleiten);
    spur.current.forEach((bild, i) => {
      const durchsicht = SPUR_DURCHSICHT[i] ?? 0;
      spiele(
        bild,
        [
          { transform: weg, opacity: durchsicht },
          { transform: "translate(0px, 0px)", opacity: 0 },
        ],
        { ...gleiten, delay: SPUR_ABSTAND_MS * (i + 1) },
      );
    });
    spiele(opfer.current, [{ opacity: 1 }, { opacity: 0 }], gleiten);
    // Nur beim Erscheinen: Jede Bewegung hat ihren eigenen Schlüssel und gleitet einmal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!start || !ziel) return null;
  const zeichne = (zeichen: string) => (
    <Figur zeichen={zeichen} x={ziel.x} y={ziel.y} satz={satz} farbe={farbe} />
  );
  return (
    <g pointerEvents="none" data-testid="zuganimation" data-zug={`${bewegung.von}${bewegung.nach}`}>
      {bewegung.geschlagen && <g ref={opfer}>{zeichne(bewegung.geschlagen)}</g>}
      {SPUR_DURCHSICHT.map((durchsicht, i) => (
        <g
          key={durchsicht}
          opacity={0}
          ref={(element) => {
            spur.current[i] = element;
          }}
        >
          {zeichne(bewegung.zeichen)}
        </g>
      ))}
      <g ref={figur}>{zeichne(bewegung.zeichen)}</g>
    </g>
  );
}

/** Alle gleitenden Figuren eines Zuges (bei der Rochade zwei). */
export function Zuganimation({
  laufend,
  gedreht,
  satz,
  farbe,
}: {
  laufend: readonly Bewegung[];
  gedreht: boolean;
  satz: Figurensatz;
  farbe: string;
}) {
  return laufend.map((b) => (
    <Gleiten key={`${b.von}${b.nach}`} bewegung={b} gedreht={gedreht} satz={satz} farbe={farbe} />
  ));
}
