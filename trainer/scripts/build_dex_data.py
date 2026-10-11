#!/usr/bin/env python3
"""Build the My-Binder encyclopedia payload from PokeAPI's CSV dump.

Khanh's binder app (/binder/) is the at-home companion to the arcade app: it
answers "what did I just catch?" - stats, form, evolution line, lore. None of
that exists in the Mezastar tag data (which only carries PE / types / gimmick),
so it is pulled once from PokeAPI and committed as a static JSON payload.

WHY A COMMITTED PAYLOAD AND NOT A RUNTIME API CALL
  - the app is used at home on a phone, often on flaky Vietnamese mobile data,
    and the service worker caches data/ for offline reads;
  - a runtime call to pokeapi.co per tag would be 300 requests on first paint;
  - the CSVs are a versioned upstream dump, so re-running this script is the
    only time anything upstream can change.

SOURCE: PokeAPI (https://github.com/PokeAPI/pokeapi, data/v2/csv). Free API,
CC0-ish community data; mainline species names, flavor text (Pokedex entries),
genera, habitats, colors, evolution triggers and form tables are all Game Freak
text distributed under the Pokemon franchise data licence. Attribution is kept
in docs/binder/index.html footer and in data/dex_lore.json's "_meta".

Everything the app displays from this file is labelled `wiki-community` or
`mainline-lore` at the point of use - the Mezastar tag numbers (PE, gimmick,
roulette) keep their own provenance and are never mixed in here.

Usage:  python trainer/scripts/build_dex_data.py
"""
import csv
import io
import json
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CACHE = os.path.join(HERE, "_pokeapi_cache")

RAW = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/"

# Only these are needed. Fetching all 187 CSVs would be ~40 MB of nothing.
FILES = [
    "pokemon_species.csv",
    "pokemon_species_names.csv",
    "pokemon_species_flavor_text.csv",
    "pokemon_evolution.csv",
    "evolution_triggers.csv",
    "pokemon.csv",
    "pokemon_forms.csv",
    "pokemon_abilities.csv",
    "items.csv",
    "moves.csv",
    # rich-sheet additions (v84): base stats per form, ability names + flavor,
    # egg groups and growth rate for the breeding/training blurb
    "pokemon_stats.csv",
    "stats.csv",
    "ability_names.csv",
    "ability_flavor_text.csv",
    "pokemon_egg_groups.csv",
    "egg_groups.csv",
    "growth_rates.csv",
]

EN = "9"  # PokeAPI language_id / local_language_id for English
HOME = {"cave", "forest", "grassland", "mountain", "sea", "urban", "waters-edge"}


def fetch(name):
    """Read one upstream CSV, caching it next to the script."""
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, name)
    if not (os.path.isfile(path) and os.path.getsize(path) > 100):
        sys.stderr.write("  fetching %s\n" % name)
        req = urllib.request.Request(RAW + name, headers={"User-Agent": "mezastar-dex-build"})
        with urllib.request.urlopen(req, timeout=120) as fh:
            data = fh.read().decode("utf-8")
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(data)
    with open(path, encoding="utf-8") as f:
        return list(csv.DictReader(f))


def norm(name):
    """Mezastar tag name -> PokeAPI species identifier.

    Two traps found the hard way, both costing full matches when wrong:
      - PokeAPI turns SPACES into hyphens ('Great Tusk' -> 'great-tusk'), so
        stripping non-alphanumerics deleted the separator and 3 tags vanished;
      - a 'Mega' prefix must be matched as a whole word, or 'Meganium' loses
        'mega' and becomes 'nium'.
    Regional prefixes (Alolan/Galarian/Hisuian) are stripped because those tags
    are the same species as the base one, and the form table below carries the
    distinction instead.
    """
    k = name.lower().replace("♀", "-f").replace("♂", "-m")
    k = re.sub(r"[\s_]+", "-", k)
    k = re.sub(r"[^a-z0-9-]", "", k).strip("-")
    for prefix in ("alolan", "galarian", "hisuian", "paldean", "armor", "mega-", "gmax-", "mega "):
        if k.startswith(prefix):
            k = k[len(prefix):].lstrip("-")
            break
    return k


def clean_flavor(text):
    """Flavor text uses \\x0c page breaks and \\n hard wraps - flatten both."""
    out = text.replace("\x0c", " ").replace("\n", " ")
    out = out.replace("\u2019", "'").replace("\u00a0", " ")
    return re.sub(r"\s+", " ", out).strip()


