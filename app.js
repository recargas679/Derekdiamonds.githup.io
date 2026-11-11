var MI_WHATSAPP = "+5358080234";
var filtroPedidos = 'todos';
var toastTimer = null;
function toast(m){
  var t = document.getElementById('toast'); if(!t) return;
  t.textContent = m; t.style.display = 'block';
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.style.display = 'none'; }, 2200);
}
function abrirWhats(){ window.open('https://wa.me/' + MI_WHATSAPP + '?text=' + encodeURIComponent('Hola DEREK DIAMONDS 💎, quiero recargar'), '_blank'); }
function abrirPanelAdmin(){
  var el = document.getElementById('panel-admin'); if(!el) return;
  var pass = prompt("🔑 Contraseña de Admin:");
  if(pass !== "derek123"){ alert("❌ Contraseña incorrecta"); return; }
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
  if(el.style.display === 'block'){ cargarAPIEnForm(); renderCreditos(); renderPedidos(); el.scrollIntoView({ behavior: 'smooth' }); }
}
function cargarAPIEnForm(){
  if(!DB.api) return;
  document.getElementById('apiProveedor').value = DB.api.proveedor || 'manual';
  document.getElementById('apiKey').value = DB.api.key || '';
  document.getElementById('apiUid').value = DB.api.uid || '';
  document.getElementById('apiSaldo').value = DB.api.saldo || 0;
  document.getElementById('apiEstado').textContent = "✅ API guardada: " + DB.api.proveedor + " | Saldo: " + (DB.api.saldo || 0) + " USDT";
}
function guardarAPI(){
  var proveedor = document.getElementById('apiProveedor').value;
  var key = document.getElementById('apiKey').value.trim();
  var uid = document.getElementById('apiUid').value.trim();
  var saldo = parseFloat(document.getElementById('apiSaldo').value) || 0;
  DB.api = { proveedor: proveedor, key: key, uid: uid, saldo: saldo, fecha: new Date().toLocaleString('es-CU') };
  guardarDB(DB);
  document.getElementById('apiEstado').textContent = "✅ API guardada: " + proveedor + " | Saldo: " + saldo + " USDT";
  toast("✅ API guardada");
}
function darCreditos(){
  var wa = document.getElementById('credWa').value.trim();
  var monto = parseInt(document.getElementById('credMonto').value) || 0;
  if(!wa || monto <= 0){ alert("Pon WhatsApp y monto válido"); return; }
  var existe = null;
  for(var i=0;i<DB.creditos.length;i++){ if(DB.creditos[i].wa === wa){ existe = DB.creditos[i]; break; } }
  if(existe){ existe.monto += monto; } else { DB.creditos.push({ wa: wa, monto: monto, fecha: new Date().toLocaleString('es-CU') }); }
  guardarDB(DB);
  document.getElementById('credWa').value = ""; document.getElementById('credMonto').value = "";
  renderCreditos(); toast("✅ +" + monto + " créditos a " + wa);
}
function renderCreditos(){
  var el = document.getElementById('listaCreditos'); if(!el) return;
  if(DB.creditos.length === 0){ el.innerHTML = "<p class='note'>Sin créditos dados todavía.</p>"; return; }
  var html = "";
  DB.creditos.forEach(function(c){ html += "<div class='pedido'>💬 " + c.wa + "<br>💰 <b style='color:#00e5c8'>" + c.monto + " créditos</b><br><small>" + c.fecha + "</small></div>"; });
  el.innerHTML = html;
}
function filtrarPedidos(filtro, btn){
  filtroPedidos = filtro;
  document.querySelectorAll('.pill').forEach(function(p){ p.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  renderPedidos();
}
function renderPedidos(){
  var el = document.getElementById('listaPedidos'); if(!el) return;
  var lista = DB.pedidos;
  if(filtroPedidos !== 'todos'){ lista = lista.filter(function(p){ return p.estado === filtroPedidos; }); }
  if(lista.length === 0){ el.innerHTML = "<p class='note'>No hay pedidos en este filtro.</p>"; return; }
  var html = "";
  lista.forEach(function(p){
    var color = p.estado === 'entregado' ? '#00e5c8' : p.estado === 'verificando' ? '#ffcc00' : '#ff4444';
    html += "<div class='pedido'><b>" + p.id + "</b> - <b style='color:" + color + "'>" + p.estado.toUpperCase() + "</b><br>🎮 " + p.juego + " - " + p.oferta + "<br>🆔 ID: " + p.playerId + "<br>💬 WA: " + p.wa + " - " + (p.nombre || '') + "<br>💰 " + p.pago + " - " + p.total + "<br><small>" + p.fecha + "</small><br><div style='margin-top:8px;display:flex;gap:6px'><button class='btn-small' onclick=\"marcarEntregado('" + p.id + "')\">✅ Entregado</button><button class='btn-small' style='background:#ff4444;color:white' onclick=\"marcarRechazado('" + p.id + "')\">❌ Rechazar</button><button class='btn-small ghost' onclick=\"abrirWhatsCliente('" + p.wa + "','" + p.id + "')\">💬 WhatsApp</button></div></div>";
  });
  el.innerHTML = html;
}
function marcarEntregado(id){ cambiarEstadoPedido(id, 'entregado'); renderPedidos(); toast("✅ Pedido " + id + " entregado"); }
function marcarRechazado(id){ cambiarEstadoPedido(id, 'rechazado'); renderPedidos(); toast("Pedido rechazado"); }
function abrirWhatsCliente(wa, id){ window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent('Hola, soy Derek Diamonds. Tu pedido ' + id + ' está en proceso.'), '_blank'); }
function exportarDB(){
  var data = JSON.stringify(DB, null, 2);
  var blob = new Blob([data], { type: 'application/json' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'derek-diamonds-db.json'; a.click();
  toast("📥 Base de datos exportada");
}
function borrarDB(){
  if(!confirm("¿Borrar TODOS los pedidos y créditos? Esto no se puede deshacer.")) return;
  DB = { pedidos: [], creditos: [], api: null }; guardarDB(DB); renderCreditos(); renderPedidos(); toast("🗑️ Base de datos borrada");
}