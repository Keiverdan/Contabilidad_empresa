/* ============================================================
   TUTORIAL INTERACTIVO (RESPONSIVE MÓVIL/ESCRITORIO)
   ============================================================ */

const TUTORIAL_PASOS = [
  {
    titulo: '¡Bienvenido a La Contabilidad de Elohim! 👋',
    texto: `Este es un sistema contable 100% venezolano, adaptado a las normas <b>VEN-NIF</b> y a las exigencias del <b>SENIAT</b>.<br><br>Te guiaré por los módulos principales en menos de 5 minutos. Puedes saltar el tutorial en cualquier momento y retomarlo luego desde <b>Ayuda → Tutorial Guiado</b>.`,
    target: null, posicion: 'centro'
  },
  {
    titulo: 'Paso 1: Configura la Empresa',
    texto: `El sistema trabaja con <b>Inversiones Elohim, C.A.</b> como empresa única de práctica.<br><br>Si en algún momento necesitas cambiar de empresa, usa el selector en la barra superior. Toda la data se guarda por empresa.`,
    target: '#empresaSelect', posicion: 'bottom'
  },
  {
    titulo: 'Paso 2: Actualiza la Tasa BCV',
    texto: `Antes de registrar cualquier operación, asegúrate de tener la <b>tasa oficial del día</b>.<br><br>Ve a <b>Tasa BCV</b> y registra el valor en Bolívares por dólar. El sistema la mostrará siempre en la barra superior.`,
    target: '#tcLabel', posicion: 'bottom'
  },
  {
    titulo: 'Paso 3: Revisa el Plan de Cuentas',
    texto: `El <b>Plan de Cuentas</b> es la columna vertebral de la contabilidad. Ya viene precargado con la estructura VEN-NIF.<br><br>Puedes <b>agregar</b> cuentas nuevas, pero <b>no borres</b> las que tengan movimientos.`,
    target: '.nav-btn', posicion: 'right', buscarTexto: 'Plan de Cuentas'
  },
  {
    titulo: 'Paso 4: Registra tus Clientes y Proveedores',
    texto: `Antes de vender o comprar, necesitas tener los terceros registrados con su <b>RIF</b> o <b>cédula</b>.<br><br>El sistema acepta personas <b>naturales (V/E)</b> y <b>jurídicas (J/G/C/P/N)</b>, y guarda su <b>domicilio electrónico</b>.`,
    target: '.nav-btn', posicion: 'right', buscarTexto: 'Clientes/Proveedores'
  },
  {
    titulo: 'Paso 5: Carga tus Productos',
    texto: `En <b>Productos/Inventario</b> registras los bienes que vendes, con su <b>costo</b>, <b>precio</b> y <b>stock</b>.<br><br>El sistema te avisa en rojo cuando un producto está por debajo del stock mínimo.`,
    target: '.nav-btn', posicion: 'right', buscarTexto: 'Productos/Inventario'
  },
  {
    titulo: 'Paso 6: Registra Compras',
    texto: `En <b>Compras</b> ingresas las facturas de tus proveedores. El sistema calcula <b>automáticamente</b>: IVA, retención de IVA (75%), retención de ISLR y el asiento contable.`,
    target: '.nav-btn', posicion: 'right', buscarTexto: 'Compras'
  },
  {
    titulo: 'Paso 7: Registra Ventas y Servicios',
    texto: `<b>Ventas</b> es para mercancías y <b>Servicios</b> para prestaciones.<br><br>Ambos generan <b>asiento automático</b> con CxC, ingreso, IVA débito fiscal y costo.`,
    target: '.nav-btn', posicion: 'right', buscarTexto: 'Ventas'
  },
  {
    titulo: 'Paso 8: Nómina',
    texto: `Registra a tus empleados y genera la nómina mensual con todos los cálculos LOTTT: IVSS, RPE, FAOV, INCE y Paro Forzoso.<br><br>También tienes la <b>Nómina Rápida</b> para cálculos express y liquidaciones.`,
    target: '.nav-btn', posicion: 'right', buscarTexto: 'Nómina'
  },
  {
    titulo: 'Paso 9: Libros y Reportes',
    texto: `Todos los libros se generan <b>en tiempo real</b>: Libro Diario, Mayor, Balance, Libros SENIAT, GyP y BG.<br><br>Todos son <b>exportables a Excel y PDF</b>.`,
    target: '.nav-btn', posicion: 'right', buscarTexto: 'Libro Diario'
  },
  {
    titulo: 'Paso 10: Respalda tu información',
    texto: `Toda la información se guarda <b>en tu navegador</b> (localStorage).<br><br>Para no perder tus datos al limpiar caché, usa el botón <b>JSON</b> en la barra superior para descargar un respaldo.`,
    target: '#btnExportJSON', posicion: 'bottom'
  },
  {
    titulo: '¡Listo! Ya puedes comenzar 🎉',
    texto: `Has completado el tutorial. Recuerda:<br>
    • <b>SIEMPRE</b> verifica la partida doble (Debe = Haber)<br>
    • <b>NUNCA</b> borres cuentas con movimientos<br>
    • <b>ANTES</b> de un cierre, revisa que no haya asientos descuadrados<br>
    • Usa el <b>Glosario</b> si no entiendes un término<br><br>
    Puedes repetir este tutorial cuando quieras desde <b>Ayuda → Tutorial Guiado</b>.`,
    target: null, posicion: 'centro'
  }
];

let tutorialIndex = 0;
let tutorialActivo = false;

function esMovil() {
  return window.innerWidth < 768;
}

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
  // Bloquear scroll del body mientras el tutorial está abierto
  document.body.style.overflow = 'hidden';
}

