interface HealthGaugeProps {
  score: number;
  label: string;
}

export function HealthGauge({ score, label }: HealthGaugeProps) {
  let colorClass = 'text-success';
  let bgClass = 'bg-success/10';
  let borderClass = 'border-success/20';
  
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-surface-1 border border-border rounded-premium p-6 flex items-center justify-between relative overflow-hidden group shadow-sm hover:border-accent/40 transition-all duration-500">
      <div className={`absolute inset-0 opacity-10 blur-3xl transition-opacity group-hover:opacity-25 ${bgClass}`} />
      
      <div className="relative z-10">
        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted mb-1">
          {label}
        </div>
        <div className={`text-2xl font-black tracking-tighter ${colorClass}`}>
          {score}<span className="text-sm opacity-60 ml-0.5">%</span>
        </div>
      </div>

      <div className="relative z-10 w-16 h-16 transform transition-transform group-hover:scale-110 duration-500">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-surface-3"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className={`${colorClass} transition-all duration-1000 ease-out`}
            style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
          />
        </svg>
      </div>
    </div>
  );
}
