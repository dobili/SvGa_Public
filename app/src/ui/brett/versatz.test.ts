/** Tests für den seitlichen Versatz übereinanderliegender Pfeile. */
import { describe, expect, it } from "vitest";
import { querversaetze } from "./versatz";

const ABSTAND = 100;

describe("querversaetze", () => {
  it("Abb. 1.26: b6–d4 und c5–d4 liegen übereinander, die übrigen nicht", () => {
    const pfeile = [
      { von: "c5", nach: "d4" },
      { von: "c6", nach: "d4" },
      { von: "b6", nach: "d4" },
      { von: "c3", nach: "d4" },
      { von: "f3", nach: "d4" },
      { von: "d1", nach: "d4" },
    ];
    expect(querversaetze(pfeile, ABSTAND)).toEqual([-50, 0, 50, 0, 0, 0]);
  });

  it("Pfeile auf derselben Linie ohne gemeinsames Stück bleiben, wo sie sind", () => {
    const pfeile = [
      { von: "a1", nach: "c3" },
      { von: "d4", nach: "f6" },
    ];
    expect(querversaetze(pfeile, ABSTAND)).toEqual([0, 0]);
  });

  it("gegenläufige Pfeile werden getrennt, drei Pfeile gleichmäßig verteilt", () => {
    expect(
      querversaetze(
        [
          { von: "e2", nach: "e5" },
          { von: "e5", nach: "e2" },
        ],
        ABSTAND,
      ),
    ).toEqual([-50, -50]);
    const drei = querversaetze(
      [
        { von: "a1", nach: "a8" },
        { von: "a2", nach: "a5" },
        { von: "a4", nach: "a6" },
      ],
      ABSTAND,
    );
    expect(drei).toEqual([-100, 0, 100]);
  });
});
