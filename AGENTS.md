# AGENTS.md

This repository is a Scaffold-HBAR template. Keep changes focused, reproducible, and safe for a developer who scaffolds it from scratch.

## Project map

- `packages/hardhat/contracts/PythPriceGuard.sol`: oracle circuit breaker.
- `packages/hardhat/contracts/IPyth.sol`: minimal Pyth interface.
- `packages/hardhat/contracts/MockPyth.sol`: deterministic test double only.
- `packages/hardhat/test/PythPriceGuard.test.ts`: contract behavior tests.
- `packages/nextjs/app/api/pyth/btc/route.ts`: Pyth Hermes read route.
- `packages/nextjs`: developer-facing starter UI.
- `template.json`: scaffold capabilities and defaults.

## Required checks

After material changes:

```bash
npm install
npm run lint
npm test
npm run build
```

Before release or bounty submission, also scaffold the public repository with `npm create scaffold-hbar@latest` and repeat the checks from the fresh output.

## Oracle invariants

- Keep Pyth signature verification in the guarded path by calling the Pyth contract.
- Keep `getPriceNoOlderThan` as the freshness check.
- Express min/max bounds in raw feed units and document the exponent.
- Stale or out-of-band prices must stop the protected action.
- Require enough native value before forwarding the update fee.
- Refund only the caller's excess value.
- Add a focused test for each behavior change.

## Repository hygiene

Do not commit local environment files, funded account credentials, generated build output, dependency directories, caches, or machine-specific files.

## Testnet evidence

A final bounty submission needs a Hedera Testnet transaction that opens in HashScan or verifies through a mirror node. Evidence must be produced by this template flow.
