/* ============================================================
   NÓMINA — Venezuela (LOTTT + Ley IVSS + RPE + FAOV + INCE)
   ============================================================ */

function renderNomina(container) {
  const db = getDB();
  const empleados = db.nomina || [];
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Nómina</h1>

    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <h2 class="text-sm font-bold mb-3 pb-2 border-b">Registrar empleado</h2>
      <form id="formEmpleado" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div class="sm:col-span-2 lg:col-span-1">
          <label class="block text-xs font-medium mb-1">Cédula</label>
          <input id="empCedula" placeholder="V-12345678" required class="w-full text-xs p-2 border rounded mono" oninput="previewEmpRIF()">
          <p id="empRifMsg" class="text-[10px] mt-1"></p>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">Nombre completo</label>
          <input id="empNombre" placeholder="Nombre y apellido" required class="w-full text-xs p-2 border rounded">
        </div>
        <div><label class="block text-xs font-medium mb-1">Cargo</label>
          <input id="empCargo" placeholder="Cargo" class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Sueldo mensual (.Bs)</label>
          <input type="number" step="0.01" id="empSueldo" placeholder="0.00" required class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">Fecha ingreso</label>
          <input type="date" id="empFechaIngreso" value="${hoyISO()}" class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Prima antigüedad (%)</label>
          <input type="number" step="0.01" id="empPrima" placeholder="0" value="0" class="w-full text-xs p-2 border rounded mono"></div>
        <div><label class="block text-xs font-medium mb-1">N° hijos</label>
          <input type="number" id="empHijos" placeholder="0" value="0" class="w-full text-xs p-2 border rounded mono"></div>
        <button class="sm:col-span-2 lg:col-span-3 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold">
          <i class="fa-solid fa-user-plus mr-1"></i> Agregar empleado
        </button>
      </form>
    </div>

    <div class="bg-white rounded-lg border shadow overflow-hidden mb-4">
      <div class="p-3 bg-slate-100 border-b font-bold text-xs flex justify-between flex-wrap gap-2">
        <span>Empleados registrados</span>
        <button onclick="generarNominaMensual()" class="bg-amber-500 text-slate-950 text-xs px-3 py-1.5 rounded font-bold">
          <i class="fa-solid fa-calculator"></i> Generar nómina del mes
        </button>
      </div>
      <div class="table-responsive max-h-[400px] overflow-y-auto">
        <table id="tablaEmpleados" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
            <tr><th class="p-2">Cédula</th><th class="p-2">Nombre</th><th class="p-2">Cargo</th>
                <th class="p-2 text-right">Sueldo</th><th class="p-2">Ingreso</th>
                <th class="p-2 no-print">Acción</th></tr>
          </thead>
          <tbody id="bodyEmpleados"></tbody>
        </table>
      </div>
    </div>

    <div class="bg-white rounded-lg border shadow overflow-hidden">
      <div class="p-3 bg-slate-100 border-b font-bold text-xs">Nóminas generadas</div>
      <div class="table-responsive max-h-[500px] overflow-y-auto">
        <table id="tablaNominas" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
            <tr><th class="p-2">Periodo</th><th class="p-2">Empleado</th>
                <th class="p-2 text-right">Sueldo</th>
                <th class="p-2 text-right">IVSS</th>
                <th class="p-2 text-right">RPE</th>
                <th class="p-2 text-right">FAOV</th>
                <th class="p-2 text-right">Paro Forz.</th>
                <th class="p-2 text-right">Neto</th></tr>
          </thead>
          <tbody id="bodyNominas"></tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formEmpleado').addEventListener('submit', guardarEmpleado);
  renderTablaEmpleados();
  renderTablaNominas();
}

function previewEmpRIF() {
  const rif = document.getElementById('empCedula').value;
  const msg = document.getElementById('empRifMsg');
  if (!rif) { msg.textContent = ''; return; }
  const r = validarRIF(rif);
  msg.textContent = r.valido ? `✅ Cédula válida → ${formatearRIF(rif)}` : `❌ ${r.mensaje}`;
  msg.className = 'text-[10px] mt-1 ' + (r.valido ? 'text-emerald-600' : 'text-red-600');
}

function guardarEmpleado(e) {
  e.preventDefault();
  const db = getDB();
  const cedulaRaw = document.getElementById('empCedula').value.trim();
  const val = validarRIF(cedulaRaw);
  if (!val.valido) return mostrarAlerta(`Cédula inválida: ${val.mensaje}`, 'error');
  const cedula = formatearRIF(cedulaRaw);
  if (db.nomina.some(n => n.cedula === cedula)) return mostrarAlerta('Empleado ya registrado.', 'error');
  db.nomina.push({
    id: Date.now(),
    cedula,
    nombre: document.getElementById('empNombre').value.trim(),
    cargo: document.getElementById('empCargo').value.trim(),
    sueldo: parseFloat(document.getElementById('empSueldo').value),
    fechaIngreso: document.getElementById('empFechaIngreso').value,
    prima: parseFloat(document.getElementById('empPrima').value) || 0,
    hijos: parseInt(document.getElementById('empHijos').value) || 0,
    empresa: db.empresaActual
  });
  saveDB(db);
  registrarAuditoria('NÓMINA', 'Empleado agregado', cedula);
  e.target.reset();
  document.getElementById('empFechaIngreso').value = hoyISO();
  document.getElementById('empRifMsg').textContent = '';
  renderTablaEmpleados();
  mostrarAlerta('Empleado registrado.');
}