# --------------------------------------------------------------------------
# load
# --------------------------------------------------------------------------
sys.stderr.write("loading PokeAPI CSVs\n")
species = fetch("pokemon_species.csv")
names = fetch("pokemon_species_names.csv")
flavor = fetch("pokemon_species_flavor_text.csv")
evo = fetch("pokemon_evolution.csv")
triggers = {t["id"]: t["identifier"] for t in fetch("evolution_triggers.csv")}
pokemon = fetch("pokemon.csv")
forms = fetch("pokemon_forms.csv")
abilities = fetch("pokemon_abilities.csv")
items = fetch("items.csv")
moves = fetch("moves.csv")
# --- rich-sheet inputs (v84) ---
stats_table = {s["id"]: s["identifier"] for s in fetch("stats.csv")}
pokemon_stats = fetch("pokemon_stats.csv")
ability_names = {a["ability_id"]: a["name"]
                 for a in fetch("ability_names.csv") if a["local_language_id"] == EN}
# ability flavor: newest English entry per ability (same newest-wins rule as flavor)
_ability_flavor = {}
for r in fetch("ability_flavor_text.csv"):
    if r["language_id"] != EN:
        continue
    aid = r["ability_id"]
    prev = _ability_flavor.get(aid)
    if prev is None or int(r["version_group_id"]) > prev[0]:
        _ability_flavor[aid] = (int(r["version_group_id"]), clean_flavor(r["flavor_text"]))
ability_flavor = {k: v[1] for k, v in _ability_flavor.items()}
egg_group_names = {e["id"]: e["identifier"] for e in fetch("egg_groups.csv")}
pokemon_egg_groups = fetch("pokemon_egg_groups.csv")
growth_rates = {g["id"]: g["identifier"] for g in fetch("growth_rates.csv")}

by_identifier = {s["identifier"]: s for s in species}
species_id_of = {p["id"]: p["species_id"] for p in pokemon}

genus = {r["pokemon_species_id"]: r["genus"] for r in names if r["local_language_id"] == EN}
english_name = {r["pokemon_species_id"]: r["name"] for r in names if r["local_language_id"] == EN}

# Latest English Pokedex entry per species. The dump holds one row per language
# per version, so without picking a single version the app would show five
# different entries at random.
best_flavor = {}
for r in flavor:
    if r["language_id"] != EN:
        continue
    sid = r["species_id"]
    text = clean_flavor(r["flavor_text"])
    if not text:
        continue
    if sid not in best_flavor:
        best_flavor[sid] = (int(r["version_id"]), text)
    elif int(r["version_id"]) > best_flavor[sid][0]:
        best_flavor[sid] = (int(r["version_id"]), text)

forms_by_species = {}
for f in forms:
    sid = species_id_of.get(f["pokemon_id"])
    if sid is None:
        continue
    forms_by_species.setdefault(sid, []).append(f)

# pokemon_evolution has NO parent column: each row is (child, condition). The
# parent of every child lives on the child's species row
# (pokemon_species.evolves_from_species_id). Index each condition row by the
# PARENT so build_entry(sid) can ask "what do the children of sid require?"
# Keying by the child itself (the first draft) made every evolved Pokemon list
# ITS OWN evolution as if it evolved into itself.
#
# The table also repeats one evolution once per game it appears in (Eevee's
# Leafeon row exists 6 times: level-up in the moss-rock games, leaf-stone in
# the newer ones). Keep only the LATEST version group per child so Eevee lists
# 8 conditions, not 19.
_parent_of = {s["id"]: (s.get("evolves_from_species_id") or "") for s in species}
_evolution_groups = {}
for e in evo:
    parent = _parent_of.get(e["evolved_species_id"], "")
    if not parent:
        continue
    key = e["evolved_species_id"]
    prev = _evolution_groups.get(key)
    if prev is None or int(e["version_group_id"]) > int(prev["version_group_id"]):
        _evolution_groups[key] = e
evolves_into = {}
for child, e in _evolution_groups.items():
    evolves_into.setdefault(_parent_of.get(child, ""), []).append(e)

abilities_by_species = {}
for a in abilities:
    sid = species_id_of.get(a["pokemon_id"])
    if sid is None:
        continue
    abilities_by_species.setdefault(sid, []).append(a)

# base stats: key by default-form pokemon id -> species (battle stats live per FORM;
# the default form is the right one for an encyclopedia sheet)
stats_by_species = {}
for ps in pokemon_stats:
    pid = ps["pokemon_id"]
    sid = species_id_of.get(pid)
    if sid is None or not ps["base_stat"]:
        continue
    stats_by_species.setdefault(sid, {})[stats_table.get(ps["stat_id"], "")] = int(ps["base_stat"])

egg_groups_by_species = {}
for peg in pokemon_egg_groups:
    egg_groups_by_species.setdefault(peg["species_id"], []).append(
        egg_group_names.get(peg["egg_group_id"], ""))

