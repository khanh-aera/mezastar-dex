"""Bump the service worker to v63 and add the play app to its shell.

Without this, an installed PWA keeps serving the v62 shell and /play/ would 404
from the cache on his phone.
"""
import os, re, shutil

R = r"C:\Users\ankha\AppData\Local\hermes\profiles\cg-bro\workspace\mezastar-dex"
NEW_VER = "mezastar-v63"

PLAY_SHELL = '''const SHELL = ["./", "index.html", "assets/style.css", "assets/app.js",
  "play/", "play/index.html", "play/app.js", "play/play.css",
  "data/roster.json","data/support.json", "data/bosses.json", "data/typechart.json", "data/pool.json",
  "island/data/sprites.json", "island/data/pokedex.json",
  "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];'''

OLD_SHELL_MARK = 'const SHELL = ["./", "index.html", "assets/style.css", "assets/app.js",'


def patch(path):
    s = open(path, encoding="utf-8", errors="replace").read()
    s2 = re.sub(r'mezastar-v\d+', NEW_VER, s)
    if OLD_SHELL_MARK in s2 and '"play/index.html"' not in s2:
        i = s2.index(OLD_SHELL_MARK)
        j = s2.index('];', i)
        s2 = s2[:j] + '  "play/", "play/index.html", "play/app.js", "play/play.css",\n  ' + s2[j:]
    if s2 == s:
        print("  unchanged:", path)
        return
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        f.write(s2)
        f.flush()
        os.fsync(f.fileno())
    shutil.move(tmp, path)
    print("  bumped:", path)


for rel in ["sw.js", os.path.join("docs", "sw.js")]:
    p = os.path.join(R, rel)
    if os.path.exists(p):
        patch(p)
    else:
        print("  MISSING:", rel)

# verify
for rel in ["sw.js", os.path.join("docs", "sw.js")]:
    s = open(os.path.join(R, rel), encoding="utf-8", errors="replace").read()
    ver = re.search(r'mezastar-v\d+', s).group(0)
    has_play = '"play/index.html"' in s
    print("%s -> %s, play in shell: %s" % (rel, ver, has_play))
