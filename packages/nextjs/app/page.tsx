"use client";

import { useEffect, useState } from "react";

type PriceState = {
  price: string;
  exponent: number;
  publishTime: number;
};

const PYTH_TESTNET = "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729";
const BTC_USD = "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";

function formatPrice(raw: string, exponent: number) {
  const value = Number(raw) * 10 ** exponent;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Home() {
  const [price, setPrice] = useState<PriceState | null>(null);

  useEffect(() => {
    fetch("/api/pyth/btc")
      .then(response => response.json())
      .then(data => {
        if (data.price) {
          setPrice(data);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <main>
      <span className="eyebrow">Scaffold-HBAR · Hedera Testnet · Pyth</span>
      <h1>Price safety as a starter primitive.</h1>
      <p className="lede">
        A reusable Hedera EVM circuit breaker that submits signed Pyth updates, enforces freshness,
        and blocks protected actions when the oracle leaves your configured price band.
      </p>

      <section className="grid">
        <article className="card">
          <h2>Live Pyth BTC/USD</h2>
          <div className="live">{price ? formatPrice(price.price, price.exponent) : "Loading…"}</div>
          <p className="muted">
            {price ? "Publish time: " + new Date(price.publishTime * 1000).toISOString() : "Reading Hermes"}
          </p>
        </article>

        <article className="card">
          <h2>Hedera Testnet Pyth</h2>
          <code>{PYTH_TESTNET}</code>
          <p>On-chain update and fresh-price validation happen in PythPriceGuard.</p>
        </article>

        <article className="card">
          <h2>BTC/USD feed</h2>
          <code>{BTC_USD}</code>
          <p>The same feed powers the live developer view and the guard configuration.</p>
        </article>
      </section>
    </main>
  );
}
