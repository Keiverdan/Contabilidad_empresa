function usuarioTieneEmpresa(usuarioId, empresaId) {
  const db = getDB();
  const u = db.usuarios.find(x => x.id === usuarioId);
  return u && u.empresas.includes(empresaId);
}

function cambiarEmpresa(empresaId) {
  const db = getDB();
  empresaId = Number(empresaId);
  const u = db.usuarios.find(x => x.nombre === db.usuarioActual);
  if (u && !usuarioTieneEmpresa(u.id, empresaId)) {
    mostrarAlerta('Sin permisos para esa empresa.', 'error');
    return;
  }
  db.empresaActual = empresaId;
  saveDB(db);
  registrarAuditoria('EMPRESA', 'Cambio de empresa', `ID ${empresaId}`);
  renderVistaActual();
}

function renderUsuarios(container) {
  const db = getDB();
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Usuarios y Asignación de Empresas</h1>
    <div class="bg-white p-4 rounded-lg shadow mb-4">
      <form id="formUsuario" class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input id="userNombre" placeholder="Nombre" required class="text-xs p-2 border rounded">
        <select id="userRol" class="text-xs p-2 border rounded">
          <option value="ADMIN">Administrador</option>
          <option value="CONTADOR">Contador</option>
          <option value="AUXILIAR">Auxiliar</option>
        </select>
        <button class="bg-emerald-600 text-white rounded text-xs font-bold">Agregar usuario</button>
      </form>
    </div>
    <div class="table-responsive bg-white rounded-lg shadow">
      <table class="w-full text-xs">
        <thead class="bg-slate-800 text-white">
          <tr><th class="p-2 text-left">Usuario</th><th class="p-2 text-left">Rol</th>
              <th class="p-2 text-left">Empresas</th><th class="p-2">Acción</th></tr>
        </thead>
        <tbody>
          ${db.usuarios.map(u => `
            <tr class="border-b">
              <td class="p-2">${u.nombre}</td>
              <td class="p-2">${u.rol}</td>
              <td class="p-2">${u.empresas.map(id => db.empresas.find(e => e.id === id)?.nombre || `#${id}`).join(', ')}</td>
              <td class="p-2 text-center">
                <button onclick="eliminarUsuario(${u.id})" class="text-red-500"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('formUsuario').addEventListener('submit', e => {
    e.preventDefault();
    const db = getDB();
    db.usuarios.push({
      id: Date.now(),
      nombre: document.getElementById('userNombre').value.trim(),
      rol: document.getElementById('userRol').value,
      empresas: [db.empresaActual]
    });
    saveDB(db);
    renderUsuarios(container);
    mostrarAlerta('Usuario agregado.');
  });
}

function eliminarUsuario(id) {
  const db = getDB();
  if (db.usuarios.length <= 1) return mostrarAlerta('Debe quedar al menos un usuario.', 'error');
  db.usuarios = db.usuarios.filter(u => u.id !== id);
  saveDB(db);
  renderVistaActual();
}