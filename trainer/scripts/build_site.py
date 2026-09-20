#!/usr/bin/env python3
"""Build the Mezastar binder website (static, GitHub Pages ready).

Reads:  mezastar_tagdb.json (all sets), binder.json / khanh_collection_stats.json (his tags)
Writes: docs/index.html assets are hand written; this script writes docs/data/*.json
        and copies the needed MezaTag PNGs into docs/img/.

Usage:  python build_site.py
"""
import json, os, shutil, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
def find(names, starts=("..", ".")):
    for base in (HERE, os.path.join(HERE, ".."), os.path.join(HERE, "..", "..")):
        for n in names:
            p = os.path.join(base, n)
            if os.path.isfile(p):
                return p
    return None

DBP = find(["mezastar_tagdb.json", "data/mezastar_tagdb.json"])
COLLP = find(["binder.json", "khanh_collection_stats.json", "trainer/binder.json"])
IMGDIR = None
for cand in (os.path.join(HERE, "..", "..", "images"),          # repo/images/<Version>/*.png
             os.path.join(HERE, "..", "images"),
             os.path.join(HERE, "..", "..", "classroom", "mezastar_tags"),
             "C:/Users/ankha/AppData/Local/hermes/profiles/cg-bro/workspace/mezastar_tags"):
    if cand and os.path.isdir(cand):
        IMGDIR = cand
        break
print("image root:", IMGDIR)
if not DBP or not COLLP:
    print("missing data", DBP, COLLP); sys.exit(1)

DB = json.load(open(DBP, encoding="utf-8"))
RAW = json.load(open(COLLP, encoding="utf-8"))
coll_list = RAW.get("tags") if isinstance(RAW, dict) and isinstance(RAW.get("tags"), list) else None
if coll_list is None:
    coll_list = [{"id": k, **(v if isinstance(v, dict) else {"pe": v})} for k, v in RAW.items()]

T = ["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground",
     "Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"]
SPEC = [
 ("Normal",[],["Rock","Steel"],["Ghost"]),("Fire",["Grass","Ice","Bug","Steel"],["Fire","Water","Rock","Dragon"],[]),
 ("Water",["Fire","Ground","Rock"],["Water","Grass","Dragon"],[]),("Electric",["Water","Flying"],["Electric","Grass","Dragon"],["Ground"]),
 ("Grass",["Water","Ground","Rock"],["Fire","Grass","Poison","Flying","Bug","Dragon","Steel"],[]),
 ("Ice",["Grass","Ground","Flying","Dragon"],["Fire","Water","Ice","Steel"],[]),
 ("Fighting",["Normal","Ice","Rock","Dark","Steel"],["Poison","Flying","Psychic","Bug","Fairy"],["Ghost"]),
 ("Poison",["Grass","Fairy"],["Poison","Ground","Rock","Ghost"],["Steel"]),
 ("Ground",["Fire","Electric","Poison","Rock","Steel"],["Grass","Bug"],["Flying"]),
 ("Flying",["Grass","Fighting","Bug"],["Electric","Rock","Steel"],[]),
 ("Psychic",["Fighting","Poison"],["Psychic","Steel"],["Dark"]),
 ("Bug",["Grass","Psychic","Dark"],["Fire","Fighting","Poison","Flying","Ghost","Steel","Fairy"],[]),
 ("Rock",["Fire","Ice","Flying","Bug"],["Fighting","Ground","Steel"],[]),
 ("Ghost",["Psychic","Ghost"],["Dark"],["Normal"]),("Dragon",["Dragon"],["Steel"],["Fairy"]),
 ("Dark",["Psychic","Ghost"],["Fighting","Dark","Fairy"],[]),
 ("Steel",["Ice","Rock","Fairy"],["Fire","Water","Electric","Steel"],[]),
 ("Fairy",["Fighting","Dragon","Dark"],["Fire","Poison","Steel"],[]),
]
CH = {a: {d: 1.0 for d in T} for a in T}
for a, twos, halves, zeros in SPEC:
    for d in twos: CH[a][d] = 2.0
    for d in halves: CH[a][d] = 0.5
    for d in zeros: CH[a][d] = 0.0

