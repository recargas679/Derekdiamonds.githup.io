var MI_WHATSAPP = "+5358080234";
var sesion = null;
var juegoSel = null;
var pagoSel = null;
var ofertaSel = null;
var DATOS_PAGO = {
  "USDT": "🪙 USDT BEP20\nDirección: 0x389F24959A590de3119870230229A957Fb218914\nRed: BSC BEP20\nA nombre de: Derek",
  "SALDO": "💰 SALDO MÓVIL\nNúmero: +5358080234\nA nombre de: Derek",
  "TRANSFERENCIA": "💳 TRANSFERENCIA CUP\nTarjeta: 9238129971775798\nBanco: BPA / Metropolitano\nA nombre de: Derek"
};
var OFERTAS = {
  "freefire": [
    { nombre: "100+10 Diamantes", usdt: 0.78, saldo: 270, cup: 890 },
    { nombre: "310+31 Diamantes", usdt: 2.38, saldo: 810, cup: 2660 },
    { nombre: "520+52 Diamantes", usdt: 3.99, saldo: 1370, cup: 4505 },
    { nombre: "1060+106 Diamantes", usdt: 7.42, saldo: 2535, cup: 8355 },
    { nombre: "2180+219 Diamantes", usdt: 14.71, saldo: 5030, cup: 16570 },
    { nombre: "5200+960 Diamantes", usdt: 37.14, saldo: 10800, cup: 42180 }
  ],
  "bloodstrike": [
    { nombre: "100 Oro", usdt: 1.5, saldo: 390, cup: 1000 },
    { nombre: "310 Oro", usdt: 3, saldo: 1000, cup: 3000 },
    { nombre: "520 Oro", usdt: 5, saldo: 1900, cup: 5000 },
    { nombre: "1060 Oro", usdt: 10, saldo: 3780, cup: 10000 },
    { nombre: "2180 Oro", usdt: 20, saldo: 8098, cup: 20000 }
  ]
};
function toast(m){ var t=document.getElementById('toast'); if(!t) return; t.textContent=m; t.style.display='block'; setTimeout(function(){ t.style.display='none'; },2200); }
function abrirWhats(){ window.open('https://wa.me/' + MI_WHATSAPP + '?text=' + encodeURIComponent('Hola DEREK DIAMONDS 💎, quiero recargar'), '_blank'); }
function mostrar(id){ ['paso-login','paso-juegos','paso-pago','paso-ofertas','paso-confirmar'].forEach(function(p){ document.getElementById(p).classList.add('hidden'); }); document.getElementById(id).classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'}); }
function cerrarSesion(){ localStorage.removeItem('derek_sesion'); location.href='index.html'; }
function iniciarSesion(){
  var wa=document.getElementById('loginWa').value.trim();
  var nombre=document.getElementById('loginNombre').value.trim() || "Cliente";
  if(!wa || wa.length < 8){ alert("❌ Pon tu WhatsApp correcto, ej: 5359661708"); return; }
  sesion={wa:wa,nombre:nombre}; localStorage.setItem('derek_sesion', JSON.stringify(sesion));
  document.getElementById('nombreUser').textContent=nombre; actualizarCreditos(); mostrar('paso-juegos'); toast("✅ Bienvenido "+nombre);
}
function actualizarCreditos(){
  if(!sesion) return; var c=0;
  for(var i=0;i<DB.creditos.length;i++){ if(DB.creditos[i].wa===sesion.wa){ c=DB.creditos[i].monto; break; } }
  document.getElementById('misCreditos').textContent=c+" créditos";
}
function elegirJuego(juego){
  juegoSel=juego;
  document.getElementById('btn-ff').classList.remove('sel'); document.getElementById('btn-bs').classList.remove('sel');
  document.getElementById(juego==='freefire'?'btn-ff':'btn-bs').classList.add('sel');
  document.getElementById('juegoSelTxt').textContent=juego==='freefire'?'Free Fire':'Blood Strike';
  pagoSel=null; ofertaSel=null;
  document.querySelectorAll('.pago').forEach(function(p){ p.classList.remove('sel'); });
  document.getElementById('payboxDetalle').style.display='none'; document.getElementById('btnIrOfertas').disabled=true;
  mostrar('paso-pago');
}
function volverA(donde){ if(donde==='juegos') mostrar('paso-juegos'); if(donde==='pago') mostrar('paso-pago'); if(donde==='ofertas') mostrar('paso-ofertas'); }
function elegirPago(pago){
  pagoSel=pago;
  document.querySelectorAll('.pago').forEach(function(p){ p.classList.remove('sel'); });
  document.getElementById('pago-'+pago).classList.add('sel');
  document.getElementById('payboxDetalle').style.display='block';
  document.getElementById('payText').innerText=DATOS_PAGO[pago];
  document.getElementById('btnIrOfertas').disabled=false;
}
function copiarPago(){ var txt=document.getElementById('payText').innerText; navigator.clipboard.writeText(txt).then(function(){ toast("📋 Copiado"); }); }
function irOfertas(){
  if(!pagoSel){ alert("Elige un método de pago"); return; }
  document.getElementById('ofertaJuegoTxt').textContent=juegoSel==='freefire'?'Free Fire':'Blood Strike';
  document.getElementById('ofertaPagoTxt').textContent=pagoSel;
  var lista=OFERTAS[juegoSel]; var html="";
  lista.forEach(function(o,idx){
    var precioTxt=pagoSel==='USDT'?o.usdt+" USDT":pagoSel==='SALDO'?o.saldo+" Saldo":o.cup+" CUP";
    html+="<button type='button' class='offer' onclick='elegirOferta("+idx+", this)'><b>"+o.nombre+"</b><span>"+precioTxt+"</span><small>Entrega 5-15 min</small></button>";
  });
  document.getElementById('listaOfertas').innerHTML=html; ofertaSel=null; document.getElementById('btnIrConfirmar').disabled=true; mostrar('paso-ofertas');
}
function elegirOferta(idx,btn){ ofertaSel=OFERTAS[juegoSel][idx]; document.querySelectorAll('.offer').forEach(function(o){ o.classList.remove('sel'); }); btn.classList.add('sel'); document.getElementById('btnIrConfirmar').disabled=false; }
function irConfirmar(){
  if(!ofertaSel){ alert("Elige una oferta"); return; }
  var precioTxt=pagoSel==='USDT'?ofertaSel.usdt+" USDT":pagoSel==='SALDO'?ofertaSel.saldo+" Saldo":ofertaSel.cup+" CUP";
  document.getElementById('resumenPedido').innerHTML="<b>🎮 Juego:</b> "+(juegoSel==='freefire'?'Free Fire':'Blood Strike')+"<br><b>💎 Oferta:</b> "+ofertaSel.nombre+"<br><b>💰 Pago:</b> "+pagoSel+"<br><b>👤 Cliente:</b> "+sesion.nombre+" ("+sesion.wa+")<br><b>📦 Datos de pago:</b><br><span style='font-size:12px'>"+DATOS_PAGO[pagoSel].replace(/\n/g,'<br>')+"</span>";
  document.getElementById('totalTxt').textContent=precioTxt; mostrar('paso-confirmar');
}
document.getElementById('compInput').addEventListener('change', function(e){
  var file=e.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(ev){ var img=document.getElementById('preview'); img.src=ev.target.result; img.style.display='block'; };
  reader.readAsDataURL(file);
});
function iniciarVerificacion(){
  var playerId=document.getElementById('playerId').value.trim();
  var comp=document.getElementById('compInput').files[0];
  if(!playerId){ alert("❌ Pon tu ID del juego"); return; }
  if(!comp){ alert("❌ Sube tu comprobante de pago"); return; }
  if(!sesion){ alert("Inicia sesión de nuevo"); mostrar('paso-login'); return; }
  var modal=document.getElementById('modalVerif'); modal.classList.add('show');
  var bar=document.getElementById('verifBar'); var titulo=document.getElementById('verifTitulo'); var texto=document.getElementById('verifTexto'); var detalle=document.getElementById('verifDetalle');
  var pasos=[{p:20,t:"Verificando pago...",d:"Revisando comprobante..."},{p:50,t:"Pago detectado ✓",d:"Confirmando con Derek..."},{p:80,t:"Creando pedido...",d:"Guardando en base de datos..."},{p:100,t:"✅ Pedido creado",d:"Te avisamos por WhatsApp cuando esté entregado"}];
  var i=0; bar.style.width="0%"; titulo.textContent=pasos[0].t; texto.textContent=pasos[0].d;
  var intervalo=setInterval(function(){
    if(i>=pasos.length){
      clearInterval(intervalo);
      var precioTxt=pagoSel==='USDT'?ofertaSel.usdt+" USDT":pagoSel==='SALDO'?ofertaSel.saldo+" Saldo":ofertaSel.cup+" CUP";
      var pedido=agregarPedido({juego:juegoSel==='freefire'?'Free Fire':'Blood Strike',oferta:ofertaSel.nombre,pago:pagoSel,total:precioTxt,playerId:playerId,wa:sesion.wa,nombre:sesion.nombre});
      setTimeout(function(){
        modal.classList.remove('show');
        var msg="Hola Derek 💎, acabo de hacer un pedido en tu página.\n\n📦 Pedido: "+pedido.id+"\n🎮 Juego: "+pedido.juego+"\n💎 Oferta: "+pedido.oferta+"\n🆔 Mi ID: "+playerId+"\n💰 Pagé con: "+pagoSel+" - "+precioTxt+"\n👤 Mi nombre: "+sesion.nombre;
        window.open('https://wa.me/'+MI_WHATSAPP+'?text='+encodeURIComponent(msg),'_blank');
        toast("✅ Pedido "+pedido.id+" creado");
        document.getElementById('playerId').value=""; document.getElementById('compInput').value=""; document.getElementById('preview').style.display='none'; mostrar('paso-juegos');
      },800); return;
    }
    bar.style.width=pasos[i].p+"%"; titulo.textContent=pasos[i].t; texto.textContent=pasos[i].d; detalle.textContent="No cierres esta ventana - "+pasos[i].p+"%"; i++;
  },800);
}
window.addEventListener('load', function(){
  try{
    var s=localStorage.getItem('derek_sesion');
    if(s){ sesion=JSON.parse(s); document.getElementById('nombreUser').textContent=sesion.nombre; document.getElementById('loginWa').value=sesion.wa; document.getElementById('loginNombre').value=sesion.nombre; actualizarCreditos(); mostrar('paso-juegos'); }
  }catch(e){}
});
