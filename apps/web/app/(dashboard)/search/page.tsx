import { DecisionCard } from '@/components/decision-card';
import { FilterBar } from '@/components/filter-bar';

export default function SearchPage() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Global Search</h1>
        <p className="page-subtitle">Ask questions or search across all engineering decisions</p>
      </div>

      <div style={{ padding: '2rem' }}>
        <input 
          type="text" 
          placeholder="e.g. Why did we choose Redis over PostgreSQL for the queue?" 
          className="search-input" 
          style={{ width: '100%', padding: '1rem 1.5rem', fontSize: '1.125rem', marginBottom: '2rem' }}
          defaultValue="Why do we use Redis?"
        />

        <div className="ai-answer">
          <div className="ai-answer-label">✨ AI Synthesized Answer</div>
          <div className="ai-answer-text">
            Based on the decision record from <strong>March 2026</strong>, we migrated to <strong>Upstash Redis</strong> for queue management because self-hosted Redis was causing connection drops during scaling events. Upstash provides a serverless offering that scales automatically without operational overhead.
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '2rem 0 1rem', color: 'var(--text-primary)' }}>Sources</h3>
        
        <div className="decision-list" style={{ padding: 0 }}>
          <DecisionCard 
            id="rec_1"
            title="Migrate to Upstash Redis for Queue Management"
            summary="Replaced self-hosted Redis with Upstash for BullMQ jobs to reduce operational overhead."
            impact="high"
            type="infrastructure"
            status="confirmed"
          />
        </div>
      </div>
    </div>
  );
}
