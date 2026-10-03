"""Verify play/app.js is self-contained: every identifier it calls must exist."""
import re, subprocess, os

PLAY = r"C:\Users\ankha\AppData\Local\hermes\profiles\cg-bro\workspace\mezastar-dex\play\app.js"
s = open(PLAY, encoding="utf-8", errors="replace").read()

# strip comments + literals so only real identifiers remain
code = re.sub(r"/\*.*?\*/", " ", s, flags=re.S)
code = re.sub(r"//[^\n]*", " ", code)
code = re.sub(r"`(?:\\.|[^`\\])*`", " `` ", code)
code = re.sub(r'"(?:\\.|[^"\\])*"', ' "" ', code)
code = re.sub(r"'(?:\\.|[^'\\])*'", " '' ", code)

defined = set(re.findall(r"(?:async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)", code))
defined |= set(re.findall(r"(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)", code))
defined |= set(re.findall(r"(?<![\w.$])([A-Za-z_$][A-Za-z0-9_$]*)\s*=", code))
defined |= set(re.findall(r"(?:const|let)\s*\{([^}]*)\}", code) and [])
# destructured params / decls
for m in re.finditer(r"(?:const|let|var)\s*\{([^}]*)\}\s*=", code):
    for part in m.group(1).split(","):
        nm = part.split(":")[0].split("=")[0].strip()
        if re.fullmatch(r"[A-Za-z_$][A-Za-z0-9_$]*", nm):
            defined.add(nm)
for m in re.finditer(r"function[^(]*\(([^)]*)\)", code):
    for part in m.group(1).split(","):
        nm = part.split(":")[0].split("=")[0].strip()
        if re.fullmatch(r"[A-Za-z_$][A-Za-z0-9_$]*", nm):
            defined.add(nm)

builtins = set("""if for while switch catch return typeof new delete void do else function try finally
map filter forEach reduce sort join push slice concat indexOf find some every keys values entries
includes padStart padEnd toFixed trim split replace match test length Math JSON Promise Set Map Date
Boolean console window document localStorage parseInt parseFloat isNaN at from of Number String
Object Array querySelector querySelectorAll closest add remove classList scrollIntoView preventDefault
stopPropagation setAttribute getAttribute createElement innerHTML textContent dataset contains
appendChild insertBefore removeChild focus blur click setTimeout clearTimeout renderRosterPanel""".split())

called = set(re.findall(r"(?<![\w.$])([A-Za-z_$][A-Za-z0-9_$]*)\s*\(", code))
missing = sorted(n for n in called if n not in defined and n not in builtins)

print("=== play/app.js calls but never defines ===")
print("  " + ("\n  ".join(missing) if missing else "(nothing - self-contained)"))

# DOM ids queried
ids = sorted(set(re.findall(r"""querySelector(?:All)?\(\s*["'`]#([A-Za-z0-9_-]+)""", code)))
print()
print("=== DOM ids play/app.js expects to exist ===")
print("  " + ", ".join("#" + i for i in ids))

# data files fetched
fetches = sorted(set(re.findall(r"""fetch\(\s*["'`]([^"'`]+)""", code)))
print()
print("=== data files fetched ===")
for f in fetches:
    print("  ", f)