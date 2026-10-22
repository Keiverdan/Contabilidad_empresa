function renderPlanCuentas(container) {
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Plan de Cuentas (VEN-NIF)</h1>
      <div class="flex gap-2">
        <button onclick="exportarTablaExcel('tablaPlanCuentas','Plan_de_Cuentas')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
        <button onclick="exportarSeccionPDF('planCuentas','Plan_de_Cuentas')" class="bg-red-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-pdf"></i> PDF</button>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-lg border shadow h-fit">
        <h2 class="text-sm font-semibold mb-3 pb-2 border-b">Nueva Cuenta</h2>
        <form id="formCuenta" class="space-y-2">
          <input id="ctaCodigo" placeholder="Código (1.1.01.01)" required class="w-full text-xs p-2 border rounded">
          <input id="ctaNombre" placeholder="Nombre" required class="w-full text-xs p-2 border rounded">
          <select id="ctaTipo" class="w-full text-xs p-2 border rounded">
            <option value="ACTIVO">ACTIVO</option><option value="PASIVO">PASIVO</option>
            <option value="PATRIMONIO">PATRIMONIO</option><option value="INGRESOS">INGRESOS</option>
            <option value="COSTOS">COSTOS</option><option value="GASTOS">GASTOS</option>
          </select>
          <select id="ctaNivel" class="w-full text-xs p-2 border rounded">
            <option value="TITULO">TÍTULO (no imputable)</option>
            <option value="DETALLE" selected>DETALLE (imputable)</option>
          </select>
          <button class="w-full bg-slate-800 text-white py-2 rounded text-xs">Guardar</button>
        </form>
      </div>
      <div class="lg:col-span-2 bg-white rounded-lg border shadow overflow-hidden">
        <div class="p-3 bg-slate-100 border-b flex justify-between items-center flex-wrap gap-2">
          <span class="text-xs font-bold">Estructura</span>
          <input type="text" id="filtroCuentas" placeholder="Buscar…" oninput="filtrarPlanCuentas(this.value)" class="text-xs p-1.5 border rounded w-full sm:w-64">
        </div>
        <div class="table-responsive max-h-[500px] overflow-y-auto">
          <table id="tablaPlanCuentas" class="w-full text-xs">
            <thead class="bg-slate-800 text-white text-[10px] sticky top-0">
              <tr><th class="p-2 text-left">Código</th><th class="p-2 text-left">Nombre</th>
                  <th class="p-2">Tipo</th><th class="p-2">Nivel</th><th class="p-2 no-print">Acción</th></tr>
            </thead>
            <tbody id="bodyPlanCuentas"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  renderTablaPlanCuentas();
  document.getElementById('formCuenta').addEventListener('submit', guardarCuenta);
}

function renderTablaPlanCuentas(filtro = '') {
  const db = getDB();
  const q = filtro.toLowerCase();
  const lista = db.planDeCuentas
    .filter(c => !q || c.codigo.toLowerCase().includes(q) || c.nombre.toLowerCase().includes(q))
    .sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }));
  const badge = { ACTIVO:'badge-activo', PASIVO:'badge-pasivo', PATRIMONIO:'badge-patrimonio',
    INGRESOS:'badge-ingreso', COSTOS:'badge-costo', GASTOS:'badge-gasto' };
  document.getElementById('bodyPlanCuentas').innerHTML = lista.map(c => `
    <tr class="border-b hover:bg-slate-50">
      <td class="p-2 mono font-bold">${c.codigo}</td>
      <td class="p-2 ${c.nivel === 'TITULO' ? 'font-bold' : ''}">${c.nombre}</td>
      <td class="p-2"><span class="badge ${badge[c.tipo] || ''}">${c.tipo}</span></td>
      <td class="p-2 text-[10px]">${c.nivel}</td>
      <td class="p-2 text-center no-print"><button onclick="eliminarCuenta('${c.codigo}')" class="text-red-500"><i class="fa-solid fa-trash"></i></button></td>
    </tr>
  `).join('');
}

function guardarCuenta(e) {
  e.preventDefault();
  const db = getDB();
  const codigo = document.getElementById('ctaCodigo').value.trim();
  const nombre = document.getElementById('ctaNombre').value.trim();
  if (db.planDeCuentas.some(c => c.codigo === codigo)) return mostrarAlerta('Código ya existe.', 'error');
  db.planDeCuentas.push({ codigo, nombre,
    tipo: document.getElementById('ctaTipo').value,
    nivel: document.getElementById('ctaNivel').value });
  saveDB(db);
  registrarAuditoria('PLAN DE CUENTAS', 'Creación', `${codigo} - ${nombre}`);
  document.getElementById('formCuenta').reset();
  renderTablaPlanCuentas();
  mostrarAlerta('Cuenta agregada.');
}

function eliminarCuenta(codigo) {
  const db = getDB();
  if (db.libroDiario.some(a => a.lineas.some(l => l.cuenta === codigo))) {
    return mostrarAlerta('Cuenta con movimientos, no se puede borrar.', 'error');
  }
  db.planDeCuentas = db.planDeCuentas.filter(c => c.codigo !== codigo);
  saveDB(db);
  renderTablaPlanCuentas();
  mostrarAlerta('Cuenta eliminada.', 'error');
}

function filtrarPlanCuentas(v) { renderTablaPlanCuentas(v); }

function renderImportarPlan(container) {
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Importar Plan de Cuentas CSV</h1>
    <div class="bg-white p-6 rounded-lg border shadow max-w-2xl">
      <div class="border-2 border-dashed p-6 text-center rounded-lg">
        <i class="fa-solid fa-file-csv text-4xl text-amber-500 mb-2"></i>
        <p class="text-xs mb-2">Formato: <code>Codigo,Nombre,Tipo,Nivel</code></p>
        <input type="file" id="fileCsvCuentas" accept=".csv" class="text-xs">
      </div>
      <div class="mt-4 flex flex-wrap justify-between gap-2">
        <button onclick="descargarPlantillaCSV()" class="text-xs underline">Descargar plantilla</button>
        <button onclick="procesarCSV()" class="bg-amber-500 px-4 py-2 rounded text-xs font-bold">Procesar</button>
      </div>
    </div>
  `;
}

function procesarCSV() {
  const file = document.getElementById('fileCsvCuentas').files[0];
  if (!file) return mostrarAlerta('Selecciona un archivo.', 'error');
  const reader = new FileReader();
  reader.onload = e => {
    const db = getDB();
    let n = 0;
    e.target.result.split('\n').filter(l => l.trim()).slice(1).forEach(linea => {
      const cols = linea.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (cols.length >= 2 && !db.planDeCuentas.some(c => c.codigo === cols[0])) {
        db.planDeCuentas.push({ codigo: cols[0], nombre: cols[1],
          tipo: cols[2] || 'ACTIVO', nivel: cols[3] || 'DETALLE' });
        n++;
      }
    });
    saveDB(db);
    registrarAuditoria('IMPORTAR', 'CSV', `${n} cuentas`);
    mostrarAlerta(`${n} cuentas importadas.`);
    renderVistaActual();
  };
  reader.readAsText(file);
}

function descargarPlantillaCSV() {
  const contenido = 'Codigo,Nombre,Tipo,Nivel\n1.1.01.03,Caja Divisas,ACTIVO,DETALLE\n2.1.03.01,ISLR por Pagar,PASIVO,DETALLE';
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'plantilla_cuentas.csv';
  a.click();
}