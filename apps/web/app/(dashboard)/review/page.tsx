import { DecisionCard } from '@/components/decision-card';

export default function ReviewQueue() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Review Queue</h1>
        <p className="page-subtitle">Decisions requiring confirmation or edits</p>
      </div>

      <div className="decision-list" style={{ marginTop: '2rem' }}>
        {/* Mock for Review Queue */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <DecisionCard 
              id="rec_2"
              title="Adopt Pinecone for Vector Search"
              summary="Selected Pinecone over pgvector for dedicated semantic search capabilities at scale."
              impact="high"
              type="architecture"
              status="pending_review"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button className="btn btn-success">✓ Confirm</button>
            <button className="btn btn-ghost">Edit</button>
            <button className="btn btn-danger">✕ Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}
