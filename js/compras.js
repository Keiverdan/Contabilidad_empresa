function renderCompras(container) {
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Compras y Retenciones (SENIAT)</h1>
    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <form id="formCompra" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">RIF / Cédula del proveedor</label>
          <input id="compraRif" placeholder="J-30596841-2 o V-12345678" required
                 class="w-full text-xs p-2 border rounded mono" oninput="previewCompraRIF()">
          <p id="compraRifMsg" class="text-[10px] mt-1"></p>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">Razón social / Nombre</label>
          <input id="compraProveedor" placeholder="Nombre" required class="w-full text-xs p-2 border rounded">
        </div>
        <div><label class="block text-xs font-medium mb-1">N° factura</label>
          <input id="compraFactura" placeholder="000123" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">N° control SENIAT</label>
          <input id="compraControl" placeholder="00-00123" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Fecha</label>
          <input type="date" id="compraFecha" value="${hoyISO()}" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Base imponible</label>
          <input type="number" step="0.01" id="compraBase" placeholder="0.00" required class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">Alícuota IVA</label>
          <select id="compraAlicuota" class="w-full text-xs p-2 border rounded">
            <option value="16">16%</option><option value="8">8%</option><option value="0">0%</option>
          </select></div>
        <div><label class="block text-xs font-medium mb-1">Ret. ISLR (.Bs)</label>
          <input type="number" step="0.01" id="compraRetIslr" placeholder="0.00" class="w-full text-xs p-2 border rounded mono"></div>
        <button class="sm:col-span-2 lg:col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold">
          <i class="fa-solid fa-save mr-1"></i> Registrar compra
        </button>
      </form>
    </div>
    <div class="bg-white rounded-lg border shadow overflow-hidden">
      <div class="table-responsive">
        <table id="tablaCompras" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">Fecha</th><th class="p-2">RIF</th><th class="p-2">Proveedor</th>
                <th class="p-2">Factura</th><th class="p-2 text-right">Base</th>
                <th class="p-2 text-right">IVA</th><th class="p-2 text-right">Ret IVA</th>
                <th class="p-2 text-right">Total</th></tr>
          </thead>
          <tbody id="bodyCompras"></tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formCompra').addEventListener('submit', guardarCompra);
  autocompletarTercero('compraRif', 'PROVEEDOR');
  renderTablaCompras();
}

function previewCompraRIF() {
  const rif = document.getElementById('compraRif').value;
  const msg = document.getElementById('compraRifMsg');
  if (!rif) { msg.textContent = ''; return; }
  const r = validarRIF(rif);
  msg.textContent = r.valido ? `✅ RIF válido → ${formatearRIF(rif)}` : `❌ ${r.mensaje}`;
  msg.className = 'text-[10px] mt-1 ' + (r.valido ? 'text-emerald-600' : 'text-red-600');
}

function guardarCompra(e) {
  e.preventDefault();
  const db = getDB();
  const rifRaw = document.getElementById('compraRif').value.trim();
  const val = validarRIF(rifRaw);
  if (!val.valido) return mostrarAlerta(`RIF inválido: ${val.mensaje}`, 'error');
  const rif = formatearRIF(rifRaw);
  const fecha = document.getElementById('compraFecha').value;
  if (periodoCerrado(fecha)) return mostrarAlerta('Período cerrado.', 'error');

  const base = parseFloat(document.getElementById('compraBase').value) || 0;
  const alicuota = parseFloat(document.getElementById('compraAlicuota').value);
  const iva = +(base * alicuota / 100).toFixed(2);
  const retIva = +(iva * CONFIG.RET_IVA_PORC / 100).toFixed(2);
  const retIslr = parseFloat(document.getElementById('compraRetIslr').value) || 0;
  const total = +(base + iva).toFixed(2);

  const compra = {
    id: db.libroCompras.length + 1, fecha, rif,
    proveedor: document.getElementById('compraProveedor').value.trim(),
    factura: document.getElementById('compraFactura').value.trim(),
    control: document.getElementById('compraControl').value.trim(),
    base, alicuota, iva, retIva, retIslr, total,
    empresa: db.empresaActual
  };
  db.libroCompras.push(compra);

  // Asiento automático
  const num = generarNumeroAsiento();
  const lineas = [
    { cuenta: '1.1.03.01', detalle: `Compra fact ${compra.factura}`, debe: base, haber: 0 },
    { cuenta: '2.1.02.01', detalle: 'IVA compra', debe: iva, haber: 0 },
    { cuenta: '2.1.01.01', detalle: `CxP ${compra.proveedor}`, debe: 0, haber: total - retIva - retIslr },
    { cuenta: '2.1.02.01', detalle: 'Ret IVA', debe: 0, haber: retIva }
  ].filter(l => l.debe > 0 || l.haber > 0);
  db.libroDiario.push({ num, fecha, concepto: `Compra ${compra.factura}`, lineas,
    total: base, empresa: db.empresaActual, creado: new Date().toISOString() });

  saveDB(db);
  registrarAuditoria('COMPRAS', 'Registro', `Fact ${compra.factura} - ${compra.proveedor}`);
  renderTablaCompras();
  e.target.reset();
  document.getElementById('compraFecha').value = hoyISO();
  document.getElementById('compraRifMsg').textContent = '';
  mostrarAlerta('Compra registrada y asiento generado.');
}

function renderTablaCompras() {
  const db = getDB();
  document.getElementById('bodyCompras').innerHTML = db.libroCompras
    .filter(c => c.empresa === db.empresaActual)
    .map(c => `
      <tr class="border-b hover:bg-slate-50">
        <td class="p-2 mono">${fmtFecha(c.fecha)}</td>
        <td class="p-2 mono">${c.rif}</td>
        <td class="p-2">${c.proveedor}</td>
        <td class="p-2 mono">${c.factura}</td>
        <td class="p-2 text-right mono">${fmtNum(c.base)}</td>
        <td class="p-2 text-right mono">${fmtNum(c.iva)}</td>
        <td class="p-2 text-right mono text-amber-700">${fmtNum(c.retIva)}</td>
        <td class="p-2 text-right mono font-bold">${fmtNum(c.total)}</td>
      </tr>
    `).join('') || '<tr><td colspan="8" class="p-4 text-center text-slate-500">Sin registros</td></tr>';
}