/* ---------- Crear overlay ---------- */
function crearOverlayTutorial() {
  const prev = document.getElementById('tutorialOverlay');
  if (prev) prev.remove();

  const overlay = document.createElement('div');
  overlay.id = 'tutorialOverlay';
  overlay.className = 'fixed inset-0 z-[9997]';
  overlay.innerHTML = `
    <div id="tutorialBackdrop" class="absolute inset-0 bg-black/70"></div>
    <div id="tutorialHighlight" class="absolute border-4 border-amber-400 rounded-lg shadow-2xl transition-all duration-300 pointer-events-none" style="display:none"></div>
    <div id="tutorialBox" class="bg-white rounded-lg shadow-2xl p-4 sm:p-5 w-[calc(100%-1.5rem)] sm:w-96 sm:max-w-md">
      <div class="flex justify-between items-start mb-2">
        <h3 id="tutorialTitulo" class="font-bold text-slate-800 text-sm sm:text-base pr-2"></h3>
        <button onclick="cerrarTutorial()" class="text-slate-400 hover:text-slate-700 text-2xl leading-none flex-shrink-0" title="Cerrar">&times;</button>
      </div>
      <div id="tutorialTexto" class="text-xs text-slate-600 leading-relaxed mb-4 max-h-[45vh] sm:max-h-60 overflow-y-auto scroll-suave"></div>
      <div class="flex items-center justify-between gap-2">
        <div id="tutorialProgreso" class="text-[10px] text-slate-500 font-semibold"></div>
        <div class="flex gap-2">
          <button id="tutorialPrev" onclick="pasoAnteriorTutorial()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs px-3 py-2 rounded font-semibold">
            <i class="fa-solid fa-arrow-left"></i> <span class="hidden sm:inline">Anterior</span>
          </button>
          <button id="tutorialNext" onclick="pasoSiguienteTutorial()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs px-4 py-2 rounded font-bold">
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

  // Recalcular en resize (rotación, cambio de tamaño)
  window.addEventListener('resize', () => {
    if (tutorialActivo) mostrarPasoTutorial();
  });
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

  // Resetear estilos del box
  box.style.top = '';
  box.style.left = '';
  box.style.transform = '';

  // 📱 MÓVIL: siempre centrado, sin highlight
  if (esMovil()) {
    highlight.style.display = 'none';
    box.style.position = 'fixed';
    box.style.top = '50%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';
    return;
  }

  // 💻 ESCRITORIO: buscar target y resaltarlo
  let target = null;
  if (paso.target) {
    if (paso.buscarTexto) {
      const btns = document.querySelectorAll(paso.target);
      for (const b of btns) {
        if (b.textContent.includes(paso.buscarTexto)) { target = b; break; }
      }
    } else {
      target = document.querySelector(paso.target);
    }
  }

  if (target && paso.posicion !== 'centro' && target.offsetParent !== null) {
    const r = target.getBoundingClientRect();
    highlight.style.display = 'block';
    highlight.style.position = 'fixed';
    highlight.style.top = (r.top - 4) + 'px';
    highlight.style.left = (r.left - 4) + 'px';
    highlight.style.width = (r.width + 8) + 'px';
    highlight.style.height = (r.height + 8) + 'px';

    box.style.position = 'fixed';
    const boxRect = box.getBoundingClientRect();
    const boxW = 384;
    const boxH = 350;
    let top, left;

    if (paso.posicion === 'bottom') {
      top = r.bottom + 12;
      left = r.left + (r.width / 2) - (boxW / 2);
    } else if (paso.posicion === 'right') {
      top = r.top;
      left = r.right + 12;
    } else {
      top = r.bottom + 12;
      left = r.left;
    }

    // Ajuste a los bordes de la ventana
    if (left + boxW > window.innerWidth - 12) left = window.innerWidth - boxW - 12;
    if (left < 12) left = 12;
    if (top + boxH > window.innerHeight - 12) top = window.innerHeight - boxH - 12;
    if (top < 12) top = 12;

    box.style.top = top + 'px';
    box.style.left = left + 'px';
  } else {
    // Sin target o target oculto → centrar
    highlight.style.display = 'none';
    box.style.position = 'fixed';
    box.style.top = '50%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';
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
  document.body.style.overflow = '';
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
        <i class="fa-solid fa-graduation-cap mr-1"></i> Iniciar tutorial
      </button>
    </div>

    <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Estado</p>
        <p class="text-sm sm:text-lg font-bold ${db.tutorialCompletado ? 'text-emerald-700' : 'text-amber-600'}">
          ${db.tutorialCompletado ? '✅ Completado' : '⏳ Pendiente'}
        </p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Pasos</p>
        <p class="text-sm sm:text-lg font-bold">${TUTORIAL_PASOS.length}</p>
      </div>
      <div class="bg-white p-3 rounded-lg border shadow">
        <p class="text-[10px] text-slate-500 uppercase">Duración</p>
        <p class="text-sm sm:text-lg font-bold">~5 min</p>
      </div>
    </div>

    <div class="bg-white rounded-lg border shadow overflow-hidden">
      <div class="p-3 bg-slate-100 border-b font-bold text-xs">📖 Contenido del tutorial</div>
      <div class="divide-y">
        ${TUTORIAL_PASOS.map((p, i) => `
          <div class="p-3 sm:p-4 hover:bg-slate-50">
            <div class="flex items-start gap-3">
              <span class="bg-amber-500 text-slate-950 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs flex-shrink-0">${i + 1}</span>
              <div class="min-w-0">
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

/* ---------- Auto-lanzar al cargar ---------- */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(verificarTutorialPrimeraVez, 500);
});
