const REPO='Pmcosmetics/Pm';
const CSV_URL='../../orders.csv';
const EDIT_URL='https://github.com/Pmcosmetics/Pm/edit/main/orders.csv';
let allOrders=[];

function parseCSV(text){
  const rows=[]; let row=[]; let cell=''; let quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(c==='"' && quoted && n==='"'){cell+='"';i++;continue;}
    if(c==='"'){quoted=!quoted;continue;}
    if(c===',' && !quoted){row.push(cell);cell='';continue;}
    if((c==='\n'||c==='\r') && !quoted){if(c==='\r'&&n==='\n')i++;row.push(cell);cell='';if(row.some(v=>v!==''))rows.push(row);row=[];continue;}
    cell+=c;
  }
  if(cell!==''||row.length){row.push(cell);if(row.some(v=>v!==''))rows.push(row);}
  if(!rows.length)return [];
  const headers=rows.shift().map(x=>x.trim());
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])));
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function waLink(o){
  const phone=(o.phone||'').replace(/\D/g,'');
  const text=`طلب ${o.order_id||''} — ${o.product_name||''} × ${o.quantity||1}`;
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
}
function issueLink(o,status='shipped'){
  const title=encodeURIComponent(`${status} ${o.order_id||'order'}`);
  const body=encodeURIComponent(`Order ID: ${o.order_id||''}\nCurrent status: ${o.status||''}\nRequested status: ${status}\nProduct: ${o.product_id||''} ${o.product_name||''}\n\nAdd courier/tracking and update orders.csv.`);
  return `https://github.com/${REPO}/issues/new?title=${title}&body=${body}`;
}
function render(){
  const q=document.getElementById('search').value.toLowerCase(); const st=document.getElementById('status').value;
  const rows=allOrders.filter(o=>{const hay=Object.values(o).join(' ').toLowerCase();return (!q||hay.includes(q))&&(!st||o.status===st)});
  document.getElementById('summary').textContent=`${rows.length} طلب معروض · ${allOrders.length} إجمالي`;
  const body=document.getElementById('orders');
  if(!rows.length){body.innerHTML='<tr><td colspan="7">لا توجد نتائج.</td></tr>';return;}
  body.innerHTML=rows.map(o=>`<tr><td><strong>${esc(o.order_id)}</strong></td><td>${esc(o.date)}<br><small>${esc(o.time)}</small></td><td>${esc(o.product_id)}<br>${esc(o.product_name)}</td><td>${esc(o.quantity)}</td><td>${esc(o.price_pm)} ${esc(o.currency)}</td><td><span class="status ${esc(o.status)}">${esc(o.status)}</span></td><td class="actions"><a class="btn" href="${waLink(o)}" target="_blank" rel="noopener">واتساب</a><a class="btn secondary" href="${issueLink(o,'shipped')}" target="_blank" rel="noopener">Mark Shipped</a></td></tr>`).join('');
}
async function load(){
  document.getElementById('error').textContent='';
  try{const r=await fetch(`${CSV_URL}?v=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);allOrders=parseCSV(await r.text());render();}
  catch(e){document.getElementById('orders').innerHTML='<tr><td colspan="7">تعذر تحميل orders.csv.</td></tr>';document.getElementById('error').textContent='تأكد أن الملف موجود على main وأن GitHub Pages تعمل.';}
}
document.getElementById('editCsv').href=EDIT_URL;
document.getElementById('download').href=CSV_URL;document.getElementById('download').download='orders.csv';
document.getElementById('search').addEventListener('input',render);document.getElementById('status').addEventListener('change',render);document.getElementById('reload').addEventListener('click',load);load();