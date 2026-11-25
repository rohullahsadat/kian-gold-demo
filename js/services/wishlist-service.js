
const KEY='kian_wishlist_v2';const read=()=>JSON.parse(localStorage.getItem(KEY)||'[]');const write=x=>localStorage.setItem(KEY,JSON.stringify(x));
export const Wishlist={all:read,toggle(id){let a=read();a=a.includes(id)?a.filter(x=>x!==id):[...a,id];write(a);return a.includes(id)},remove(id){write(read().filter(x=>x!==id))},has(id){return read().includes(id)}};
