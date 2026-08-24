const WHATSAPP_NUMBER='256701461648';
const STORAGE_KEY='leden-products-v1';
const CART_KEY='leden-cart-v1';
const starterProducts=[
 {id:'posho',name:'Posho',price:3000,description:'Fresh maize flour portion for an everyday meal.',emoji:'🌽'},
 {id:'nakati',name:'Nakati',price:2500,description:'Fresh local leafy greens, ready for your kitchen.',emoji:'🥬'},
 {id:'kalo',name:'Kalo',price:5000,description:'Traditional millet meal, simple and filling.',emoji:'🟤'},
 {id:'gum',name:'Chewing Gum',price:1000,description:'A small everyday treat for home or on the go.',emoji:'🍬'}
];
function loadProducts(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(saved)&&saved.length?saved:starterProducts}catch{return starterProducts}}
function loadCart(){try{return JSON.parse(localStorage.getItem(CART_KEY))||{}}catch{return {}}}
let products=loadProducts();let cart=loadCart();
const grid=document.getElementById('productGrid'),countEl=document.getElementById('cartCount'),drawer=document.getElementById('cartDrawer'),backdrop=document.getElementById('backdrop');
const money=n=>`UGX ${Number(n).toLocaleString('en-UG')}`;
function art(p){return p.image?`<img src="${p.image}" alt="${escapeHtml(p.name)}">`:`<span>${p.emoji||'🛍️'}</span>`}
function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function renderProducts(){products=loadProducts();grid.innerHTML=products.map(p=>`<article class="product-card"><div class="product-art">${art(p)}</div><div class="product-info"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||'Available from LeDen.')}</p><span class="price">${money(p.price)}</span><button class="add-button" data-add="${escapeHtml(p.id)}">Add to order</button></div></article>`).join('');grid.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>add(b.dataset.add)))}
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart));updateCount()}
function add(id){cart[id]=(cart[id]||0)+1;saveCart();openCart()}
function updateCount(){countEl.textContent=Object.values(cart).reduce((a,b)=>a+b,0)}
function cartRows(){return Object.entries(cart).map(([id,qty])=>{const p=products.find(x=>x.id===id);return p?{p,qty}:null}).filter(Boolean)}
function renderCart(){products=loadProducts();const rows=cartRows(),wrap=document.getElementById('cartItems');if(!rows.length){wrap.innerHTML='<p>Your order is empty. Add a product to begin.</p>'}else{wrap.innerHTML=rows.map(({p,qty})=>`<div class="cart-row"><div><strong>${escapeHtml(p.name)}</strong><p>${money(p.price)} each</p></div><div class="qty"><button data-dec="${p.id}">−</button><b>${qty}</b><button data-inc="${p.id}">+</button></div></div>`).join('');wrap.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>change(b.dataset.inc,1));wrap.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>change(b.dataset.dec,-1))}document.getElementById('cartTotal').textContent=money(rows.reduce((s,{p,qty})=>s+p.price*qty,0))}
function change(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);if(!cart[id])delete cart[id];saveCart();renderCart()}
function openCart(){renderCart();drawer.classList.add('open');backdrop.classList.add('open');drawer.setAttribute('aria-hidden','false')}
function closeCart(){drawer.classList.remove('open');backdrop.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
function sendOrder(){const rows=cartRows();if(!rows.length){alert('Add at least one product first.');return}const name=document.getElementById('customerName').value.trim(),area=document.getElementById('customerArea').value.trim();const total=rows.reduce((s,{p,qty})=>s+p.price*qty,0);const lines=['Hello LeDen, I would like to order:',...rows.map(({p,qty})=>`• ${p.name} x${qty} — ${money(p.price*qty)}`),'',`Estimated total: ${money(total)}`,name?`Name: ${name}`:'',area?`Delivery area: ${area}`:'','Please confirm availability and delivery.'].filter(Boolean);window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener,noreferrer')}
document.getElementById('cartButton').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;backdrop.onclick=closeCart;document.getElementById('sendWhatsApp').onclick=sendOrder;window.addEventListener('storage',()=>{renderProducts();renderCart()});renderProducts();updateCount();