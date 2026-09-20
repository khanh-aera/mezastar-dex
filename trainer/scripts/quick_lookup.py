#!/usr/bin/env python3
"""Mezastar in-game quick lookup: boss name -> best picks from Khanh's binder.

Usage:  python quick_lookup.py "kyurem"
        python quick_lookup.py koraidon zekrom        (several bosses at once)
        python quick_lookup.py --solo "kyurem"        (tighter output)

Output is deliberately tiny so it can be pasted straight into chat.
Runs from either the repo copy (trainer/scripts/) or the workspace dev copy.
"""
import sys, os, json, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
UP1 = os.path.dirname(HERE)
UP2 = os.path.dirname(UP1)
CANDIDATES = [
    HERE, UP1, UP2,
    os.path.join(UP1, "data"), os.path.join(UP2, "data"),
    os.path.join(UP2, "..", "data"),
    "C:/Users/ankha/AppData/Local/hermes/profiles/cg-bro/workspace",
    "C:/Users/ankha/AppData/Local/hermes/profiles/cg-bro/workspace/data",
    "C:/Users/ankha/AppData/Local/hermes/profiles/cg-bro/workspace/mezastar-dex/data",
    "C:/Users/ankha/AppData/Local/hermes/profiles/cg-bro/workspace/mezastar-dex/trainer",
]
DB_NAMES = ["mezastar_tagdb.json", "data/mezastar_tagdb.json", "mezastar_tagdb_raw.json"]
COLL_NAMES = ["khanh_collection_stats.json", "binder.json", "trainer/binder.json"]

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

# ---------- loading ----------
def try_paths(names, want):
    for base in CANDIDATES:
        for nm in names:
            p = os.path.join(base, *nm.split("/")) if not os.path.isabs(nm) else nm
            if os.path.isfile(p):
                try:
                    with open(p, encoding="utf-8") as fh:
                        d = json.load(fh)
                    if want == "db" and not isinstance(d, list): continue
                    if want == "coll" and isinstance(d, list) and not d: continue
                    return d, p
                except Exception:
                    continue
    return None, None

DB, dbpath = try_paths(DB_NAMES, "db")
COLL, collpath = try_paths(COLL_NAMES, "coll")
if DB is None:
    print("DATA MISSING: tag database not found"); sys.exit(1)
if COLL is None:
    print("DATA MISSING: collection/binder not found"); sys.exit(1)

def tlist(raw):
    if isinstance(raw, list): return [t for t in raw if t in T]
    return [t.strip() for t in str(raw or "").replace("/", ",").split(",") if t.strip() in T]

# ---------- boss table (prefer typed entries, prefer the VN set) ----------
BOSSES = {}
for e in DB:
    n = e.get("name")
    if not n: continue
    ts = tlist(e.get("types"))
    cur = BOSSES.get(n)
    if cur is None or (not cur["types"] and ts) or (ts and str(e.get("version", "")).startswith("Stardust V2")):
        BOSSES[n] = {"types": ts, "pe": e.get("pe"), "version": e.get("version"), "tier": e.get("tier")}
ALL = sorted(BOSSES)

# ---------- own roster ----------
raw_coll = COLL.get("tags") if isinstance(COLL, dict) and isinstance(COLL.get("tags"), list) else COLL
records = []
if isinstance(raw_coll, dict):
    for tid, st in raw_coll.items():
        records.append({"id": tid, **(st if isinstance(st, dict) else {"pe": st})})
elif isinstance(raw_coll, list):
    records = [r for r in raw_coll if isinstance(r, dict)]

dbmeta = {e["id"]: e for e in DB if e.get("id")}
OWN = []
for r in records:
    meta = dbmeta.get(r.get("id"), {})
    pe = r.get("pe") or meta.get("pe") or 0
    try: pe = int(pe)
    except Exception: pe = 0
    ts = tlist(r.get("types")) or tlist(meta.get("types"))
    name = r.get("name") or meta.get("name") or str(r.get("id"))
    OWN.append({"id": r.get("id", "?"), "name": name, "pe": pe, "types": ts,
                "ability": (r.get("ability") or meta.get("ability") or "")})
OWN.sort(key=lambda x: -x["pe"])
if not OWN:
    print("DATA MISSING: roster empty"); sys.exit(1)

# ---------- helpers ----------
def off_mult(attack_types, boss_types):
    best = 0.0
    for at in attack_types:
        m = 1.0
        for bt in boss_types:
            m *= CH[at][bt]
        best = max(best, m)
    return best

def incoming(boss_types, mon):
    return max((CH[x][d] for x in boss_types for d in mon["types"]), default=1.0)

def resolve(q):
    q = q.strip().lower().replace("-", " ")
    if not q: return None
    if q in [n.lower() for n in ALL]:
        return next(n for n in ALL if n.lower() == q)
    starts = [n for n in ALL if n.lower().startswith(q)]
    if starts: return sorted(starts, key=len)[0]
    subs = [n for n in ALL if q in n.lower()]
    if subs: return sorted(subs, key=len)[0]
    close = difflib.get_close_matches(q, [n.lower() for n in ALL], n=1, cutoff=0.6)
    if close: return next(n for n in ALL if n.lower() == close[0])
    return None

TRIGGER_HINT = {"Dynamax", "Mega", "Z"}

def report(q, brief=False):
    name = resolve(q) or q
    b = BOSSES.get(name)
    if not b or not b["types"]:
        return f"{q}: boss not in the tag database, no type data"
    bt = b["types"]
    rows = []
    for m in OWN:
        o = off_mult(m["types"], bt)
        rows.append((o, -incoming(bt, m), m["pe"], m))
    rows.sort(key=lambda r: (-r[0], -r[1], -r[2]))
    o, negin, pe, top = rows[0]
    pick = f"{name} ({'/'.join(bt)}): {top['name']} PE{pe}"
    if o >= 2:
        pick += f" -> {int(o)}x"
    elif o == 0:
        pick += " (cannot be hit super effectively, use highest PE)"
    else:
        pick += " (no 2x available)"
    if brief:
        return pick
    out = [pick]
    alt = next((r for r in rows[1:] if r[0] == o and r[3]["name"] != top["name"]), None)
    if alt and o >= 2:
        out.append(f"ALT {alt[3]['name']} PE{alt[3]['pe']}")
    inc = incoming(bt, top)
    if inc >= 2:
        out.append(f"WATCH {top['name']} takes {int(inc)}x here")
    trig = top.get("ability")
    if trig: out.append(f"TRIGGER {trig}")
    risky = sorted({m["name"] for m in OWN if incoming(bt, m) >= 2 and m["name"] != top["name"]},
                   key=lambda n: -next(x["pe"] for x in OWN if x["name"] == n))[:4]
    if risky: out.append("AVOID " + ", ".join(risky))
    return " | ".join(out)

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--solo"]
    brief = "--solo" in sys.argv
    if not args:
        print("usage: quick_lookup.py <boss name> [...]"); sys.exit(0)
    print("\n".join(report(a, brief) for a in args))
