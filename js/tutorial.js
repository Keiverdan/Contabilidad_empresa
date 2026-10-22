/* ============================================================
   TUTORIAL INTERACTIVO
   ============================================================
   - Se muestra automáticamente la primera vez (db.tutorialCompletado = false)
   - 12 pasos guiados con resaltado del elemento correspondiente
   - Botones: Anterior, Siguiente, Saltar tutorial
   - Al terminar, guarda db.tutorialCompletado = true
   - Disponible siempre en el módulo "Tutorial Guiado"
   ============================================================ */

const TUTORIAL_PASOS = [
  {
    titulo: '¡Bienvenido a La Contabilidad de Elohim! 👋',
    texto: `Este es un sistema contable 100% venezolano, adaptado a las normas <b>VEN-NIF</b> y a las exigencias del <b>SENIAT</b>.
    <br><br>Te guiaré por los módulos principales en menos de 5 minutos. Puedes saltar el tutorial en cualquier momento y retomarlo luego desde <b>Ayuda → Tutorial Guiado</b>.`,
    target: null,
    posicion: 'centro'
  },
  {
    titulo: 'Paso 1: Configura la Empresa',
    texto: `El sistema trabaja con <b>Inversiones Elohim, C.A.</b> como empresa única de práctica.
    <br><br>Si en algún momento necesitas cambiar de empresa, usa el selector en la barra superior. Toda la data se guarda por empresa.`,
    target: '#empresaSelect',
    posicion: 'bottom'
  },
  {
    titulo: 'Paso 2: Actualiza la Tasa BCV',
    texto: `Antes de registrar cualquier operación, asegúrate de tener la <b>tasa oficial del día</b>.
    <br><br>Ve a <b>Tasa BCV</b> y registra el valor en Bolívares por dólar. El sistema la mostrará siempre en la barra superior.`,
    target: '#tcLabel',
    posicion: 'bottom'
  },
  {
    titulo: 'Paso 3: Revisa el Plan de Cuentas',
    texto: `El <b>Plan de Cuentas</b> es la columna vertebral de la contabilidad. Ya viene precargado con la estructura VEN-NIF (Activo, Pasivo, Patrimonio, Ingresos, Costos y Gastos).
    <br><br>Puedes <b>agregar</b> cuentas nuevas, pero <b>no borres</b> las que tengan movimientos.`,
    target: '.nav-btn',
    posicion: 'right',
    buscarTexto: 'Plan de Cuentas'
  },
  {
    titulo: 'Paso 4: Registra tus Clientes y Proveedores',
    texto: `Antes de vender o comprar, necesitas tener los terceros registrados con su <b>RIF</b> o <b>cédula</b>.
    <br><br>El sistema acepta personas <b>naturales (V/E)</b> y <b>jurídicas (J/G/C/P/N)</b>, y guarda su <b>domicilio electrónico</b> (email) para envío de facturas.`,
    target: '.nav-btn',
    posicion: 'right',
    buscarTexto: 'Clientes/Proveedores'
  },
  {
    titulo: 'Paso 5: Carga tus Productos',
    texto: `En <b>Productos/Inventario</b> registras los bienes que vendes, con su <b>costo</b>, <b>precio</b> y <b>stock</b>.
    <br><br>El sistema te avisa en rojo cuando un producto está por debajo del stock mínimo.`,
    target: '.nav-btn',
    posicion: 'right',
    buscarTexto: 'Productos/Inventario'
  },
  {
    titulo: 'Paso 6: Registra Compras',
    texto: `En <b>Compras</b> ingresas las facturas de tus proveedores. El sistema calcula <b>automáticamente</b>:
    <ul class="list-disc pl-5 mt-1">
      <li>IVA (16% / 8% / 0%)</li>
      <li>Retención de IVA (75%)</li>
      <li>Retención de ISLR</li>
      <li>Asiento contable con partida doble</li>
    </ul>`,
    target: '.nav-btn',
    posicion: 'right',
    buscarTexto: 'Compras'
  },
  {
    titulo: 'Paso 7: Registra Ventas y Servicios',
    texto: `<b>Ventas</b> es para mercancías y <b>Servicios</b> para prestaciones (asesorías, consultorías).
    <br><br>Ambos generan <b>asiento automático</b> con CxC, ingreso, IVA débito fiscal y costo.`,
    target: '.nav-btn',
    posicion: 'right',
    buscarTexto: 'Ventas'
  },
  {
    titulo: 'Paso 8: Nómina',
    texto: `Registra a tus empleados y genera la nómina mensual con todos los cálculos LOTTT:
    <ul class="list-disc pl-5 mt-1">
      <li>IVSS (patrono 9% / obrero 4%)</li>
      <li>RPE (2%)</li>
      <li>FAOV (patrono 2% / obrero 1%)</li>
      <li>INCE (2%)</li>
      <li>Paro forzoso</li>
    </ul>
    También tienes la <b>Nómina Rápida</b> para cálculos express y liquidaciones.`,
    target: '.nav-btn',
    posicion: 'right',
    buscarTexto: 'Nómina'
  },
  {
    titulo: 'Paso 9: Libros y Reportes',
    texto: `Todos los libros se generan <b>en tiempo real</b>:
    <ul class="list-disc pl-5 mt-1">
      <li>Libro Diario y Mayor</li>
      <li>Balance de Comprobación</li>
      <li>Libros de Compras y Ventas SENIAT</li>
      <li>Estado de Resultados (GyP)</li>
      <li>Estado de Situación Financiera (BG)</li>
    </ul>
    Todos son <b>exportables a Excel y PDF</b>.`,
    target: '.nav-btn',
    posicion: 'right',
    buscarTexto: 'Libro Diario'
  },
  {
    titulo: 'Paso 10: Respalda tu información',
    texto: `Toda la información se guarda <b>en tu navegador</b> (localStorage).
    <br><br>Para no perder tus datos al limpiar caché, usa el botón <b>JSON</b> en la barra superior para descargar un respaldo. Puedes restaurarlo con <b>Cargar</b>.`,
    target: '#btnExportJSON',
    posicion: 'bottom'
  },
  {
    titulo: '¡Listo! Ya puedes comenzar 🎉',
    texto: `Has completado el tutorial. Recuerda:
    <ul class="list-disc pl-5 mt-1">
      <li><b>SIEMPRE</b> verifica la partida doble (Debe = Haber)</li>
      <li><b>NUNCA</b> borres cuentas con movimientos</li>
      <li><b>ANTES</b> de un cierre, revisa que no haya asientos descuadrados</li>
      <li>Usa el <b>Glosario</b> si no entiendes un término</li>
    </ul>
    <br>Puedes repetir este tutorial cuando quieras desde <b>Ayuda → Tutorial Guiado</b>.`,
    target: null,
    posicion: 'centro'
  }
];

