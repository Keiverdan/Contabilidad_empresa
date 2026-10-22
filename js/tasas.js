function renderTiposCambio(container) {
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Tasa BCV e Historial</h1>
      <button onclick="exportarTablaExcel('tablaHistorialTasas','Historial_Tasas')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-lg border shadow">
        <h2 class="text-sm font-semibold mb-3 pb-2 border-b">Actualizar Tasa</h2>
        <form id="formTasa" class="space-y-2">
          <input type="date" id="tasaFecha" required class="w-full text-xs p-2 border rounded" value="${hoyISO()}">
          <input type="number" step="0.0001" id="tasaValor" placeholder="36.50" required class="w-full text-xs p-2 border rounded mono">
          <button class="w-full bg-emerald-600 text-white py-2 rounded text-xs">Establecer</button>
        </form>
      </div>
      <div class="lg:col-span-2 bg-white rounded-lg border shadow overflow-hidden">
        <div class="p-3 bg-slate-100 border-b font-bold text-xs">Histórico</div>
        <div class="table-responsive max-h-[450px] overflow-y-auto">
          <table id="tablaHistorialTasas" class="w-full text-xs">
            <thead class="bg-slate-800 text-white text-[10px] sticky top-0">
              <tr><th class="p-2 text-left">Fecha</th><th class="p-2">Moneda</th>
                  <th class="p-2 text-right">Tasa</th><th class="p-2 no-print">Acción</th></tr>
            </thead>
            <tbody id="bodyTasas"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  document.getElementById('formTasa').addEventListener('submit', e => {
    e.preventDefault();
    const fecha = document.getElementById('tasaFecha').value;
    const tasa = parseFloat(document.getElementById('tasaValor').value);
    if (tasa <= 0) return mostrarAlerta('Tasa inválida.', 'error');
    const db = getDB();
    db.historicoTasas.unshift({ fecha, moneda: 'USD', tasa });
    saveDB(db);
    registrarAuditoria('TASA BCV', 'Actualización', `${tasa} (${fecha})`);
    document.getElementById('tcLabel').innerText = tasa.toFixed(2);
    renderTablaTasas();
    mostrarAlerta('Tasa actualizada.');
  });
  renderTablaTasas();
}

function renderTablaTasas() {
  const db = getDB();
  document.getElementById('bodyTasas').innerHTML = db.historicoTasas.map((t, i) => `
    <tr class="border-b hover:bg-slate-50">
      <td class="p-2 mono">${t.fecha}</td>
      <td class="p-2">${t.moneda}</td>
      <td class="p-2 text-right mono font-bold text-emerald-700">${parseFloat(t.tasa).toFixed(2)} .Bs</td>
      <td class="p-2 text-center no-print"><button onclick="eliminarTasa(${i})" class="text-red-500"><i class="fa-solid fa-trash"></i></button></td>
    </tr>
  `).join('');
  document.getElementById('tcLabel').innerText = (db.historicoTasas[0]?.tasa || 0).toFixed(2);
}

function eliminarTasa(i) {
  const db = getDB();
  db.historicoTasas.splice(i, 1);
  saveDB(db);
  renderTablaTasas();
}