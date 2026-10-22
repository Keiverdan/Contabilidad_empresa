/* ============================================================
   NÓMINA RÁPIDA — Calculadora de salarios y liquidaciones
   ============================================================ */

function renderNominaRapida(container) {
  container.innerHTML = `
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Nómina Rápida — Calculadora</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Calculadora de salario -->
      <div class="bg-white p-4 rounded-lg border shadow">
        <h2 class="text-sm font-bold mb-3 pb-2 border-b">💵 Cálculo rápido de salario mensual</h2>
        <form id="formSalarioRapido" class="space-y-2">
          <div class="grid grid-cols-2 gap-2">
            <div><label class="block text-xs font-medium mb-1">Sueldo base (.Bs)</label>
              <input type="number" step="0.01" id="sueldoBase" placeholder="0.00" class="w-full text-xs p-2 border rounded mono"></div>
            <div><label class="block text-xs font-medium mb-1">Días trabajados</label>
              <input type="number" id="diasTrab" value="30" class="w-full text-xs p-2 border rounded mono"></div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div><label class="block text-xs font-medium mb-1">Horas extras diurnas</label>
              <input type="number" step="0.01" id="hExtrasDiur" value="0" class="w-full text-xs p-2 border rounded mono"></div>
            <div><label class="block text-xs font-medium mb-1">Horas extras nocturnas</label>
              <input type="number" step="0.01" id="hExtrasNoct" value="0" class="w-full text-xs p-2 border rounded mono"></div>
          </div>
          <div><label class="block text-xs font-medium mb-1">Bonificación especial (.Bs)</label>
            <input type="number" step="0.01" id="bonoEspecial" value="0" class="w-full text-xs p-2 border rounded mono"></div>
          <button type="button" onclick="calcularSalarioRapido()" class="w-full bg-emerald-600 text-white py-2 rounded text-xs font-bold">
            <i class="fa-solid fa-calculator mr-1"></i> Calcular salario
          </button>
        </form>
        <div id="resultSalario" class="mt-3"></div>
      </div>

      <!-- Liquidación -->
      <div class="bg-white p-4 rounded-lg border shadow">
        <h2 class="text-sm font-bold mb-3 pb-2 border-b">📋 Liquidación de prestaciones (LOTTT)</h2>
        <form id="formLiquidacion" class="space-y-2">
          <div class="grid grid-cols-2 gap-2">
            <div><label class="block text-xs font-medium mb-1">Salario mensual (.Bs)</label>
              <input type="number" step="0.01" id="liqSalario" placeholder="0.00" class="w-full text-xs p-2 border rounded mono"></div>
            <div><label class="block text-xs font-medium mb-1">Años de servicio</label>
              <input type="number" step="0.1" id="liqAnios" value="1" class="w-full text-xs p-2 border rounded mono"></div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div><label class="block text-xs font-medium mb-1">Días vacaciones pendientes</label>
              <input type="number" step="0.01" id="liqVacPend" value="0" class="w-full text-xs p-2 border rounded mono"></div>
            <div><label class="block text-xs font-medium mb-1">Días bono vacacional pendientes</label>
              <input type="number" step="0.01" id="liqBonoPend" value="0" class="w-full text-xs p-2 border rounded mono"></div>
          </div>
          <button type="button" onclick="calcularLiquidacion()" class="w-full bg-emerald-600 text-white py-2 rounded text-xs font-bold">
            <i class="fa-solid fa-file-invoice-dollar mr-1"></i> Calcular liquidación
          </button>
        </form>
        <div id="resultLiquidacion" class="mt-3"></div>
      </div>
    </div>
  `;
}

