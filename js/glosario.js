/* ============================================================
   GLOSARIO DE TÉRMINOS CONTABLES Y FISCALES VENEZOLANOS
   ============================================================ */

const GLOSARIO = [
  /* ---------- CONTABILIDAD BÁSICA ---------- */
  { categoria:'Contabilidad Básica', termino:'Activo',
    definicion:'Todos los bienes y derechos que posee la empresa y que se espera generen beneficios futuros. Se clasifica en Corriente (efectivo, cuentas por cobrar, inventario) y No Corriente (propiedad, planta y equipo).',
    ejemplo:'Caja, Bancos, Cuentas por Cobrar, Inventario, Maquinaria.' },
  { categoria:'Contabilidad Básica', termino:'Pasivo',
    definicion:'Todas las obligaciones y deudas que la empresa tiene con terceros. Se clasifica en Corriente (a corto plazo, menos de 1 año) y No Corriente (largo plazo).',
    ejemplo:'Cuentas por Pagar, Préstamos Bancarios, IVA por Enterar, Prestaciones Sociales.' },
  { categoria:'Contabilidad Básica', termino:'Patrimonio',
    definicion:'Es el valor residual de los activos de la empresa, una vez deducidos todos sus pasivos. Representa la inversión de los socios más los resultados acumulados.',
    ejemplo:'Capital Social, Utilidades Retenidas, Resultado del Ejercicio.' },
  { categoria:'Contabilidad Básica', termino:'Partida Doble',
    definicion:'Principio contable universal que establece que todo hecho económico afecta al menos dos cuentas: una que se debita (Debe) y otra que se acredita (Haber). La suma de los débitos debe ser igual a la suma de los créditos.',
    ejemplo:'Compra de mercancía al contado: Debe Inventario, Haber Caja.' },
  { categoria:'Contabilidad Básica', termino:'Debe (Débito)',
    definicion:'Columna izquierda de un asiento contable. Aumenta los Activos, Costos y Gastos; disminuye Pasivos, Patrimonio e Ingresos.',
    ejemplo:'Al comprar una computadora: Débito a Equipos de Oficina.' },
  { categoria:'Contabilidad Básica', termino:'Haber (Crédito)',
    definicion:'Columna derecha de un asiento contable. Aumenta Pasivos, Patrimonio e Ingresos; disminuye Activos, Costos y Gastos.',
    ejemplo:'Al recibir un pago: Crédito a Cuentas por Cobrar.' },
  { categoria:'Contabilidad Básica', termino:'Asiento de Apertura',
    definicion:'Primer asiento del libro diario. Registra el inventario inicial y el capital con el que inicia la empresa.',
    ejemplo:'Debe: Caja 100,00 / Bancos 500,00 · Haber: Capital 600,00' },
  { categoria:'Contabilidad Básica', termino:'Balance de Comprobación',
    definicion:'Lista de todos los saldos de las cuentas en un momento dado. Su función es verificar que la suma de los débitos sea igual a la suma de los créditos.',
    ejemplo:'Si los totales no coinciden, hay un asiento descuadrado.' },
  { categoria:'Contabilidad Básica', termino:'Cuenta T',
    definicion:'Representación gráfica de una cuenta contable en forma de T, con el Debe en el lado izquierdo y el Haber en el derecho. Se usa para calcular saldos.',
    ejemplo:'Se usa en ejercicios académicos y para revisar saldos.' },
  { categoria:'Contabilidad Básica', termino:'Naturaleza de la Cuenta',
    definicion:'Indica si una cuenta aumenta por el Debe (naturaleza deudora) o por el Haber (naturaleza acreedora).',
    ejemplo:'Activo → Deudora. Pasivo → Acreedora. Ingreso → Acreedora.' },
  { categoria:'Contabilidad Básica', termino:'Saldo',
    definicion:'Diferencia entre la suma del Debe y la suma del Haber de una cuenta. Puede ser Deudor (Debe > Haber), Acreedor (Haber > Debe) o Nulo (iguales).',
    ejemplo:'Si Caja tiene Debe 1.000 y Haber 300, su saldo deudor es 700.' },
  { categoria:'Contabilidad Básica', termino:'Catálogo de Cuentas',
    definicion:'Lista ordenada y codificada de todas las cuentas que utiliza la empresa. También se le llama Plan de Cuentas.',
    ejemplo:'1.1.01.01 Caja · 1.1.01.02 Bancos · 4.1.01.01 Ventas' },
  { categoria:'Contabilidad Básica', termino:'Marco Legal Contable',
    definicion:'Conjunto de normas que rigen la contabilidad en Venezuela. Incluye: VEN-NIF, Ley de Ejercicio de la Contaduría Pública, Código de Comercio, Ley de ISLR, Ley de IVA.',
    ejemplo:'VEN-NIF es la adaptación venezolana de las NIIF.' },

  /* ---------- ESTADOS FINANCIEROS ---------- */
  { categoria:'Estados Financieros', termino:'Estado de Resultados (GyP)',
    definicion:'También llamado Estado de Ganancias y Pérdidas. Muestra los ingresos, costos y gastos de un período, y el resultado (utilidad o pérdida) del ejercicio.',
    ejemplo:'Ventas 100.000 - Costos 60.000 - Gastos 20.000 = Utilidad 20.000.' },
  { categoria:'Estados Financieros', termino:'Estado de Situación Financiera (BG)',
    definicion:'Antes llamado Balance General. Muestra en una fecha determinada los Activos, Pasivos y Patrimonio de la empresa. La ecuación contable es: Activo = Pasivo + Patrimonio.',
    ejemplo:'Si Activo es 100 y Pasivo es 40, el Patrimonio debe ser 60.' },
  { categoria:'Estados Financieros', termino:'Estado de Flujo de Efectivo',
    definicion:'Muestra los movimientos de efectivo en actividades de operación, inversión y financiamiento. Revela si la empresa genera o consume caja.',
    ejemplo:'Una empresa puede tener utilidad pero no tener efectivo.' },
  { categoria:'Estados Financieros', termino:'Notas a los Estados Financieros',
    definicion:'Aclaratorias y detalles que complementan los estados financieros. Explican políticas contables, contingencias y desgloses de las cifras.',
    ejemplo:'Detalle de las cuentas por cobrar por antigüedad.' },
  { categoria:'Estados Financieros', termino:'Utilidad Bruta',
    definicion:'Diferencia entre las Ventas Netas y el Costo de Ventas. Es la ganancia antes de restar los gastos operativos.',
    ejemplo:'Ventas 100.000 - Costo 60.000 = Utilidad Bruta 40.000.' },
  { categoria:'Estados Financieros', termino:'Utilidad Neta',
    definicion:'Resultado final después de restar todos los costos y gastos (incluidos impuestos). Es la cifra que se distribuye a los socios o se reinvierte.',
    ejemplo:'Utilidad Bruta 40.000 - Gastos 20.000 = Utilidad Neta 20.000.' },
  { categoria:'Estados Financieros', termino:'NIIF / VEN-NIF',
    definicion:'Normas Internacionales de Información Financiera (NIIF), adaptadas a Venezuela como VEN-NIF. Regulan cómo se preparan y presentan los estados financieros.',
    ejemplo:'VEN-NIF PYME aplica a pequeñas y medianas entidades.' },

  /* ---------- IMPUESTOS ---------- */
  { categoria:'Impuestos', termino:'IVA (Impuesto al Valor Agregado)',
    definicion:'Impuesto indirecto que grava la venta de bienes y prestación de servicios. En Venezuela la alícuota general es 16%, con una reducida de 8% y exenciones.',
    ejemplo:'Venta de 1.000 + IVA 16% = 1.160 a pagar por el cliente.' },
  { categoria:'Impuestos', termino:'Débito Fiscal',
    definicion:'IVA cobrado por la empresa en sus ventas. Se declara mensualmente y se entera al SENIAT.',
    ejemplo:'Si vendes 1.000 con IVA, tu débito fiscal es 160.' },
  { categoria:'Impuestos', termino:'Crédito Fiscal',
    definicion:'IVA pagado por la empresa en sus compras. Se descuenta del débito fiscal para calcular el IVA a pagar.',
    ejemplo:'Si compras 500 con IVA, tu crédito fiscal es 80.' },
  { categoria:'Impuestos', termino:'Retención de IVA',
    definicion:'Porcentaje del IVA que el comprador retiene al vendedor y entera directamente al SENIAT. En Venezuela es del 75% para contribuyentes especiales.',
    ejemplo:'IVA 160 → Retención 75% = 120. Se paga al proveedor 40 de IVA.' },
  { categoria:'Impuestos', termino:'ISLR (Impuesto sobre la Renta)',
    definicion:'Impuesto anual sobre las utilidades de personas naturales y jurídicas. En Venezuela se declara con el formulario H y se retiene en algunos pagos.',
    ejemplo:'Una empresa con utilidad de 100.000 paga ISLR según tarifa progresiva.' },
  { categoria:'Impuestos', termino:'Retención de ISLR',
    definicion:'Porcentaje que el pagador retiene al beneficiario de un pago y entera al SENIAT. Aplica a honorarios profesionales, servicios, alquileres.',
    ejemplo:'Honorarios 10.000 → Retención 3% = 300. Se pagan 9.700.' },
  { categoria:'Impuestos', termino:'SENIAT',
    definicion:'Servicio Nacional Integrado de Administración Aduanera y Tributaria. Es el ente recaudador de impuestos en Venezuela.',
    ejemplo:'Todos los libros de compras y ventas se entregan a este organismo.' },
  { categoria:'Impuestos', termino:'RIF (Registro de Información Fiscal)',
    definicion:'Código que identifica a los contribuyentes ante el SENIAT. Se compone de una letra (V, E, J, P, G, C, N) y 8 dígitos más un dígito verificador.',
    ejemplo:'J-30596841-2 corresponde a una persona jurídica.' },
  { categoria:'Impuestos', termino:'Contribuyente Especial',
    definicion:'Persona natural o jurídica calificada por el SENIAT por su volumen de operaciones. Debe emitir facturas fiscales y retener IVA a sus proveedores.',
    ejemplo:'Grandes cadenas de supermercados, laboratorios, etc.' },
  { categoria:'Impuestos', termino:'Unidad Tributaria (UT)',
    definicion:'Valor de referencia usado para calcular multas, sanciones y algunos impuestos. Su valor se ajusta periódicamente.',
    ejemplo:'Si la UT vale 9, una multa de 10 UT son 90.' },
  { categoria:'Impuestos', termino:'Factura Fiscal',
    definicion:'Documento que soporta la venta de bienes o prestación de servicios. Debe cumplir requisitos del SENIAT: número, control, RIF, fecha, monto, IVA.',
    ejemplo:'Toda venta debe emitir factura fiscal con número de control.' },
  { categoria:'Impuestos', termino:'Número de Control',
    definicion:'Numeración consecutiva asignada por el SENIAT a los talonarios de facturas. Permite rastrear cada documento emitido.',
    ejemplo:'Control 00-00123 identifica una factura única.' },
  { categoria:'Impuestos', termino:'Providencia SNAT/2015/0049',
    definicion:'Norma que regula la retención del IVA en Venezuela. Establece quiénes son agentes de retención y los porcentajes aplicables.',
    ejemplo:'Los contribuyentes especiales retienen el 75% del IVA.' },

  /* ---------- NÓMINA Y LABORAL ---------- */
  { categoria:'Nómina y Laboral', termino:'LOTTT',
    definicion:'Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras. Regula las relaciones laborales en Venezuela y establece derechos como vacaciones, utilidades, prestaciones.',
    ejemplo:'Establece 15 días de vacaciones y 30 días de utilidades mínimos.' },
  { categoria:'Nómina y Laboral', termino:'IVSS',
    definicion:'Instituto Venezolano de los Seguros Sociales. Aporta cobertura de salud, pensiones y riesgos laborales. Aportes: patrono 9% y obrero 4%.',
    ejemplo:'Un sueldo de 10.000 genera IVSS obrero de 400 y patrono de 900.' },
  { categoria:'Nómina y Laboral', termino:'RPE (Régimen Prestacional de Empleo)',
    definicion:'Aporte patronal del 2% sobre el salario para financiar el seguro de paro forzoso.',
    ejemplo:'Sueldo 10.000 → RPE patronal 200.' },
  { categoria:'Nómina y Laboral', termino:'FAOV (Fondo de Ahorro Obligatorio para la Vivienda)',
    definicion:'Aporte para financiar vivienda. Aporta el patrono 2% y el obrero 1% sobre el salario.',
    ejemplo:'Sueldo 10.000 → FAOV patrono 200, obrero 100.' },
  { categoria:'Nómina y Laboral', termino:'INCE (Instituto Nacional de Cooperación Educativa)',
    definicion:'Aporte patronal del 2% sobre el salario para financiar programas de formación profesional.',
    ejemplo:'Sueldo 10.000 → INCE 200.' },
  { categoria:'Nómina y Laboral', termino:'Paro Forzoso',
    definicion:'Seguro que cubre al trabajador cuando pierde su empleo. Aportes: patrono 2% y obrero 0,5%.',
    ejemplo:'Sueldo 10.000 → patrono 200, obrero 50.' },
  { categoria:'Nómina y Laboral', termino:'Prestaciones Sociales',
    definicion:'Ahorro que el patrono debe depositar al trabajador al terminar la relación laboral. Equivalen a 5 días de salario integral por año + 2 días adicionales después del primer año.',
    ejemplo:'Un trabajador con 5 años recibe 30 días de salario integral.' },
  { categoria:'Nómina y Laboral', termino:'Salario Integral',
    definicion:'Salario diario más las alícuotas de bono vacacional y utilidades. Es la base para calcular prestaciones y algunos aportes.',
    ejemplo:'Salario 30 + bono vacacional 2 + utilidades 2,5 = Salario integral 34,5.' },
  { categoria:'Nómina y Laboral', termino:'Vacaciones',
    definicion:'Descanso remunerado anual. LOTTT establece 15 días hábiles + 1 día adicional por año de servicio hasta 15 adicionales. Se pagan con bono vacacional del 50% del salario.',
    ejemplo:'15 días de vacaciones + 15 días de bono = 30 días de salario.' },
  { categoria:'Nómina y Laboral', termino:'Utilidades (Aguinaldos)',
    definicion:'Participación del trabajador en las ganancias de la empresa. Mínimo 30 días de salario, hasta 4 meses según el tiempo de servicio.',
    ejemplo:'Con 1 año de servicio se pagan mínimo 30 días.' },
  { categoria:'Nómina y Laboral', termino:'Horas Extras',
    definicion:'Trabajo fuera de la jornada ordinaria. Se paga con recargo del 50% (diurnas) o 75% (nocturnas) según LOTTT art. 118.',
    ejemplo:'Hora normal 100 → Hora extra diurna 150.' },
  { categoria:'Nómina y Laboral', termino:'Cesta Ticket',
    definicion:'Beneficio de alimentación para trabajadores. Su valor se ajusta según el Ejecutivo Nacional. Sustituye al antiguo bono de alimentación.',
    ejemplo:'40 USD mensuales como referencia actual.' },

  /* ---------- LIBROS Y REGISTROS ---------- */
  { categoria:'Libros y Registros', termino:'Libro Diario',
    definicion:'Registro cronológico de todas las transacciones de la empresa en orden de fecha. Cada asiento debe tener Debe = Haber.',
    ejemplo:'AS-2026-00001 · 15/01 · Venta según factura 001.' },
  { categoria:'Libros y Registros', termino:'Libro Mayor',
    definicion:'Agrupación de los movimientos del Libro Diario por cada cuenta contable. Permite ver el saldo y evolución de cada cuenta.',
    ejemplo:'Caja: Debe 5.000, Haber 3.000, Saldo 2.000.' },
  { categoria:'Libros y Registros', termino:'Libro de Compras',
    definicion:'Registro fiscal de todas las compras con factura. Debe ser presentado al SENIAT. Incluye RIF, factura, control, base, IVA, retención.',
    ejemplo:'Formato exigido por el SENIAT para contribuyentes especiales.' },
  { categoria:'Libros y Registros', termino:'Libro de Ventas',
    definicion:'Registro fiscal de todas las ventas con factura. Se lleva junto con el de compras y se presenta al SENIAT.',
    ejemplo:'Muestra las ventas diarias del mes con IVA desglosado.' },
  { categoria:'Libros y Registros', termino:'Libro de Inventario',
    definicion:'Registro detallado de las entradas y salidas de mercancías. Permite valorizar el inventario final y calcular el costo de ventas.',
    ejemplo:'100 unidades a 5,00 = 500 en inventario.' },
  { categoria:'Libros y Registros', termino:'Libro Auxiliar',
    definicion:'Desglose del Libro Mayor para una cuenta específica, generalmente por tercero (cliente o proveedor). Permite ver cuánto debe cada uno.',
    ejemplo:'Auxiliar de CxC: María 200, José 150.' },

  /* ---------- PRESUPUESTOS Y CONTROL ---------- */
  { categoria:'Presupuestos y Control', termino:'Presupuesto',
    definicion:'Plan financiero que estima los ingresos y gastos esperados para un período futuro. Es una herramienta de control y planeación.',
    ejemplo:'Presupuesto 2026: ventas estimadas 500.000, gastos 300.000.' },
  { categoria:'Presupuestos y Control', termino:'Punto de Equilibrio',
    definicion:'Nivel de ventas en el cual los ingresos igualan a los costos totales (fijos + variables). Por encima de ese punto hay utilidad; por debajo, pérdida.',
    ejemplo:'Costos fijos 100.000 / Margen 40% = Punto de equilibrio 250.000.' },
  { categoria:'Presupuestos y Control', termino:'Costo Fijo',
    definicion:'Gasto que no varía con el nivel de producción o ventas. Se paga aunque la empresa no venda.',
    ejemplo:'Alquiler, sueldos administrativos, seguros.' },
  { categoria:'Presupuestos y Control', termino:'Costo Variable',
    definicion:'Gasto que cambia proporcionalmente con el nivel de actividad. Si no hay ventas, no hay costo variable.',
    ejemplo:'Materia prima, comisiones de venta, fletes.' },
  { categoria:'Presupuestos y Control', termino:'Margen de Contribución',
    definicion:'Diferencia entre el precio de venta y el costo variable unitario. Es lo que contribuye a cubrir los costos fijos y generar utilidad.',
    ejemplo:'Precio 100 - Costo variable 60 = Margen 40.' },
  { categoria:'Presupuestos y Control', termino:'Cierre Contable',
    definicion:'Proceso de finalizar un período contable (diario, mensual o anual) para que no se puedan modificar los asientos. Al cerrar, se calcula el resultado del período.',
    ejemplo:'Un cierre mensual bloquea los asientos de ese mes.' },
  { categoria:'Presupuestos y Control', termino:'Auditoría',
    definicion:'Revisión sistemática de los registros contables para verificar que sean correctos y estén completos. En este sistema, la bitácora registra todas las acciones.',
    ejemplo:'Registro de quién creó, modificó o eliminó cada dato.' },

  /* ---------- SISTEMA / APP ---------- */
  { categoria:'Sistema', termino:'LocalStorage',
    definicion:'Espacio de almacenamiento del navegador donde se guardan los datos del sistema. No requiere internet ni servidor. Se borra al limpiar caché.',
    ejemplo:'Si limpias el navegador, pierdes los datos. Por eso haz respaldos.' },
  { categoria:'Sistema', termino:'Respaldo JSON',
    definicion:'Archivo de texto con todos los datos del sistema en formato JSON. Se puede descargar y volver a cargar en otro navegador.',
    ejemplo:'Botón "JSON" en la barra superior para descargar.' },
  { categoria:'Sistema', termino:'Bitácora de Auditoría',
    definicion:'Registro de todas las acciones realizadas en el sistema, con fecha, usuario, módulo y detalle. Permite rastrear quién hizo qué.',
    ejemplo:'"admin creó la cuenta 1.1.01.03 el 15/01/2026".' },
  { categoria:'Sistema', termino:'Partida Doble Validada',
    definicion:'Mecanismo del sistema que impide guardar un asiento si la suma del Debe no es igual a la del Haber. Garantiza la integridad contable.',
    ejemplo:'Si intentas guardar Debe 100 / Haber 90, el sistema lo rechaza.' },
  { categoria:'Sistema', termino:'Domicilio Electrónico',
    definicion:'Correo electrónico fiscal del cliente o proveedor, exigido por el SENIAT para el envío de facturas electrónicas.',
    ejemplo:'cliente@empresa.com registrado en la ficha del tercero.' }
];

