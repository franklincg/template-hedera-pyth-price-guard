# Hedera Pyth Price Guard

A Scaffold-HBAR external template for dApps that must stop sensitive actions when a Pyth price is stale or outside an explicit safety band.

## What it demonstrates

- Hedera Testnet smart-contract deployment.
- Pyth price reads with a maximum accepted age.
- Configurable min/max raw-price circuit breaker.
- Pyth update-data forwarding with exact fee handling and refund.
- Hardhat tests using Pyth's official Solidity mock.
- Minimal Next.js frontend suitable for Scaffold-HBAR.

## Create from the template

```bash
npm create scaffold-hbar@latest -- --template franklincg/template-hedera-pyth-price-guard
cd <your-project>
npm install
npm test
npm run build
```

## Contract model

`PythPriceGuard` stores the Pyth contract, price-feed id, freshness limit, and inclusive raw-price band. `read()` rejects stale data through Pyth's `getPriceNoOlderThan`. `updateAndCheck()` can accept a Pyth update payload, pay the exact update fee, enforce the configured band, and refund excess native value.

The deployment script targets the official Pyth Core contract on Hedera Testnet:

`0xA2aa501b19aff244D90cc15a4Cf739D2725B5729`

The example feed is ETH/USD:

`0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace`

## Validation

```bash
npm install
npm run lint
npm test
npm run build
```

No funded account is required for install, lint, tests, or build.

## Hedera Testnet deployment

Configure a testnet-only signer in your local environment and run `npm run deploy:testnet`. The script prints the deployed contract address, deployment transaction hash, and HashScan link. Never commit local environment files.

## Security note

This is a reference template, not an audited risk engine. Production applications should choose an appropriate feed, freshness limit, confidence policy, decimal/exponent conversion, and application-specific deviation model.

## License

MIT.
