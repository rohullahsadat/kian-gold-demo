
/* =========================================================
   KIAN GOLD — MAIN APPLICATION
   ========================================================= */

// =========================================================
// IMPORTS
// =========================================================

import { renderHeader } from './components/navigation.js';
import { renderFooter } from './components/footer.js';
import { toast } from './components/notifications.js';
import { renderTicker } from './components/gold-ticker.js';
import { initAssistant } from './components/ai-assistant.js';
import { initHeroSlider } from './components/hero-slider.js';

import { getProducts } from './services/product-service.js';
import { getGoldPrices } from './services/gold-price-service.js';

import {
  calculateProductPrice,
  money
} from './services/pricing-service.js';

import { Cart } from './services/cart-service.js';
import { Wishlist } from './services/wishlist-service.js';

import { showMessage } from './utils/validation.js';


// =========================================================
// GLOBAL VARIABLES & HELPERS
// =========================================================

let products = [];
let gold = null;

const $ = selector => document.querySelector(selector);

const fa = number =>
  new Intl.NumberFormat('fa-IR').format(Number(number) || 0);


// =========================================================
// CART & WISHLIST COUNTS
// =========================================================

function refreshCounts() {
  const cartCount = $('#cart-count');
  const wishCount = $('#wish-count');

  if (cartCount) {
    cartCount.textContent = fa(Cart.count());
  }

  if (wishCount) {
    wishCount.textContent = fa(Wishlist.all().length);
  }
}


// =========================================================
// PRODUCT PRICE
// =========================================================

function productPrice(product) {
  if (!gold || !product) return 0;

  return calculateProductPrice(product, gold).total;
}


// =========================================================
// PRODUCT CARD
// =========================================================

function card(product) {
  return `
    <article class="product-card">

      <a
        class="product-image"
        href="product-detail.html?id=${encodeURIComponent(product.id)}"
      >
        <img
          loading="lazy"
          src="${product.image}"
          alt="${product.name}"
        >
      </a>

      <button
        class="heart-btn"
        data-wish="${product.id}"
        aria-label="افزودن به علاقه‌مندی‌ها"
      >
        ${Wishlist.has(product.id) ? '♥' : '♡'}
      </button>

      <div class="product-info">

        <h3>${product.name}</h3>

        <p>
          ${fa(product.karat)} عیار ·
          ${fa(product.weight)} گرم
        </p>

        <div class="product-price">
          ${money(productPrice(product), gold.currency)}
        </div>

        <div class="product-actions">

          <button data-add="${product.id}">
            افزودن به سبد
          </button>

          <a
            class="btn btn-outline"
            href="product-detail.html?id=${encodeURIComponent(product.id)}"
          >
            جزئیات
          </a>

        </div>
      </div>

    </article>
  `;
}


// =========================================================
// RENDER PRODUCT GRID
// =========================================================

function renderGrid(element, list) {
  if (!element) return;

  element.innerHTML = list.length
    ? list.map(card).join('')
    : '<p class="notice">محصولی مطابق انتخاب شما پیدا نشد.</p>';
}


// =========================================================
// PRODUCT ACTIONS
// =========================================================

function bindProductActions() {

  // Add to cart
  document.querySelectorAll('[data-add]').forEach(button => {

    button.addEventListener('click', () => {

      Cart.add(button.dataset.add);

      refreshCounts();

      toast('محصول به سبد خرید افزوده شد.');

    });

  });


  // Wishlist
  document.querySelectorAll('[data-wish]').forEach(button => {

    button.addEventListener('click', () => {

      const added = Wishlist.toggle(button.dataset.wish);

      button.textContent = added ? '♥' : '♡';

      refreshCounts();

      toast(
        added
          ? 'به علاقه‌مندی‌ها افزوده شد.'
          : 'از علاقه‌مندی‌ها حذف شد.'
      );

    });

  });

}


// =========================================================
// HOME PAGE
// =========================================================

