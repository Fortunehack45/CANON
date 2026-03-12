// Dashboard landing page - CTO Overview
import { StatCard } from '@/components/stat-card';
import { DecisionCard } from '@/components/decision-card';
import { HealthGauge } from '@/components/health-gauge';

export default function CTOOverview() {
  // Static mock data for MVP scaffold
  const stats = {
    total: 124,
    confirmed: 89,
    pending: 23,
    rejected: 12
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">CTO Overview</h1>
        <p className="page-subtitle">Real-time engineering knowledge intelligence</p>
      </div>

      <div className="stat-grid">
        <StatCard title="Total Decisions" value={stats.total} delta="+12 this week" />
        <StatCard title="Confirmed" value={stats.confirmed} delta="+8 this week" type="success" />
        <StatCard title="Pending Review" value={stats.pending} delta="Needs attention" type="warning" />
        <HealthGauge score={85} label="Knowledge Health" />
      </div>

      <div className="page-header" style={{ paddingTop: '1rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.25rem' }}>Recent High-Impact Decisions</h2>
      </div>

      <div className="decision-list" style={{ marginTop: '1.5rem' }}>
        <DecisionCard 
          id="rec_1"
          title="Migrate to Upstash Redis for Queue Management"
          summary="Replaced self-hosted Redis with Upstash for BullMQ jobs to reduce operational overhead."
          impact="high"
          type="infrastructure"
          status="confirmed"
        />
        <DecisionCard 
          id="rec_2"
          title="Adopt Pinecone for Vector Search"
          summary="Selected Pinecone over pgvector for dedicated semantic search capabilities at scale."
          impact="high"
          type="architecture"
          status="pending_review"
        />
        <DecisionCard 
          id="rec_3"
          title="Use ULID for Primary Keys"
          summary="Switched from UUIDv4 to ULID for lexicographically sortable IDs across all database tables."
          impact="medium"
          type="data_model"
          status="confirmed"
        />
      </div>
    </div>
  );
}
