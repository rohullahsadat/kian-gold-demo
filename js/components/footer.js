
export function renderFooter() {
    const el = document.querySelector('[data-footer]');
    if (!el) return;

    el.innerHTML = `
        <footer class="footer">
            <div class="container">

                <div class="footer-grid">

                    <!-- Brand -->
                    <div class="footer-brand">
                        <a class="brand" href="index.html">
                            <img
                                src="assets/images/logo5.jpg"
                                alt="لوگوی کیان درّالتاج"
                                class="brand-logo"
                            >
                            <span>
                                <b>کیان درّالتاج</b>
                                <small>KIAN GOLD</small>
                            </span>
                        </a>

                        <p>
                            STAY GOLD — ظرافتی ماندگار، هنر ساخت استثنایی.
                        </p>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h3>دسترسی سریع</h3>
                        <div class="footer-links">
                            <a href="shop.html">فروشگاه</a>
                            <a href="collections.html">مجموعه‌ها</a>
                            <a href="about.html">درباره ما</a>
                            <a href="faq.html">پرسش‌های متداول</a>
                        </div>
                    </div>

                    <!-- Customer Services -->
                    <div>
                        <h3>خدمات مشتریان</h3>
                        <div class="footer-links">
                            <a href="account.html">حساب کاربری</a>
                            <a href="gold-prices.html">قیمت طلا</a>
                            <a href="contact.html">تماس با ما</a>
                            <a href="cart.html">سبد خرید</a>
                        </div>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h3>ارتباط با ما</h3>

                        <div class="footer-links">
                            <a href="tel:+989123995125">
                                ۰۹۱۲۳۹۹۵۱۲۵
                            </a>

                            <a href="mailto:kiandorteh@gmail.com">
                                ایمیل فروشگاه
                            </a>
                        </div>

                        <div class="footer-socials">

                            <a
                                href="https://wa.me/989123995125"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="واتساپ KIAN GOLD"
                                title="واتساپ"
                                class="social-link whatsapp"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.5 23.5l6-1.6A11.8 11.8 0 0 0 20.5 3.5ZM12 21a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.5.9.9-3.4-.2-.4A9.8 9.8 0 1 1 12 21Zm5.4-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.8 5 .8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z"/>
                                </svg>
                            </a>

                            <a
                                href="https://b2n.ir/dh5403"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="تلگرام KIAN GOLD"
                                title="تلگرام"
                                class="social-link telegram"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M22 2 2.8 9.4c-1.3.5-1.3 1.2-.2 1.5l4.9 1.5 1.9 5.9c.2.7.1 1 .8 1 .5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.5.3 1.7-.8L23 3.5c.3-1.4-.5-2-1-1.5ZM8.3 12.1l10.9-6.9c.5-.3.9-.1.5.2l-9 8.2-.3 3.4-2.1-4.9Z"/>
                                </svg>
                            </a>

                            <a
                                href="https://www.instagram.com/dorratoltaj_gallery/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="اینستاگرام KIAN GOLD"
                                title="اینستاگرام"
                                class="social-link instagram"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/>
                                </svg>
                            </a>

                        </div>
                    </div>

                    <!-- Newsletter -->
                    <div>
                        <h3>خبرنامه کیان</h3>
                        <p>
                            برای دریافت خبر مجموعه‌های تازه عضو شوید.
                        </p>

                        <form class="newsletter" id="newsletter-form">
                            <input
                                type="email"
                                placeholder="ایمیل شما"
                                required
                                aria-label="ایمیل"
                            >
                            <button class="btn btn-gold" type="submit">
                                عضویت
                            </button>
                        </form>
                    </div>

                </div>

                <!-- Footer Bottom -->
                <div class="footer-bottom">

                    <p class="footer-copyright">
                        © کیان درّالتاج — تمامی حقوق محفوظ است.
                        نسخه نمایشی فروشگاه.
                    </p>

                    <div class="footer-credit">
                        <span>Developer</span>
                        <strong>Rohullah Sadat</strong>
                    </div>

                </div>

            </div>
        </footer>
    `;
}