function initHome() {

  initHeroSlider();

  renderGrid(
    $('#featured-products'),
    products.slice(0, 4)
  );

  renderGrid(
    $('#new-products'),
    products.filter(product => product.new)
  );

}


// =========================================================
// SHOP PAGE
// =========================================================

function initShop() {

  const query = new URLSearchParams(location.search);

  if (query.get('category') && $('#category-filter')) {
    $('#category-filter').value = query.get('category');
  }

  let limit = 8;

  const applyFilters = () => {

    let list = [...products];

    const search =
      ($('#product-search')?.value || '').trim().toLowerCase();

    const category = $('#category-filter')?.value || '';
    const karat = $('#karat-filter')?.value || '';

    const minPrice = Number($('#min-price')?.value) || 0;
    const maxPrice = Number($('#max-price')?.value) || Infinity;

    const sort = $('#sort-products')?.value || '';

    // Filtering
    list = list.filter(product => {

      return (
        (!search || product.name.toLowerCase().includes(search)) &&
        (!category || product.category === category) &&
        (!karat || String(product.karat) === karat) &&
        productPrice(product) >= minPrice &&
        productPrice(product) <= maxPrice
      );

    });

    // Sorting
    if (sort === 'low') {
      list.sort((a, b) => productPrice(a) - productPrice(b));
    }

    if (sort === 'high') {
      list.sort((a, b) => productPrice(b) - productPrice(a));
    }

    if (sort === 'new') {
      list.sort((a, b) => Number(b.new) - Number(a.new));
    }

    if (sort === 'popular') {
      list.sort((a, b) => b.popularity - a.popularity);
    }

    // Results
    const resultCount = $('#result-count');

    if (resultCount) {
      resultCount.textContent = fa(list.length) + ' محصول';
    }

    renderGrid(
      $('#shop-products'),
      list.slice(0, limit)
    );

    bindProductActions();

  };

  // Filter events
  [
    'product-search',
    'category-filter',
    'karat-filter',
    'min-price',
    'max-price',
    'sort-products'
  ].forEach(id => {

    $('#' + id)?.addEventListener('input', applyFilters);

  });

  // Clear filters
  $('#clear-filters')?.addEventListener('click', () => {

    [
      'product-search',
      'category-filter',
      'karat-filter',
      'min-price',
      'max-price'
    ].forEach(id => {

      const element = $('#' + id);

      if (element) element.value = '';

    });

    applyFilters();

  });

  // Load more
  $('#load-more')?.addEventListener('click', () => {

    limit += 8;

    applyFilters();

  });

  applyFilters();

}


// =========================================================
// PRODUCT DETAIL PAGE
// =========================================================

