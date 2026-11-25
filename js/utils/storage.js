export const storage = {
  /**
   * دریافت مقدار از localStorage
   * @param {string} k - کلید مورد نظر
   * @param {any} fallback - مقدار پیش‌فرض در صورت نبود کلید یا خطا
   */
  get(k, fallback = null) {
    try {
      const item = localStorage.getItem(k);
      return item !== null ? JSON.parse(item) : fallback;
    } catch (error) {
      return fallback;
    }
  },

  /**
   * ذخیره مقدار در localStorage به صورت JSON
   * @param {string} k - کلید
   * @param {any} v - مقداری که می‌خواهید ذخیره کنید
   */
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  }
};
