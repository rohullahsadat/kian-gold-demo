
const MARKET_URL =
  'https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/latest-toman.json';

const DEMO_URL = new URL(
  '../../data/demo-gold-prices.json',
  import.meta.url
);

export async function getGoldPrices() {
  try {
    const response = await fetch(MARKET_URL, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('دریافت نرخ بازار ناموفق بود');
    }

    const payload = await response.json();

    const gold24 = payload?.data?.categories?.gold?.find(
      item => item.symbol === 'GOLD_24K_IRR'
    );

    if (
      !gold24 ||
      !Number.isFinite(Number(gold24.price)) ||
      Number(gold24.price) <= 0
    ) {
      throw new Error('نرخ معتبر طلای ۲۴ عیار پیدا نشد');
    }

    return {
      currency: 'IRT',
      currencyLabel: 'تومان',
      source: 'Iran Market Data',
      isDemo: false,
      isStale: Boolean(gold24.stale),
      gram24: Number(gold24.price),
      ounce24: Number(gold24.price) * 31.1034768,
      changePercent: Number(gold24.change_pct || 0),
      lastUpdated:
        gold24.timestamp_tehran ||
        payload.data.generated_at
    };

  } catch (error) {
    console.error('Gold market API error:', error);

    // Fallback to local demo prices
    const fallbackResponse = await fetch(DEMO_URL);

    if (!fallbackResponse.ok) {
      throw new Error('نرخ بازار و نرخ نمونه در دسترس نیست');
    }

    const demo = await fallbackResponse.json();

    return {
      ...demo,
      isDemo: true,
      isStale: false,
      source: 'نرخ نمونه کیان گلد (Fallback)'
    };
  }
}
