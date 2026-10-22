/* ============================================================
   SERVICIOS (venta de servicios con IVA y asiento)
   ============================================================ */

function renderServicios(container) {
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Servicios Prestados</h1>
    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <form id="formServicio" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">RIF / Cédula del cliente</label>
          <input id="srvRif" placeholder="V-12345678 o J-98765432-1" required
                 class="w-full text-xs p-2 border rounded mono" oninput="previewServicioRIF()">
          <p id="srvRifMsg" class="text-[10px] mt-1"></p>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">Razón social / Nombre</label>
          <input id="srvCliente" required class="w-full text-xs p-2 border rounded">
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">Descripción del servicio</label>
          <input id="srvDesc" placeholder="Ej: Asesoría contable mensual" required class="w-full text-xs p-2 border rounded">
        </div>
        <div><label class="block text-xs font-medium mb-1">N° factura</label>
          <input id="srvFactura" placeholder="000501" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">N° control</label>
          <input id="srvControl" placeholder="00-00501" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Fecha</label>
          <input type="date" id="srvFecha" value="${hoyISO()}" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Base imponible</label>
          <input type="number" step="0.01" id="srvBase" placeholder="0.00" required class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">Alícuota IVA</label>
          <select id="srvAlicuota" class="w-full text-xs p-2 border rounded">
            <option value="16">16%</option><option value="8">8%</option><option value="0">0%</option>
          </select></div>
        <div><label class="block text-xs font-medium mb-1">Costo del servicio</label>
          <input type="number" step="0.01" id="srvCosto" placeholder="0.00" class="w-full text-xs p-2 border rounded mono"></div>
        <button class="sm:col-span-2 lg:col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold">
          <i class="fa-solid fa-save mr-1"></i> Registrar servicio
        </button>
      </form>
    </div>
    <div class="bg-white rounded-lg border shadow overflow-hidden">
      <div class="table-responsive">
        <table id="tablaServicios" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">Fecha</th><th class="p-2">RIF</th><th class="p-2">Cliente</th>
                <th class="p-2">Descripción</th><th class="p-2">Factura</th>
                <th class="p-2 text-right">Base</th><th class="p-2 text-right">IVA</th>
                <th class="p-2 text-right">Total</th></tr>
          </thead>
          <tbody id="bodyServicios"></tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formServicio').addEventListener('submit', guardarServicio);
  autocompletarTercero('srvRif', 'CLIENTE');
  renderTablaServicios();
}

function previewServicioRIF() {
  const rif = document.getElementById('srvRif').value;
  const msg = document.getElementById('srvRifMsg');
  if (!rif) { msg.textContent = ''; return; }
  const r = validarRIF(rif);
  msg.textContent = r.valido ? `✅ RIF válido → ${formatearRIF(rif)}` : `❌ ${r.mensaje}`;
  msg.className = 'text-[10px] mt-1 ' + (r.valido ? 'text-emerald-600' : 'text-red-600');
}

function guardarServicio(e) {
  e.preventDefault();
  const db = getDB();
  const rifRaw = document.getElementById('srvRif').value.trim();
  const val = validarRIF(rifRaw);
  if (!val.valido) return mostrarAlerta(`RIF inválido: ${val.mensaje}`, 'error');
  const rif = formatearRIF(rifRaw);
  const fecha = document.getElementById('srvFecha').value;
  if (periodoCerrado(fecha)) return mostrarAlerta('Período cerrado.', 'error');

  const base = parseFloat(document.getElementById('srvBase').value) || 0;
  const alicuota = parseFloat(document.getElementById('srvAlicuota').value);
  const iva = +(base * alicuota / 100).toFixed(2);
  const costo = parseFloat(document.getElementById('srvCosto').value) || 0;
  const total = +(base + iva).toFixed(2);

  const servicio = {
    id: db.libroServicios.length + 1, fecha, rif,
    cliente: document.getElementById('srvCliente').value.trim(),
    descripcion: document.getElementById('srvDesc').value.trim(),
    factura: document.getElementById('srvFactura').value.trim(),
    control: document.getElementById('srvControl').value.trim(),
    base, alicuota, iva, total, costo, empresa: db.empresaActual
  };
  db.libroServicios.push(servicio);

  const num = generarNumeroAsiento();
  const lineas = [
    { cuenta: '1.1.02.01', detalle: `CxC ${servicio.cliente}`, debe: total, haber: 0 },
    { cuenta: '4.1.02.01', detalle: `Servicio ${servicio.factura}`, debe: 0, haber: base },
    { cuenta: '2.1.02.01', detalle: 'Débito fiscal IVA', debe: 0, haber: iva },
    { cuenta: '5.1.02.01', detalle: 'Costo servicio', debe: costo, haber: 0 },
    { cuenta: '1.1.03.01', detalle: 'Consumo interno', debe: 0, haber: costo }
  ].filter(l => l.debe > 0 || l.haber > 0);
  db.libroDiario.push({ num, fecha, concepto: `Servicio ${servicio.factura}`, lineas,
    total, empresa: db.empresaActual, creado: new Date().toISOString() });

  saveDB(db);
  registrarAuditoria('SERVICIOS', 'Registro', `Fact ${servicio.factura} - ${servicio.cliente}`);
  renderTablaServicios();
  e.target.reset();
  document.getElementById('srvFecha').value = hoyISO();
  document.getElementById('srvRifMsg').textContent = '';
  mostrarAlerta('Servicio registrado.');
}

function renderTablaServicios() {
  const db = getDB();
  document.getElementById('bodyServicios').innerHTML = db.libroServicios
    .filter(s => s.empresa === db.empresaActual)
    .map(s => `
      <tr class="border-b hover:bg-slate-50">
        <td class="p-2 mono">${fmtFecha(s.fecha)}</td>
        <td class="p-2 mono">${s.rif}</td>
        <td class="p-2">${s.cliente}</td>
        <td class="p-2">${s.descripcion}</td>
        <td class="p-2 mono">${s.factura}</td>
        <td class="p-2 text-right mono">${fmtNum(s.base)}</td>
        <td class="p-2 text-right mono">${fmtNum(s.iva)}</td>
        <td class="p-2 text-right mono font-bold">${fmtNum(s.total)}</td>
      </tr>
    `).join('') || '<tr><td colspan="8" class="p-4 text-center text-slate-500">Sin registros</td></tr>';
}