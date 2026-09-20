# Trainer data: Khanh's binder and battle strategy

Private working data for our own Mezastar play. This folder is NOT part of the shared tag catalogue.

| File | What it is |
| --- | --- |
| `binder.json` | Every tag Khanh physically owns, with PE, types, ability and a path to its artwork |
| `battle_dossier.md` | Full battle strategy write-up: power ranking, type coverage, counter table per boss type, core three, the one-per-battle trigger budget, defensive risks, hunt list, play tactics |
| `battle_analysis.json` | Machine readable counter table (boss type to best and alternate picks) plus the missing-attack-type list |

## Regenerating
Both analysis files are generated from the master database (`data/mezastar_tagdb.json`) plus `binder.json`
using the mainline Pokemon type chart. Whenever the binder changes, rebuild the analysis rather than editing
these files by hand.

## Current state
- `count_unique`: 19 unique tags (20 physical, one duplicate)
- Attack type coverage: 14 of 18, missing Fire, Poison, Bug and Ghost
- Trigger budget: Dynamax (Snorlax), Mega Evolution (Lucario), Z-Move (Torterra or Empoleon, one per session)

## Privacy
This repository is private. If it is ever made public, remove the `trainer/` folder first so Khanh's
collection and strategy notes are not published with the tag catalogue.
