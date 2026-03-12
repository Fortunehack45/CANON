interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  type?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({ title, value, delta, type = 'default' }: StatCardProps) {
  const colors = {
    default: 'var(--text-primary)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
  };

  return (
    <div className="stat-card">
      <div className="stat-label">{title}</div>
      <div className="stat-value" style={{ color: colors[type] }}>{value}</div>
      {delta && <div className="stat-delta">{delta}</div>}
    </div>
  );
}
