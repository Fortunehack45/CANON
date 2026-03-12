import { DecisionCard } from '@/components/decision-card';
import { FilterBar } from '@/components/filter-bar';

export default function DecisionsFeed() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Decision Feed</h1>
        <p className="page-subtitle">All engineering decisions captured across the organization</p>
      </div>

      <FilterBar />

      <div className="decision-list" style={{ marginTop: '1rem' }}>
        <DecisionCard 
          id="rec_1"
          title="Migrate to Upstash Redis for Queue Management"
          summary="Replaced self-hosted Redis with Upstash for BullMQ jobs to reduce operational overhead."
          impact="high"
          type="infrastructure"
          status="confirmed"
        />
        <DecisionCard 
          id="rec_3"
          title="Use ULID for Primary Keys"
          summary="Switched from UUIDv4 to ULID for lexicographically sortable IDs across all database tables."
          impact="medium"
          type="data_model"
          status="confirmed"
        />
        <DecisionCard 
          id="rec_4"
          title="Adopt Tailwind CSS for Admin Dashboard"
          summary="Standardizing on Tailwind for utility-first styling to move faster and keep CSS bundles small."
          impact="medium"
          type="architecture"
          status="confirmed"
        />
      </div>
    </div>
  );
}