# the default (base) form of each species carries height/weight
default_pokemon_by_species = {}
for p in pokemon:
    if p["is_default"] == "1":
        default_pokemon_by_species.setdefault(p["species_id"], p)


def clean_flavor(text):
    """Flavor text uses \\x0c page breaks and \\n hard wraps - flatten both."""
    out = text.replace("\x0c", " ").replace("\n", " ")
    out = out.replace("\u2019", "'").replace("\u00a0", " ")
    return re.sub(r"\s+", " ", out).strip()


# --------------------------------------------------------------------------
# resolve
# --------------------------------------------------------------------------
def resolve(identifier):
    """identifier -> species row, or None."""
    return by_identifier.get(identifier)


item_name = {i["id"]: i["identifier"] for i in items}
move_name = {m["id"]: m["identifier"] for m in moves}


def thing(mid, table):
    """numeric id -> readable name; ids are joined tables, never user text"""
    ident = table.get(mid, "")
    return ident.replace("-", " ") if ident else "a special item/move"


def describe_evo(ev):
    """One evolution condition as a short human sentence."""
    kind = triggers.get(ev["evolution_trigger_id"], "")
    if kind == "level-up":
        if ev["minimum_level"]:
            return "Lv %s" % ev["minimum_level"]
        if ev["minimum_happiness"]:
            return "high friendship"
        if ev["minimum_beauty"]:
            return "high beauty"
        if ev["minimum_affection"]:
            return "high affection"
        if ev["time_of_day"]:
            return "Lv up (%s)" % ev["time_of_day"].replace("-", " ")
        if ev["known_move_id"]:
            return "knowing %s" % thing(ev["known_move_id"], move_name)
        if ev.get("held_item_id"):
            return "holding %s" % thing(ev["held_item_id"], item_name)
        return "Lv up"
    if kind == "use-item":
        if ev["trigger_item_id"]:
            return "using a %s" % thing(ev["trigger_item_id"], item_name)
        return "using an item"
    if kind == "trade":
        return "traded"
    if kind == "shed":
        return "shed form"
    if kind == "spin":
        return "spun around"
    if kind == "take-damage":
        return "taking damage"
    if kind == "use-move":
        return "using %s" % thing(ev["used_move_id"], move_name)
    return kind.replace("-", " ") or "special condition"


def label_for(sid):
    """Species id -> English name + genus, for evolution labels."""
    name = english_name.get(sid, "")
    return name


# --------------------------------------------------------------------------
# build the payload for one Mezastar tag
# --------------------------------------------------------------------------
def build_entry(tag):
    name = tag["name"]
    ident = norm(name)
    sp = resolve(ident)
    out = {
        "name": name,
        "slug": ident,
        "types": tag.get("types", []),
    }
    if sp is None:
        # No mainline species (should not happen, but never crash the build):
        # emit the tag with lore explicitly absent rather than inventing text.
        out["source"] = "unverified"
        return out

    sid = sp["id"]
    out["dex"] = int(sid)
    out["gen"] = int(sp["generation_id"])
    out["genus"] = genus.get(sid, "")
    out["color"] = sp.get("color_id", "")
    # height/weight live on the DEFAULT pokemon of the species, not the species row
    pk_default = default_pokemon_by_species.get(sid)
    if pk_default:
        out["height"] = round(float(pk_default["height"] or 0) / 10, 1)   # decimetres -> m
        out["weight"] = round(float(pk_default["weight"] or 0) / 10, 1)   # hectograms -> kg
    out["capture_rate"] = int(sp.get("capture_rate") or 0)
    out["base_happiness"] = int(sp.get("base_happiness") or 0)
    out["legendary"] = sp.get("is_legendary") == "1"
    out["mythical"] = sp.get("is_mythical") == "1"
    out["baby"] = sp.get("is_baby") == "1"
    # rich-sheet additions (v84): base stats, abilities with flavor, egg groups,
    # growth rate - the numbers a trainer actually asks about
    bs = stats_by_species.get(sid)
    if bs:
        out["baseStats"] = {
            "hp": bs.get("hp", 0), "atk": bs.get("attack", 0),
            "def": bs.get("defense", 0), "spa": bs.get("special-attack", 0),
            "spd": bs.get("special-defense", 0), "spe": bs.get("speed", 0),
        }
    abil, seen_ab = [], set()
    for a in abilities_by_species.get(sid, []):
        aid = a["ability_id"]
        if aid in seen_ab:   # the table repeats abilities across games; keep one
            continue
        seen_ab.add(aid)
        abil.append({
            "name": (ability_names.get(aid) or "").replace("-", " "),
            "hidden": a["is_hidden"] == "1",
            "flavor": ability_flavor.get(aid, ""),
        })
    if abil:
        out["abilities"] = abil
    eg = egg_groups_by_species.get(sid)
    if eg:
        out["eggGroups"] = [g.replace("-", " ") for g in eg]
    gr = sp.get("growth_rate_id") or ""
    if gr:
        out["growthRate"] = growth_rates.get(gr, "").replace("-", " ")
    flavor = best_flavor.get(sid)
    if flavor:
        out["lore"] = flavor[1]
    # habitat -> readable word, dropping the ones that are game-data only
    hab = sp.get("habitat_id") or ""
    out["habitat"] = hab if hab in HOME else ""

    # forms
    fs = forms_by_species.get(sid, [])
    seen = set()
    form_list = []
    for f in fs:
        fid = f["identifier"]
        if fid == ident:
            continue
        if fid in seen:
            continue
        seen.add(fid)
        form_list.append({
            "name": pretty_form(fid, ident),
            "id": fid,
            "mega": f["is_mega"] == "1",
            "gmax": f["form_identifier"] == "gmax",
            "regional": f["form_identifier"] in ("alola", "galar", "hisui"),
        })
    out["forms"] = form_list

    # evolution: what it turns INTO (each pokemon_evolution row is keyed by the
    # evolved child), and what it came FROM (pokemon_species.evolves_from_species_id
    # - the parent link lives on the species row, not on the evolution row)
    evo = []
    for e in evolves_into.get(sid, []):
        target = e["evolved_species_id"]
        evo.append({
            "to": english_name.get(target, ""),
            "toSlug": _slug_by_sid.get(target, ""),
            "condition": describe_evo(e),
        })
    out["evolvesInto"] = evo

    parent = sp.get("evolves_from_species_id") or ""
    if parent:
        # the condition of "<parent> -> me" lives on the evolution row where this
        # species is the CHILD (Tyranitar's sheet must say "Pupitar -> Lv 55")
        mine = _evolution_groups.get(sid)
        out["evolvesFrom"] = {
            "name": english_name.get(parent, ""),
            "slug": _slug_by_sid.get(parent, ""),
            "condition": describe_evo(mine) if mine else "",
        }
    return out


