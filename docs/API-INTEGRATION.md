# نقاط اتصال API
- `GET /api/products/` فهرست و فیلتر محصولات
- `GET /api/products/{slug}/` جزئیات محصول
- `GET /api/pricing/gold/` آخرین نرخ معتبر همراه منبع و زمان
- `POST /api/cart/` همگام‌سازی سبد سمت سرور
- `POST /api/orders/` ایجاد سفارش با محاسبه مجدد سمت سرور
- `POST /api/payments/initialize/` ایجاد پرداخت و callback تأییدشده
- `POST /api/assistant/chat/` ارتباط امن با مدل هوش مصنوعی
تمام کلیدهای API باید فقط در سرور نگهداری شوند.
