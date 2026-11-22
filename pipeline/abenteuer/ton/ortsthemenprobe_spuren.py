"""Version 2 des Probestücks Ortsthemen: Spuren, Musiker im Park, Steigerung je Sieg (Klangplan A0).

Warum: Nachtrag des Haupt-Chats (22.11.2026) nach den Spielen der DS-Zeit; Regeln in spuren.py.
Gebaut werden nach ``hoerprobe/ortsthemen/v2/``:
- die Spuren von Maple Falls (melodie, begleitung, bass, musiker) und des Clubkampfs (grund,
  melodie, horn) als m4a, je genau so lang wie die Form;
- zwei fertige Demos zum Anhören ohne Mischpult: ``demo-musiker.m4a`` (ein Durchgang ohne, im
  zweiten kommt der Geiger im Park näher) und ``demo-steigerung.m4a`` (Grund, nach dem ersten
  Sieg die Melodie, nach dem zweiten das Horn);
- der Abschnitt der Seite mit einem Mischpult im Browser (Web Audio, alle Spuren starten im selben
  Augenblick) und der Speicherschätzung.
Abhängigkeiten: numpy, ffmpeg, spuren.py, sampler.py.
"""

import html
import subprocess
from pathlib import Path

from pipeline.abenteuer.ton.musikbau import BITRATE, MIDI
from pipeline.abenteuer.ton.spuren import dateigroesse_kb, mische, puffer_mb, rendere_spuren
from pipeline.abenteuer.ton.stuecke.ortsthemen_probe import (
    CLUBKAMPF_SPUREN,
    KAMPF_GRUPPEN,
    MAPLE_GRUPPEN,
    MAPLE_SPUREN,
)

UNTERORDNER = "v2"
# Mischpult im Browser: Spuren dekodieren, im selben Augenblick als Schleife starten, Pegel weich
# setzen (Zeitkonstante 0,3 s). So würde die App mischen (ton/tonspieler.ts).
MISCHPULT_SKRIPT = """<script>
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const pulte = {};
async function lade(id) {
  if (pulte[id]) return pulte[id];
  const regler = [...document.querySelectorAll(`input[data-pult="${id}"]`)];
  const spuren = await Promise.all(regler.map(async (r) => {
    const puffer = await ctx.decodeAudioData(await (await fetch(r.dataset.datei)).arrayBuffer());
    const pegel = ctx.createGain();
    pegel.gain.value = 0;
    pegel.connect(ctx.destination);
    r.oninput = () => pegel.gain.setTargetAtTime(Number(r.value), ctx.currentTime, 0.05);
    return { r, puffer, pegel };
  }));
  pulte[id] = { spuren, quellen: null };
  return pulte[id];
}
function halt(p) {
  if (p && p.quellen) { p.quellen.forEach((q) => q.stop()); p.quellen = null; }
}
function starte(p) {
  if (p.quellen) return;
  const beginn = ctx.currentTime + 0.1;
  p.quellen = p.spuren.map((s) => {
    const q = ctx.createBufferSource();
    q.buffer = s.puffer; q.loop = true; q.connect(s.pegel); q.start(beginn);
    return q;
  });
}
document.addEventListener("click", async (e) => {
  const k = e.target.closest("button"); if (!k) return;
  if (k.dataset.halt) { halt(pulte[k.dataset.halt]); return; }
  if (!k.dataset.pult) return;
  await ctx.resume();
  const p = await lade(k.dataset.pult);
  starte(p);
  const lage = JSON.parse(k.dataset.lage);
  for (const s of p.spuren) {
    const wert = lage[s.r.dataset.spur] || 0;
    s.pegel.gain.setTargetAtTime(wert, ctx.currentTime, 0.3);
    s.r.value = wert;
  }
});
</script>"""
# Der Musiker kommt im zweiten Durchgang über so viele Sekunden näher (lineare Blende).
NAEHER_SEKUNDEN = 8.0
# Voreinstellungen des Mischpults: Spur → Pegel (0 bis 1).
MAPLE_LAGEN = {
    "Tag": {"melodie": 1, "begleitung": 1, "bass": 1},
    "Nacht / innen": {"melodie": 0.6, "begleitung": 0.8},
    "Ausgedünnt": {"begleitung": 1, "bass": 1},
    "Musiker nah": {"melodie": 1, "begleitung": 1, "bass": 1, "musiker": 1},
}
KAMPF_LAGEN = {
    "Start": {"grund": 1},
    "Nach dem 1. Sieg": {"grund": 1, "melodie": 1},
    "Nach dem 2. Sieg": {"grund": 1, "melodie": 1, "horn": 1},
}


