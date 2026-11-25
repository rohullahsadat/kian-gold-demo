
export async function getProducts(){const r=await fetch(new URL('../../data/products.json',import.meta.url));if(!r.ok)throw new Error('دریافت محصولات ناموفق بود');return r.json()}