def tlist(raw):
    if isinstance(raw, list): return [t for t in raw if t in T]
    return [t.strip() for t in str(raw or "").replace("/", ",").split(",") if t.strip() in T]

db_meta = {}
for e in DB:
    n, ts = e.get("name"), tlist(e.get("types"))
    if not n: continue
    cur = db_meta.get(n)
    if cur is None or (ts and str(e.get("version","")).startswith("Stardust V2")) or (not cur["types"] and ts):
        db_meta[n] = {"name": n, "id": e.get("id"), "version": e.get("version"),
                      "types": ts, "pe": e.get("pe"), "grade": e.get("grade"),
                      "tier": e.get("tier"), "ability": e.get("ability"), "moves": e.get("moves")}

def img_fname(entry):
    i = entry.get("image")
    if i: return os.path.basename(i)
    return None

def find_png(tag_id, name):
    if not IMGDIR: return None
    pat = re.compile(rf"^{re.escape(str(tag_id))}[_\-]", re.I)
    for root, _, files in os.walk(IMGDIR):
        for f in files:
            if f.lower().endswith(".png") and pat.match(f):
                return os.path.join(root, f)
    safe = re.sub(r"[^A-Za-z0-9]", "", (name or "").lower())
    for root, _, files in os.walk(IMGDIR):
        for f in files:
            if f.lower().endswith(".png") and safe and safe in re.sub(r"[^A-Za-z0-9]", "", f.lower()):
                return os.path.join(root, f)
    return None

OUT = os.path.join(HERE, "..", "..", "docs")
os.makedirs(os.path.join(OUT, "data"), exist_ok=True)
os.makedirs(os.path.join(OUT, "img"), exist_ok=True)

def strip_white_bg(im, tol=18):
    """The official tag art is flat RGB on a white page. Remove that white (only where it
    connects to the border, so white inside the art survives) and crop to the tag itself."""
    try:
        import numpy as np
        from scipy import ndimage
        from PIL import Image
    except Exception:
        return im.convert("RGBA")
    a = np.array(im.convert("RGB"))
    white = (a >= 255 - tol).all(axis=2)
    lab, _ = ndimage.label(white, structure=np.ones((3, 3), int))
    border_ids = np.unique(np.concatenate([lab[0, :], lab[-1, :], lab[:, 0], lab[:, -1]]))
    border_ids = border_ids[border_ids > 0]
    bg = np.isin(lab, border_ids)
    alpha = np.full(bg.shape, 255, np.uint8)
    alpha[bg] = 0
    ring = ndimage.binary_dilation(bg, iterations=2) & ~bg
    mn = a.min(axis=2).astype(np.float32)
    calc = np.clip((1.0 - mn / 255.0) * 255.0, 0, 255).astype(np.uint8)
    alpha[ring] = np.minimum(alpha[ring], calc[ring])
    out = np.dstack([a, alpha])
    ys, xs = np.nonzero(alpha > 0)
    if len(ys):
        pad = 2
        out = out[max(0, ys.min() - pad):ys.max() + 1 + pad, max(0, xs.min() - pad):xs.max() + 1 + pad]
    return Image.fromarray(out, "RGBA")

def save_art(src):
    """Convert a tag PNG to a phone friendly WebP (white page removed) and return its site path."""
    base = os.path.splitext(os.path.basename(src))[0]
    tgt = os.path.join(OUT, "img", base + ".webp")
    if not os.path.exists(tgt):
        try:
            from PIL import Image
            im = strip_white_bg(Image.open(src))
            if im.width > 640:
                im = im.resize((640, max(1, round(im.height * 640 / im.width))), Image.LANCZOS)
            im.save(tgt, "WEBP", quality=82, method=5)
        except Exception as e:
            print(f"   ! art fallback for {base}: {type(e).__name__}: {e}")
            shutil.copy2(src, tgt.replace(".webp", ".png"))
            return "img/" + base + ".png"
    return "img/" + base + ".webp"

