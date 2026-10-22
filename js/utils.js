/* ============================================================
   UTILIDADES GENERALES
   ============================================================ */

const fmtBs = n => new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2, maximumFractionDigits: 2
}).format(Number(n) || 0) + ' .Bs';

const fmtNum = n => new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2, maximumFractionDigits: 2
}).format(Number(n) || 0);

const fmtFecha = iso => {
  if (!iso) return '';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return isNaN(d) ? iso : d.toLocaleDateString('es-VE');
};

const hoyISO = () => new Date().toISOString().slice(0, 10);

function normalizarRIF(rif) {
  if (!rif) return '';
  return String(rif).toUpperCase().replace(/[^VEJPGCN0-9]/g, '');
}

function calcularDV_VarianteA(cuerpo) {
  const pesos = [3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  for (let i = 0; i < 8; i++) suma += parseInt(cuerpo[i], 10) * pesos[i];
  const resto = suma % 11;
  let dv = 11 - resto;
  if (dv >= 10) dv = 0;
  return dv;
}

function calcularDV_VarianteB(cuerpo) {
  const pesos = [3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  for (let i = 0; i < 8; i++) suma += parseInt(cuerpo[i], 10) * pesos[i];
  const resto = suma % 10;
  let dv = 10 - resto;
  if (dv >= 10) dv = 0;
  return dv;
}

function validarRIF(rif) {
  const r = normalizarRIF(rif);
  if (!r) return { valido: false, mensaje: 'RIF vacío' };
  const tipo = r[0];
  if (!['V','E','J','P','G','C','N'].includes(tipo)) {
    return { valido: false, mensaje: `Tipo inválido "${tipo}". Use V, E, J, P, G, C o N.` };
  }
  const resto = r.slice(1);
  if (!/^\d+$/.test(resto)) {
    return { valido: false, mensaje: 'Solo números después de la letra.' };
  }
  if (tipo === 'V' || tipo === 'E') {
    if (resto.length < 6 || resto.length > 9) {
      return { valido: false,
        mensaje: `Cédula ${tipo} debe tener 6 a 8 dígitos (DV opcional). Tiene ${resto.length}.` };
    }
    return { valido: true, tipo, cuerpo: resto.padStart(8, '0'), dv: 'N/A', mensaje: 'Formato válido' };
  }
  if (resto.length !== 9) {
    return { valido: false,
      mensaje: `RIF ${tipo} debe tener 8 dígitos + 1 DV (9 en total). Tiene ${resto.length}.` };
  }
  const cuerpo = resto.slice(0, 8);
  const dvIng = parseInt(resto[8], 10);
  const dA = calcularDV_VarianteA(cuerpo);
  const dB = calcularDV_VarianteB(cuerpo);
  if (dvIng !== dA && dvIng !== dB) {
    return { valido: true, tipo, cuerpo, dv: dvIng, mensaje: 'Formato válido',
      advertencia: `DV ${dvIng} no coincide con variantes conocidas (${dA} o ${dB}). Se acepta igual.` };
  }
  return { valido: true, tipo, cuerpo, dv: dvIng, mensaje: 'Formato válido' };
}

function formatearRIF(rif) {
  const r = normalizarRIF(rif);
  if (r.length < 2) return r;
  const tipo = r[0];
  const cuerpo = r.slice(1, -1);
  const dv = r.slice(-1);
  if (cuerpo.length === 8) return `${tipo}-${cuerpo}-${dv}`;
  return `${tipo}-${cuerpo}`;
}

function validarEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarPartidaDoble(debe, haber) {
  const d = Math.round(Number(debe) * 100) / 100;
  const h = Math.round(Number(haber) * 100) / 100;
  return d > 0 && d === h;
}

function registrarAuditoria(modulo, accion, detalles = '') {
  const db = getDB();
  db.bitacora.unshift({
    fecha: new Date().toISOString(),
    usuario: db.usuarioActual || 'anónimo',
    empresa: db.empresaActual || 1,
    modulo, accion, detalles
  });
  if (db.bitacora.length > 500) db.bitacora.length = 500;
  saveDB(db);
}

function mostrarAlerta(msg, tipo = 'exito') {
  const cont = document.getElementById('alertContainer');
  if (!cont) return;
  const col = tipo === 'exito' ? 'bg-emerald-600'
            : tipo === 'error' ? 'bg-red-600'
            : 'bg-amber-500';
  const el = document.createElement('div');
  el.className = `${col} text-white px-4 py-2 rounded-lg shadow mb-2 text-xs flex justify-between items-center fade-in`;
  el.innerHTML = `<span>${msg}</span>
    <button onclick="this.parentElement.remove()" class="font-bold ml-4">&times;</button>`;
  cont.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

function fechaEnPeriodo(fecha, desde, hasta) {
  return fecha >= desde && fecha <= hasta;
}

function generarNumeroAsiento() {
  const db = getDB();
  const anio = new Date().getFullYear();
  const n = (db.libroDiario?.length || 0) + 1;
  return `AS-${anio}-${String(n).padStart(5, '0')}`;
}

function testRIFs() {
  const casos = [
    ['J-27200917-8', true], ['J-30596841-2', true],
    ['V-12345678', true], ['V-1234567', true], ['E-12345678', true],
    ['J-12345678-9', true], ['J-1234567-9', false], ['X-12345678-9', false]
  ];
  return casos.map(([rif, esp]) => {
    const r = validarRIF(rif);
    return { rif, esperado: esp, obtenido: r.valido, ok: r.valido === esp,
      mensaje: r.mensaje, advertencia: r.advertencia || '' };
  });
}