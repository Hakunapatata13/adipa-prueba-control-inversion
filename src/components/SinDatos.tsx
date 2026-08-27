export default function SinDatos({
  ultimaActualizacion,
  compact = false,
}: {
  ultimaActualizacion: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <span className="inline-flex flex-col text-xs text-marino/60 italic">
        <span className="font-semibold not-italic text-marino/70">
          Sin datos
        </span>
        Últ. act.: {ultimaActualizacion}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-lila-claro/40 border border-dashed border-morado/30 px-4 py-3">
      <span className="w-2.5 h-2.5 rounded-full bg-marino/30 shrink-0" />
      <div className="text-sm">
        <p className="font-semibold text-marino">
          Sin datos disponibles para este período
        </p>
        <p className="text-marino/60">
          Última actualización disponible: {ultimaActualizacion}
        </p>
      </div>
    </div>
  );
}
