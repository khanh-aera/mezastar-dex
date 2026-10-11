#!/usr/bin/env python3
"""Vendor rich-sheet media INTO the repo so the binder never depends on
raw.githubusercontent.com hotlinks (blocked/flaky on Vietnamese mobile ISPs,
and the #1 suspect for 'pokemon info is not show').

Downloads, per species referenced by data/dex_lore.json:
  - official artwork PNG  -> docs/dexmedia/art/<dex>.webp   (Pillow, max 460px)
  - generation-v animated sprite (if it exists) -> docs/dexmedia/anim/<dex>.gif
  - cry .ogg              -> docs/dexmedia/cry/<dex>.m4a    (ffmpeg; .ogg does
                            NOT play on iOS Safari, m4a plays everywhere)

Idempotent: skips files already present. Safe to re-run.
Usage: python trainer/scripts/vendor_dex_media.py
"""
import io
import json
import os
import subprocess
import sys
import urllib.request
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
DEST = os.path.join(ROOT, "docs", "dexmedia")
FFMPEG = os.environ.get("FFMPEG") or "ffmpeg"

SPR = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/"
CRIES = "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/"

ART = os.path.join(DEST, "art")
ANIM = os.path.join(DEST, "anim")
CRY = os.path.join(DEST, "cry")
for d in (ART, ANIM, CRY):
    os.makedirs(d, exist_ok=True)


def fetch(url, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": "mezastar-dex-vendor"})
    with urllib.request.urlopen(req, timeout=timeout) as fh:
        return fh.read()


def vendor_art(dex):
    out = os.path.join(ART, "%d.webp" % dex)
    if os.path.isfile(out) and os.path.getsize(out) > 1000:
        return "cached"
    raw = fetch(SPR + "pokemon/other/official-artwork/%d.png" % dex)
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    im.thumbnail((460, 460), Image.LANCZOS)
    im.save(out, "WEBP", quality=82, method=6)
    return "ok (%d bytes)" % os.path.getsize(out)


def vendor_anim(dex):
    out = os.path.join(ANIM, "%d.gif" % dex)
    if os.path.isfile(out) and os.path.getsize(out) > 500:
        return "cached"
    try:
        raw = fetch(SPR + "pokemon/versions/generation-v/black-white/animated/%d.gif" % dex)
    except Exception:
        return "none"          # gen 6+ species have no animated sprite upstream
    with open(out, "wb") as f:
        f.write(raw)
    return "ok"


def vendor_cry(dex):
    out = os.path.join(CRY, "%d.m4a" % dex)
    if os.path.isfile(out) and os.path.getsize(out) > 500:
        return "cached"
    try:
        raw = fetch(CRIES + "%d.ogg" % dex)
    except Exception:
        return "none"
    ogg = os.path.join(CRY, "_tmp.ogg")
    with open(ogg, "wb") as f:
        f.write(raw)
    r = subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", ogg,
                        "-c:a", "aac", "-b:a", "48k", out],
                       capture_output=True, text=True)
    os.remove(ogg)
    return "ok" if r.returncode == 0 else "FAIL %s" % r.stderr[:80]


def main():
    lore = json.load(open(os.path.join(ROOT, "data", "dex_lore.json"), encoding="utf-8"))["tags"]
    dexes = sorted({t["dex"] for t in lore if t.get("dex")})
    sys.stderr.write("vendoring media for %d species\n" % len(dexes))
    stats = {"art": 0, "anim": 0, "cry": 0, "fail": 0}
    for i, dex in enumerate(dexes):
        try:
            a = vendor_art(dex)
            n = vendor_anim(dex)
            c = vendor_cry(dex)
        except Exception as e:
            stats["fail"] += 1
            sys.stderr.write("  dex %d FAIL %s\n" % (dex, e))
            continue
        stats["art"] += a != "none"
        stats["anim"] += n.startswith("ok")
        stats["cry"] += c.startswith("ok")
        if i % 40 == 0:
            sys.stderr.write("  %d/%d\n" % (i, len(dexes)))
    total = sum(os.path.getsize(os.path.join(d, f))
                for d in (ART, ANIM, CRY)
                for f in os.listdir(d) if not f.startswith("_"))
    sys.stderr.write("art %d | anim %d | cry %d | fail %d | total %.1f MB\n"
                     % (stats["art"], stats["anim"], stats["cry"], stats["fail"], total / 1048576))


if __name__ == "__main__":
    main()
