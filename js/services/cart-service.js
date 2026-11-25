
const KEY='kian_cart_v2';const read=()=>JSON.parse(localStorage.getItem(KEY)||'[]');const write=x=>localStorage.setItem(KEY,JSON.stringify(x));
export const Cart={all:read,add(id){let a=read(),i=a.find(x=>x.id===id);i?i.qty++:a.push({id,qty:1});write(a)},remove(id){write(read().filter(x=>x.id!==id))},qty(id,n){let a=read().map(x=>x.id===id?{...x,qty:Math.max(1,n)}:x);write(a)},clear(){write([])},count(){return read().reduce((s,x)=>s+x.qty,0)}};
