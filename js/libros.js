/* ============================================================
   LIBROS CONTABLES
   ============================================================ */

function renderLibroDiario(container) {
  const db = getDB();
  const asientos = db.libroDiario.filter(a => a.empresa === db.empresaActual)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Libro Diario</h1>
      <div class="flex gap-2">
        <button onclick="exportarTablaExcel('tablaLibroDiario','Libro_Diario')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
        <button onclick="exportarSeccionPDF('libroDiario','Libro_Diario')" class="bg-red-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-pdf"></i> PDF</button>
      </div>
    </div>
    <div id="libroDiario" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="table-responsive">
        <table id="tablaLibroDiario" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">N°</th><th class="p-2">Fecha</th><th class="p-2">Concepto</th>
                <th class="p-2">Cuenta</th><th class="p-2 text-right">Debe</th><th class="p-2 text-right">Haber</th></tr>
          </thead>
          <tbody>
            ${asientos.map(a => a.lineas.map((l, i) => `
              <tr class="border-b hover:bg-slate-50">
                ${i === 0 ? `<td class="p-2 mono font-bold" rowspan="${a.lineas.length}">${a.num}</td>
                             <td class="p-2 mono" rowspan="${a.lineas.length}">${fmtFecha(a.fecha)}</td>
                             <td class="p-2" rowspan="${a.lineas.length}">${a.concepto}</td>` : ''}
                <td class="p-2 mono">${l.cuenta} ${getNombreCuenta(l.cuenta)}</td>
                <td class="p-2 text-right mono">${l.debe ? fmtNum(l.debe) : ''}</td>
                <td class="p-2 text-right mono">${l.haber ? fmtNum(l.haber) : ''}</td>
              </tr>
            `).join('')).join('') || '<tr><td colspan="6" class="p-4 text-center text-slate-500">Sin movimientos</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLibroMayor(container) {
  const db = getDB();
  const cuentas = db.planDeCuentas.filter(c => c.nivel === 'DETALLE');
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Libro Mayor</h1>
    <div class="space-y-4">
      ${cuentas.map(c => {
        const mov = [];
        db.libroDiario.filter(a => a.empresa === db.empresaActual).forEach(a =>
          a.lineas.forEach(l => { if (l.cuenta === c.codigo) mov.push({ ...l, fecha: a.fecha, num: a.num, concepto: a.concepto }); })
        );
        if (!mov.length) return '';
        let saldo = 0;
        return `
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="bg-slate-100 p-2 font-bold text-xs">${c.codigo} — ${c.nombre} (${c.tipo})</div>
            <div class="table-responsive">
              <table class="w-full text-[11px]">
                <thead class="bg-slate-800 text-white text-[9px]">
                  <tr><th class="p-2">Fecha</th><th class="p-2">Comprobante</th><th class="p-2">Concepto</th>
                      <th class="p-2 text-right">Debe</th><th class="p-2 text-right">Haber</th><th class="p-2 text-right">Saldo</th></tr>
                </thead>
                <tbody>
                  ${mov.map(m => {
                    const nat = TIPOS_CUENTA[c.tipo].naturaleza;
                    saldo += nat === 'DEBITO' ? (m.debe - m.haber) : (m.haber - m.debe);
                    return `<tr class="border-b">
                      <td class="p-2 mono">${fmtFecha(m.fecha)}</td>
                      <td class="p-2 mono">${m.num}</td>
                      <td class="p-2">${m.concepto}</td>
                      <td class="p-2 text-right mono">${m.debe ? fmtNum(m.debe) : ''}</td>
                      <td class="p-2 text-right mono">${m.haber ? fmtNum(m.haber) : ''}</td>
                      <td class="p-2 text-right mono font-bold">${fmtNum(Math.abs(saldo))}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>`;
      }).join('') || '<p class="text-xs text-slate-500 p-4">Sin movimientos.</p>'}
    </div>
  `;
}

function renderBalanceComprobacion(container) {
  const db = getDB();
  const mov = {};
  db.libroDiario.filter(a => a.empresa === db.empresaActual).forEach(a =>
    a.lineas.forEach(l => {
      if (!mov[l.cuenta]) mov[l.cuenta] = { debe: 0, haber: 0 };
      mov[l.cuenta].debe += l.debe;
      mov[l.cuenta].haber += l.haber;
    })
  );
  const filas = Object.entries(mov).map(([cuenta, m]) => {
    const info = db.planDeCuentas.find(c => c.codigo === cuenta);
    const nat = info ? TIPOS_CUENTA[info.tipo].naturaleza : 'DEBITO';
    const saldo = nat === 'DEBITO' ? m.debe - m.haber : m.haber - m.debe;
    return { cuenta, nombre: info?.nombre || '—', tipo: info?.tipo || '—', debe: m.debe, haber: m.haber, saldo, nat };
  });
  const totDebe = filas.reduce((s, f) => s + f.debe, 0);
  const totHaber = filas.reduce((s, f) => s + f.haber, 0);
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Balance de Comprobación</h1>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="table-responsive">
        <table id="tablaComprobacion" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">Cuenta</th><th class="p-2">Nombre</th><th class="p-2">Tipo</th>
                <th class="p-2 text-right">Debe</th><th class="p-2 text-right">Haber</th><th class="p-2 text-right">Saldo</th></tr>
          </thead>
          <tbody>
            ${filas.map(f => `
              <tr class="border-b hover:bg-slate-50">
                <td class="p-2 mono font-bold">${f.cuenta}</td>
                <td class="p-2">${f.nombre}</td>
                <td class="p-2">${f.tipo}</td>
                <td class="p-2 text-right mono">${fmtNum(f.debe)}</td>
                <td class="p-2 text-right mono">${fmtNum(f.haber)}</td>
                <td class="p-2 text-right mono font-bold">${fmtNum(Math.abs(f.saldo))} ${f.saldo >= 0 ? (f.nat === 'DEBITO' ? 'D' : 'A') : (f.nat === 'DEBITO' ? 'A' : 'D')}</td>
              </tr>
            `).join('')}
            <tr class="bg-slate-100 font-bold">
              <td colspan="3" class="p-2 text-right">TOTALES</td>
              <td class="p-2 text-right mono">${fmtNum(totDebe)}</td>
              <td class="p-2 text-right mono">${fmtNum(totHaber)}</td>
              <td class="p-2 text-right mono">${Math.round(totDebe * 100) === Math.round(totHaber * 100) ? '✓ CUADRADO' : '✗ DESCUADRE'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLibroInventario(container) {
  const db = getDB();
  const inv = db.libroInventario.filter(i => i.empresa === db.empresaActual);
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Libro de Inventario</h1>
    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <form id="formInv" class="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input id="invFecha" type="date" value="${hoyISO()}" class="text-xs p-2 border rounded">
        <input id="invProducto" placeholder="Producto" class="text-xs p-2 border rounded">
        <input id="invCant" type="number" step="0.01" placeholder="Cantidad" class="text-xs p-2 border rounded mono">
        <input id="invCosto" type="number" step="0.01" placeholder="Costo unitario" class="text-xs p-2 border rounded mono">
        <button class="sm:col-span-4 bg-emerald-600 text-white py-2 rounded text-xs font-bold">Registrar entrada</button>
      </form>
    </div>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="table-responsive">
        <table class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">Fecha</th><th class="p-2">Producto</th><th class="p-2 text-right">Cantidad</th>
                <th class="p-2 text-right">Costo U.</th><th class="p-2 text-right">Total</th></tr>
          </thead>
          <tbody>
            ${inv.map(i => `
              <tr class="border-b"><td class="p-2 mono">${fmtFecha(i.fecha)}</td>
              <td class="p-2">${i.producto}</td>
              <td class="p-2 text-right mono">${i.cantidad}</td>
              <td class="p-2 text-right mono">${fmtNum(i.costo)}</td>
              <td class="p-2 text-right mono font-bold">${fmtNum(i.cantidad * i.costo)}</td></tr>
            `).join('') || '<tr><td colspan="5" class="p-4 text-center text-slate-500">Sin movimientos</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formInv').addEventListener('submit', e => {
    e.preventDefault();
    const db = getDB();
    db.libroInventario.push({
      fecha: document.getElementById('invFecha').value,
      producto: document.getElementById('invProducto').value,
      cantidad: parseFloat(document.getElementById('invCant').value),
      costo: parseFloat(document.getElementById('invCosto').value),
      empresa: db.empresaActual
    });
    saveDB(db); renderLibroInventario(container);
    mostrarAlerta('Entrada registrada.');
  });
}

function renderAuxiliares(container) {
  const db = getDB();
  const mov = db.libroDiario.filter(a => a.empresa === db.empresaActual);
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Libros Auxiliares por Tercero</h1>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="table-responsive">
        <table class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px]">
            <tr><th class="p-2">Cuenta</th><th class="p-2">Tercero</th>
                <th class="p-2 text-right">Debe</th><th class="p-2 text-right">Haber</th><th class="p-2 text-right">Saldo</th></tr>
          </thead>
          <tbody>
            ${(() => {
              const agg = {};
              mov.forEach(a => a.lineas.forEach(l => {
                if (l.cuenta === '1.1.02.01' || l.cuenta === '2.1.01.01') {
                  const key = l.cuenta + '|' + (l.detalle || '').replace(/^(CxC|CxP)\s*/, '');
                  if (!agg[key]) agg[key] = { cuenta: l.cuenta, tercero: key.split('|')[1], debe: 0, haber: 0 };
                  agg[key].debe += l.debe; agg[key].haber += l.haber;
                }
              }));
              return Object.values(agg).map(a => {
                const saldo = a.cuenta === '1.1.02.01' ? a.debe - a.haber : a.haber - a.debe;
                return `<tr class="border-b">
                  <td class="p-2 mono">${a.cuenta}</td>
                  <td class="p-2">${a.tercero || '(sin nombre)'}</td>
                  <td class="p-2 text-right mono">${fmtNum(a.debe)}</td>
                  <td class="p-2 text-right mono">${fmtNum(a.haber)}</td>
                  <td class="p-2 text-right mono font-bold">${fmtNum(Math.abs(saldo))}</td>
                </tr>`;
              }).join('');
            })() || '<tr><td colspan="5" class="p-4 text-center text-slate-500">Sin movimientos</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function getNombreCuenta(codigo) {
  return getDB().planDeCuentas.find(c => c.codigo === codigo)?.nombre || '';
}