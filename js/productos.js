/* ============================================================
   PRODUCTOS DE INVENTARIO (con valorización)
   ============================================================ */

function renderProductos(container) {
  const db = getDB();
  const productos = db.productos.filter(p => p.empresa === db.empresaActual);
  const valorTotal = productos.reduce((s, p) => s + (p.stock * p.costo), 0);
  const valorVenta = productos.reduce((s, p) => s + (p.stock * p.precio), 0);
  const margen = valorVenta - valorTotal;

  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Productos / Inventario</h1>
      <button onclick="exportarTablaExcel('tablaProductos','Productos')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded">
        <i class="fa-solid fa-file-excel"></i> Excel
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Productos</p>
        <p class="text-lg font-bold">${productos.length}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Valor a costo</p>
        <p class="text-lg font-bold text-slate-700">${fmtBs(valorTotal)}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Valor a precio venta</p>
        <p class="text-lg font-bold text-emerald-700">${fmtBs(valorVenta)}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Margen potencial</p>
        <p class="text-lg font-bold text-amber-600">${fmtBs(margen)}</p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <h2 class="text-sm font-bold mb-3 pb-2 border-b">Agregar / editar producto</h2>
      <form id="formProducto" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div><label class="block text-xs font-medium mb-1">Código</label>
          <input id="prodCodigo" placeholder="P001" required class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">Nombre</label>
          <input id="prodNombre" placeholder="Nombre producto" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Categoría</label>
          <input id="prodCategoria" placeholder="Papelería, Tecnología…" class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Unidad</label>
          <select id="prodUnidad" class="w-full text-xs p-2 border rounded">
            <option>Unidad</option><option>Caja</option><option>Paquete</option>
            <option>Kg</option><option>Litro</option><option>Metro</option><option>Servicio</option>
          </select></div>
        <div><label class="block text-xs font-medium mb-1">Costo unitario</label>
          <input type="number" step="0.01" id="prodCosto" placeholder="0.00" required class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">Precio venta</label>
          <input type="number" step="0.01" id="prodPrecio" placeholder="0.00" required class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">Stock actual</label>
          <input type="number" step="0.01" id="prodStock" placeholder="0" required class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">Stock mínimo</label>
          <input type="number" step="0.01" id="prodStockMin" placeholder="0" class="w-full text-xs p-2 border rounded mono"></div>
        <button class="sm:col-span-2 lg:col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold">
          <i class="fa-solid fa-save mr-1"></i> Guardar producto
        </button>
      </form>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg border shadow overflow-hidden">
      <div class="p-3 bg-slate-100 border-b flex justify-between flex-wrap gap-2">
        <span class="text-xs font-bold">Catálogo</span>
        <input type="text" id="filtroProductos" placeholder="Buscar…" oninput="filtrarProductos(this.value)" class="text-xs p-1.5 border rounded w-full sm:w-64">
      </div>
      <div class="table-responsive max-h-[500px] overflow-y-auto">
        <table id="tablaProductos" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
            <tr><th class="p-2">Código</th><th class="p-2">Nombre</th><th class="p-2">Categoría</th>
                <th class="p-2 text-right">Costo</th><th class="p-2 text-right">Precio</th>
                <th class="p-2 text-right">Stock</th><th class="p-2 text-right">Mín</th>
                <th class="p-2 text-right">Margen</th><th class="p-2 no-print">Acción</th></tr>
          </thead>
          <tbody id="bodyProductos"></tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formProducto').addEventListener('submit', guardarProducto);
  renderTablaProductos();
}

function guardarProducto(e) {
  e.preventDefault();
  const db = getDB();
  const codigo = document.getElementById('prodCodigo').value.trim().toUpperCase();
  if (db.productos.some(p => p.codigo === codigo && p.empresa === db.empresaActual)) {
    return mostrarAlerta('Ya existe un producto con ese código.', 'error');
  }
  db.productos.push({
    id: Date.now(),
    codigo,
    nombre: document.getElementById('prodNombre').value.trim(),
    categoria: document.getElementById('prodCategoria').value.trim(),
    unidad: document.getElementById('prodUnidad').value,
    costo: parseFloat(document.getElementById('prodCosto').value) || 0,
    precio: parseFloat(document.getElementById('prodPrecio').value) || 0,
    stock: parseFloat(document.getElementById('prodStock').value) || 0,
    stockMin: parseFloat(document.getElementById('prodStockMin').value) || 0,
    empresa: db.empresaActual
  });
  saveDB(db);
  registrarAuditoria('PRODUCTOS', 'Creación', `${codigo} - ${document.getElementById('prodNombre').value}`);
  e.target.reset();
  renderProductos(document.getElementById('viewContainer'));
  mostrarAlerta('Producto agregado.');
}

function renderTablaProductos(filtro = '') {
  const db = getDB();
  const q = filtro.toLowerCase();
  const lista = db.productos.filter(p => p.empresa === db.empresaActual &&
    (!q || p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q) ||
     (p.categoria || '').toLowerCase().includes(q)));
  document.getElementById('bodyProductos').innerHTML = lista.map(p => {
    const margen = p.precio - p.costo;
    const pctMargen = p.costo > 0 ? (margen / p.costo * 100) : 0;
    const bajoStock = p.stock <= p.stockMin;
    return `<tr class="border-b hover:bg-slate-50 ${bajoStock ? 'bg-red-50' : ''}">
      <td class="p-2 mono font-bold">${p.codigo}</td>
      <td class="p-2">${p.nombre}</td>
      <td class="p-2">${p.categoria || '—'}</td>
      <td class="p-2 text-right mono">${fmtNum(p.costo)}</td>
      <td class="p-2 text-right mono">${fmtNum(p.precio)}</td>
      <td class="p-2 text-right mono ${bajoStock ? 'text-red-600 font-bold' : ''}">${p.stock} ${p.unidad || ''}</td>
      <td class="p-2 text-right mono">${p.stockMin}</td>
      <td class="p-2 text-right mono text-emerald-700 font-bold">${fmtNum(margen)} (${pctMargen.toFixed(1)}%)</td>
      <td class="p-2 text-center no-print">
        <button onclick="eliminarProducto(${p.id})" class="text-red-500"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" class="p-4 text-center text-slate-500">Sin productos</td></tr>';
}

function filtrarProductos(v) { renderTablaProductos(v); }

function eliminarProducto(id) {
  const db = getDB();
  db.productos = db.productos.filter(p => p.id !== id);
  saveDB(db);
  renderProductos(document.getElementById('viewContainer'));
  mostrarAlerta('Producto eliminado.', 'error');
}

/* Utilidad para otros módulos */
function getProductoPorCodigo(codigo) {
  return getDB().productos.find(p => p.codigo === codigo && p.empresa === getDB().empresaActual);
}