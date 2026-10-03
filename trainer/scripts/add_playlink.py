"""Add a Play entry point to the binder header (both root and docs copies).

The binder is the collection reference; /play/ is what he opens at the cabinet.
A single header button keeps the relationship obvious without duplicating a tab.
"""
import os, shutil, sys

R = r"C:\Users\ankha\AppData\Local\hermes\profiles\cg-bro\workspace\mezastar-dex"

OLD = '''    <div class="statrow">
      <div class="stat"><b id="sCount">19</b><span>Tags</span></div>
      <div class="stat"><b id="sPe">0</b><span>Total PE</span></div>
      <div class="stat"><b id="sType">0</b><span>Types</span></div>
    </div>
  </header>'''

NEW = '''    <div class="statrow">
      <div class="stat"><b id="sCount">19</b><span>Tags</span></div>
      <div class="stat"><b id="sPe">0</b><span>Total PE</span></div>
      <div class="stat"><b id="sType">0</b><span>Types</span></div>
    </div>
    <a class="playbtn" href="play/">⚔ Play</a>
  </header>'''


def patch(path):
    s = open(path, encoding="utf-8", errors="replace").read()
    if 'class="playbtn"' in s:
        print("  already patched:", path)
        return False
    if OLD not in s:
        print("  ANCHOR NOT FOUND:", path)
        return False
    s = s.replace(OLD, NEW, 1)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        f.write(s)
        f.flush()
        os.fsync(f.fileno())
    shutil.move(tmp, path)
    print("  patched:", path)
    return True


ok = True
for rel in ["index.html", os.path.join("docs", "index.html")]:
    p = os.path.join(R, rel)
    if os.path.exists(p):
        ok &= patch(p)
    else:
        print("  missing:", rel)
        ok = False
sys.exit(0 if ok else 1)