function renderTablaEmpleados() {
  const db = getDB();
  document.getElementById('bodyEmpleados').innerHTML = db.nomina
    .filter(e => e.empresa === db.empresaActual)
    .map(e => `
      <tr class="border-b hover:bg-slate-50">
        <td class="p-2 mono">${e.cedula}</td>
        <td class="p-2">${e.nombre}</td>
        <td class="p-2">${e.cargo || '—'}</td>
        <td class="p-2 text-right mono">${fmtNum(e.sueldo)}</td>
        <td class="p-2 mono">${fmtFecha(e.fechaIngreso)}</td>
        <td class="p-2 text-center no-print">
          <button onclick="eliminarEmpleado(${e.id})" class="text-red-500"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="6" class="p-4 text-center text-slate-500">Sin empleados</td></tr>';
}

function eliminarEmpleado(id) {
  const db = getDB();
  db.nomina = db.nomina.filter(e => e.id !== id);
  saveDB(db);
  renderTablaEmpleados();
  mostrarAlerta('Empleado eliminado.', 'error');
}

function generarNominaMensual() {
  const db = getDB();
  const empleados = db.nomina.filter(e => e.empresa === db.empresaActual);
  if (empleados.length === 0) return mostrarAlerta('No hay empleados.', 'error');
  const periodo = prompt('Periodo (YYYY-MM):', new Date().toISOString().slice(0, 7));
  if (!periodo) return;

  const detalle = empleados.map(e => {
    const sueldoBase = e.sueldo;
    const prima = sueldoBase * (e.prima / 100);
    const sueldoIntegral = sueldoBase + prima;
    // Deducciones obrero
    const ivssObrero = sueldoIntegral * CONFIG.IVSS_OBRERO;
    const rpeObrero = sueldoIntegral * CONFIG.RPE_PATRONO; // RPE solo patrono, pero informativo
    const faovObrero = sueldoIntegral * CONFIG.FAOV_OBRERO;
    const paroObrero = sueldoIntegral * CONFIG.PARO_FORZOSO_OBRERO;
    // Aportes patronales
    const ivssPatrono = sueldoIntegral * CONFIG.IVSS_PATRONO;
    const rpePatrono = sueldoIntegral * CONFIG.RPE_PATRONO;
    const faovPatrono = sueldoIntegral * CONFIG.FAOV_PATRONO;
    const incePatrono = sueldoIntegral * CONFIG.INCE_PATRONO;
    const paroPatrono = sueldoIntegral * CONFIG.PARO_FORZOSO_PATRONO;
    const deducciones = ivssObrero + faovObrero + paroObrero;
    const neto = sueldoIntegral - deducciones;
    return { cedula: e.cedula, nombre: e.nombre, sueldoBase, prima, sueldoIntegral,
      ivssObrero, rpeObrero, faovObrero, paroObrero,
      ivssPatrono, rpePatrono, faovPatrono, incePatrono, paroPatrono,
      deducciones, neto };
  });

  const nomina = { id: Date.now(), periodo, detalle, empresa: db.empresaActual };
  db.nominaMes = db.nominaMes || [];
  db.nominaMes.push(nomina);

  // Asiento de nómina
  const num = generarNumeroAsiento();
  const totSueldo = detalle.reduce((s, d) => s + d.sueldoIntegral, 0);
  const totDed = detalle.reduce((s, d) => s + d.deducciones, 0);
  const totPatrono = detalle.reduce((s, d) => s + d.ivssPatrono + d.rpePatrono + d.faovPatrono + d.incePatrono + d.paroPatrono, 0);
  const lineas = [
    { cuenta: '6.1.01.01', detalle: `Nómina ${periodo}`, debe: totSueldo, haber: 0 },
    { cuenta: '6.1.02.01', detalle: `Cargas patronales ${periodo}`, debe: totPatrono, haber: 0 },
    { cuenta: '2.1.03.01', detalle: 'Sueldos por pagar', debe: 0, haber: totSueldo - totDed },
    { cuenta: '2.1.04.01', detalle: 'Retenciones laborales', debe: 0, haber: totDed + totPatrono }
  ];
  db.libroDiario.push({ num, fecha: hoyISO(), concepto: `Nómina ${periodo}`, lineas,
    total: totSueldo + totPatrono, empresa: db.empresaActual, creado: new Date().toISOString() });

  saveDB(db);
  registrarAuditoria('NÓMINA', 'Generación', periodo);
  renderTablaNominas();
  mostrarAlerta(`Nómina ${periodo} generada con ${detalle.length} empleados.`);
}

function renderTablaNominas() {
  const db = getDB();
  const nominas = db.nominaMes || [];
  const rows = [];
  nominas.filter(n => n.empresa === db.empresaActual).forEach(n => {
    n.detalle.forEach((d, i) => {
      rows.push(`<tr class="border-b hover:bg-slate-50">
        ${i === 0 ? `<td class="p-2 mono font-bold" rowspan="${n.detalle.length}">${n.periodo}</td>` : ''}
        <td class="p-2">${d.nombre}</td>
        <td class="p-2 text-right mono">${fmtNum(d.sueldoIntegral)}</td>
        <td class="p-2 text-right mono">${fmtNum(d.ivssObrero)}</td>
        <td class="p-2 text-right mono">${fmtNum(d.rpeObrero)}</td>
        <td class="p-2 text-right mono">${fmtNum(d.faovObrero)}</td>
        <td class="p-2 text-right mono">${fmtNum(d.paroObrero)}</td>
        <td class="p-2 text-right mono font-bold text-emerald-700">${fmtNum(d.neto)}</td>
      </tr>`);
    });
  });
  document.getElementById('bodyNominas').innerHTML = rows.join('') ||
    '<tr><td colspan="8" class="p-4 text-center text-slate-500">Sin nóminas generadas</td></tr>';
}