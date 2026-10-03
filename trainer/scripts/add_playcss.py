"""Append the .playbtn rule to the binder stylesheet (both root and docs copies)."""
import os, shutil, sys

R = r"C:\Users\ankha\AppData\Local\hermes\profiles\cg-bro\workspace\mezastar-dex"

RULE = """
/* ---------- play app entry point ----------
   /play/ is the arcade companion; the binder is the collection reference.
   One header button, no extra tab, so the two surfaces stay distinct. */
.playbtn{
  flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;
  min-height:40px;padding:0 15px;border-radius:999px;
  font-family:"Chakra Petch",sans-serif;font-size:13px;font-weight:700;letter-spacing:.08em;
  text-decoration:none;color:#1a0b28;
  background:linear-gradient(96deg,#ffd76a,#ffb0e6);
  box-shadow:0 6px 18px rgba(255,170,220,.3);
  border:1px solid transparent;
  white-space:nowrap;
}
.playbtn:active{transform:translateY(1px);box-shadow:0 3px 10px rgba(255,170,220,.3)}
@media (max-width:620px){
  .playbtn{min-height:38px;padding:0 13px;font-size:12px}
}
"""

ok = True
for rel in [os.path.join("assets", "style.css"), os.path.join("docs", "assets", "style.css")]:
    p = os.path.join(R, rel)
    s = open(p, encoding="utf-8", errors="replace").read()
    if ".playbtn{" in s:
        print("  already patched:", rel)
        continue
    tmp = p + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        f.write(s.rstrip() + "\n" + RULE)
        f.flush()
        os.fsync(f.fileno())
    shutil.move(tmp, p)
    print("  patched:", rel)
print("done")