function initProduct() {

  const id =
    new URLSearchParams(location.search).get('id') ||
    products[0]?.id;

  const product =
    products.find(item => item.id === id) ||
    products[0];

  const element = $('#product-detail');

  if (!product || !element) return;

  const calculation = calculateProductPrice(product, gold);

  element.innerHTML = `

    <div class="about-grid">

      <div>

        <img
          id="main-product-image"
          src="${product.image}"
          alt="${product.name}"
          style="width:100%;max-height:620px;object-fit:cover;cursor:zoom-in"
        >

        <p class="muted">
          برای بزرگ‌نمایی روی تصویر کلیک کنید.
        </p>

      </div>

      <div>

        <span class="eyebrow">
          KIAN GOLD · انتخاب ماندگار
        </span>

        <h1 style="font-size:2.2rem">
          ${product.name}
        </h1>

        <p>${product.desc}</p>

        <div class="price-card">

          <b>${money(calculation.total, gold.currency)}</b>

          <span>
            قیمت تخمینی بر اساس
            ${gold.isDemo ? 'داده نمایشی' : 'نرخ دریافتی بازار'}
          </span>

        </div>

        <p>
          وزن: ${fa(product.weight)} گرم
        </p>

        <p>
          عیار: ${fa(product.karat)} عیار
        </p>

        <p>
          وضعیت: آماده سفارش (نمایشی)
        </p>

        <h3>جزئیات قیمت</h3>

        <div class="summary-line">
          <span>ارزش طلای خام</span>
          <b>${money(calculation.gold, gold.currency)}</b>
        </div>

        <div class="summary-line">
          <span>اجرت ساخت</span>
          <b>${money(calculation.making, gold.currency)}</b>
        </div>

        <div class="summary-line">
          <span>سود فروشنده</span>
          <b>${money(calculation.margin, gold.currency)}</b>
        </div>

        <div class="summary-line">
          <span>سایر هزینه‌ها</span>
          <b>${money(calculation.extra, gold.currency)}</b>
        </div>

        <div class="summary-line summary-total">
          <span>جمع تخمینی</span>
          <b>${money(calculation.total, gold.currency)}</b>
        </div>

        <p class="notice warning">
          قیمت نهایی باید در سرور و با نرخ معتبر روز محاسبه و تأیید شود.
        </p>

        <div class="product-actions">

          <button class="btn btn-gold" id="detail-add">
            افزودن به سبد خرید
          </button>

          <button class="btn btn-outline" id="detail-wish">
            ♡ علاقه‌مندی
          </button>

        </div>

      </div>

    </div>

  `;

  // Add to cart
  $('#detail-add').onclick = () => {

    Cart.add(product.id);

    refreshCounts();

    toast('به سبد خرید افزوده شد.');

  };

  // Wishlist
  $('#detail-wish').onclick = () => {

    Wishlist.toggle(product.id);

    refreshCounts();

    toast('فهرست علاقه‌مندی به‌روزرسانی شد.');

  };

  // Image zoom
  $('#main-product-image').onclick = () => {

    const overlay = document.createElement('div');

    overlay.style = `
      position:fixed;
      inset:0;
      background:#000e;
      z-index:500;
      display:grid;
      place-items:center;
      padding:20px;
    `;

    overlay.innerHTML = `

      <button
        style="
          position:absolute;
          top:20px;
          left:25px;
          font-size:30px;
          background:none;
          color:white;
          border:0;
        "
      >
        ×
      </button>

      <img
        src="${product.image}"
        alt="${product.name}"
        style="max-height:90vh;max-width:95vw;object-fit:contain"
      >

    `;

    overlay.onclick = () => overlay.remove();

    document.body.append(overlay);

  };

  renderGrid(
    $('#related-products'),
    products.filter(item => item.id !== product.id).slice(0, 4)
  );

}


// =========================================================
// WISHLIST PAGE
// =========================================================

function initWishlist() {

  const element = $('#wishlist-items');

  if (!element) return;

  const render = () => {

    const list = products.filter(product =>
      Wishlist.has(product.id)
    );

    if (!list.length) {

      element.innerHTML = `
        <div class="notice">
          فهرست علاقه‌مندی شما خالی است.
          <a href="shop.html">مشاهده فروشگاه</a>
        </div>
      `;

      return;

    }

    element.innerHTML = list.map(product => {

      return card(product).replace(
        '</article>',
        `
          <button data-remove-wish="${product.id}">
            حذف از فهرست
          </button>
        </article>
        `
      );

    }).join('');

    bindProductActions();

    element.querySelectorAll('[data-remove-wish]').forEach(button => {

      button.onclick = () => {

        Wishlist.remove(button.dataset.removeWish);

        refreshCounts();

        render();

      };

    });

  };

  render();

}


// =========================================================
// CART PAGE
// =========================================================

