function calcularSaldos() {
  const db = getDB();
  const saldos = {};
  db.planDeCuentas.forEach(c => saldos[c.codigo] = 0);
  db.libroDiario.filter(a => a.empresa === db.empresaActual).forEach(a =>
    a.lineas.forEach(l => {
      const info = db.planDeCuentas.find(c => c.codigo === l.cuenta);
      if (!info) return;
      const nat = TIPOS_CUENTA[info.tipo].naturaleza;
      saldos[l.cuenta] += nat === 'DEBITO' ? (l.debe - l.haber) : (l.haber - l.debe);
    })
  );
  return saldos;
}

function renderEstadoResultados(container) {
  const db = getDB();
  const s = calcularSaldos();
  const cuentasTipo = t => db.planDeCuentas.filter(c => c.tipo === t && c.nivel === 'DETALLE');
  const ingresos = cuentasTipo('INGRESOS');
  const costos = cuentasTipo('COSTOS');
  const gastos = cuentasTipo('GASTOS');
  const totIng = ingresos.reduce((a, c) => a + s[c.codigo], 0);
  const totCos = costos.reduce((a, c) => a + s[c.codigo], 0);
  const totGas = gastos.reduce((a, c) => a + s[c.codigo], 0);
  const bruto = totIng - totCos;
  const neto = bruto - totGas;
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Estado de Resultados (GyP)</h1>
      <div class="flex gap-2">
        <button onclick="exportarTablaExcel('tablaGyP','Estado_Resultados')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
        <button onclick="exportarSeccionPDF('estadoResultados','Estado_Resultados')" class="bg-red-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-pdf"></i> PDF</button>
      </div>
    </div>
    <div id="estadoResultados" class="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      <div class="text-center pb-4 mb-4 border-b">
        <h2 class="text-lg font-bold uppercase">${db.empresas.find(e => e.id === db.empresaActual).nombre}</h2>
        <h3 class="text-xs font-semibold">ESTADO DE RESULTADOS INTEGRALES</h3>
        <p class="text-[11px]">Expresado en Bolívares (.Bs)</p>
      </div>
      <table id="tablaGyP" class="w-full text-xs">
        <tbody>
          <tr class="bg-slate-50 font-bold"><td class="p-2">INGRESOS OPERACIONALES</td><td></td></tr>
          ${ingresos.map(c => `<tr><td class="p-1.5 pl-6">${c.nombre}</td><td class="p-1.5 text-right mono">${fmtNum(s[c.codigo])}</td></tr>`).join('')}
          <tr class="font-bold border-t"><td class="p-2">TOTAL INGRESOS</td><td class="p-2 text-right mono text-emerald-700">${fmtNum(totIng)}</td></tr>
          <tr class="bg-slate-50 font-bold"><td class="p-2">COSTO DE VENTAS</td><td></td></tr>
          ${costos.map(c => `<tr><td class="p-1.5 pl-6">${c.nombre}</td><td class="p-1.5 text-right mono">(${fmtNum(Math.abs(s[c.codigo]))})</td></tr>`).join('')}
          <tr class="font-bold border-t"><td class="p-2">TOTAL COSTOS</td><td class="p-2 text-right mono text-red-700">(${fmtNum(totCos)})</td></tr>
          <tr class="font-bold bg-amber-50"><td class="p-2">UTILIDAD BRUTA</td><td class="p-2 text-right mono">${fmtNum(bruto)}</td></tr>
          <tr class="bg-slate-50 font-bold"><td class="p-2">GASTOS OPERACIONALES</td><td></td></tr>
          ${gastos.map(c => `<tr><td class="p-1.5 pl-6">${c.nombre}</td><td class="p-1.5 text-right mono">(${fmtNum(s[c.codigo])})</td></tr>`).join('')}
          <tr class="font-bold border-t"><td class="p-2">TOTAL GASTOS</td><td class="p-2 text-right mono text-red-700">(${fmtNum(totGas)})</td></tr>
          <tr class="bg-slate-800 text-white font-bold">
            <td class="p-3">RESULTADO NETO DEL EJERCICIO</td>
            <td class="p-3 text-right mono">${fmtNum(neto)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderBalanceGeneral(container) {
  const db = getDB();
  const s = calcularSaldos();
  const activos = db.planDeCuentas.filter(c => c.tipo === 'ACTIVO' && c.nivel === 'DETALLE');
  const pasivos = db.planDeCuentas.filter(c => c.tipo === 'PASIVO' && c.nivel === 'DETALLE');
  const patrim = db.planDeCuentas.filter(c => c.tipo === 'PATRIMONIO' && c.nivel === 'DETALLE');
  const ing = db.planDeCuentas.filter(c => c.tipo === 'INGRESOS' && c.nivel === 'DETALLE').reduce((a,c) => a + s[c.codigo], 0);
  const cos = db.planDeCuentas.filter(c => c.tipo === 'COSTOS' && c.nivel === 'DETALLE').reduce((a,c) => a + s[c.codigo], 0);
  const gas = db.planDeCuentas.filter(c => c.tipo === 'GASTOS' && c.nivel === 'DETALLE').reduce((a,c) => a + s[c.codigo], 0);
  const utilidad = ing - cos - gas;
  const totAct = activos.reduce((a,c) => a + s[c.codigo], 0);
  const totPas = pasivos.reduce((a,c) => a + s[c.codigo], 0);
  const totPat = patrim.reduce((a,c) => a + s[c.codigo], 0) + utilidad;
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Estado de Situación Financiera</h1>
      <div class="flex gap-2">
        <button onclick="exportarTablaExcel('tablaBG','Balance_General')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
        <button onclick="exportarSeccionPDF('balanceGeneral','Balance_General')" class="bg-red-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-pdf"></i> PDF</button>
      </div>
    </div>
    <div id="balanceGeneral" class="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      <div class="text-center pb-4 mb-4 border-b">
        <h2 class="text-lg font-bold uppercase">${db.empresas.find(e => e.id === db.empresaActual).nombre}</h2>
        <h3 class="text-xs font-semibold">ESTADO DE SITUACIÓN FINANCIERA</h3>
        <p class="text-[11px]">Expresado en Bolívares (.Bs)</p>
      </div>
      <div id="tablaBG" class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div>
          <h4 class="font-bold border-b-2 border-slate-800 pb-1 mb-2">1. ACTIVOS</h4>
          ${activos.map(c => `<div class="flex justify-between pl-4 py-0.5"><span>${c.nombre}</span><span class="mono">${fmtNum(s[c.codigo])}</span></div>`).join('')}
          <div class="flex justify-between font-bold border-t pt-1 mt-2"><span>TOTAL ACTIVOS</span><span class="mono text-emerald-700">${fmtNum(totAct)}</span></div>
        </div>
        <div>
          <h4 class="font-bold border-b-2 border-slate-800 pb-1 mb-2">2. PASIVO Y PATRIMONIO</h4>
          <p class="font-semibold">Pasivo</p>
          ${pasivos.map(c => `<div class="flex justify-between pl-4 py-0.5"><span>${c.nombre}</span><span class="mono">${fmtNum(s[c.codigo])}</span></div>`).join('')}
          <div class="flex justify-between font-bold border-t pt-1 mt-1"><span>TOTAL PASIVO</span><span class="mono">${fmtNum(totPas)}</span></div>
          <p class="font-semibold pt-2">Patrimonio</p>
          ${patrim.map(c => `<div class="flex justify-between pl-4 py-0.5"><span>${c.nombre}</span><span class="mono">${fmtNum(s[c.codigo])}</span></div>`).join('')}
          <div class="flex justify-between pl-4 py-0.5"><span>Resultado del Ejercicio</span><span class="mono">${fmtNum(utilidad)}</span></div>
          <div class="flex justify-between font-bold border-t pt-1 mt-1"><span>TOTAL PATRIMONIO</span><span class="mono">${fmtNum(totPat)}</span></div>
          <div class="flex justify-between font-bold bg-slate-100 p-2 rounded border mt-3"><span>TOTAL PASIVO + PATRIMONIO</span><span class="mono text-emerald-700">${fmtNum(totPas + totPat)}</span></div>
        </div>
      </div>
    </div>
  `;
}

function exportarTablaExcel(id, filename) {
  const el = document.getElementById(id);
  if (!el) return mostrarAlerta('Tabla no encontrada.', 'error');
  const wb = XLSX.utils.table_to_book(el, { sheet: 'Reporte' });
  XLSX.writeFile(wb, `${filename}_${hoyISO()}.xlsx`);
  registrarAuditoria('REPORTES', 'Excel', filename);
}

function exportarSeccionPDF(id, filename) {
  const el = document.getElementById(id);
  if (!el) return mostrarAlerta('Sección no encontrada.', 'error');
  html2pdf().set({
    margin: 0.3, filename: `${filename}_${hoyISO()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(el).save().then(() => registrarAuditoria('REPORTES', 'PDF', filename));
}

function renderHistorialAuditoria(container) {
  const db = getDB();
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Auditoría</h1>
      <button onclick="exportarTablaExcel('tablaAuditoria','Auditoria')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
    </div>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="table-responsive max-h-[500px] overflow-y-auto">
        <table id="tablaAuditoria" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
            <tr><th class="p-2">Fecha</th><th class="p-2">Usuario</th><th class="p-2">Módulo</th>
                <th class="p-2">Acción</th><th class="p-2">Detalle</th></tr>
          </thead>
          <tbody>
            ${db.bitacora.slice(0, 200).map(b => `
              <tr class="border-b">
                <td class="p-2 mono">${new Date(b.fecha).toLocaleString('es-VE')}</td>
                <td class="p-2">${b.usuario}</td>
                <td class="p-2 font-bold">${b.modulo}</td>
                <td class="p-2">${b.accion}</td>
                <td class="p-2 text-slate-500">${b.detalles || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}