let glosarioCategoriaActual = 'Todas';
let glosarioBusqueda = '';

function renderGlosario(container) {
  const categorias = ['Todas', ...new Set(GLOSARIO.map(g => g.categoria))];
  container.innerHTML = `
    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold">Glosario de Términos</h1>
        <p class="text-xs text-slate-500">Definiciones contables, fiscales y laborales adaptadas a Venezuela.</p>
      </div>
      <input type="text" id="filtroGlosario" placeholder="🔍 Buscar término…"
        value="${glosarioBusqueda}" oninput="buscarGlosario(this.value)"
        class="text-xs p-2 border rounded w-full sm:w-64">
    </div>

    <div class="mb-4 flex flex-wrap gap-2" id="filtrosGlosario">
      ${categorias.map(c => `
        <button onclick="filtrarCategoriaGlosario('${c}')"
          class="${c === glosarioCategoriaActual ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'} text-xs px-3 py-1.5 rounded border">
          ${c}
        </button>
      `).join('')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3" id="listaGlosario">
      ${renderItemsGlosario()}
    </div>

    <p class="text-[10px] text-slate-400 text-center mt-4">
      ${GLOSARIO.length} términos en total. ¿Falta alguno? Repórtalo al administrador.
    </p>
  `;
}

function renderItemsGlosario() {
  const filtrados = GLOSARIO.filter(g =>
    (glosarioCategoriaActual === 'Todas' || g.categoria === glosarioCategoriaActual) &&
    (!glosarioBusqueda || g.termino.toLowerCase().includes(glosarioBusqueda.toLowerCase()) ||
     g.definicion.toLowerCase().includes(glosarioBusqueda.toLowerCase()))
  );
  if (!filtrados.length) return '<p class="text-xs text-slate-500 p-4">Sin resultados.</p>';
  return filtrados.map(g => `
    <div class="bg-white rounded-lg border shadow-sm p-4 hover:shadow transition">
      <div class="flex justify-between items-start gap-2 mb-2">
        <h3 class="font-bold text-sm text-slate-800">${g.termino}</h3>
        <span class="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded uppercase whitespace-nowrap">${g.categoria}</span>
      </div>
      <p class="text-xs text-slate-600 leading-relaxed mb-2">${g.definicion}</p>
      <div class="bg-amber-50 border-l-2 border-amber-400 p-2 rounded-r">
        <p class="text-[10px] text-amber-800"><b>Ejemplo:</b> ${g.ejemplo}</p>
      </div>
    </div>
  `).join('');
}

function buscarGlosario(v) {
  glosarioBusqueda = v;
  document.getElementById('listaGlosario').innerHTML = renderItemsGlosario();
}

function filtrarCategoriaGlosario(cat) {
  glosarioCategoriaActual = cat;
  document.querySelectorAll('#filtrosGlosario button').forEach(b => {
    if (b.textContent.trim() === cat) {
      b.className = 'bg-slate-800 text-white text-xs px-3 py-1.5 rounded border';
    } else {
      b.className = 'bg-white text-slate-700 hover:bg-slate-100 text-xs px-3 py-1.5 rounded border';
    }
  });
  document.getElementById('listaGlosario').innerHTML = renderItemsGlosario();
}