_parent_cache = {}


def evo_rows_by_parent(sid):
    if sid not in _parent_cache:
        rows = []
        for e in evo:
            if e["evolves_from_species_id"] == sid:
                rows.append(e)
        _parent_cache[sid] = rows
    return _parent_cache[sid]


_slug_by_sid = {s["id"]: s["identifier"] for s in species}


def by_identifier_name(sid):
    return _slug_by_sid.get(sid, "")


def pretty_form(fid, base):
    """'charizard-mega-x' -> 'Mega X'."""
    suffix = fid[len(base) + 1:] if fid.startswith(base + "-") else fid
    words = [w for w in suffix.split("-") if w]
    nice = {"mega": "Mega", "gmax": "Gigantamax", "alola": "Alolan", "galar": "Galarian",
            "hisui": "Hisuian", "x": "X", "y": "Y", "male": "Male", "female": "Female"}
    return " ".join(nice.get(w, w.capitalize()) for w in words) or fid


def main():
    db_path = os.path.join(ROOT, "data", "mezastar_tagdb.json")
    db = json.load(open(db_path, encoding="utf-8"))
    # one row per NAME: the same Pokemon ships in 6 sets, and the encyclopedia
    # entry is about the Pokemon, not the print run
    by_name = {}
    for t in db:
        by_name.setdefault(t["name"], t)

    out = []
    matched = 0
    for name in sorted(by_name):
        entry = build_entry(by_name[name])
        if entry.get("dex"):
            matched += 1
        out.append(entry)

    payload = {
        "_meta": {
            "source": "PokeAPI CSV dump (github.com/PokeAPI/pokeapi, data/v2/csv)",
            "licence": "PokeAPI community data; Pokemon names/flavor are franchise data",
            "built": "2026-10-11",
            "tags": len(out),
            "matched": matched,
            "note": ("Mainline species data only: dex number, genus, Pokedex lore, form list, "
                     "evolution conditions. Mezastar PE / gimmick / roulette are NOT here."),
        },
        "tags": out,
    }
    dest = os.path.join(ROOT, "data", "dex_lore.json")
    tmp = dest + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, dest)
    size = os.path.getsize(dest)
    sys.stderr.write("wrote data/dex_lore.json = %d tags (%d matched) = %.1f KB\n"
                     % (len(out), matched, size / 1024.0))
    if matched < len(out):
        sys.stderr.write("WARNING: %d tags had no mainline species match\n" % (len(out) - matched))


if __name__ == "__main__":
    main()
