/*
 * Karteneditor – Bettvordergrund über Liegenden (Editor 1.9.1, Auftrag des Hauptchats, 23.11.2026):
 * wie bettausschnitt in der App (app/src/abenteuer/oberwelt/vordergrund.ts). Wer im Bett liegt,
 * liegt unter der Decke: Das Bett wird ein zweites Mal über die Figur gezeichnet, aber nur ohne die
 * Kopfseite (Anteil `kopf` der sichtbaren Breite, Vorgabe 0,3, im Katalog `vordergrund.kopf`; 1
 * heißt: keine Decke). Die Kopfseite steht im Namen des Betts (KopfRechts/KopfOst, KopfLinks/
 * KopfWest), gespiegelt vertauscht; ohne Angabe rechts, wie die App (sitzrichtung.ts,
 * kopfseiteDesBetts). Gedrehte oder beschnittene Betten zeigt der Editor ohne Decke.
 */
"use strict";

(function (KE) {
  const K = 16;
  const BETT = /Bett/;
  const KOPF_RECHTS = /Kopf(Rechts|Ost)/;
  const KOPF_LINKS = /Kopf(Links|West)/;
  const VORGABE_KOPF = 0.3;

  /** Kopfseite eines Betts aus seinem Namen, gespiegelt vertauscht; ohne Angabe rechts. */
  KE.kopfseiteDesBetts = function (name, gespiegelt) {
    const seite = KOPF_LINKS.test(name) ? "links" : KOPF_RECHTS.test(name) ? "rechts" : "rechts";
    if (!gespiegelt) return seite;
    return seite === "rechts" ? "links" : "rechts";
  };

  /** Das Bett unter dem Feld einer Markierung (kleinstes, das die Kachelmitte enthält), sonst null. */
  function bettUnter(feld) {
    const mx = feld[0] * K + K / 2;
    const my = feld[1] * K + K / 2;
    return (
      KE.platziere(KE.szene())
        .filter((s) => !s.fehlt && BETT.test(s.kennung))
        .filter((s) => s.x <= mx && mx < s.x + s.b && s.y <= my && my < s.y + s.h)
        .sort((a, b) => a.b * a.h - b.b * b.h)[0] || null
    );
  }

  /**
   * Zeichnet die Decke des Betts über eine Liegende (aufgerufen aus KE.zeichnePerson, blick.js).
   * Ausschnitt im Bildrahmen wie bettausschnitt; die Kopfseite gilt im Rahmen, also vor dem
   * Spiegeln: Ein gespiegeltes Bett zeigt seine Kopfseite vertauscht, gezeichnet wird gespiegelt.
   */
  KE.zeichneBettvordergrund = function (ctx, m) {
    const s = bettUnter(m.eintrag.feld);
    const roh = s && KE.zustand.daten.moebel[s.kennung];
    const b = roh && KE.bild(roh.bild);
    if (!b || !b.complete || s.eintrag.drehung || KE.zuschnittVon(s.eintrag)) return;
    const u = KE.umrissVon(roh.bild);
    const anteil = roh.vordergrund?.kopf ?? VORGABE_KOPF;
    if (!u || anteil >= 1) return;
    const kopf = KE.kopfseiteDesBetts(s.kennung, false);
    const frei = Math.round(u[2] * anteil);
    const x = kopf === "links" ? u[0] + frei : u[0];
    const breite = u[2] - frei;
    const massstab = Number(s.eintrag.massstab ?? 1);
    ctx.save();
    ctx.translate(s.x + (s.eintrag.spiegeln ? b.naturalWidth * massstab : 0), s.y);
    ctx.scale(s.eintrag.spiegeln ? -massstab : massstab, massstab);
    ctx.drawImage(b, x, u[1], breite, u[3], x, u[1], breite, u[3]);
    ctx.restore();
  };
})(window.KE);