function calcularSalarioRapido() {
  const sueldo = parseFloat(document.getElementById('sueldoBase').value) || 0;
  const dias = parseFloat(document.getElementById('diasTrab').value) || 30;
  const hDiur = parseFloat(document.getElementById('hExtrasDiur').value) || 0;
  const hNoct = parseFloat(document.getElementById('hExtrasNoct').value) || 0;
  const bono = parseFloat(document.getElementById('bonoEspecial').value) || 0;

  // Valor hora = sueldo / 30 / 8
  const valorHora = sueldo / 30 / 8;
  // Hora extra diurna = valorHora × 1.5 (LOTTT art. 118)
  const pagoHExtraDiur = hDiur * valorHora * 1.5;
  // Hora extra nocturna = valorHora × 1.75 (recargo nocturno + extra)
  const pagoHExtraNoct = hNoct * valorHora * 1.75;
  // Salario proporcional a días
  const sueldoProporcional = (sueldo / 30) * dias;
  const totalBruto = sueldoProporcional + pagoHExtraDiur + pagoHExtraNoct + bono;

  // Deducciones
  const ivss = totalBruto * CONFIG.IVSS_OBRERO;
  const rpe = totalBruto * CONFIG.RPE_PATRONO; // informativo
  const faov = totalBruto * CONFIG.FAOV_OBRERO;
  const paroForzoso = totalBruto * CONFIG.PARO_FORZOSO_OBRERO;
  const totalDeducciones = ivss + faov + paroForzoso;
  const neto = totalBruto - totalDeducciones;

  // Aportes patronales
  const ivssPat = totalBruto * CONFIG.IVSS_PATRONO;
  const rpePat = totalBruto * CONFIG.RPE_PATRONO;
  const faovPat = totalBruto * CONFIG.FAOV_PATRONO;
  const incePat = totalBruto * CONFIG.INCE_PATRONO;
  const paroPat = totalBruto * CONFIG.PARO_FORZOSO_PATRONO;
  const totalPatrono = ivssPat + rpePat + faovPat + incePat + paroPat;

  document.getElementById('resultSalario').innerHTML = `
    <table class="w-full text-xs border">
      <tbody>
        <tr class="bg-slate-50 font-bold"><td colspan="2" class="p-1.5">ASIGNACIONES</td></tr>
        <tr><td class="p-1.5">Sueldo (${dias} días)</td><td class="p-1.5 text-right mono">${fmtNum(sueldoProporcional)}</td></tr>
        <tr><td class="p-1.5">Horas extras diurnas (×1.5)</td><td class="p-1.5 text-right mono">${fmtNum(pagoHExtraDiur)}</td></tr>
        <tr><td class="p-1.5">Horas extras nocturnas (×1.75)</td><td class="p-1.5 text-right mono">${fmtNum(pagoHExtraNoct)}</td></tr>
        <tr><td class="p-1.5">Bonificación</td><td class="p-1.5 text-right mono">${fmtNum(bono)}</td></tr>
        <tr class="font-bold border-t"><td class="p-1.5">TOTAL BRUTO</td><td class="p-1.5 text-right mono text-emerald-700">${fmtNum(totalBruto)}</td></tr>
        <tr class="bg-slate-50 font-bold"><td colspan="2" class="p-1.5">DEDUCCIONES</td></tr>
        <tr><td class="p-1.5">IVSS (4%)</td><td class="p-1.5 text-right mono text-red-600">(${fmtNum(ivss)})</td></tr>
        <tr><td class="p-1.5">FAOV (1%)</td><td class="p-1.5 text-right mono text-red-600">(${fmtNum(faov)})</td></tr>
        <tr><td class="p-1.5">Paro forzoso (0.5%)</td><td class="p-1.5 text-right mono text-red-600">(${fmtNum(paroForzoso)})</td></tr>
        <tr class="font-bold border-t"><td class="p-1.5">TOTAL DEDUCCIONES</td><td class="p-1.5 text-right mono text-red-600">(${fmtNum(totalDeducciones)})</td></tr>
        <tr class="bg-emerald-50 font-bold"><td class="p-2">NETO A PAGAR</td><td class="p-2 text-right mono text-emerald-700 text-base">${fmtNum(neto)}</td></tr>
        <tr class="bg-slate-50 font-bold"><td colspan="2" class="p-1.5">APORTES PATRONALES (informativo)</td></tr>
        <tr><td class="p-1.5">IVSS (9%)</td><td class="p-1.5 text-right mono">${fmtNum(ivssPat)}</td></tr>
        <tr><td class="p-1.5">RPE (2%)</td><td class="p-1.5 text-right mono">${fmtNum(rpePat)}</td></tr>
        <tr><td class="p-1.5">FAOV (2%)</td><td class="p-1.5 text-right mono">${fmtNum(faovPat)}</td></tr>
        <tr><td class="p-1.5">INCE (2%)</td><td class="p-1.5 text-right mono">${fmtNum(incePat)}</td></tr>
        <tr><td class="p-1.5">Paro forzoso (2%)</td><td class="p-1.5 text-right mono">${fmtNum(paroPat)}</td></tr>
        <tr class="font-bold border-t"><td class="p-1.5">TOTAL PATRONO</td><td class="p-1.5 text-right mono">${fmtNum(totalPatrono)}</td></tr>
      </tbody>
    </table>
  `;
}