let tutorialIndex = 0;
let tutorialActivo = false;

/* ---------- Auto-lanzar en primera visita ---------- */
function verificarTutorialPrimeraVez() {
  const db = getDB();
  if (!db.tutorialCompletado) {
    setTimeout(() => iniciarTutorial(true), 800);
  }
}

/* ---------- Iniciar ---------- */
function iniciarTutorial(auto = false) {
  tutorialIndex = 0;
  tutorialActivo = true;
  crearOverlayTutorial();
  mostrarPasoTutorial();
}

/* ---------- Crear overlay ---------- */
function crearOverlayTutorial() {
  let overlay = document.getElementById('tutorialOverlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'tutorialOverlay';
  overlay.className = 'fixed inset-0 z-[9998] pointer-events-none';
  overlay.innerHTML = `
    <div id="tutorialBackdrop" class="absolute inset-0 bg-black/60 transition-opacity pointer-events-auto"></div>
    <div id="tutorialHighlight" class="absolute border-4 border-amber-400 rounded-lg shadow-2xl transition-all duration-300 pointer-events-none" style="display:none"></div>
    <div id="tutorialBox" class="absolute bg-white rounded-lg shadow-2xl p-5 max-w-md w-[calc(100%-2rem)] sm:w-96 pointer-events-auto transition-all duration-300">
      <div class="flex justify-between items-start mb-2">
        <h3 id="tutorialTitulo" class="font-bold text-slate-800 text-base pr-2"></h3>
        <button onclick="cerrarTutorial()" class="text-slate-400 hover:text-slate-700 text-2xl leading-none" title="Cerrar">&times;</button>
      </div>
      <div id="tutorialTexto" class="text-xs text-slate-600 leading-relaxed mb-4 max-h-60 overflow-y-auto"></div>
      <div class="flex items-center justify-between gap-2">
        <div id="tutorialProgreso" class="text-[10px] text-slate-500 font-semibold"></div>
        <div class="flex gap-2">
          <button id="tutorialPrev" onclick="pasoAnteriorTutorial()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs px-3 py-1.5 rounded font-semibold">
            <i class="fa-solid fa-arrow-left"></i> Anterior
          </button>
          <button id="tutorialNext" onclick="pasoSiguienteTutorial()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs px-4 py-1.5 rounded font-bold">
            Siguiente <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <button onclick="cerrarTutorial()" class="mt-3 text-[10px] text-slate-400 hover:text-slate-700 underline w-full text-center">
        Saltar tutorial
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}

/* ---------- Mostrar paso actual ---------- */
function mostrarPasoTutorial() {
  const paso = TUTORIAL_PASOS[tutorialIndex];
  if (!paso) return cerrarTutorial();

  const titulo = document.getElementById('tutorialTitulo');
  const texto = document.getElementById('tutorialTexto');
  const progreso = document.getElementById('tutorialProgreso');
  const prevBtn = document.getElementById('tutorialPrev');
  const nextBtn = document.getElementById('tutorialNext');
  const highlight = document.getElementById('tutorialHighlight');
  const box = document.getElementById('tutorialBox');

  titulo.textContent = paso.titulo;
  texto.innerHTML = paso.texto;
  progreso.textContent = `${tutorialIndex + 1} / ${TUTORIAL_PASOS.length}`;
  prevBtn.style.visibility = tutorialIndex === 0 ? 'hidden' : 'visible';
  nextBtn.innerHTML = tutorialIndex === TUTORIAL_PASOS.length - 1
    ? 'Finalizar <i class="fa-solid fa-check"></i>'
    : 'Siguiente <i class="fa-solid fa-arrow-right"></i>';

  // Buscar target
  let target = null;
  if (paso.target) {
    if (paso.buscarTexto) {
      const btns = document.querySelectorAll(paso.target);
      for (const b of btns) if (b.textContent.includes(paso.buscarTexto)) { target = b; break; }
    } else {
      target = document.querySelector(paso.target);
    }
  }

  // Colocar highlight y box
  if (target && paso.posicion !== 'centro') {
    const r = target.getBoundingClientRect();
    highlight.style.display = 'block';
    highlight.style.top = (r.top - 4) + 'px';
    highlight.style.left = (r.left - 4) + 'px';
    highlight.style.width = (r.width + 8) + 'px';
    highlight.style.height = (r.height + 8) + 'px';
    highlight.style.position = 'fixed';

    box.style.position = 'fixed';
    const boxRect = box.getBoundingClientRect();
    let top = r.bottom + 12;
    let left = r.left;
    if (paso.posicion === 'bottom') {
      top = r.bottom + 12;
      left = Math.min(r.left, window.innerWidth - 400);
    } else if (paso.posicion === 'right') {
      top = Math.max(10, Math.min(r.top, window.innerHeight - 350));
      left = r.right + 12;
    }
    if (left + 400 > window.innerWidth) left = window.innerWidth - 400;
    if (left < 10) left = 10;
    if (top + 350 > window.innerHeight) top = window.innerHeight - 350;
    if (top < 10) top = 10;

    box.style.top = top + 'px';
    box.style.left = left + 'px';
  } else {
    highlight.style.display = 'none';
    box.style.position = 'fixed';
    box.style.top = '50%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';
    box.style.maxWidth = '500px';
  }
  if (target && paso.posicion !== 'centro') {
    box.style.transform = 'none';
  }
}

/* ---------- Navegación ---------- */
function pasoSiguienteTutorial() {
  if (tutorialIndex < TUTORIAL_PASOS.length - 1) {
    tutorialIndex++;
    mostrarPasoTutorial();
  } else {
    finalizarTutorial();
  }
}

function pasoAnteriorTutorial() {
  if (tutorialIndex > 0) {
    tutorialIndex--;
    mostrarPasoTutorial();
  }
}

function cerrarTutorial() {
  const overlay = document.getElementById('tutorialOverlay');
  if (overlay) overlay.remove();
  tutorialActivo = false;
}

function finalizarTutorial() {
  const db = getDB();
  db.tutorialCompletado = true;
  saveDB(db);
  registrarAuditoria('TUTORIAL', 'Completado', 'El usuario terminó el tutorial guiado');
  cerrarTutorial();
  mostrarAlerta('¡Tutorial completado! Ya puedes empezar a usar el sistema.');
}

/* ---------- Módulo "Tutorial Guiado" ---------- */
function renderTutorial(container) {
  const db = getDB();
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold">Tutorial Guiado</h1>
        <p class="text-xs text-slate-500">Repasa el sistema las veces que necesites.</p>
      </div>
      <button onclick="iniciarTutorial()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs px-4 py-2 rounded font-bold">
        <i class="fa-solid fa-graduation-cap mr-1"></i> Iniciar tutorial interactivo
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Estado</p>
        <p class="text-lg font-bold ${db.tutorialCompletado ? 'text-emerald-700' : 'text-amber-600'}">
          ${db.tutorialCompletado ? '✅ Completado' : '⏳ Pendiente'}
        </p>
      </div>
      <div class="bg-white p-4 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Total de pasos</p>
        <p class="text-lg font-bold">${TUTORIAL_PASOS.length}</p>
      </div>
      <div class="bg-white p-4 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Duración estimada</p>
        <p class="text-lg font-bold">~5 min</p>
      </div>
    </div>

    <div class="bg-white rounded-lg border shadow overflow-hidden">
      <div class="p-3 bg-slate-100 border-b font-bold text-xs">📖 Contenido del tutorial</div>
      <div class="divide-y">
        ${TUTORIAL_PASOS.map((p, i) => `
          <div class="p-4 hover:bg-slate-50">
            <div class="flex items-start gap-3">
              <span class="bg-amber-500 text-slate-950 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs flex-shrink-0">${i + 1}</span>
              <div>
                <p class="font-bold text-sm text-slate-800">${p.titulo}</p>
                <div class="text-xs text-slate-600 mt-1 leading-relaxed">${p.texto}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="mt-4 text-center">
      <button onclick="reiniciarTutorial()" class="text-xs text-slate-500 hover:text-slate-900 underline">
        Marcar tutorial como pendiente para verlo de nuevo al iniciar
      </button>
    </div>
  `;
}

function reiniciarTutorial() {
  const db = getDB();
  db.tutorialCompletado = false;
  saveDB(db);
  mostrarAlerta('El tutorial se mostrará automáticamente la próxima vez.');
  renderTutorial(document.getElementById('viewContainer'));
}

/* ---------- Iniciar al cargar (auto si es primera vez) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(verificarTutorialPrimeraVez, 500);
});