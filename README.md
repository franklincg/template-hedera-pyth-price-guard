# Hedera Pyth Price Guard

A Scaffold-HBAR external template for adding a small, auditable Pyth price circuit breaker to Hedera dApps.

The template combines a Solidity contract on Hedera EVM with Pyth's pull-oracle flow. A protected action can require a freshly verified price and stop when the feed leaves an application-defined band.

## Scaffold it

Prerequisites: Node.js 20.18.3 or later and npm.

```bash
npm create scaffold-hbar@latest my-price-guard -- --template franklincg/template-hedera-pyth-price-guard
cd my-price-guard
npm install
npm run lint
npm test
npm run build
```

Run the frontend with:

```bash
npm run dev --workspace @price-guard/nextjs
```

Then open http://localhost:3000. The app also exposes `/api/pyth/btc`, a server route that reads the current BTC/USD feed from Pyth Hermes.

## Architecture

- `packages/hardhat/contracts/PythPriceGuard.sol`: on-chain circuit breaker.
- `packages/hardhat/contracts/IPyth.sol`: minimal Pyth interface needed by the guard.
- `packages/hardhat/test/PythPriceGuard.test.ts`: fee and price-band tests.
- `packages/nextjs/app/api/pyth/btc/route.ts`: live Pyth Hermes read route.
- `packages/nextjs/app/page.tsx`: developer-facing live feed and architecture summary.

Pyth is load-bearing here: the contract asks the official Pyth contract for the update fee, submits signed price-update bytes, then reads the feed with `getPriceNoOlderThan`. Removing Pyth removes the template's core capability.

## Pyth flow

`updateAndCheck(priceUpdate)`:

1. asks Pyth for the update fee;
2. requires enough native value to pay it;
3. calls `updatePriceFeeds` with signed update bytes;
4. reads the configured feed with `getPriceNoOlderThan`;
5. reverts if the raw Pyth price is outside the configured min/max band.

The bounds use Pyth's raw integer representation. Interpret them together with the feed exponent.

Default BTC/USD feed:

```text
0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
```

Official Pyth Core contract on Hedera Testnet:

```text
0xA2aa501b19aff244D90cc15a4Cf739D2725B5729
```

Hedera Testnet chain ID is `296`.

## Contract tests

The tests use a small `MockPyth`, so CI does not depend on a live RPC.

```bash
npm test
```

Covered behavior:

- in-range fresh price succeeds;
- out-of-range price reverts;
- insufficient oracle update fee reverts;
- excess native value is refunded;
- feed configuration is immutable.

## Hedera Testnet deployment

A deployment script is included in `packages/hardhat/scripts/deploy.ts`. Use a funded Hedera Testnet EVM account supplied at runtime; never commit account credentials. The script prints the contract address, transaction hash, and HashScan transaction URL after confirmation.

## Testnet evidence

The bounty submission must include a real Hedera Testnet transaction produced by this template and verifiable through HashScan or a mirror node. The repository does not fabricate or hard-code transaction evidence.

## Security notes

- Treat Hermes update bytes as untrusted caller input; Pyth verifies signed updates.
- Use `getPriceNoOlderThan` rather than accepting stale data.
- Choose `maxAge` and price bounds for the application's risk profile.
- A circuit breaker is one risk control, not a complete oracle-risk engine.
- Never commit funded account credentials.

## AI-assisted development

See `AGENTS.md` for invariants and validation steps.

## License

MIT.
