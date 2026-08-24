const STORAGE_KEY='leden-products-v1';
const starterProducts=[
 {id:'posho',name:'Posho',price:3000,description:'Fresh maize flour portion for an everyday meal.',emoji:'🌽'},
 {id:'nakati',name:'Nakati',price:2500,description:'Fresh local leafy greens, ready for your kitchen.',emoji:'🥬'},
 {id:'kalo',name:'Kalo',price:5000,description:'Traditional millet meal, simple and filling.',emoji:'🟤'},
 {id:'gum',name:'Chewing Gum',price:1000,description:'A small everyday treat for home or on the go.',emoji:'🍬'}
];
const list=document.getElementById('ownerProducts'),statusEl=document.getElementById('status');
function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function load(){try{const p=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(p)&&p.length?p:starterProducts}catch{return starterProducts}}
function save(p){localStorage.setItem(STORAGE_KEY,JSON.stringify(p));render();}
function money(n){return `UGX ${Number(n).toLocaleString('en-UG')}`}
function render(){const products=load();list.innerHTML=products.map(p=>`<div class="owner-product"><div class="owner-thumb">${p.image?`<img src="${p.image}" alt="">`:`<span>${p.emoji||'🛍️'}</span>`}</div><div><strong>${escapeHtml(p.name)}</strong><small>${money(p.price)} · ${escapeHtml(p.description||'No description')}</small></div><button class="danger-button" data-remove="${escapeHtml(p.id)}">Remove</button></div>`).join('');list.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>removeProduct(b.dataset.remove))}
function removeProduct(id){const next=load().filter(p=>p.id!==id);localStorage.setItem(STORAGE_KEY,JSON.stringify(next));statusEl.textContent='Product removed from this demo device.';render()}
function readImage(file){return new Promise((resolve,reject)=>{if(!file)return resolve('');if(file.size>1500000)return reject(new Error('Please use an image smaller than 1.5 MB for this prototype.'));const reader=new FileReader();reader.onerror=()=>reject(new Error('Could not read image.'));reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)})}
document.getElementById('productForm').addEventListener('submit',async e=>{e.preventDefault();statusEl.textContent='';try{const name=document.getElementById('productName').value.trim(),price=Number(document.getElementById('productPrice').value),description=document.getElementById('productDescription').value.trim(),file=document.getElementById('productImage').files[0];if(!name||!Number.isFinite(price)||price<0)throw new Error('Enter a valid product name and price.');const image=await readImage(file);const product={id:`p-${Date.now()}`,name,price,description,image,emoji:'🛍️'};save([product,...load()]);e.target.reset();statusEl.textContent='Product added. Open the shop to see it.'}catch(err){statusEl.textContent=err.message}});
document.getElementById('resetStarter').onclick=()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(starterProducts));statusEl.textContent='Starter products restored.';render()};render();