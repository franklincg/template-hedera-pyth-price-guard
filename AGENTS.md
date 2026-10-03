# AGENTS.md

## Goal
Keep this repository a small, production-readable Scaffold-HBAR example of a Pyth-backed price safety guard on Hedera.

## Required checks
Before submitting changes, run `npm install`, `npm run lint`, `npm test`, and `npm run build`.

## Contract rules
Preserve Pyth freshness checking and explicit price-band behavior. Keep tests alongside behavior changes. Do not commit local credentials or generated build outputs.

## Hedera rules
Use Hedera Testnet for deployment evidence. Evidence must be publicly verifiable through HashScan or the Hedera Mirror Node. Mainnet funds are not required.

## Scope
Prefer focused changes and avoid unrelated scaffold rewrites.
