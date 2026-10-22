function periodoCerrado(fecha) {
  const db = getDB();
  return db.cierres.some(c =>
    c.empresa === db.empresaActual && c.estado === 'CERRADO' &&
    fechaEnPeriodo(fecha, c.desde, c.hasta));
}

function renderCierres(container) {
  const db = getDB();
  const lista = db.cierres.filter(c => c.empresa === db.empresaActual);
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Cierres y Aperturas</h1>
    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <form id="formCierre" class="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <select id="cierreTipo" class="text-xs p-2 border rounded">
          <option value="DIARIO">Cierre Diario</option>
          <option value="MENSUAL">Cierre Mensual</option>
          <option value="ANUAL">Cierre Anual</option>
        </select>
        <input type="date" id="cierreDesde" required class="text-xs p-2 border rounded">
        <input type="date" id="cierreHasta" required class="text-xs p-2 border rounded">
        <button class="bg-slate-800 text-white rounded text-xs font-bold">Cerrar</button>
      </form>
    </div>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="table-responsive">
        <table class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">Tipo</th><th class="p-2">Desde</th><th class="p-2">Hasta</th>
                <th class="p-2">Estado</th><th class="p-2">Acción</th></tr>
          </thead>
          <tbody>
            ${lista.map(c => `
              <tr class="border-b">
                <td class="p-2">${c.tipo}</td>
                <td class="p-2 mono">${fmtFecha(c.desde)}</td>
                <td class="p-2 mono">${fmtFecha(c.hasta)}</td>
                <td class="p-2"><span class="${c.estado === 'CERRADO' ? 'text-red-600' : 'text-emerald-600'} font-bold">${c.estado}</span></td>
                <td class="p-2">${c.estado === 'CERRADO' ? `<button onclick="reaperturar('${c.id}')" class="text-amber-600 text-xs underline">Reaperturar</button>` : '—'}</td>
              </tr>
            `).join('') || '<tr><td colspan="5" class="p-4 text-center text-slate-500">Sin cierres</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formCierre').addEventListener('submit', e => {
    e.preventDefault();
    const db = getDB();
    const desde = document.getElementById('cierreDesde').value;
    const hasta = document.getElementById('cierreHasta').value;
    if (desde > hasta) return mostrarAlerta('Rango inválido.', 'error');
    db.cierres.push({ id: 'C' + Date.now(), tipo: document.getElementById('cierreTipo').value,
      desde, hasta, estado: 'CERRADO', empresa: db.empresaActual, fechaCierre: new Date().toISOString() });
    saveDB(db);
    registrarAuditoria('CIERRE', document.getElementById('cierreTipo').value, `${desde} → ${hasta}`);
    renderCierres(container);
    mostrarAlerta('Período cerrado.');
  });
}

function reaperturar(id) {
  const db = getDB();
  const c = db.cierres.find(x => x.id === id);
  if (!c) return;
  if (!confirm(`¿Reaperturar ${c.desde} a ${c.hasta}?`)) return;
  c.estado = 'ABIERTO';
  saveDB(db);
  registrarAuditoria('REAPERTURA', 'Período', `${c.desde} → ${c.hasta}`);
  renderVistaActual();
  mostrarAlerta('Período reaperturado.');
}