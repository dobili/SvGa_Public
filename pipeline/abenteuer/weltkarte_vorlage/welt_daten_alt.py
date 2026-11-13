"""Daten der Weltkarte: je Grundkarte Bild(er) der Zustände, Ausgänge mit Feldern und Ziel, Reisen aus Dialogen."""
import json, re, subprocess, sys
from pathlib import Path
from PIL import Image
D = Path("/tmp/claude-0/-home-user/64e22b70-cc0c-52bb-8e5b-60280573b18a/scratchpad")
H = Path("/home/user/SvGa_Public"); sys.path.insert(0, str(H))
from pipeline.abenteuer import uebergaenge as u
TEXTE = json.loads((H / "inhalte/abenteuer/texte/de.json").read_text())
sz = u.szenen()
_orte = json.loads((H / "inhalte/abenteuer/orte.json").read_text())["orte"]
liste = [{**a, "ort": o["kennung"]} for o in _orte for a in o.get("ausloeser", []) if a.get("art") == "uebergang" or a.get("dialog")]
figuren = {f["kennung"]: f for o in _orte for f in o.get("figuren", [])}
zust = json.loads(subprocess.run([str(H / ".venv/bin/python"), "-m", "pipeline.abenteuer.zustaende", "--json"], cwd=H, capture_output=True, text=True, check=True).stdout)
B = D / "welt_akt1" / "bilder"
ink = {p.stem: p.read_text() for p in (H / "inhalte/abenteuer/dialoge/de").glob("*.ink")}

def knoten(datei, name, tiefe=4, gesehen=None):
    gesehen = gesehen if gesehen is not None else set()
    if (datei, name) in gesehen or datei not in ink: return ""
    gesehen.add((datei, name))
    m = re.search(r"^===\s*" + re.escape(name) + r"\s*===\s*$(.*?)(?=^===|\Z)", ink[datei], re.M | re.S)
    if not m: return ""
    text = m.group(1)
    if tiefe:
        for z in set(re.findall(r"->\s*([a-z_0-9]+)", text)):
            text += knoten(datei, z, tiefe - 1, gesehen)
    return text

def mitte(felder): return [sum(f[0] for f in felder) / len(felder) + .5, sum(f[1] for f in felder) / len(felder) + .5]

karten = {}
for kennung, s in sz.items():
    bild = B / f"{kennung}.png"
    if not bild.exists(): print("ohne Bild", kennung); continue
    im = Image.open(bild); breite = max(len(z) for z in s["raster"]); hoehe = len(s["raster"])
    fass = [{"n": "Grundzustand", "d": f"bilder/{kennung}.png"}]
    for z in zust:
        if z["karte"] == kennung and (B / f"{kennung}-{z['zustand']}.png").exists():
            fass.append({"n": z["zustand"], "d": f"bilder/{kennung}-{z['zustand']}.png", "t": z["satz"][:1].upper() + z["satz"][1:]})
    karten[kennung] = {"id": kennung, "name": TEXTE.get("ort." + kennung, kennung), "ort": TEXTE.get(f"ort.{kennung.split('.')[0]}.name", ""),
                       "w": im.width, "h": im.height, "k": im.width / breite, "tb": breite, "th": hoehe, "f": fass, "a": []}
for kennung, s in sz.items():
    if kennung not in karten: continue
    namen = sorted({a["name"] for a in s.get("ausloeser", [])})
    for name in namen:
        r = u.regel_fuer(liste, kennung, name)
        if not r: continue
        felder = u.felder(s, name)
        ziele = []
        if r["art"] == "uebergang": ziele = [(r["ziel"]["karte"], r["ziel"].get("ausloeser"), "weg")]
        elif r.get("dialog"):
            datei, _, kn = r["dialog"].partition(".")
            for zk, za in dict.fromkeys(re.findall(r'~\s*reise\("([^"]+)",\s*"([^"]+)"\)', knoten(datei, kn))):
                ziele.append((zk, za, "reise"))
        for zk, za, art in ziele:
            if zk not in karten or zk == kennung and art == "reise": continue
            zf = u.felder(sz[zk], za) if za else []
            xs = [f[0] for f in felder]; ys = [f[1] for f in felder]
            karten[kennung]["a"].append({"n": name, "art": art, "z": zk, "za": za, "x": min(xs), "y": min(ys), "b": max(xs) - min(xs) + 1, "h": max(ys) - min(ys) + 1,
                                         "zm": mitte(zf) if zf else None})
aus = list(karten.values())
print(len(aus), "Karten,", sum(len(k["a"]) for k in aus), "Ausgänge,", sum(1 for k in aus for a in k["a"] if a["art"] == "reise"), "Reisen,", sum(1 for k in aus for a in k["a"] if a["zm"] is None), "ohne Zielfeld")
erreicht = {"mapleFalls.dachboden"}; neu = True
while neu:
    neu = False
    for k in aus:
        if k["id"] in erreicht:
            for a in k["a"]:
                if a["z"] not in erreicht: erreicht.add(a["z"]); neu = True
print("vom Dachboden erreichbar:", len(erreicht), "nicht:", sorted(set(karten) - erreicht))
(D / "welt_akt1" / "daten.json").write_text(json.dumps(aus, ensure_ascii=False))
