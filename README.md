# Warung Rasa — Indonesian Cooking Game

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/akun-kerja/best-cooking-game-01/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/akun-kerja/best-cooking-game-01/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

Run a small Indonesian food stall. Customers order Nasi Goreng, Mie Ayam
or Gado-Gado; take ingredients from the counter, chop them on the board,
cook them in the wok, build the plate and serve through the window before
the customer's patience runs out. One day lasts 150 seconds; orders get
faster and less patient as your level rises. Combos pay extra.

Built for [make.fun's best-cooking-game-20261125-0137 bounty](https://make.fun/bounty/best-cooking-game-20261125-0137) — make the best cooking game ($250 in USDC).

## How to play

- Click an ingredient bin (or press 1–6) to pick it up.
- Click the chopping board to chop it (3 clicks). Rice and noodles skip
  the board and go straight to the wok.
- Click the wok to cook, then click again to take the finished dish.
- Click the plate to add a ready ingredient (max 3, no duplicates).
- Click the serve window when the plate matches an order ticket.
- Right-click the plate to throw it away. `R` restarts, `M` mutes.

## Recipes

- **Nasi Goreng** — Nasi (wok) + Telur (chop, wok) + Cabai (chop)
- **Mie Ayam** — Mie (wok) + Ayam (chop, wok) + Cabai (chop)
- **Gado-Gado** — Tahu (chop) + Telur (chop, wok) + Cabai (chop)

## Tech

- Static files under `game/`, no build step, no network requests.
- All art is drawn on canvas; all sounds are synthesised with WebAudio.
- Screenshot staging: open `index.html?shot=cover`, `?shot=serve`,
  `?shot=rush` or `?shot=title` for staged states.

## Screenshots

- `1-cover.jpg` — mid-assembly: chicken on the board, noodles in the wok,
  two items plated, chilli in hand.
- `2-serve.jpg` — a full Nasi Goreng plate ready at the serve window.
- `3-rush.jpg` — three tickets at once, one nearly out of patience.
- `4-title.jpg` — the title screen with the how-to-play card.

## Run

```sh
node serve.ts
# open http://localhost:8080
```

## Build the entry output

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
