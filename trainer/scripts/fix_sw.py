import os, re, shutil

R = r"C:\Users\ankha\AppData\Local\hermes\profiles\cg-bro\workspace\mezastar-dex"

for rel in ["sw.js", os.path.join("docs", "sw.js")]:
    p = os.path.join(R, rel)
    s = open(p, encoding="utf-8", errors="replace").read()
    # undo the bad insertion
    s = re.sub(r'\s*"play/", "play/index\.html", "play/app\.js", "play/play\.css",', '', s)
    # insert properly: right before the manifest entry, keeping the list valid
    anchor = '"manifest.webmanifest"'
    if anchor in s and '"play/index.html"' not in s:
        s = s.replace(anchor,
                      '"play/index.html", "play/app.js", "play/play.css",\n  ' + anchor,
                      1)
    tmp = p + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        f.write(s)
        f.flush()
        os.fsync(f.fileno())
    shutil.move(tmp, p)
    print("fixed", rel)
