import { EstadoRitmo, ESTADO_LABEL } from "@/lib/mockData";

const estadoStyles: Record<EstadoRitmo, string> = {
  azul: "bg-celeste-claro text-morado",
  naranja: "bg-alerta/15 text-alerta",
  rojo: "bg-riesgo/15 text-riesgo",
};

const dotStyles: Record<EstadoRitmo, string> = {
  azul: "bg-celeste",
  naranja: "bg-alerta",
  rojo: "bg-riesgo",
};

export function SemaforoBadge({ estado }: { estado: EstadoRitmo }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${estadoStyles[estado]}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotStyles[estado]}`} />
      {ESTADO_LABEL[estado]}
    </span>
  );
}

export function SemaforoSimple({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
        ok ? "bg-ok/15 text-ok" : "bg-riesgo/15 text-riesgo"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${ok ? "bg-ok" : "bg-riesgo"}`} />
      {ok ? "Dentro de lo normal" : "Ineficiencia"}
    </span>
  );
}