function initCart() {

  const element = $('#cart-items');
  const summary = $('#cart-summary');

  if (!element || !summary) return;

  const render = () => {

    const items = Cart.all()
      .map(item => ({
        ...item,
        product: products.find(product => product.id === item.id)
      }))
      .filter(item => item.product);

    if (!items.length) {

      element.innerHTML = `
        <div class="notice">
          سبد خرید شما خالی است.
          <a href="shop.html">رفتن به فروشگاه</a>
        </div>
      `;

      summary.innerHTML = '';

      return;

    }

    // Cart items
    element.innerHTML = items.map(item => `

      <div class="cart-row">

        <img
          src="${item.product.image}"
          alt="${item.product.name}"
        >

        <div>

          <b>${item.product.name}</b>

          <p>
            ${money(productPrice(item.product), gold.currency)}
          </p>

          <div class="qty-control">

            <button data-dec="${item.product.id}">
              −
            </button>

            <span>${fa(item.qty)}</span>

            <button data-inc="${item.product.id}">
              +
            </button>

          </div>

        </div>

        <div class="cart-row-actions">

          <b>
            ${money(productPrice(item.product) * item.qty, gold.currency)}
          </b>

          <button
            data-remove="${item.product.id}"
            class="text-link"
          >
            حذف
          </button>

        </div>

      </div>

    `).join('');

    // Total
    const subtotal = items.reduce((sum, item) => {

      return sum + productPrice(item.product) * item.qty;

    }, 0);

    summary.innerHTML = `

      <h3>خلاصه سفارش</h3>

      <div class="summary-line">
        <span>جمع محصولات</span>
        <b>${money(subtotal, gold.currency)}</b>
      </div>

      <div class="summary-line">
        <span>هزینه ارسال</span>
        <b>پس از هماهنگی</b>
      </div>

      <div class="summary-line summary-total">
        <span>جمع تخمینی</span>
        <b>${money(subtotal, gold.currency)}</b>
      </div>

      <p class="muted">
        هزینه ارسال و مالیات احتمالی هنوز تنظیم نشده است.
      </p>

      <a class="btn btn-gold full" href="checkout.html">
        ادامه و تکمیل سفارش
      </a>

      <a class="btn btn-outline full" href="shop.html">
        ادامه خرید
      </a>

    `;

    // Increase quantity
    element.querySelectorAll('[data-inc]').forEach(button => {

      button.onclick = () => {

        const item = Cart.all().find(
          item => item.id === button.dataset.inc
        );

        if (!item) return;

        Cart.qty(button.dataset.inc, item.qty + 1);

        refreshCounts();

        render();

      };

    });

    // Decrease quantity
    element.querySelectorAll('[data-dec]').forEach(button => {

      button.onclick = () => {

        const item = Cart.all().find(
          item => item.id === button.dataset.dec
        );

        if (!item) return;

        Cart.qty(button.dataset.dec, item.qty - 1);

        refreshCounts();

        render();

      };

    });

    // Remove item
    element.querySelectorAll('[data-remove]').forEach(button => {

      button.onclick = () => {

        Cart.remove(button.dataset.remove);

        refreshCounts();

        render();

      };

    });

  };

  render();

}


// =========================================================
// CHECKOUT PAGE
// =========================================================

function initCheckout() {

  const summary = $('#checkout-summary');

  let total = 0;

  if (summary) {

    total = Cart.all().reduce((sum, item) => {

      const product = products.find(
        product => product.id === item.id
      );

      if (!product) return sum;

      return sum + productPrice(product) * item.qty;

    }, 0);

    summary.innerHTML = `

      <h3>خلاصه سفارش</h3>

      <div class="summary-line summary-total">

        <span>جمع تخمینی</span>

        <b>${money(total, gold.currency)}</b>

      </div>

    `;

  }

  // Checkout form
  $('#checkout-form')?.addEventListener('submit', event => {

    event.preventDefault();

    if (!Cart.count()) {

      toast('سبد خرید خالی است.');

      return;

    }

    const data = Object.fromEntries(
      new FormData(event.currentTarget)
    );

    if (data.payment === 'gateway') {

      $('#checkout-message').textContent =
        'درگاه پرداخت هنوز متصل نیست؛ پرداخت انجام نشد.';

      return;

    }

    const orders = JSON.parse(
      localStorage.getItem('kian_demo_orders') || '[]'
    );

    orders.push({

      id: Date.now(),

      name: data.name,

      phone: data.phone,

      total,

      created: new Date().toLocaleString('fa-IR'),

      status: 'در انتظار تماس'

    });

    localStorage.setItem(
      'kian_demo_orders',
      JSON.stringify(orders)
    );

    Cart.clear();

    refreshCounts();

    $('#checkout-message').textContent =
      'درخواست سفارش شما در همین مرورگر ثبت شد. این ثبت نمایشی است و به فروشنده ارسال نشده است.';

    event.currentTarget.reset();

  });

}


