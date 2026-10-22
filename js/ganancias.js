/* ============================================================
   GANANCIAS Y MÁRGENES — Rentabilidad por producto
   ============================================================ */

function renderGanancias(container) {
  const db = getDB();
  const productos = db.productos.filter(p => p.empresa === db.empresaActual);
  const ventas = db.libroVentas.filter(v => v.empresa === db.empresaActual);
  const servicios = (db.libroServicios || []).filter(s => s.empresa === db.empresaActual);
  const totalIngresos = ventas.reduce((s, v) => s + v.base, 0) + servicios.reduce((s, v) => s + v.base, 0);
  const totalCostos = ventas.reduce((s, v) => s + (v.costo || 0), 0) + servicios.reduce((s, v) => s + (v.costo || 0), 0);
  const totalGastos = db.planDeCuentas
    .filter(c => c.tipo === 'GASTOS' && c.nivel === 'DETALLE')
    .reduce((sum, c) => {
      let s = 0;
      db.libroDiario.filter(a => a.empresa === db.empresaActual).forEach(a =>
        a.lineas.forEach(l => { if (l.cuenta === c.codigo) s += l.debe - l.haber; }));
      return sum + s;
    }, 0);
  const gananciaBruta = totalIngresos - totalCostos;
  const gananciaNeta = gananciaBruta - totalGastos;
  const margenBrutoPct = totalIngresos > 0 ? (gananciaBruta / totalIngresos) * 100 : 0;

  // Rentabilidad por producto
  const rentProductos = productos.map(p => {
    const ventasProd = ventas.filter(v => (v.detalle || '').includes(p.codigo));
    const ingresos = ventasProd.reduce((s, v) => s + v.base, 0);
    const costoVentas = ventasProd.reduce((s, v) => s + (v.costo || 0), 0);
    return {
      codigo: p.codigo, nombre: p.nombre,
      costoUnit: p.costo, precioUnit: p.precio,
      margenUnit: p.precio - p.costo,
      margenPct: p.costo > 0 ? ((p.precio - p.costo) / p.costo * 100) : 0,
      ingresos, costoVentas, margen: ingresos - costoVentas
    };
  }).sort((a, b) => b.margenUnit - a.margenUnit);

  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Análisis de Ganancias y Márgenes</h1>
      <button onclick="exportarTablaExcel('tablaGanancias','Ganancias')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Ingresos totales</p>
        <p class="text-lg font-bold text-emerald-700">${fmtBs(totalIngresos)}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Costos</p>
        <p class="text-lg font-bold text-red-600">${fmtBs(totalCostos)}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Ganancia bruta</p>
        <p class="text-lg font-bold text-amber-600">${fmtBs(gananciaBruta)}</p>
        <p class="text-[10px] text-slate-500">Margen: ${margenBrutoPct.toFixed(1)}%</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Ganancia neta</p>
        <p class="text-lg font-bold ${gananciaNeta >= 0 ? 'text-emerald-700' : 'text-red-600'}">${fmtBs(gananciaNeta)}</p>
      </div>
    </div>

    <div class="bg-white rounded-lg border shadow overflow-hidden" id="tablaGanancias">
      <div class="p-3 bg-slate-100 border-b font-bold text-xs">📦 Rentabilidad por producto</div>
      <div class="table-responsive max-h-[500px] overflow-y-auto">
        <table class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
            <tr><th class="p-2">Código</th><th class="p-2">Producto</th>
                <th class="p-2 text-right">Costo U.</th><th class="p-2 text-right">Precio U.</th>
                <th class="p-2 text-right">Margen U.</th><th class="p-2 text-right">Margen %</th>
                <th class="p-2 text-right">Ingresos</th><th class="p-2 text-right">Ganancia</th></tr>
          </thead>
          <tbody>
            ${rentProductos.map(r => `
              <tr class="border-b hover:bg-slate-50">
                <td class="p-2 mono">${r.codigo}</td>
                <td class="p-2">${r.nombre}</td>
                <td class="p-2 text-right mono">${fmtNum(r.costoUnit)}</td>
                <td class="p-2 text-right mono">${fmtNum(r.precioUnit)}</td>
                <td class="p-2 text-right mono text-emerald-700 font-bold">${fmtNum(r.margenUnit)}</td>
                <td class="p-2 text-right mono">${r.margenPct.toFixed(1)}%</td>
                <td class="p-2 text-right mono">${fmtNum(r.ingresos)}</td>
                <td class="p-2 text-right mono font-bold">${fmtNum(r.margen)}</td>
              </tr>
            `).join('') || '<tr><td colspan="8" class="p-4 text-center text-slate-500">Sin productos</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}