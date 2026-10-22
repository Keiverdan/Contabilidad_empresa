let lineasTemporales = [];

function renderAsientos(container) {
  lineasTemporales = [
    { cuenta: '', detalle: '', debe: 0, haber: 0 },
    { cuenta: '', detalle: '', debe: 0, haber: 0 }
  ];
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Asientos Contables</h1>
      <button onclick="abrirModalCopiar()" class="bg-slate-700 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-copy"></i> Copiar comprobante</button>
    </div>
    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div><label class="block text-xs font-medium mb-1">N° Comprobante</label>
          <input id="asientoNum" readonly class="w-full text-xs p-2 border rounded bg-slate-100 font-bold mono"></div>
        <div><label class="block text-xs font-medium mb-1">Fecha</label>
          <input type="date" id="asientoFecha" value="${hoyISO()}" class="w-full text-xs p-2 border rounded"></div>
        <div><label class="block text-xs font-medium mb-1">Concepto</label>
          <input id="asientoConcepto" placeholder="Glosa general" class="w-full text-xs p-2 border rounded"></div>
      </div>
      <div class="table-responsive mb-4">
        <table class="w-full text-xs border">
          <thead class="bg-slate-800 text-white text-[10px]">
            <tr><th class="p-2 text-left min-w-[200px]">Cuenta (imputable)</th>
                <th class="p-2 text-left min-w-[150px]">Detalle</th>
                <th class="p-2 text-right w-32">Debe</th><th class="p-2 text-right w-32">Haber</th><th class="p-2 w-10"></th></tr>
          </thead>
          <tbody id="asientoLineas"></tbody>
          <tfoot class="bg-slate-100 font-bold">
            <tr><td colspan="2" class="p-2 text-right">TOTALES</td>
                <td id="totalDebe" class="p-2 text-right mono text-emerald-700">0.00</td>
                <td id="totalHaber" class="p-2 text-right mono text-emerald-700">0.00</td><td></td></tr>
            <tr><td colspan="5" id="estadoCuadre" class="p-2 text-center text-xs font-bold">—</td></tr>
          </tfoot>
        </table>
      </div>
      <div class="flex flex-wrap justify-between gap-2">
        <button onclick="agregarLinea()" class="bg-slate-200 px-3 py-1.5 rounded text-xs"><i class="fa-solid fa-plus"></i> Añadir línea</button>
        <button onclick="guardarAsiento()" class="bg-amber-500 px-5 py-2 rounded text-xs font-bold"><i class="fa-solid fa-save"></i> Guardar asiento</button>
      </div>
    </div>
  `;
  document.getElementById('asientoNum').value = generarNumeroAsiento();
  renderLineasAsiento();
}

function renderLineasAsiento() {
  const db = getDB();
  const cuentas = db.planDeCuentas.filter(c => c.nivel === 'DETALLE')
    .sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }));
  document.getElementById('asientoLineas').innerHTML = lineasTemporales.map((l, i) => `
    <tr class="linea-asiento border-b">
      <td><select onchange="actualizarLinea(${i},'cuenta',this.value)" class="w-full p-1 border rounded text-xs">
        <option value="">— Seleccione —</option>
        ${cuentas.map(c => `<option value="${c.codigo}" ${l.cuenta === c.codigo ? 'selected' : ''}>${c.codigo} - ${c.nombre}</option>`).join('')}
      </select></td>
      <td><input type="text" value="${l.detalle || ''}" onchange="actualizarLinea(${i},'detalle',this.value)" class="w-full p-1 border rounded text-xs"></td>
      <td><input type="number" step="0.01" value="${l.debe || 0}" onchange="actualizarLinea(${i},'debe',this.value)" class="debe-input w-full p-1 border rounded text-xs"></td>
      <td><input type="number" step="0.01" value="${l.haber || 0}" onchange="actualizarLinea(${i},'haber',this.value)" class="haber-input w-full p-1 border rounded text-xs"></td>
      <td class="text-center"><button onclick="quitarLinea(${i})" class="text-red-500">&times;</button></td>
    </tr>
  `).join('');
  recalcularTotales();
}

function actualizarLinea(i, campo, valor) {
  if (campo === 'debe' || campo === 'haber') valor = parseFloat(valor) || 0;
  lineasTemporales[i][campo] = valor;
  recalcularTotales();
}

function agregarLinea() {
  lineasTemporales.push({ cuenta: '', detalle: '', debe: 0, haber: 0 });
  renderLineasAsiento();
}

function quitarLinea(i) {
  lineasTemporales.splice(i, 1);
  if (lineasTemporales.length === 0) lineasTemporales.push({ cuenta:'',detalle:'',debe:0,haber:0 });
  renderLineasAsiento();
}

function recalcularTotales() {
  const debe = lineasTemporales.reduce((s, l) => s + (Number(l.debe) || 0), 0);
  const haber = lineasTemporales.reduce((s, l) => s + (Number(l.haber) || 0), 0);
  document.getElementById('totalDebe').innerText = fmtNum(debe);
  document.getElementById('totalHaber').innerText = fmtNum(haber);
  const estado = document.getElementById('estadoCuadre');
  if (validarPartidaDoble(debe, haber)) {
    estado.innerText = '✓ ASIENTO CUADRADO';
    estado.className = 'p-2 text-center text-xs font-bold text-emerald-600';
  } else {
    estado.innerText = `✗ DESCUADRE: ${fmtNum(Math.abs(debe - haber))}`;
    estado.className = 'p-2 text-center text-xs font-bold text-red-600';
  }
}

function guardarAsiento() {
  const db = getDB();
  const fecha = document.getElementById('asientoFecha').value;
  const concepto = document.getElementById('asientoConcepto').value.trim();
  const num = document.getElementById('asientoNum').value;
  const validas = lineasTemporales.filter(l => l.cuenta && (l.debe > 0 || l.haber > 0));
  if (validas.length < 2) return mostrarAlerta('Se requieren al menos 2 líneas con monto.', 'error');
  if (!concepto) return mostrarAlerta('Falta concepto.', 'error');
  const debe = validas.reduce((s, l) => s + l.debe, 0);
  const haber = validas.reduce((s, l) => s + l.haber, 0);
  if (!validarPartidaDoble(debe, haber)) return mostrarAlerta('Asiento descuadrado.', 'error');
  if (periodoCerrado(fecha)) return mostrarAlerta('Período cerrado para esa fecha.', 'error');

  db.libroDiario.push({ num, fecha, concepto,
    lineas: validas.map(l => ({ ...l })), total: debe,
    empresa: db.empresaActual, creado: new Date().toISOString() });
  saveDB(db);
  registrarAuditoria('ASIENTO', 'Creación', `${num} - ${concepto}`);
  mostrarAlerta('Asiento guardado.');
  renderAsientos(document.getElementById('viewContainer'));
}

function abrirModalCopiar() {
  const db = getDB();
  const lista = db.libroDiario.slice(-30).reverse();
  const html = `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2" id="modalCopiar">
      <div class="bg-white rounded-lg p-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-bold text-sm">Copiar comprobante reciente</h3>
          <button onclick="document.getElementById('modalCopiar').remove()" class="text-slate-500 text-xl">&times;</button>
        </div>
        ${lista.length === 0 ? '<p class="text-xs text-slate-500">No hay asientos guardados.</p>' :
          lista.map(a => `
            <button onclick="copiarAsiento('${a.num}')" class="w-full text-left border rounded p-2 mb-2 hover:bg-slate-50 text-xs">
              <strong class="mono">${a.num}</strong> · ${fmtFecha(a.fecha)} · ${a.concepto}
              <span class="block text-slate-500">Total: ${fmtBs(a.total)}</span>
            </button>`).join('')}
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function copiarAsiento(num) {
  const db = getDB();
  const a = db.libroDiario.find(x => x.num === num);
  if (!a) return;
  lineasTemporales = a.lineas.map(l => ({ ...l }));
  renderLineasAsiento();
  document.getElementById('asientoConcepto').value = a.concepto + ' (copia)';
  document.getElementById('modalCopiar').remove();
  mostrarAlerta('Comprobante copiado al formulario.');
}