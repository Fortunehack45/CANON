import Link from 'next/link';

interface DecisionCardProps {
  id: string;
  title: string;
  summary: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  status: 'confirmed' | 'pending_review' | 'rejected';
}

export function DecisionCard({ id, title, summary, impact, type, status }: DecisionCardProps) {
  return (
    <Link href={`/decisions/${id}`} className="decision-card">
      <div className="decision-card-header">
        <div>
          <h3 className="decision-card-title">{title}</h3>
          <p className="decision-card-summary">{summary}</p>
        </div>
      </div>
      <div className="decision-card-meta">
        <span className={`badge badge-${impact}`}>{impact} impact</span>
        <span className="badge badge-type">{type.replace('_', ' ')}</span>
        <span className={`badge badge-${status === 'confirmed' ? 'status' : 'pending'}`}>
          {status.replace('_', ' ')}
        </span>
      </div>
    </Link>
  );
}
