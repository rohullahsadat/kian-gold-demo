# برنامه مهاجرت به Django

## قالب‌ها
- اسکلت مشترک صفحات را به `templates/base.html` منتقل کنید.
- سربرگ، پاورقی، کارت محصول، پیام‌ها و فرم‌ها را به `templates/partials/` تبدیل کنید.
- صفحات HTML مستقل به templateهای متناظر تبدیل شوند و مسیرهای URL در هر اپ تعریف شوند.

## اپلیکیشن‌های پیشنهادی
`core`, `accounts`, `products`, `orders`, `pricing`, `payments`, `wishlist`, `assistant`, `content`, `notifications`.

## مدل‌ها
Product، Category، ProductImage، Inventory، GoldPriceSnapshot، PricingRule، Cart، CartItem، Order، OrderItem، Address، WishlistItem و PaymentTransaction.

## الزامات امنیتی
تمام قیمت نهایی و موجودی در سرور محاسبه و اعتبارسنجی شوند. از Django authentication، password hashing، CSRF، permissionها، HTTPS، متغیرهای محیطی و تأیید سمت سرور تراکنش پرداخت استفاده کنید. هرگز به قیمت، مبلغ یا شناسه ارسالی مرورگر اعتماد نکنید. پنل ادمین فعلی فقط نمونه UI است.