// =========================================================
// GOLD PRICES PAGE
// =========================================================

function initGold() {

  const cards = $('#gold-price-cards');

  if (!cards) return;

  // Calculate all karat prices from the same 24K base rate
  const rates = [24, 22, 21, 18].map(karat => ({

    karat,

    price: Number(gold.gram24) * karat / 24

  }));

  cards.innerHTML = rates.map(item => `

    <div class="price-card">

      <span>
        هر گرم طلای ${fa(item.karat)} عیار
      </span>

      <b>
        ${money(item.price, gold.currency)}
      </b>

      <small>تومان</small>

    </div>

  `).join('');

  // Last update
  const updatedElement = $('#gold-updated');

  if (updatedElement) {
    updatedElement.textContent =
      'آخرین به‌روزرسانی: ' + (gold.lastUpdated || 'نامشخص');
  }

  // Source and connection status
  const sourceStatus = gold.isDemo
    ? 'داده نمایشی — API بازار زنده متصل نیست'
    : gold.isStale
      ? 'داده بازار قدیمی است'
      : 'اتصال به داده بازار برقرار است';

  const sourceElement = $('#gold-source');

  if (sourceElement) {
    sourceElement.textContent =
      `منبع: ${gold.source || 'نامشخص'} · ${sourceStatus}`;
  }

  // Demo chart
  const canvas = $('#gold-chart');

  if (!canvas) return;

  const context = canvas.getContext('2d');

  if (!context) return;

  const values = [
    5700,
    5780,
    5740,
    5890,
    5840,
    5980,
    6050,
    6200
  ];

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.strokeStyle = '#d4af37';
  context.lineWidth = 4;

  context.beginPath();

  values.forEach((value, index) => {

    const x = 40 + index * 115;
    const y = 260 - (value - 5500) / 900 * 210;

    if (index) {
      context.lineTo(x, y);
    } else {
      context.moveTo(x, y);
    }

  });

  context.stroke();

  context.fillStyle = '#777';
  context.font = '16px Vazirmatn';

  context.fillText(
    'نمودار نمونه و غیرواقعی',
    40,
    25
  );

}


// =========================================================
// FORMS
// =========================================================

function initForms() {

  // Form validation
  document.querySelectorAll(
    '#login-form, #register-form, #forgot-form, #contact-form, #profile-form'
  ).forEach(form => {

    form.addEventListener('submit', event => {

      event.preventDefault();

      if (!form.reportValidity()) return;

      let message =
        'اطلاعات فرم بررسی شد؛ این عملیات در نسخه نمایشی به سرور ارسال نمی‌شود.';

      if (form.id === 'register-form') {

        const data = new FormData(form);

        if (data.get('password') !== data.get('confirm')) {

          showMessage(
            form,
            'رمز عبور و تکرار آن یکسان نیستند.'
          );

          return;

        }

      }

      if (form.id === 'login-form') {

        message =
          'رابط ورود آماده است، اما احراز هویت واقعی هنوز پیاده‌سازی نشده است.';

      }

      if (form.id === 'forgot-form') {

        message =
          'درخواست شما بررسی شد؛ ارسال ایمیل بازیابی در نسخه نمایشی فعال نیست.';

      }

      showMessage(form, message);

    });

  });

  // Password visibility
  document.querySelectorAll('.password-toggle').forEach(button => {

    button.onclick = () => {

      const input = button.parentElement.querySelector('input');

      if (!input) return;

      input.type =
        input.type === 'password'
          ? 'text'
          : 'password';

      button.textContent =
        input.type === 'password'
          ? 'نمایش'
          : 'پنهان';

    };

  });

  // Newsletter
  $('#newsletter-form')?.addEventListener('submit', event => {

    event.preventDefault();

    toast(
      'فرم خبرنامه بررسی شد؛ سرویس ارسال هنوز متصل نیست.'
    );

    event.currentTarget.reset();

  });

  // Demo logout
  $('#demo-logout')?.addEventListener('click', () => {

    localStorage.removeItem('kian_demo_user');

    toast('از حالت نمایشی خارج شدید.');

  });

}


