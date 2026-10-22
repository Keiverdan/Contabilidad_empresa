let vistaActual = 'planCuentas';

const RENDERERS = {
  planCuentas: renderPlanCuentas,
  importarPlan: renderImportarPlan,
  tiposCambio: renderTiposCambio,
  terceros: renderTerceros,
  usuarios: renderUsuarios,
  presupuestos: renderPresupuestos,
  productos: renderProductos,
  asientos: renderAsientos,
  compras: renderCompras,
  ventas: renderVentas,
  servicios: renderServicios,
  nomina: renderNomina,
  nominaRapida: renderNominaRapida,
  cierres: renderCierres,
  libroDiario: renderLibroDiario,
  libroMayor: renderLibroMayor,
  libroInventario: renderLibroInventario,
  auxiliares: renderAuxiliares,
  libroCompras: renderLibroCompras,
  libroVentas: renderLibroVentas,
  estructuraCompras: renderEstructuraCompras,
  ganancias: renderGanancias,
  balanceComprobacion: renderBalanceComprobacion,
  estadoResultados: renderEstadoResultados,
  balanceGeneral: renderBalanceGeneral,
  historialAuditoria: renderHistorialAuditoria,
  tutorial: renderTutorial,
  glosario: renderGlosario
};

function renderVistaActual() {
  const cont = document.getElementById('viewContainer');
  const fn = RENDERERS[vistaActual];
  if (fn) fn(cont);
}

function navegar(id) {
  vistaActual = id;
  renderVistaActual();
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarBackdrop')?.classList.add('hidden');
}

function construirMenu() {
  const grupos = {};
  MODULOS.forEach(m => (grupos[m.group] = grupos[m.group] || []).push(m));
  document.getElementById('navMenu').innerHTML = Object.entries(grupos).map(([g, items]) => `
    <div>
      <h3 class="text-[11px] uppercase font-semibold text-slate-400 px-3 mb-1">${g}</h3>
      <ul class="space-y-0.5">
        ${items.map(i => `<li><button onclick="navegar('${i.id}')" class="nav-btn w-full text-left flex items-center px-3 py-1.5 text-xs rounded hover:bg-slate-700 hover:text-white">
          <i class="fa-solid ${i.icon} w-5"></i> ${i.label}</button></li>`).join('')}
      </ul>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  construirMenu();
  const db = getDB();
  document.getElementById('tcLabel').innerText = (db.historicoTasas[0]?.tasa || 0).toFixed(2);
  document.getElementById('empresaSelect').value = db.empresaActual;
  document.getElementById('empresaSelect').addEventListener('change', e => cambiarEmpresa(e.target.value));
  document.getElementById('btnExportJSON').addEventListener('click', exportarRespaldoJSON);
  document.getElementById('fileImportJSON').addEventListener('change', importarRespaldoJSON);
  document.getElementById('btnExportHTML').addEventListener('click', descargarHTML);
  document.getElementById('btnReset').addEventListener('click', resetearDatos);
  document.getElementById('btnTutorial').addEventListener('click', () => iniciarTutorial());
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  document.getElementById('btnMenu').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('hidden', !sidebar.classList.contains('open'));
  });
  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('open');
    backdrop.classList.add('hidden');
  });
  registrarAuditoria('SISTEMA', 'Carga inicial', `Versión ${CONFIG.VERSION}`);
  navegar('planCuentas');
});

function descargarHTML() {
  const clone = document.documentElement.cloneNode(true);
  clone.querySelectorAll('script[data-bard-client-injected],script[ws-interception-config]').forEach(s => s.remove());
  const html = '<!DOCTYPE html>\n' + clone.outerHTML;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'La_Contabilidad_de_Elohim.html';
  a.click();
  registrarAuditoria('SISTEMA', 'Descarga HTML');
}