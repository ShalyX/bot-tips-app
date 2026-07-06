# BOT-TIPS App

This repository contains two projects:

- `frontend/` — React + TypeScript + Vite app for BOT Chain creator tipping
- `contracts/` — Hardhat project with `CreatorRegistry` and `TipJar` contracts

See `frontend/README.md` for setup, BOT Chain testnet config, and submission framing.

Quick checks:

```bash
cd frontend && npm ci && npm run lint && npm run build
cd ../contracts && npm ci && npm run compile
```

Never commit real `.env` files or private keys. Use the included `.env.example` files as templates.
