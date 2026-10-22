function renderVentas(container) {
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Ventas de Mercancía</h1>
    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <form id="formVenta" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">RIF / Cédula del cliente</label>
          <input id="ventaRif" placeholder="V-12345678 o J-98765432-1" required
                 class="w-full text-xs p-2 border rounded mono" oninput="previewVentaRIF()">
          <p id="ventaRifMsg" class="text-[10px] mt-1"></p>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">Nombre / Razón social</label>
          <input id="ventaCliente" placeholder="Cliente" required class="w-full text-xs p-2 border rounded">
        </div>
        <div><label class="block text-xs font-medium mb-1">N° factura</label>
          <input id="ventaFactura" placeholder="000501" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">N° control</label>
          <input id="ventaControl" placeholder="00-00501" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Fecha</label>
          <input type="date" id="ventaFecha" value="${hoyISO()}" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Base imponible</label>
          <input type="number" step="0.01" id="ventaBase" placeholder="0.00" required class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">Alícuota IVA</label>
          <select id="ventaAlicuota" class="w-full text-xs p-2 border rounded">
            <option value="16">16%</option><option value="8">8%</option><option value="0">0%</option>
          </select></div>
        <div><label class="block text-xs font-medium mb-1">Costo mercancía</label>
          <input type="number" step="0.01" id="ventaCosto" placeholder="0.00" class="w-full text-xs p-2 border rounded mono"></div>
        <button class="sm:col-span-2 lg:col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold">
          <i class="fa-solid fa-save mr-1"></i> Registrar venta
        </button>
      </form>
    </div>
    <div class="bg-white rounded-lg border shadow overflow-hidden">
      <div class="table-responsive">
        <table id="tablaVentas" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">Fecha</th><th class="p-2">RIF</th><th class="p-2">Cliente</th>
                <th class="p-2">Factura</th><th class="p-2 text-right">Base</th>
                <th class="p-2 text-right">IVA</th><th class="p-2 text-right">Total</th></tr>
          </thead>
          <tbody id="bodyVentas"></tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formVenta').addEventListener('submit', guardarVenta);
  autocompletarTercero('ventaRif', 'CLIENTE');
  renderTablaVentas();
}

function previewVentaRIF() {
  const rif = document.getElementById('ventaRif').value;
  const msg = document.getElementById('ventaRifMsg');
  if (!rif) { msg.textContent = ''; return; }
  const r = validarRIF(rif);
  msg.textContent = r.valido ? `✅ RIF válido → ${formatearRIF(rif)}` : `❌ ${r.mensaje}`;
  msg.className = 'text-[10px] mt-1 ' + (r.valido ? 'text-emerald-600' : 'text-red-600');
}

function guardarVenta(e) {
  e.preventDefault();
  const db = getDB();
  const rifRaw = document.getElementById('ventaRif').value.trim();
  const val = validarRIF(rifRaw);
  if (!val.valido) return mostrarAlerta(`RIF inválido: ${val.mensaje}`, 'error');
  const rif = formatearRIF(rifRaw);
  const fecha = document.getElementById('ventaFecha').value;
  if (periodoCerrado(fecha)) return mostrarAlerta('Período cerrado.', 'error');

  const base = parseFloat(document.getElementById('ventaBase').value) || 0;
  const alicuota = parseFloat(document.getElementById('ventaAlicuota').value);
  const iva = +(base * alicuota / 100).toFixed(2);
  const costo = parseFloat(document.getElementById('ventaCosto').value) || 0;
  const total = +(base + iva).toFixed(2);

  const venta = {
    id: db.libroVentas.length + 1, fecha, rif,
    cliente: document.getElementById('ventaCliente').value.trim(),
    factura: document.getElementById('ventaFactura').value.trim(),
    control: document.getElementById('ventaControl').value.trim(),
    base, alicuota, iva, total, costo, empresa: db.empresaActual
  };
  db.libroVentas.push(venta);

  const num = generarNumeroAsiento();
  const lineas = [
    { cuenta: '1.1.02.01', detalle: `CxC ${venta.cliente}`, debe: total, haber: 0 },
    { cuenta: '4.1.01.01', detalle: `Venta ${venta.factura}`, debe: 0, haber: base },
    { cuenta: '2.1.02.01', detalle: 'Débito fiscal IVA', debe: 0, haber: iva },
    { cuenta: '5.1.01.01', detalle: 'Costo venta', debe: costo, haber: 0 },
    { cuenta: '1.1.03.01', detalle: 'Salida inventario', debe: 0, haber: costo }
  ].filter(l => l.debe > 0 || l.haber > 0);
  db.libroDiario.push({ num, fecha, concepto: `Venta ${venta.factura}`, lineas,
    total, empresa: db.empresaActual, creado: new Date().toISOString() });

  saveDB(db);
  registrarAuditoria('VENTAS', 'Registro', `Fact ${venta.factura} - ${venta.cliente}`);
  renderTablaVentas();
  e.target.reset();
  document.getElementById('ventaFecha').value = hoyISO();
  document.getElementById('ventaRifMsg').textContent = '';
  mostrarAlerta('Venta registrada y asiento generado.');
}

function renderTablaVentas() {
  const db = getDB();
  document.getElementById('bodyVentas').innerHTML = db.libroVentas
    .filter(v => v.empresa === db.empresaActual)
    .map(v => `
      <tr class="border-b hover:bg-slate-50">
        <td class="p-2 mono">${fmtFecha(v.fecha)}</td>
        <td class="p-2 mono">${v.rif}</td>
        <td class="p-2">${v.cliente}</td>
        <td class="p-2 mono">${v.factura}</td>
        <td class="p-2 text-right mono">${fmtNum(v.base)}</td>
        <td class="p-2 text-right mono">${fmtNum(v.iva)}</td>
        <td class="p-2 text-right mono font-bold">${fmtNum(v.total)}</td>
      </tr>
    `).join('') || '<tr><td colspan="7" class="p-4 text-center text-slate-500">Sin registros</td></tr>';
}