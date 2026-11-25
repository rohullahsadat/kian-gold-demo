
import { getGoldPrices } from '../services/gold-price-service.js';
import { money } from '../services/pricing-service.js';

export async function renderTicker() {
  try {
    const gold = await getGoldPrices();

    const priceElement = document.querySelector('#ticker-price');
    const statusElement = document.querySelector('#ticker-status');

    if (priceElement) {
      priceElement.textContent =
        `${money(gold.gram24)} / گرم ۲۴ عیار`;
    }

    if (statusElement) {
      if (gold.isDemo) {
        statusElement.textContent =
          'نرخ نمونه · اتصال به بازار برقرار نیست';
      } else if (gold.isStale) {
        statusElement.textContent =
          'داده بازار قدیمی است';
      } else {
        statusElement.textContent =
          'نرخ بازار · به‌روزرسانی آنلاین';
      }
    }

  } catch (error) {
    console.error('Gold ticker error:', error);

    const statusElement = document.querySelector('#ticker-status');

    if (statusElement) {
      statusElement.textContent =
        'قیمت طلا در دسترس نیست';
    }
  }
}
