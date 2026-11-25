export function renderHeader() {
  const el = document.querySelector('[data-header]');

  // اگر المان هدف در صفحه یافت نشد، تابع متوقف شود
  if (!el) return;

  // تزریق ساختار HTML به هدر
  el.innerHTML = `
    <header class="site-header">
      <div class="container header-main">
        
        <!-- لوگو و برند -->
        <a class="brand" href="index.html">
          <img
  src="assets/images/logo5.jpg"
  alt="لوگوی کیان درّالتاج"
  class="brand-logo"
>
          <span>
            <b>کیان درّالتاج</b>
            <small>KIAN GOLD · STAY GOLD</small>
          </span>
        </a>

        <!-- دکمه موبایل -->
        <button class="menu-toggle" aria-label="باز کردن منو">☰</button>

        <!-- منوی اصلی ناوبری -->
        <nav class="main-nav">
          <a href="index.html">خانه</a>
          <a href="shop.html">فروشگاه</a>
          <a href="category.html">دسته‌بندی‌ها</a>
          <a href="collections.html">مجموعه‌ها</a>
          <a href="gold-prices.html">قیمت طلا</a>
          <a href="about.html">درباره ما</a>
          <a href="contact.html">تماس</a>
        </nav>

        <!-- بخش عملیات کاربر (ورود، علاقه‌مندی‌ها و سبد خرید) -->
        <div class="header-actions">
          <a href="login.html" class="optional">ورود</a>
          <a href="wishlist.html">
            ♡ <span class="count" id="wish-count">۰</span>
          </a>
          <a href="cart.html">
            سبد <span class="count" id="cart-count">۰</span>
          </a>
        </div>

      </div>
    </header>
  `;

  // مدیریت باز و بسته شدن منو در حالت موبایل
  const menuToggle = el.querySelector('.menu-toggle');
  const mainNav = el.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }
}