def schreibe_m4a(ton, ziel: Path) -> None:  # noqa: ANN001 (numpy)
    """Schreibt Stereo-Ton als m4a (über eine WAV im Arbeitsordner)."""
    from pipeline.abenteuer.ton.sampler import schreibe_wav

    MIDI.mkdir(parents=True, exist_ok=True)
    wav = MIDI / f"{ziel.stem}.wav"
    schreibe_wav(ton, wav)
    befehl = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-c:a", "aac", "-b:a", BITRATE]
    subprocess.run([*befehl, str(ziel)], check=True)
    wav.unlink()


def demo_musiker(spuren: dict):  # noqa: ANN201 (numpy)
    """Zwei Durchgänge Tag; im zweiten blendet der Geiger über NAEHER_SEKUNDEN ein (er kommt näher)."""
    import numpy as np

    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    tag = mische(spuren, MAPLE_LAGEN["Tag"])
    blende = np.ones(len(tag), dtype=np.float32)
    rampe = int(NAEHER_SEKUNDEN * ABTASTRATE)
    blende[:rampe] = np.linspace(0, 1, rampe)
    zweiter = tag + spuren["musiker"] * blende[:, None]
    return np.concatenate([tag, zweiter])


def demo_steigerung(spuren: dict):  # noqa: ANN201 (numpy)
    """Je Stufe ein Durchgang: Start, nach dem ersten Sieg, nach dem zweiten Sieg."""
    import numpy as np

    return np.concatenate([mische(spuren, lage) for lage in KAMPF_LAGEN.values()])


def baue_version2(ziel: Path) -> str:
    """Rendert Spuren und Demos nach ``ziel/v2`` und gibt den HTML-Abschnitt der Seite zurück."""
    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    ordner = ziel / UNTERORDNER
    ordner.mkdir(parents=True, exist_ok=True)
    maple = rendere_spuren(MAPLE_SPUREN, MAPLE_GRUPPEN)
    kampf = rendere_spuren(CLUBKAMPF_SPUREN, KAMPF_GRUPPEN)
    for praefix, spuren in (("maple", maple), ("kampf", kampf)):
        for name, ton in spuren.items():
            schreibe_m4a(ton, ordner / f"{praefix}-{name}.m4a")
    schreibe_m4a(demo_musiker(maple), ordner / "demo-musiker.m4a")
    schreibe_m4a(demo_steigerung(kampf), ordner / "demo-steigerung.m4a")
    sekunden = len(next(iter(maple.values()))) / ABTASTRATE
    laengen = {len(t) for t in [*maple.values()]} | {0}
    print(f"Spuren Maple Falls: {sorted(maple)}; gleiche Länge: {len(laengen) == 2} ({sekunden:.1f} s)")
    return abschnitt(ordner, maple, kampf, sekunden) + mischungen_gemessen(maple, kampf, ABTASTRATE)


