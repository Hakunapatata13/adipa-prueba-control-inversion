export default function PacingBar({
  label,
  pct,
  colorClass,
}: {
  label: string;
  pct: number;
  colorClass: string;
}) {
  const clamped = Math.min(Math.max(pct, 0), 1.2);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-marino/70">{label}</span>
        <span className="font-bold text-marino">
          {(pct * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-lila-claro/60 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${Math.min(clamped * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
