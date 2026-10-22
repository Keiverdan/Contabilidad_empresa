function renderLibroCompras(container) {
  const db = getDB();
  const compras = db.libroCompras.filter(c => c.empresa === db.empresaActual);
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Libro de Compras (SENIAT)</h1>
      <div class="flex gap-2">
        <button onclick="exportarTablaExcel('tablaLibroCompras','Libro_Compras')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
        <button onclick="exportarTXTCompras()" class="bg-amber-500 text-slate-950 text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-code"></i> TXT</button>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="table-responsive">
        <table id="tablaLibroCompras" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">N°</th><th class="p-2">Fecha</th><th class="p-2">RIF</th>
                <th class="p-2">Proveedor</th><th class="p-2">Factura</th><th class="p-2">Control</th>
                <th class="p-2 text-right">Total</th><th class="p-2 text-right">Base</th>
                <th class="p-2 text-right">%IVA</th><th class="p-2 text-right">IVA</th><th class="p-2 text-right">Ret IVA</th></tr>
          </thead>
          <tbody>
            ${compras.map((c, i) => `
              <tr class="border-b hover:bg-slate-50">
                <td class="p-2">${i + 1}</td>
                <td class="p-2 mono">${fmtFecha(c.fecha)}</td>
                <td class="p-2 mono font-bold">${c.rif}</td>
                <td class="p-2">${c.proveedor}</td>
                <td class="p-2 mono">${c.factura}</td>
                <td class="p-2 mono">${c.control}</td>
                <td class="p-2 text-right mono font-bold">${fmtNum(c.total)}</td>
                <td class="p-2 text-right mono">${fmtNum(c.base)}</td>
                <td class="p-2 text-right">${c.alicuota}%</td>
                <td class="p-2 text-right mono">${fmtNum(c.iva)}</td>
                <td class="p-2 text-right mono text-amber-700">${fmtNum(c.retIva)}</td>
              </tr>
            `).join('') || '<tr><td colspan="11" class="p-4 text-center text-slate-500">Sin registros</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLibroVentas(container) {
  const db = getDB();
  const ventas = db.libroVentas.filter(v => v.empresa === db.empresaActual);
  const servicios = (db.libroServicios || []).filter(s => s.empresa === db.empresaActual);
  const todas = [...ventas, ...servicios].sort((a, b) => a.fecha.localeCompare(b.fecha));
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Libro de Ventas (SENIAT)</h1>
      <div class="flex gap-2">
        <button onclick="exportarTablaExcel('tablaLibroVentas','Libro_Ventas')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
        <button onclick="exportarTXTVentas()" class="bg-amber-500 text-slate-950 text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-code"></i> TXT</button>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="table-responsive">
        <table id="tablaLibroVentas" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">N°</th><th class="p-2">Fecha</th><th class="p-2">RIF</th>
                <th class="p-2">Cliente</th><th class="p-2">Factura</th><th class="p-2">Control</th>
                <th class="p-2 text-right">Total</th><th class="p-2 text-right">Base</th>
                <th class="p-2 text-right">%IVA</th><th class="p-2 text-right">IVA</th></tr>
          </thead>
          <tbody>
            ${todas.map((v, i) => `
              <tr class="border-b hover:bg-slate-50">
                <td class="p-2">${i + 1}</td>
                <td class="p-2 mono">${fmtFecha(v.fecha)}</td>
                <td class="p-2 mono font-bold">${v.rif}</td>
                <td class="p-2">${v.cliente}</td>
                <td class="p-2 mono">${v.factura}</td>
                <td class="p-2 mono">${v.control}</td>
                <td class="p-2 text-right mono font-bold">${fmtNum(v.total)}</td>
                <td class="p-2 text-right mono">${fmtNum(v.base)}</td>
                <td class="p-2 text-right">${v.alicuota}%</td>
                <td class="p-2 text-right mono text-emerald-700">${fmtNum(v.iva)}</td>
              </tr>
            `).join('') || '<tr><td colspan="10" class="p-4 text-center text-slate-500">Sin registros</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function exportarTXTCompras() {
  const db = getDB();
  const rows = db.libroCompras.filter(c => c.empresa === db.empresaActual);
  const header = ['RIF','Proveedor','Fecha','Factura','Control','Base','Alicuota','IVA','RetIva'].join('\t');
  const lines = rows.map(c => [c.rif, c.proveedor, c.fecha, c.factura, c.control,
    c.base.toFixed(2), c.alicuota, c.iva.toFixed(2), c.retIva.toFixed(2)].join('\t'));
  descargarTXT([header, ...lines].join('\n'), `compras_${hoyISO()}.txt`);
}

function exportarTXTVentas() {
  const db = getDB();
  const ventas = db.libroVentas.filter(v => v.empresa === db.empresaActual);
  const servicios = (db.libroServicios || []).filter(s => s.empresa === db.empresaActual);
  const todas = [...ventas, ...servicios];
  const header = ['RIF','Cliente','Fecha','Factura','Control','Base','Alicuota','IVA'].join('\t');
  const lines = todas.map(v => [v.rif, v.cliente, v.fecha, v.factura, v.control,
    v.base.toFixed(2), v.alicuota, v.iva.toFixed(2)].join('\t'));
  descargarTXT([header, ...lines].join('\n'), `ventas_${hoyISO()}.txt`);
}

function descargarTXT(contenido, nombre) {
  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
}