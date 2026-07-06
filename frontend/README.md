# BOT-TIPS

BOT-TIPS is a BOT Chain testnet prototype for direct creator tipping. Creators register an on-chain profile, fans send native $BOT tips with an optional message, and the app reads public registry/tip data from BOT Chain.

## What is implemented

- React + TypeScript + Vite frontend
- Privy login with X/wallet support
- BOT Chain testnet configuration
- Creator discovery page backed by the `CreatorRegistry` contract
- Creator dashboard for registration, campaign goals, wallet balance, and received/sent tips
- Public creator profile pages with direct $BOT tipping
- Solidity contracts for the creator registry and a simple standalone tip jar

## BOT Chain testnet

- Chain ID: `968`
- RPC: `https://rpc.bohr.life`
- Explorer: `https://scan.bohr.life/`
- Faucet: `https://faucet.botchain.ai/basic`
- Native token: `BOT`

## Frontend setup

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

Optional `.env` values:

```bash
VITE_PRIVY_APP_ID=your-privy-app-id
VITE_CREATOR_REGISTRY_ADDRESS=0xcb55f29c7F1D2e86E77CDc63C61270A73665Ae33
```

Both frontend variables are public browser configuration, not private secrets. The checked-in defaults point at the current demo registry/app configuration.

## Build and lint

```bash
cd frontend
npm run lint
npm run build
```

## Contract setup

```bash
cd contracts
cp .env.example .env
npm ci
npm run compile
```

For deployment or seeding, add a funded BOT Chain testnet deployer key to `contracts/.env`:

```bash
PRIVATE_KEY=0xyour_bot_chain_testnet_deployer_private_key
CREATOR_REGISTRY_ADDRESS=0xcb55f29c7F1D2e86E77CDc63C61270A73665Ae33
```

Then run:

```bash
npm run deploy
npm run seed
```

Do not commit real `.env` files or private keys.

## Submission framing

Use precise testnet language:

> BOT-TIPS is a BOT Chain testnet prototype demonstrating BOT-native creator tipping with on-chain profile registration, direct native-token settlement, and public receipt/event verification.

Avoid claiming audited payments, production usage, or mainnet settlement unless those are separately completed and evidenced.
