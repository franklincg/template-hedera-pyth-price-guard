export default function Home() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "72px 24px", fontFamily: "sans-serif" }}>
      <p style={{ textTransform: "uppercase", letterSpacing: 3, fontWeight: 700 }}>Hedera + Pyth</p>
      <h1 style={{ fontSize: 54, lineHeight: 1.05 }}>Price Guard for safer on-chain actions</h1>
      <p style={{ fontSize: 20, lineHeight: 1.6, opacity: 0.75 }}>
        A Scaffold-HBAR template that rejects stale oracle data and blocks protected actions when the configured Pyth price leaves an explicit safety band.
      </p>
      <section style={{ display: "grid", gap: 16, marginTop: 40 }}>
        <article><h2>Freshness gate</h2><p>Pyth data must be no older than the configured maxAge.</p></article>
        <article><h2>Explicit price band</h2><p>Applications choose the inclusive raw-price range that protects their action.</p></article>
        <article><h2>Hedera Testnet</h2><p>The deployment path targets Pyth Core on Hedera Testnet and produces public HashScan evidence.</p></article>
      </section>
    </main>
  );
}
