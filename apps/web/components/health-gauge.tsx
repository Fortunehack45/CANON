interface HealthGaugeProps {
  score: number;
  label: string;
}

export function HealthGauge({ score, label }: HealthGaugeProps) {
  let colorClass = 'text-success';
  let bgClass = 'bg-success/10';
  let borderClass = 'border-success/20';
  
  if (score < 80) {
    colorClass = 'text-warning';
    bgClass = 'bg-warning/10';
    borderClass = 'border-warning/20';
  }
  if (score < 60) {
    colorClass = 'text-danger';
    bgClass = 'bg-danger/10';
    borderClass = 'border-danger/20';
  }

  return (
    <div className="bg-surface-1 border border-border rounded-premium p-6 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className={`absolute inset-0 opacity-10 blur-3xl transition-opacity group-hover:opacity-20 ${bgClass}`} />
      <div className={`text-4xl font-black tracking-tighter mb-2 relative z-10 ${colorClass}`}>
        {score}<span className="text-xl opacity-60 ml-0.5">%</span>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted relative z-10">
        {label}
      </div>
    </div>
  );
}
