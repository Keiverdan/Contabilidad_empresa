/* ============================================================
   ESTRUCTURA DE COMPRAS — Análisis por proveedor, mes, categoría
   ============================================================ */

function renderEstructuraCompras(container) {
  const db = getDB();
  const compras = db.libroCompras.filter(c => c.empresa === db.empresaActual);

  // Por proveedor
  const porProv = {};
  compras.forEach(c => {
    if (!porProv[c.proveedor]) porProv[c.proveedor] = { monto: 0, cantidad: 0 };
    porProv[c.proveedor].monto += c.total;
    porProv[c.proveedor].cantidad++;
  });
  const provArr = Object.entries(porProv).sort((a, b) => b[1].monto - a[1].monto);
  const totalCompras = compras.reduce((s, c) => s + c.total, 0);

  // Por mes
  const porMes = {};
  compras.forEach(c => {
    const mes = c.fecha.slice(0, 7);
    porMes[mes] = (porMes[mes] || 0) + c.total;
  });
  const mesArr = Object.entries(porMes).sort();

  // Por alícuota
  const porAlic = {};
  compras.forEach(c => {
    porAlic[c.alicuota] = (porAlic[c.alicuota] || 0) + c.total;
  });

  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Estructura de Compras</h1>
      <button onclick="exportarTablaExcel('tablaEstructura','Estructura_Compras')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Total compras</p>
        <p class="text-lg font-bold">${fmtBs(totalCompras)}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">N° facturas</p>
        <p class="text-lg font-bold">${compras.length}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Proveedores</p>
        <p class="text-lg font-bold">${provArr.length}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">IVA total</p>
        <p class="text-lg font-bold text-amber-600">${fmtBs(compras.reduce((s, c) => s + c.iva, 0))}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4" id="tablaEstructura">
      <div class="bg-white rounded-lg border shadow overflow-hidden">
        <div class="p-3 bg-slate-100 border-b font-bold text-xs">🏭 Top proveedores</div>
        <div class="table-responsive max-h-[400px] overflow-y-auto">
          <table class="w-full text-[11px]">
            <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
              <tr><th class="p-2">#</th><th class="p-2">Proveedor</th>
                  <th class="p-2 text-right">Facturas</th><th class="p-2 text-right">Monto</th><th class="p-2 text-right">%</th></tr>
            </thead>
            <tbody>
              ${provArr.map(([prov, d], i) => `
                <tr class="border-b hover:bg-slate-50">
                  <td class="p-2">${i + 1}</td>
                  <td class="p-2">${prov}</td>
                  <td class="p-2 text-right mono">${d.cantidad}</td>
                  <td class="p-2 text-right mono font-bold">${fmtNum(d.monto)}</td>
                  <td class="p-2 text-right mono">${totalCompras ? ((d.monto / totalCompras) * 100).toFixed(1) : 0}%</td>
                </tr>
              `).join('') || '<tr><td colspan="5" class="p-4 text-center text-slate-500">Sin compras</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-lg border shadow overflow-hidden">
        <div class="p-3 bg-slate-100 border-b font-bold text-xs">📅 Compras por mes</div>
        <div class="table-responsive max-h-[400px] overflow-y-auto">
          <table class="w-full text-[11px]">
            <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
              <tr><th class="p-2">Mes</th><th class="p-2 text-right">Monto</th></tr>
            </thead>
            <tbody>
              ${mesArr.map(([mes, monto]) => `
                <tr class="border-b">
                  <td class="p-2 mono">${mes}</td>
                  <td class="p-2 text-right mono">${fmtNum(monto)}</td>
                </tr>
              `).join('') || '<tr><td colspan="2" class="p-4 text-center text-slate-500">Sin datos</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}