/* ============================================================
   CLIENTES Y PROVEEDORES (personas naturales y jurídicas)
   ============================================================ */

function renderTerceros(container) {
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h1 class="text-xl sm:text-2xl font-bold">Clientes y Proveedores</h1>
      <button onclick="exportarTablaExcel('tablaTerceros','Terceros')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded"><i class="fa-solid fa-file-excel"></i> Excel</button>
    </div>

    <div class="bg-white p-4 rounded-lg border shadow mb-4">
      <h2 class="text-sm font-bold mb-3 pb-2 border-b">Registrar nuevo tercero</h2>
      <form id="formTercero" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-medium mb-1">Tipo de persona</label>
          <select id="terPersona" class="w-full text-xs p-2 border rounded" onchange="actualizarTipoRIF()">
            <option value="NATURAL">👤 Persona Natural (V / E)</option>
            <option value="JURIDICA">🏢 Persona Jurídica (J / G / C / P / N)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Tipo RIF</label>
          <select id="terTipoRIF" class="w-full text-xs p-2 border rounded">
            <option value="V">V — Venezolano</option>
            <option value="E">E — Extranjero</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Número RIF / Cédula</label>
          <input id="terNumRIF" placeholder="12345678" class="w-full text-xs p-2 border rounded mono" oninput="previewRIF()">
          <p id="rifPreview" class="text-[10px] mt-1 text-slate-500"></p>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">Nombre / Razón social</label>
          <input id="terNombre" placeholder="Ej: María Pérez" required class="w-full text-xs p-2 border rounded">
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Categoría</label>
          <select id="terTipo" class="w-full text-xs p-2 border rounded">
            <option value="CLIENTE">Cliente</option>
            <option value="PROVEEDOR">Proveedor</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Teléfono</label>
          <input id="terTelefono" placeholder="0414-1234567" class="w-full text-xs p-2 border rounded">
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1">📧 Domicilio electrónico (email)</label>
          <input type="email" id="terEmail" placeholder="cliente@example.com" class="w-full text-xs p-2 border rounded">
        </div>
        <div class="sm:col-span-2 lg:col-span-3">
          <label class="block text-xs font-medium mb-1">Dirección fiscal</label>
          <input id="terDireccion" placeholder="Dirección completa" class="w-full text-xs p-2 border rounded">
        </div>
        <div class="sm:col-span-2 lg:col-span-3 flex justify-end">
          <button class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded text-xs">
            <i class="fa-solid fa-save mr-1"></i> Guardar tercero
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-3 bg-slate-100 border-b flex flex-wrap justify-between items-center gap-2">
        <span class="text-xs font-bold">Catálogo de terceros</span>
        <input type="text" id="filtroTerceros" placeholder="Buscar RIF, nombre o email…" oninput="filtrarTerceros(this.value)" class="text-xs p-1.5 border rounded w-full sm:w-64">
      </div>
      <div class="table-responsive max-h-[500px] overflow-y-auto">
        <table id="tablaTerceros" class="w-full text-[11px]">
          <thead class="bg-slate-800 text-white text-[9px] sticky top-0">
            <tr><th class="p-2">RIF</th><th class="p-2">Nombre</th><th class="p-2">Persona</th>
                <th class="p-2">Categoría</th><th class="p-2">Teléfono</th>
                <th class="p-2">📧 Email</th><th class="p-2 no-print">Acción</th></tr>
          </thead>
          <tbody id="bodyTerceros"></tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('formTercero').addEventListener('submit', guardarTercero);
  renderTablaTerceros();
}

function actualizarTipoRIF() {
  const persona = document.getElementById('terPersona').value;
  const sel = document.getElementById('terTipoRIF');
  if (persona === 'NATURAL') {
    sel.innerHTML = `<option value="V">V — Venezolano</option>
                     <option value="E">E — Extranjero</option>`;
  } else {
    sel.innerHTML = `<option value="J">J — Jurídico</option>
                     <option value="G">G — Gobierno</option>
                     <option value="C">C — Consejo Comunal</option>
                     <option value="P">P — Pasaporte</option>
                     <option value="N">N — Natural extranjero residenciado</option>`;
  }
  previewRIF();
}