function calcularLiquidacion() {
  const salario = parseFloat(document.getElementById('liqSalario').value) || 0;
  const anios = parseFloat(document.getElementById('liqAnios').value) || 0;
  const vacPend = parseFloat(document.getElementById('liqVacPend').value) || 0;
  const bonoPend = parseFloat(document.getElementById('liqBonoPend').value) || 0;

  // Salario diario integral = (salario mensual / 30) + alícuota bono vac + alícuota utilidades
  const salDiario = salario / 30;
  const alicBonoVac = (salDiario * CONFIG.DIAS_BONO_VACACIONAL) / 360;
  const alicUtilidades = (salDiario * CONFIG.DIAS_UTILIDADES) / 360;
  const salDiarioIntegral = salDiario + alicBonoVac + alicUtilidades;

  // Prestaciones art. 142 LOTTT: 5 días/año + 2 días adicionales por año (después del 1er año)
  let diasPrest = anios * CONFIG.DIAS_PRESTACION_ANTIGUEDAD;
  if (anios > 1) diasPrest += (Math.floor(anios) - 1) * CONFIG.DIAS_PRESTACION_ADICIONAL;
  const prestaciones = salDiarioIntegral * diasPrest;

  // Vacaciones y bono vacacional pendientes
  const vacaciones = salDiario * vacPend;
  const bonoVacacional = salDiario * bonoPend;

  // Utilidades fraccionadas (proporcional a meses trabajados en el año)
  const utilidades = salDiario * CONFIG.DIAS_UTILIDADES * Math.min(1, anios % 1 || 1);

  const total = prestaciones + vacaciones + bonoVacacional + utilidades;

  document.getElementById('resultLiquidacion').innerHTML = `
    <table class="w-full text-xs border">
      <tbody>
        <tr class="bg-slate-50 font-bold"><td colspan="2" class="p-1.5">CÁLCULO</td></tr>
        <tr><td class="p-1.5">Salario diario</td><td class="p-1.5 text-right mono">${fmtNum(salDiario)}</td></tr>
        <tr><td class="p-1.5">Salario diario integral</td><td class="p-1.5 text-right mono">${fmtNum(salDiarioIntegral)}</td></tr>
        <tr><td class="p-1.5">Días de prestaciones acumulados</td><td class="p-1.5 text-right mono">${diasPrest.toFixed(0)}</td></tr>
        <tr class="bg-slate-50 font-bold"><td colspan="2" class="p-1.5">CONCEPTO</td></tr>
        <tr><td class="p-1.5">Prestaciones sociales (art. 142)</td><td class="p-1.5 text-right mono">${fmtNum(prestaciones)}</td></tr>
        <tr><td class="p-1.5">Vacaciones pendientes</td><td class="p-1.5 text-right mono">${fmtNum(vacaciones)}</td></tr>
        <tr><td class="p-1.5">Bono vacacional pendiente</td><td class="p-1.5 text-right mono">${fmtNum(bonoVacacional)}</td></tr>
        <tr><td class="p-1.5">Utilidades fraccionadas</td><td class="p-1.5 text-right mono">${fmtNum(utilidades)}</td></tr>
        <tr class="bg-emerald-50 font-bold"><td class="p-2">TOTAL LIQUIDACIÓN</td><td class="p-2 text-right mono text-emerald-700 text-base">${fmtNum(total)}</td></tr>
      </tbody>
    </table>
    <p class="text-[10px] text-slate-500 mt-2">* Cálculo referencial LOTTT. Verificar con contador antes de pagar.</p>
  `;
}