def mischungen_gemessen(maple: dict, kampf: dict, rate: int) -> str:
    """Jede Voreinstellung des Mischpults gemessen (Klangplan A0.6): Werte und Lautheitskurve."""
    from pipeline.abenteuer.ton.lautheit import kurve_svg, kurzbeschreibung, miss_ton

    zeilen = []
    for spuren, lagen, kampfthema in ((maple, MAPLE_LAGEN, False), (kampf, KAMPF_LAGEN, True)):
        for name, lage in lagen.items():
            messung = miss_ton(mische(spuren, lage), rate, name, kampfthema)
            print(f"  Mischung {name}: {kurzbeschreibung(messung)}")
            zeilen.append(
                f"<p><small>{html.escape(name)}: {html.escape(kurzbeschreibung(messung))}</small></p>"
            )
            zeilen.append(kurve_svg(messung))
    return f"<section><h2>Lautheit der Mischungen</h2>{''.join(zeilen)}</section>"


def _speicher(ordner: Path, spuren: dict, praefix: str, sekunden: float) -> str:
    """Zeile mit Dateigröße und dekodiertem Speicher je Spur."""
    teile = [f"{n}: {dateigroesse_kb(ordner / f'{praefix}-{n}.m4a'):.0f} KB" for n in spuren]
    gesamt = puffer_mb(sekunden) * len(spuren)
    return f"{', '.join(teile)}; dekodiert {len(spuren)} × {puffer_mb(sekunden):.1f} MB = {gesamt:.0f} MB"


def _mischpult(kennung: str, praefix: str, spuren: dict, lagen: dict[str, dict[str, float]]) -> str:
    """Knöpfe je Voreinstellung und Regler je Spur; das Skript der Seite mischt im Browser."""
    knoepfe = "".join(
        f"<button data-pult='{kennung}' data-lage='{html.escape(str(lage).replace(chr(39), chr(34)))}'>"
        f"{html.escape(name)}</button>"
        for name, lage in lagen.items()
    )
    regler = "".join(
        f"<label>{n} <input type=range min=0 max=1 step=0.05 value=0 data-pult='{kennung}' data-spur='{n}'"
        f" data-datei='{UNTERORDNER}/{praefix}-{n}.m4a'></label>"
        for n in spuren
    )
    return (
        f"<div class=pult id='{kennung}'>{knoepfe}<button data-halt='{kennung}'>Stopp</button>{regler}</div>"
    )


def abschnitt(ordner: Path, maple: dict, kampf: dict, sekunden: float) -> str:
    """HTML: Demos, Mischpulte und die Einschätzung zu Länge und Speicher."""
    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    kampf_sekunden = len(next(iter(kampf.values()))) / ABTASTRATE
    return (
        "<section><h2>Version 2: Spuren statt Stücke</h2>"
        "<p>Wie in Schwarz/Weiß: Das Ortsthema besteht aus Spuren, die App mischt sie. Nachts und "
        "innen spielen weniger, ein Musiker in der Nähe bringt seine Spur mit, im Clubkampf kommt "
        "je Sieg eine dazu.</p>"
        f"<p>Demo Musiker im Park (zweiter Durchgang: der Geiger kommt näher): "
        f"<audio controls preload=none src='{UNTERORDNER}/demo-musiker.m4a'></audio></p>"
        f"<p>Demo Clubkampf, Steigerung je Sieg (Start, nach dem 1., nach dem 2. Sieg): "
        f"<audio controls preload=none src='{UNTERORDNER}/demo-steigerung.m4a'></audio></p>"
        "<h3>Mischpult Maple Falls</h3><p>Voreinstellung tippen; die Regler zeigen die Pegel.</p>"
        f"{_mischpult('maple', 'maple', maple, MAPLE_LAGEN)}"
        f"<p><small>{_speicher(ordner, maple, 'maple', sekunden)}</small></p>"
        "<h3>Mischpult Clubkampf</h3>"
        f"{_mischpult('kampf', 'kampf', kampf, KAMPF_LAGEN)}"
        f"<p><small>{_speicher(ordner, kampf, 'kampf', kampf_sekunden)}</small></p></section>"
    )