// =========================================================
// ADMIN PANEL
// =========================================================

function initAdmin() {

  if (!document.body.classList.contains('admin-page')) {
    return;
  }

  // -------------------------------------------------------
  // PRODUCTS MANAGEMENT
  // -------------------------------------------------------

  const productTable = $('#admin-products-table');

  if (productTable) {

    const drawProducts = () => {

      const search =
        ($('#admin-product-search')?.value || '')
          .trim()
          .toLowerCase();

      const filteredProducts = products.filter(product => {

        return product.name.toLowerCase().includes(search);

      });

      productTable.innerHTML = filteredProducts.length

        ? filteredProducts.map(product => `

            <tr>

              <td>${product.name}</td>

              <td>${product.category}</td>

              <td>${fa(product.karat)}</td>

              <td>${fa(product.weight)} گرم</td>

              <td>

                <button
                  type="button"
                  data-admin-delete="${product.id}"
                >
                  حذف نمایشی
                </button>

              </td>

            </tr>

          `).join('')

        : '<tr><td colspan="5">محصولی پیدا نشد.</td></tr>';

    };

    drawProducts();

    $('#admin-product-search')?.addEventListener(
      'input',
      drawProducts
    );

    $('#admin-add-product')?.addEventListener('click', () => {

      toast(
        'افزودن دائمی محصول پس از اتصال سیستم مدیریت فعال می‌شود.'
      );

    });

    productTable.addEventListener('click', event => {

      const button = event.target.closest('[data-admin-delete]');

      if (!button) return;

      toast('حذف محصولات در نسخه نمایشی فعال نیست.');

    });

  }

  // -------------------------------------------------------
  // ORDERS MANAGEMENT
  // -------------------------------------------------------

  const ordersTable = $('#admin-orders-table');

  if (ordersTable) {

    const orders = JSON.parse(
      localStorage.getItem('kian_demo_orders') || '[]'
    );

    ordersTable.innerHTML = orders.length

      ? orders.map(order => `

          <tr>

            <td>${order.id}</td>

            <td>${order.name}</td>

            <td>${money(order.total)}</td>

            <td>${order.status}</td>

          </tr>

        `).join('')

      : `
          <tr>
            <td colspan="4">
              هنوز سفارشی ثبت نشده است.
            </td>
          </tr>
        `;

  }

  // -------------------------------------------------------
  // GOLD PRICE MANAGEMENT
  // -------------------------------------------------------

  const goldForm = $('#admin-gold-form');

  if (goldForm) {

    const gramInput = goldForm.elements.gram24;
    const sourceInput = goldForm.elements.source;

    // Load current settings
    if (gramInput) {
      gramInput.value = gold.gram24;
    }

    if (sourceInput) {
      sourceInput.value = gold.source || 'داده نمایشی مدیر';
    }

    // Save settings
    goldForm.addEventListener('submit', event => {

      event.preventDefault();

      const gram24 = Number(gramInput?.value);
      const source = sourceInput?.value.trim();

      if (!Number.isFinite(gram24) || gram24 <= 0) {

        toast(
          'قیمت هر گرم طلا باید عددی معتبر و بزرگ‌تر از صفر باشد.'
        );

        return;

      }

      if (!source) {

        toast('لطفاً منبع داده را وارد کنید.');

        return;

      }

      const updatedGold = {

        currency: 'IRT',

        currencyLabel: 'تومان',

        gram24,

        ounce24: Math.round(gram24 * 31.1035),

        source,

        isDemo: true,

        isStale: false,

        lastUpdated: 'آخرین ویرایش نمایشی مدیر',

        changePercent: gold.changePercent || 0

      };

      try {

        localStorage.setItem(
          'kian_admin_gold',
          JSON.stringify(updatedGold)
        );

        // Update current application data
        gold = {
          ...gold,
          ...updatedGold
        };

        toast(
          'نرخ نمایشی طلا با موفقیت ذخیره شد. برای اعمال در همه بخش‌ها صفحه را تازه‌سازی کنید.'
        );

      } catch (error) {

        console.error('Gold price save error:', error);

        toast('ذخیره تنظیمات ناموفق بود.');

      }

    });

  }

}


