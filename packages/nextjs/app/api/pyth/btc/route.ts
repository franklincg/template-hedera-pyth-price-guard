import { NextResponse } from "next/server";

const BTC_USD_FEED = "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
const HERMES_URL =
  "https://hermes.pyth.network/v2/updates/price/latest?ids[]=" + BTC_USD_FEED + "&parsed=true";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await fetch(HERMES_URL, {
    cache: "no-store",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Pyth Hermes request failed", status: response.status },
      { status: 502 },
    );
  }

  const payload = await response.json();
  const parsed = payload?.parsed?.[0];

  if (!parsed?.price) {
    return NextResponse.json({ error: "Pyth Hermes returned no parsed price" }, { status: 502 });
  }

  return NextResponse.json({
    feedId: "0x" + BTC_USD_FEED,
    price: parsed.price.price,
    confidence: parsed.price.conf,
    exponent: parsed.price.expo,
    publishTime: parsed.price.publish_time,
  });
}
