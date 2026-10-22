/* ============================================================
   PRESUPUESTOS AUTOMATIZADOS (incluye materiales de inventario)
   ============================================================ */

function renderPresupuestos(container) {
  const db = getDB();
  const cuentasPresup = db.planDeCuentas.filter(c =>
    c.nivel === 'DETALLE' && ['INGRESOS','GASTOS','COSTOS'].includes(c.tipo));
  const productos = db.productos.filter(p => p.empresa === db.empresaActual);

  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Presupuestos Automatizados</h1>

    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <h2 class="text-sm font-bold mb-3 pb-2 border-b">Crear presupuesto</h2>
      <form id="formPresupuesto" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div><label class="block text-xs font-medium mb-1">Nombre</label>
          <input id="presNombre" placeholder="Presupuesto 2026" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Desde</label>
          <input type="date" id="presDesde" value="${hoyISO()}" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Hasta</label>
          <input type="date" id="presHasta" required class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">% Crecimiento</label>
          <input type="number" step="0.01" id="presCrec" value="0" class="w-full text-xs p-2 border rounded mono"></div>

        <!-- Cuentas contables -->
        <div class="sm:col-span-2 lg:col-span-4">
          <label class="block text-xs font-medium mb-1">📊 Cuentas contables a presupuestar</label>
          <div id="presCuentas" class="border rounded p-2 max-h-48 overflow-y-auto">
            ${cuentasPresup.map(c => `
              <label class="flex items-center gap-2 text-xs py-0.5">
                <input type="checkbox" data-cuenta="${c.codigo}" data-tipo="cuenta">
                <span class="mono">${c.codigo}</span> ${c.nombre}
                <span class="text-slate-400">(${c.tipo})</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Materiales de inventario -->
        <div class="sm:col-span-2 lg:col-span-4">
          <label class="block text-xs font-medium mb-1">📦 Materiales de inventario a presupuestar</label>
          <div id="presMateriales" class="border rounded p-2 max-h-48 overflow-y-auto">
            ${productos.length === 0
              ? '<p class="text-xs text-slate-500">No hay productos. Ve a Productos/Inventario.</p>'
              : productos.map(p => `
                <label class="flex items-center gap-2 text-xs py-0.5">
                  <input type="checkbox" data-producto="${p.codigo}" data-tipo="material">
                  <span class="mono">${p.codigo}</span> ${p.nombre}
                  <span class="text-slate-400">— costo: ${fmtNum(p.costo)} — stock: ${p.stock}</span>
                </label>
              `).join('')}
          </div>
          <div class="mt-2 flex flex-wrap gap-2 items-end">
            <div>
              <label class="block text-[10px] font-medium mb-1">Cantidad estimada por material</label>
              <input type="number" step="1" id="presCantMaterial" value="1" min="1" class="w-24 text-xs p-1.5 border rounded mono">
            </div>
            <button type="button" onclick="calcularPresupuestoAutomatico()" class="bg-slate-700 text-white text-xs px-3 py-1.5 rounded">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Calcular automático
            </button>
          </div>
          <div id="presResultado" class="table-responsive mt-3"></div>
        </div>

        <button class="sm:col-span-2 lg:col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold">
          <i class="fa-solid fa-save mr-1"></i> Guardar presupuesto
        </button>
      </form>
    </div>

    <div class="bg-white rounded-lg border shadow overflow-hidden">
      <div class="p-3 bg-slate-100 border-b font-bold text-xs">Presupuestos creados</div>
      <div class="table-responsive max-h-[500px] overflow-y-auto">
        <table id="tablaPresupuestos" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
            <tr><th class="p-2">Nombre</th><th class="p-2">Periodo</th>
                <th class="p-2 text-right">Monto total</th><th class="p-2 no-print">Acción</th></tr>
          </thead>
          <tbody id="bodyPresupuestos"></tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formPresupuesto').addEventListener('submit', guardarPresupuesto);
  renderTablaPresupuestos();
}

function calcularPresupuestoAutomatico() {
  const db = getDB();
  const crec = parseFloat(document.getElementById('presCrec').value) || 0;
  const cantMaterial = parseFloat(document.getElementById('presCantMaterial').value) || 1;

  const cuentasSel = Array.from(document.querySelectorAll('#presCuentas input:checked'))
    .map(i => i.dataset.cuenta);
  const productosSel = Array.from(document.querySelectorAll('#presMateriales input:checked'))
    .map(i => i.dataset.producto);

  if (!cuentasSel.length && !productosSel.length) {
    return mostrarAlerta('Selecciona al menos una cuenta o material.', 'error');
  }

  // Cuentas: promedio últimos 3 meses
  const resultadoCuentas = cuentasSel.map(cod => {
    const info = db.planDeCuentas.find(c => c.codigo === cod);
    const meses = {};
    db.libroDiario.filter(a => a.empresa === db.empresaActual).forEach(a => {
      a.lineas.forEach(l => {
        if (l.cuenta === cod) {
          const nat = TIPOS_CUENTA[info.tipo].naturaleza;
          const monto = nat === 'DEBITO' ? (l.debe - l.haber) : (l.haber - l.debe);
          const mes = a.fecha.slice(0, 7);
          meses[mes] = (meses[mes] || 0) + monto;
        }
      });
    });
    const ultimos = Object.entries(meses).sort().slice(-3).map(([, v]) => v);
    const prom = ultimos.length ? ultimos.reduce((a, b) => a + b, 0) / ultimos.length : 0;
    return {
      tipo: 'cuenta', codigo: cod, nombre: info.nombre,
      base: prom, proyectado: prom * (1 + crec / 100)
    };
  });

  // Materiales: costo × cantidad estimada × (1 + crecimiento)
  const resultadoMateriales = productosSel.map(cod => {
    const p = db.productos.find(x => x.codigo === cod && x.empresa === db.empresaActual);
    const base = p.costo * cantMaterial;
    return {
      tipo: 'material', codigo: cod, nombre: p.nombre,
      base, proyectado: base * (1 + crec / 100),
      unidad: p.unidad, cantidad: cantMaterial, costo: p.costo
    };
  });

  const todas = [...resultadoCuentas, ...resultadoMateriales];
  const totalProy = todas.reduce((s, r) => s + r.proyectado, 0);

  document.getElementById('presResultado').innerHTML = `
    <table class="w-full text-[11px] border">
      <thead class="bg-slate-800 text-white text-[9px]">
        <tr><th class="p-2">Tipo</th><th class="p-2">Código</th><th class="p-2">Nombre</th>
            <th class="p-2 text-right">Base</th><th class="p-2 text-right">Proyectado</th></tr>
      </thead>
      <tbody>
        ${todas.map(r => `
          <tr class="border-b">
            <td class="p-2">${r.tipo === 'cuenta' ? '📊 Cuenta' : '📦 Material'}</td>
            <td class="p-2 mono">${r.codigo}</td>
            <td class="p-2">${r.nombre}${r.tipo === 'material' ? ` <span class="text-slate-500">(${r.cantidad} ${r.unidad})</span>` : ''}</td>
            <td class="p-2 text-right mono">${fmtNum(r.base)}</td>
            <td class="p-2 text-right mono font-bold text-emerald-700">${fmtNum(r.proyectado)}</td>
          </tr>
        `).join('')}
        <tr class="bg-slate-100 font-bold">
          <td colspan="4" class="p-2 text-right">TOTAL PROYECTADO</td>
          <td class="p-2 text-right mono text-emerald-700">${fmtNum(totalProy)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function guardarPresupuesto(e) {
  e.preventDefault();
  const db = getDB();
  const nombre = document.getElementById('presNombre').value.trim();
  const desde = document.getElementById('presDesde').value;
  const hasta = document.getElementById('presHasta').value;
  if (desde > hasta) return mostrarAlerta('Rango inválido.', 'error');

  const filas = document.querySelectorAll('#presResultado tbody tr');
  if (!filas.length) return mostrarAlerta('Calcula el presupuesto primero.', 'error');

  const detalle = [];
  filas.forEach((tr, idx) => {
    const cel = tr.querySelectorAll('td');
    if (cel.length < 5) return; // skip total row
    const montoTxt = cel[4].textContent.replace(/\./g, '').replace(',', '.');
    const monto = parseFloat(montoTxt) || 0;
    detalle.push({
      tipo: cel[0].textContent.trim(),
      codigo: cel[1].textContent.trim(),
      nombre: cel[2].textContent.trim(),
      monto
    });
  });

  db.presupuestos.push({ id: Date.now(), nombre, desde, hasta, detalle, empresa: db.empresaActual });
  saveDB(db);
  registrarAuditoria('PRESUPUESTOS', 'Creación', nombre);
  renderTablaPresupuestos();
  document.getElementById('formPresupuesto').reset();
  document.getElementById('presResultado').innerHTML = '';
  mostrarAlerta('Presupuesto guardado.');
}

function renderTablaPresupuestos() {
  const db = getDB();
  const total = p => p.detalle.reduce((s, d) => s + d.monto, 0);
  document.getElementById('bodyPresupuestos').innerHTML = db.presupuestos
    .filter(p => p.empresa === db.empresaActual)
    .map(p => `
      <tr class="border-b hover:bg-slate-50">
        <td class="p-2 font-bold">${p.nombre}</td>
        <td class="p-2 mono">${fmtFecha(p.desde)} → ${fmtFecha(p.hasta)}</td>
        <td class="p-2 text-right mono font-bold">${fmtBs(total(p))}</td>
        <td class="p-2 text-center no-print">
          <button onclick="eliminarPresupuesto(${p.id})" class="text-red-500"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="4" class="p-4 text-center text-slate-500">Sin presupuestos</td></tr>';
}

function eliminarPresupuesto(id) {
  const db = getDB();
  db.presupuestos = db.presupuestos.filter(p => p.id !== id);
  saveDB(db);
  renderTablaPresupuestos();
  mostrarAlerta('Presupuesto eliminado.', 'error');
}