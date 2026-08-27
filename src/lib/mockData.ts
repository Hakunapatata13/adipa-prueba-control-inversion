// Datos de ejemplo (mock). En una versión real esto vendría de BigQuery /
// Meta Ads API / Google Ads API. No hay conexión a datos reales.

export type Pais = "Chile" | "México" | "Colombia";

export type EstadoRitmo = "azul" | "naranja" | "rojo";

export interface ProgramaPacing {
  tipoPrograma: string;
  presupuesto: number;
  gastoActual: number | null; // null => sin datos
  ultimaActualizacion: string; // fecha de la última actualización disponible
}

export interface PeriodoPais {
  pais: Pais;
  mes: string; // "2026-08"
  mesLabel: string; // "Agosto 2026"
  diasTranscurridos: number;
  diasTotales: number;
  programas: ProgramaPacing[];
}

// ---- Control de Gasto (PMO) ----
export const periodosPMO: PeriodoPais[] = [
  {
    pais: "Chile",
    mes: "2026-08",
    mesLabel: "Agosto 2026",
    diasTranscurridos: 20,
    diasTotales: 31,
    programas: [
      {
        tipoPrograma: "Diplomados",
        presupuesto: 4_500_000,
        gastoActual: 2_600_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Magíster",
        presupuesto: 6_000_000,
        gastoActual: 4_950_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Cursos cortos",
        presupuesto: 1_800_000,
        gastoActual: 1_950_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Seminarios",
        presupuesto: 1_200_000,
        gastoActual: null,
        ultimaActualizacion: "2026-08-25 09:10",
      },
    ],
  },
  {
    pais: "México",
    mes: "2026-08",
    mesLabel: "Agosto 2026",
    diasTranscurridos: 20,
    diasTotales: 31,
    programas: [
      {
        tipoPrograma: "Diplomados",
        presupuesto: 8_200_000,
        gastoActual: 5_100_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Magíster",
        presupuesto: 9_500_000,
        gastoActual: 6_050_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Cursos cortos",
        presupuesto: 3_000_000,
        gastoActual: 2_150_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Seminarios",
        presupuesto: 1_500_000,
        gastoActual: 1_020_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
    ],
  },
  {
    pais: "Colombia",
    mes: "2026-08",
    mesLabel: "Agosto 2026",
    diasTranscurridos: 20,
    diasTotales: 31,
    programas: [
      {
        tipoPrograma: "Diplomados",
        presupuesto: 5_000_000,
        gastoActual: 3_400_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Magíster",
        presupuesto: 4_200_000,
        gastoActual: 2_450_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Cursos cortos",
        presupuesto: 1_600_000,
        gastoActual: 1_120_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
      {
        tipoPrograma: "Seminarios",
        presupuesto: 900_000,
        gastoActual: 610_000,
        ultimaActualizacion: "2026-08-27 09:15",
      },
    ],
  },
];

// ---- Inversión LATAM (Especialista) ----
export interface PlataformaInversion {
  plataforma: "Meta" | "Google" | "Seminario";
  inversion: number;
}

export interface MesLatam {
  mes: string; // "2026-05"
  mesLabel: string;
  pais: Pais | "LATAM";
  inversion: number | null; // null => sin datos
  ventaTotal: number | null;
  ultimaActualizacion: string;
}

export const plataformasLatam: PlataformaInversion[] = [
  { plataforma: "Meta", inversion: 38_500_000 },
  { plataforma: "Google", inversion: 29_200_000 },
  { plataforma: "Seminario", inversion: 6_100_000 },
];

export const desgloseMensualLatam: MesLatam[] = [
  {
    mes: "2026-05",
    mesLabel: "Mayo 2026",
    pais: "LATAM",
    inversion: 24_800_000,
    ventaTotal: 312_000_000,
    ultimaActualizacion: "2026-06-01 08:00",
  },
  {
    mes: "2026-06",
    mesLabel: "Junio 2026",
    pais: "LATAM",
    inversion: 26_100_000,
    ventaTotal: 289_500_000,
    ultimaActualizacion: "2026-07-01 08:00",
  },
  {
    mes: "2026-07",
    mesLabel: "Julio 2026",
    pais: "LATAM",
    inversion: null,
    ventaTotal: null,
    ultimaActualizacion: "2026-07-04 08:00",
  },
  {
    mes: "2026-08",
    mesLabel: "Agosto 2026",
    pais: "LATAM",
    inversion: 27_900_000,
    ventaTotal: 298_000_000,
    ultimaActualizacion: "2026-08-27 08:00",
  },
];

// ---- Cálculos de negocio ----

export function calcularProyeccionCierre(
  gastoActual: number,
  diasTranscurridos: number,
  diasTotales: number
): number {
  if (diasTranscurridos <= 0) return 0;
  const promedioDiario = gastoActual / diasTranscurridos;
  return promedioDiario * diasTotales;
}

export function calcularEstadoRitmo(
  presupuesto: number,
  gastoActual: number,
  diasTranscurridos: number,
  diasTotales: number
): EstadoRitmo {
  const proyeccion = calcularProyeccionCierre(
    gastoActual,
    diasTranscurridos,
    diasTotales
  );
  const pctProyeccion = proyeccion / presupuesto;
  const pctTiempo = diasTranscurridos / diasTotales;
  const pctGasto = gastoActual / presupuesto;
  const aceleracion = pctGasto - pctTiempo;

  if (pctProyeccion > 1 && aceleracion > 0.1) {
    return "rojo";
  }
  if (pctProyeccion >= 0.95) {
    return "naranja";
  }
  return "azul";
}

export const ESTADO_LABEL: Record<EstadoRitmo, string> = {
  azul: "En ritmo",
  naranja: "Alerta de revisión",
  rojo: "Riesgo de sobregasto",
};

export const UMBRAL_INV_VENTAS = 0.09;

export function formatCLP(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
