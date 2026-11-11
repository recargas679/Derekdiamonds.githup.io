var DB_KEY = 'derek_diamonds_db_v1';
function cargarDB(){
  try{
    var raw = localStorage.getItem(DB_KEY);
    if(!raw) return { pedidos: [], creditos: [], api: null };
    var parsed = JSON.parse(raw);
    return { pedidos: Array.isArray(parsed.pedidos)?parsed.pedidos:[], creditos: Array.isArray(parsed.creditos)?parsed.creditos:[], api: parsed.api || null };
  }catch(e){ return { pedidos: [], creditos: [], api: null }; }
}
function guardarDB(db){ try{ localStorage.setItem(DB_KEY, JSON.stringify(db)); }catch(e){} }
var DB = cargarDB();
function agregarPedido(pedido){
  pedido.id = 'DD-' + Date.now().toString().slice(-6);
  pedido.fecha = new Date().toLocaleString('es-CU');
  pedido.estado = 'verificando';
  DB.pedidos.unshift(pedido);
  guardarDB(DB);
  return pedido;
}
function cambiarEstadoPedido(id, nuevoEstado){
  var p=null;
  for(var i=0;i<DB.pedidos.length;i++){ if(DB.pedidos[i].id===id){ p=DB.pedidos[i]; break; } }
  if(p){ p.estado=nuevoEstado; guardarDB(DB); }
  return p;
}