function previewRIF() {
  const tipo = document.getElementById('terTipoRIF').value;
  const num = document.getElementById('terNumRIF').value.trim();
  const preview = document.getElementById('rifPreview');
  if (!num) { preview.textContent = ''; return; }
  const r = validarRIF(tipo + num);
  if (!r.valido) {
    preview.textContent = `❌ ${r.mensaje}`;
    preview.className = 'text-[10px] mt-1 text-red-600';
  } else if (r.advertencia) {
    preview.textContent = `⚠️ ${r.advertencia}`;
    preview.className = 'text-[10px] mt-1 text-amber-600';
  } else {
    preview.textContent = `✅ RIF válido → ${formatearRIF(tipo + num)}`;
    preview.className = 'text-[10px] mt-1 text-emerald-600';
  }
}

function guardarTercero(e) {
  e.preventDefault();
  const db = getDB();
  const persona = document.getElementById('terPersona').value;
  const tipoRIF = document.getElementById('terTipoRIF').value;
  const num = document.getElementById('terNumRIF').value.trim();
  const rif = tipoRIF + num;
  const valid = validarRIF(rif);
  if (!valid.valido) return mostrarAlerta(`RIF inválido: ${valid.mensaje}`, 'error');
  if (valid.advertencia) mostrarAlerta(`⚠️ ${valid.advertencia}`, 'error');

  const email = document.getElementById('terEmail').value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return mostrarAlerta('Email inválido.', 'error');
  }

  const rifFormateado = formatearRIF(rif);
  if (db.terceros.some(t => t.rif === rifFormateado)) {
    return mostrarAlerta('Ya existe un tercero con ese RIF.', 'error');
  }

  db.terceros.push({
    id: Date.now(),
    rif: rifFormateado,
    nombre: document.getElementById('terNombre').value.trim(),
    tipo: document.getElementById('terTipo').value,
    persona,
    telefono: document.getElementById('terTelefono').value.trim(),
    email,
    direccion: document.getElementById('terDireccion').value.trim()
  });
  saveDB(db);
  registrarAuditoria('TERCEROS', 'Registro', `${rifFormateado} - ${document.getElementById('terNombre').value}`);
  document.getElementById('formTercero').reset();
  actualizarTipoRIF();
  document.getElementById('rifPreview').textContent = '';
  renderTablaTerceros();
  mostrarAlerta('Tercero registrado.');
}

function renderTablaTerceros(filtro = '') {
  const db = getDB();
  const q = filtro.toLowerCase();
  const lista = db.terceros.filter(t =>
    !q || t.rif.toLowerCase().includes(q) || t.nombre.toLowerCase().includes(q)
    || (t.email || '').toLowerCase().includes(q)
  );
  const tipoIcon = { CLIENTE: '👤', PROVEEDOR: '🏭', AMBOS: '🔄' };
  document.getElementById('bodyTerceros').innerHTML = lista.map(t => `
    <tr class="border-b hover:bg-slate-50">
      <td class="p-2 mono font-bold">${t.rif}</td>
      <td class="p-2">${t.nombre}</td>
      <td class="p-2">${t.persona === 'NATURAL' ? '👤 Natural' : '🏢 Jurídica'}</td>
      <td class="p-2">${tipoIcon[t.tipo] || ''} ${t.tipo}</td>
      <td class="p-2">${t.telefono || '—'}</td>
      <td class="p-2 text-slate-600">${t.email || '—'}</td>
      <td class="p-2 text-center no-print">
        <button onclick="eliminarTercero(${t.id})" class="text-red-500"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" class="p-4 text-center text-slate-500">Sin registros</td></tr>';
}

function filtrarTerceros(v) { renderTablaTerceros(v); }

function eliminarTercero(id) {
  const db = getDB();
  db.terceros = db.terceros.filter(t => t.id !== id);
  saveDB(db);
  renderTablaTerceros();
  mostrarAlerta('Tercero eliminado.', 'error');
}

function autocompletarTercero(inputId, tipo) {
  const db = getDB();
  const input = document.getElementById(inputId);
  if (!input) return;
  const listId = inputId + '_list';
  let list = document.getElementById(listId);
  if (!list) {
    list = document.createElement('datalist');
    list.id = listId;
    input.setAttribute('list', listId);
    document.body.appendChild(list);
  }
  const filtrados = db.terceros.filter(t => t.tipo === tipo || t.tipo === 'AMBOS');
  list.innerHTML = filtrados.map(t => `<option value="${t.rif}">${t.nombre}</option>`).join('');
}