# ---------- roster ----------
roster, copied, missing = [], 0, []
for r in coll_list:
    tid = str(r.get("id") or "")
    meta = db_meta.get(r.get("name") or "", {})
    name = r.get("name") or meta.get("name") or tid
    ts = tlist(r.get("types")) or meta.get("types") or []
    pe = r.get("pe") or meta.get("pe") or 0
    try: pe = int(pe)
    except Exception: pe = 0
    ability = r.get("ability") or meta.get("ability") or ""
    moves = r.get("moves") or meta.get("moves") or ""
    beats = [bt for bt in T if max((CH[at][bt] for at in ts), default=1.0) >= 2]
    weak = [bt for bt in T if max((CH[bt][d] for d in ts), default=1.0) >= 2]
    resist = [bt for bt in T if ts and max((CH[bt][d] for d in ts), default=1.0) <= 0.5]
    src = find_png(tid, name)
    img = ""
    if src:
        img = save_art(src); copied += 1
    else:
        missing.append(f"{tid} {name}")
    roster.append({"id": tid, "name": name, "types": ts, "pe": pe, "grade": str(r.get("grade") or meta.get("grade") or ""),
                   "tier": r.get("tier") or meta.get("tier") or "", "ability": ability, "moves": moves,
                   "beats": beats, "weak": weak, "resist": resist, "img": img})
roster.sort(key=lambda x: -x["pe"])

# ---------- boss pool (every tag that has a type) ----------
done, bosses = set(), []
for e in DB:
    n = e.get("name")
    if not n or n in done: continue
    ts = db_meta.get(n, {}).get("types") or tlist(e.get("types"))
    if not ts: continue
    done.add(n)
    src = find_png(e.get("id"), n)
    img = ""
    if src:
        img = save_art(src); copied += 1
    real = db_meta.get(n, {})
    ver = real.get("version") or e.get("version") or ""
    bosses.append({"name": n, "id": e.get("id"), "version": ver, "vn": str(ver).startswith("Stardust V2"), "types": ts,
                   "pe": e.get("pe") or "", "tier": e.get("tier") or "", "img": img})
bosses.sort(key=lambda b: b["name"])

json.dump({"owner": RAW.get("owner", "Khanh Ngo An"), "built": "2026-09-20",
           "count": len(roster), "tags": roster}, open(os.path.join(OUT, "data", "roster.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)

# ---------- Stardust V2 pool (everything obtainable on VN machines) ----------
pool, pdone = [], set()
for e in DB:
    if not str(e.get("version", "")).startswith("Stardust V2"): continue
    n = e.get("name")
    if not n or n in pdone: continue
    pdone.add(n)
    ts = tlist(e.get("types"))
    if not ts: continue
    src = find_png(e.get("id"), n)
    img = save_art(src) if src else ""
    beats = [bt for bt in T if max((CH[at][bt] for at in ts), default=1.0) >= 2]
    weak = [bt for bt in T if max((CH[bt][d] for d in ts), default=1.0) >= 2]
    resist = [bt for bt in T if ts and max((CH[bt][d] for d in ts), default=1.0) <= 0.5]
    try: pe = int(e.get("pe") or 0)
    except Exception: pe = 0
    pool.append({"id": e.get("id"), "name": n, "types": ts, "pe": pe,
                 "grade": str(e.get("grade") or ""), "tier": e.get("tier") or "",
                 "ability": e.get("ability") or "", "moves": e.get("moves") or "",
                 "beats": beats, "weak": weak, "resist": resist, "img": img})
pool.sort(key=lambda x: -x["pe"])
json.dump({"version": "Stardust V2", "built": "2026-09-20", "count": len(pool), "tags": pool},
          open(os.path.join(OUT, "data", "pool.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"pool (Stardust V2): {len(pool)} tags")

json.dump({"count": len(bosses), "bosses": bosses}, open(os.path.join(OUT, "data", "bosses.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
json.dump({"types": T, "chart": CH}, open(os.path.join(OUT, "data", "typechart.json"), "w", encoding="utf-8"))

print(f"roster: {len(roster)} | bosses: {len(bosses)} | images copied: {copied} | missing art: {len(missing)}")
if missing: print("   no art for:", missing)
withimg = sum(1 for t in roster if t["img"])
print(f"roster entries with art: {withimg}/{len(roster)}")
