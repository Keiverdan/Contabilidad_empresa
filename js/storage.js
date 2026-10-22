const DEFAULT_DB = () => {
  return {
    version: CONFIG.DB_VERSION,
    empresaActual: 1,
    usuarioActual: 'admin',
    tutorialCompletado: false,   // ⭐ NUEVO
    empresas: [
      { id: 1, nombre: 'Inversiones Elohim, C.A.', rif: 'J-30596841-2' }
    ],
    usuarios: [
      { id: 1, nombre: 'Administrador', rol: 'ADMIN', empresas: [1] },
      { id: 2, nombre: 'Contador',      rol: 'CONTADOR', empresas: [1] }
    ],
    planDeCuentas: [
      { codigo:'1',         nombre:'ACTIVO',                          tipo:'ACTIVO',     nivel:'TITULO' },
      { codigo:'1.1',       nombre:'Activo Corriente',                tipo:'ACTIVO',     nivel:'TITULO' },
      { codigo:'1.1.01.01', nombre:'Caja Principal en Bolívares',     tipo:'ACTIVO',     nivel:'DETALLE' },
      { codigo:'1.1.01.02', nombre:'Banco Nacional M/N (.Bs)',        tipo:'ACTIVO',     nivel:'DETALLE' },
      { codigo:'1.1.02.01', nombre:'Cuentas por Cobrar Clientes',     tipo:'ACTIVO',     nivel:'DETALLE' },
      { codigo:'1.1.03.01', nombre:'Inventarios de Mercancías',       tipo:'ACTIVO',     nivel:'DETALLE' },
      { codigo:'2',         nombre:'PASIVO',                          tipo:'PASIVO',     nivel:'TITULO' },
      { codigo:'2.1.01.01', nombre:'Cuentas por Pagar Proveedores',   tipo:'PASIVO',     nivel:'DETALLE' },
      { codigo:'2.1.02.01', nombre:'Débito Fiscal IVA por Enterar',   tipo:'PASIVO',     nivel:'DETALLE' },
      { codigo:'2.1.03.01', nombre:'Sueldos y Salarios por Pagar',    tipo:'PASIVO',     nivel:'DETALLE' },
      { codigo:'2.1.04.01', nombre:'Retenciones Laborales por Pagar', tipo:'PASIVO',     nivel:'DETALLE' },
      { codigo:'3',         nombre:'PATRIMONIO',                      tipo:'PATRIMONIO', nivel:'TITULO' },
      { codigo:'3.1.01.01', nombre:'Capital Social Suscrito y Pagado',tipo:'PATRIMONIO', nivel:'DETALLE' },
      { codigo:'3.1.02.01', nombre:'Resultados Acumulados',           tipo:'PATRIMONIO', nivel:'DETALLE' },
      { codigo:'4',         nombre:'INGRESOS',                        tipo:'INGRESOS',   nivel:'TITULO' },
      { codigo:'4.1.01.01', nombre:'Ventas de Mercancías General',    tipo:'INGRESOS',   nivel:'DETALLE' },
      { codigo:'4.1.02.01', nombre:'Ingresos por Servicios',          tipo:'INGRESOS',   nivel:'DETALLE' },
      { codigo:'5',         nombre:'COSTOS',                          tipo:'COSTOS',     nivel:'TITULO' },
      { codigo:'5.1.01.01', nombre:'Costo de Ventas',                 tipo:'COSTOS',     nivel:'DETALLE' },
      { codigo:'5.1.02.01', nombre:'Costo de Servicios',              tipo:'COSTOS',     nivel:'DETALLE' },
      { codigo:'6',         nombre:'GASTOS',                          tipo:'GASTOS',     nivel:'TITULO' },
      { codigo:'6.1.01.01', nombre:'Sueldos, Salarios y Beneficios',  tipo:'GASTOS',     nivel:'DETALLE' },
      { codigo:'6.1.02.01', nombre:'Cargas Sociales (IVSS, RPE, FAOV)',tipo:'GASTOS',    nivel:'DETALLE' },
      { codigo:'6.2.01.01', nombre:'Alquileres',                      tipo:'GASTOS',     nivel:'DETALLE' },
      { codigo:'6.2.02.01', nombre:'Servicios Públicos',              tipo:'GASTOS',     nivel:'DETALLE' }
    ],
    historicoTasas: [{ fecha: hoyISO(), moneda: 'USD', tasa: 900.00 }],
    terceros: [
      { id:1, rif:'V-12345678', nombre:'María Pérez', tipo:'CLIENTE',
        persona:'NATURAL', telefono:'0414-1234567',
        email:'maria.perez@example.com', direccion:'Caracas' },
      { id:2, rif:'V-87654321', nombre:'José Rodríguez', tipo:'CLIENTE',
        persona:'NATURAL', telefono:'0424-9876543',
        email:'jose.rod@example.com', direccion:'Maracay' },
      { id:3, rif:'J-30596841-2', nombre:'Distribuidora Central, C.A.', tipo:'PROVEEDOR',
        persona:'JURIDICA', telefono:'0212-5551234',
        email:'contacto@distcentral.com', direccion:'Caracas' },
      { id:4, rif:'J-27200917-8', nombre:'Suministros Industriales, C.A.', tipo:'AMBOS',
        persona:'JURIDICA', telefono:'0241-5559876',
        email:'ventas@sumindustrial.com', direccion:'Valencia' }
    ],
    productos: [
      { id:1, codigo:'P001', nombre:'Resma de papel A4', categoria:'Papelería',
        costo:5.00, precio:8.00, stock:100, stockMin:10, unidad:'Unidad', empresa:1 },
      { id:2, codigo:'P002', nombre:'Tóner HP 26A', categoria:'Tecnología',
        costo:45.00, precio:70.00, stock:25, stockMin:5, unidad:'Unidad', empresa:1 },
      { id:3, codigo:'P003', nombre:'Bolígrafo azul', categoria:'Papelería',
        costo:0.50, precio:1.20, stock:500, stockMin:50, unidad:'Unidad', empresa:1 }
    ],
    libroCompras: [],
    libroVentas: [],
    libroDiario: [],
    libroInventario: [],
    libroServicios: [],
    movimientosInventario: [],
    nomina: [],
    nominaMes: [],
    presupuestos: [],
    cierres: [],
    bitacora: []
  };
};

