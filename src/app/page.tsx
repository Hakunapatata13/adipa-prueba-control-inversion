"use client";

import { useMemo, useState } from "react";
import {
  periodosPMO,
  Pais,
  calcularProyeccionCierre,
  calcularEstadoRitmo,
  formatCLP,
  formatPct,
} from "@/lib/mockData";
import { SemaforoBadge } from "@/components/SemaforoBadge";
import PacingBar from "@/components/PacingBar";
import SinDatos from "@/components/SinDatos";

const paises: Pais[] = ["Chile", "México", "Colombia"];

export default function ControlGastoPage() {
  const [paisSel, setPaisSel] = useState<Pais>("Chile");

  const periodo = useMemo(
    () => periodosPMO.find((p) => p.pais === paisSel)!,
    [paisSel]
  );

  const programasConDatos = periodo.programas.filter(
    (p) => p.gastoActual !== null
  ) as { tipoPrograma: string; presupuesto: number; gastoActual: number }[];
  const programasSinDatos = periodo.programas.filter(
    (p) => p.gastoActual === null
  );

  const presupuestoTotal = periodo.programas.reduce(
    (acc, p) => acc + p.presupuesto,
    0
  );
  const gastoTotal = programasConDatos.reduce(
    (acc, p) => acc + p.gastoActual,
    0
  );
  const proyeccionTotal = calcularProyeccionCierre(
    gastoTotal,
    periodo.diasTranscurridos,
    periodo.diasTotales
  );
  const estadoPais = calcularEstadoRitmo(
    presupuestoTotal,
    gastoTotal,
    periodo.diasTranscurridos,
    periodo.diasTotales
  );
  const pctTiempo = periodo.diasTranscurridos / periodo.diasTotales;
  const pctGasto = gastoTotal / presupuestoTotal;
  const pctProyeccion = proyeccionTotal / presupuestoTotal;
  const saldoDisponible = presupuestoTotal - gastoTotal;

  const colorBarra = {
    azul: "bg-celeste",
    naranja: "bg-alerta",
    rojo: "bg-riesgo",
  }[estadoPais];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-marino">
          Control de Gasto
        </h1>
        <p className="text-marino/60 mt-1">
          Ritmo de inversión publicitaria por país y tipo de programa.
        </p>
      </div>

      {/* Selectores */}
      <div className="flex flex-wrap gap-6 items-end">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-marino/50 mb-2">
            País
          </label>
          <div className="flex gap-2">
            {paises.map((p) => (
              <button
                key={p}
                onClick={() => setPaisSel(p)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  paisSel === p
                    ? "bg-morado text-white"
                    : "bg-white border border-lila-claro text-marino hover:bg-lila-claro/40"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-marino/50 mb-2">
            Período
          </label>
          <div className="px-4 py-2 rounded-full text-sm font-semibold bg-lila-claro/50 text-marino">
            {periodo.mesLabel}
          </div>
        </div>
      </div>

      {/* Resumen del período */}
      <section className="bg-white rounded-2xl border border-lila-claro p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-marino/50 font-medium">
              Resumen del período · {paisSel}
            </p>
            <p className="text-lg font-bold">
              Día {periodo.diasTranscurridos} de {periodo.diasTotales}
            </p>
          </div>
          <SemaforoBadge estado={estadoPais} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatTile
            label="Días transcurridos"
            value={`${periodo.diasTranscurridos}/${periodo.diasTotales}`}
          />
          <StatTile label="Gasto acumulado" value={formatCLP(gastoTotal)} />
          <StatTile
            label="Proyección al cierre"
            value={formatCLP(proyeccionTotal)}
          />
          <StatTile
            label="Saldo disponible"
            value={formatCLP(saldoDisponible)}
            negative={saldoDisponible < 0}
          />
        </div>

        <div className="flex flex-col gap-4">
          <PacingBar
            label="Tiempo transcurrido"
            pct={pctTiempo}
            colorClass="bg-marino/40"
          />
          <PacingBar
            label="Presupuesto consumido"
            pct={pctGasto}
            colorClass={colorBarra}
          />
          <PacingBar
            label="Proyección al cierre"
            pct={pctProyeccion}
            colorClass={colorBarra}
          />
        </div>
      </section>

      {/* Tabla de pacing por programa */}
      <section className="bg-white rounded-2xl border border-lila-claro p-6">
        <h2 className="text-lg font-bold mb-4">
          Pacing por tipo de programa
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-marino/50 border-b border-lila-claro">
                <th className="py-3 pr-4 font-bold">Tipo de Programa</th>
                <th className="py-3 pr-4 font-bold">Presupuesto</th>
                <th className="py-3 pr-4 font-bold">Gasto Actual</th>
                <th className="py-3 pr-4 font-bold">Promedio Diario</th>
                <th className="py-3 pr-4 font-bold">Proyección Cierre</th>
                <th className="py-3 pr-4 font-bold">Diferencia</th>
                <th className="py-3 pr-4 font-bold">% Ritmo</th>
              </tr>
            </thead>
            <tbody>
              {periodo.programas.map((prog) => {
                if (prog.gastoActual === null) {
                  return (
                    <tr
                      key={prog.tipoPrograma}
                      className="border-b border-lila-claro/60 last:border-0"
                    >
                      <td className="py-4 pr-4 font-semibold">
                        {prog.tipoPrograma}
                      </td>
                      <td className="py-4 pr-4 text-marino/70">
                        {formatCLP(prog.presupuesto)}
                      </td>
                      <td colSpan={5} className="py-4 pr-4">
                        <SinDatos
                          ultimaActualizacion={prog.ultimaActualizacion}
                          compact
                        />
                      </td>
                    </tr>
                  );
                }

                const promedioDiario =
                  prog.gastoActual / periodo.diasTranscurridos;
                const proyeccion = calcularProyeccionCierre(
                  prog.gastoActual,
                  periodo.diasTranscurridos,
                  periodo.diasTotales
                );
                const diferencia = prog.presupuesto - proyeccion;
                const estado = calcularEstadoRitmo(
                  prog.presupuesto,
                  prog.gastoActual,
                  periodo.diasTranscurridos,
                  periodo.diasTotales
                );
                const pctRitmo = proyeccion / prog.presupuesto;

                return (
                  <tr
                    key={prog.tipoPrograma}
                    className="border-b border-lila-claro/60 last:border-0"
                  >
                    <td className="py-4 pr-4 font-semibold">
                      {prog.tipoPrograma}
                    </td>
                    <td className="py-4 pr-4 text-marino/70">
                      {formatCLP(prog.presupuesto)}
                    </td>
                    <td className="py-4 pr-4 text-marino/70">
                      {formatCLP(prog.gastoActual)}
                    </td>
                    <td className="py-4 pr-4 text-marino/70">
                      {formatCLP(Math.round(promedioDiario))}
                    </td>
                    <td className="py-4 pr-4 text-marino/70">
                      {formatCLP(Math.round(proyeccion))}
                    </td>
                    <td
                      className={`py-4 pr-4 font-semibold ${
                        diferencia < 0 ? "text-riesgo" : "text-ok"
                      }`}
                    >
                      {diferencia < 0 ? "-" : "+"}
                      {formatCLP(Math.abs(Math.round(diferencia)))}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {formatPct(pctRitmo, 0)}
                        </span>
                        <SemaforoBadge estado={estado} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {programasSinDatos.length > 0 && (
          <p className="mt-4 text-xs text-marino/50">
            {programasSinDatos.length} programa(s) sin datos actualizados hoy — no se muestran como gasto cero.
          </p>
        )}
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  return (
    <div className="bg-fondo rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-marino/50 mb-1">
        {label}
      </p>
      <p
        className={`text-lg font-extrabold ${
          negative ? "text-riesgo" : "text-marino"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
