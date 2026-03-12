interface HealthGaugeProps {
  score: number;
  label: string;
}

export function HealthGauge({ score, label }: HealthGaugeProps) {
  // Simple textual visual representation for the scaffold
  let color = 'var(--success)';
  if (score < 80) color = 'var(--warning)';
  if (score < 60) color = 'var(--critical)';

  return (
    <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '2.5rem', fontWeight: 800, color, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
        {score}%
      </div>
      <div className="stat-label" style={{ marginTop: '0.5rem' }}>{label}</div>
    </div>
  );
}
