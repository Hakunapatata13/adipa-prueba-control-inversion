"use client";

import {
  plataformasLatam,
  desgloseMensualLatam,
  UMBRAL_INV_VENTAS,
  formatCLP,
  formatPct,
} from "@/lib/mockData";
import { SemaforoSimple } from "@/components/SemaforoBadge";
import SinDatos from "@/components/SinDatos";

export default function LatamPage() {
  const mesesConDatos = desgloseMensualLatam.filter(
    (m) => m.inversion !== null && m.ventaTotal !== null
  ) as { inversion: number; ventaTotal: number }[];

  const inversionTotal = mesesConDatos.reduce((a, m) => a + m.inversion, 0);
  const ventaTotal = mesesConDatos.reduce((a, m) => a + m.ventaTotal, 0);
  const roasTotal = ventaTotal > 0 ? ventaTotal / inversionTotal : 0;
  const inversionVentasTotal = inversionTotal / ventaTotal;

  const inversionPlataformas = plataformasLatam.reduce(
    (a, p) => a + p.inversion,
    0
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-marino">
          Inversión LATAM
        </h1>
        <p className="text-marino/60 mt-1">
          Vista agregada de inversión, venta y % Inv/Ventas por mes.
        </p>
      </div>

      {/* Resumen general */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-6 bg-morado text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-1">
            Inversión total LATAM
          </p>
          <p className="text-2xl font-extrabold">
            {formatCLP(inversionTotal)}
          </p>
        </div>
        <div className="rounded-2xl p-6 bg-celeste text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80 mb-1">
            Venta total LATAM
          </p>
          <p className="text-2xl font-extrabold">{formatCLP(ventaTotal)}</p>
        </div>
        <div className="rounded-2xl p-6 bg-white border border-lila-claro">
          <p className="text-xs font-semibold uppercase tracking-wide text-marino/50 mb-1">
            % ROAS
          </p>
          <p className="text-2xl font-extrabold text-marino">
            {roasTotal.toFixed(2)}x
          </p>
          <p className="text-xs text-marino/50 mt-1">
            % Inv/Ventas: {formatPct(inversionVentasTotal)}
          </p>
        </div>
      </section>

      {/* Inversión por plataforma */}
      <section className="bg-white rounded-2xl border border-lila-claro p-6">
        <h2 className="text-lg font-bold mb-4">Inversión por plataforma</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plataformasLatam.map((p) => {
            const pct = p.inversion / inversionPlataformas;
            return (
              <div key={p.plataforma} className="bg-fondo rounded-xl p-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-marino">
                    {p.plataforma}
                  </span>
                  <span className="text-xs font-semibold text-marino/50">
                    {formatPct(pct, 0)}
                  </span>
                </div>
                <p className="text-lg font-extrabold text-morado mb-2">
                  {formatCLP(p.inversion)}
                </p>
                <div className="h-2 w-full rounded-full bg-lila-claro overflow-hidden">
                  <div
                    className="h-full rounded-full bg-morado"
                    style={{ width: `${pct * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Desglose mensual */}
      <section className="bg-white rounded-2xl border border-lila-claro p-6">
        <h2 className="text-lg font-bold mb-4">Desglose mensual · LATAM</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-marino/50 border-b border-lila-claro">
                <th className="py-3 pr-4 font-bold">Mes</th>
                <th className="py-3 pr-4 font-bold">Inversión</th>
                <th className="py-3 pr-4 font-bold">Venta Total</th>
                <th className="py-3 pr-4 font-bold">ROAS%</th>
                <th className="py-3 pr-4 font-bold">% Inv/Ventas</th>
              </tr>
            </thead>
            <tbody>
              {desgloseMensualLatam.map((m) => {
                if (m.inversion === null || m.ventaTotal === null) {
                  return (
                    <tr
                      key={m.mes}
                      className="border-b border-lila-claro/60 last:border-0"
                    >
                      <td className="py-4 pr-4 font-semibold">
                        {m.mesLabel}
                      </td>
                      <td colSpan={4} className="py-4 pr-4">
                        <SinDatos
                          ultimaActualizacion={m.ultimaActualizacion}
                          compact
                        />
                      </td>
                    </tr>
                  );
                }

                const roas = m.ventaTotal / m.inversion;
                const invVentas = m.inversion / m.ventaTotal;
                const ok = invVentas <= UMBRAL_INV_VENTAS;

                return (
                  <tr
                    key={m.mes}
                    className="border-b border-lila-claro/60 last:border-0"
                  >
                    <td className="py-4 pr-4 font-semibold">{m.mesLabel}</td>
                    <td className="py-4 pr-4 text-marino/70">
                      {formatCLP(m.inversion)}
                    </td>
                    <td className="py-4 pr-4 text-marino/70">
                      {formatCLP(m.ventaTotal)}
                    </td>
                    <td className="py-4 pr-4 text-marino/70">
                      {roas.toFixed(2)}x
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {formatPct(invVentas)}
                        </span>
                        <SemaforoSimple ok={ok} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-marino/50">
          Umbral: verde si % Inv/Ventas ≤ {formatPct(UMBRAL_INV_VENTAS, 0)}, rojo si es mayor.
        </p>
      </section>
    </div>
  );
}