// =========================================================
// GLOBAL INITIALIZATION
// =========================================================

function initGlobal() {

  // Header and footer
  renderHeader();

  renderFooter();

  // Global components
  // Gold ticker is initialized later, after gold data loads.
  initAssistant();

  refreshCounts();

  // Back to top
  $('#back-top')?.addEventListener('click', () => {

    scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

  const top = $('.back-top');

  window.addEventListener('scroll', () => {

    top?.classList.toggle('show', scrollY > 400);

  });

  top?.addEventListener('click', () => {

    scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

  // Hide preloader
  setTimeout(() => {

    document.querySelector('.preloader')?.classList.add('done');

  }, 500);

}


// =========================================================
// MAIN APPLICATION
// =========================================================

async function main() {

  // Initialize shared components
  initGlobal();

  // Load products and gold prices
  try {

    [products, gold] = await Promise.all([

      getProducts(),

      getGoldPrices()

    ]);

    // Read browser-only demo override safely
    let override = null;

    try {

      override = JSON.parse(
        localStorage.getItem('kian_admin_gold') || 'null'
      );

    } catch (error) {

      console.warn('Invalid saved gold override:', error);

      localStorage.removeItem('kian_admin_gold');

    }

    // Apply manual override ONLY when market API is unavailable
    if (gold.isDemo && override) {

      const overridePrice = Number(override.gram24);

      if (Number.isFinite(overridePrice) && overridePrice > 0) {

        gold = {

          ...gold,

          ...override,

          gram24: overridePrice,

          isDemo: true,

          isStale: false

        };

      }

    } else if (!gold.isDemo && override) {

      // Live market data always has priority
      localStorage.removeItem('kian_admin_gold');

    }

  } catch (error) {

    console.error('Application loading error:', error);

    toast(
      'بارگذاری داده‌ها ناموفق بود. لطفاً سایت را با وب‌سرور محلی اجرا کنید.'
    );

    return;

  }

  // Initialize gold ticker only after gold data is loaded
  renderTicker();

  // Detect current page
  const page = document.body.dataset.page;

  // Initialize page-specific features
  if (page === 'home') {
    initHome();
  }

  if (page === 'shop') {
    initShop();
  }

  if (page === 'product') {
    initProduct();
  }

  if (page === 'wishlist') {
    initWishlist();
  }

  if (page === 'cart') {
    initCart();
  }

  if (page === 'checkout') {
    initCheckout();
  }

  if (page === 'gold') {
    initGold();
  }

  // Initialize shared page features
  initForms();

  initAdmin();

  bindProductActions();

  refreshCounts();

}


// =========================================================
// START APPLICATION
// =========================================================

main();
