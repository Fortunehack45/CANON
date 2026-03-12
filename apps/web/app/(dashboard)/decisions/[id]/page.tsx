import Link from 'next/link';

export default function DecisionDetail({ params }: { params: { id: string } }) {
  // Mock decision detail
  return (
    <div className="animate-in">
      <div className="page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <Link href="/decisions" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          ← Back to Feed
        </Link>
        <h1 className="page-title">Migrate to Upstash Redis for Queue Management</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <span className="badge badge-high">high impact</span>
          <span className="badge badge-type">infrastructure</span>
          <span className="badge badge-status">confirmed</span>
        </div>
      </div>

      <div style={{ padding: '0 2rem 2rem', maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Summary</h3>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
            Replaced self-hosted Redis with Upstash for BullMQ jobs to reduce operational overhead.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Why</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Self-hosting Redis was causing connection drops during scaling events. Upstash provides a serverless Redis offering that scales automatically and requires zero maintenance. It integrates perfectly with our Vercel and Railway workloads.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>What Technically Changed</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Updated `ioredis` connection string to use `UPSTASH_REDIS_URL`. Enabled `lazyConnect` and removed custom retry logic since Upstash handles connection pooling.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Alternatives Considered</h3>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.5rem' }}>
              <li>Redis Labs / Redis Enterprise (too expensive for our current tier)</li>
              <li>Railway managed Redis (still requires manual scaling of resources)</li>
              <li>AWS ElastiCache (too much configuration overhead)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