let _cacheDB = null;

function getDB() {
  if (_cacheDB) return _cacheDB;
  try {
    const raw = localStorage.getItem(CONFIG.DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version !== CONFIG.DB_VERSION) {
        _cacheDB = { ...DEFAULT_DB(), ...parsed, version: CONFIG.DB_VERSION };
      } else {
        _cacheDB = parsed;
      }
    } else {
      _cacheDB = DEFAULT_DB();
    }
  } catch (e) {
    console.error('Error leyendo localStorage:', e);
    _cacheDB = DEFAULT_DB();
  }
  return _cacheDB;
}

function saveDB(db) {
  try {
    _cacheDB = db;
    localStorage.setItem(CONFIG.DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Error guardando:', e);
    mostrarAlerta('Error al guardar. ¿Superaste el límite de 5 MB?', 'error');
  }
}

function exportarRespaldoJSON() {
  const db = getDB();
  const dataStr = 'data:application/json;charset=utf-8,'
    + encodeURIComponent(JSON.stringify(db, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `Respaldo_Elohim_${hoyISO()}.json`;
  a.click();
  registrarAuditoria('RESPALDO', 'Exportación JSON completa');
}

function importarRespaldoJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.planDeCuentas) throw new Error('Estructura inválida');
      saveDB(data);
      mostrarAlerta('Respaldo restaurado. Recargando…');
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      mostrarAlerta('Archivo JSON inválido: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function resetearDatos() {
  if (!confirm('¿Borrar TODOS los datos y recargar el seed de prueba?')) return;
  localStorage.removeItem(CONFIG.DB_KEY);
  _cacheDB = null;
  location.reload();
}