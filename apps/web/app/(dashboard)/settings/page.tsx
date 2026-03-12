export default function SettingsPage() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Workspace Settings</h1>
        <p className="page-subtitle">Manage organization and integrations</p>
      </div>

      <div style={{ padding: '2rem', maxWidth: '800px', display: 'grid', gap: '2rem' }}>
        
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Integrations</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Connect tools to automatically capture engineering decisions.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>GitHub App</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Capture decisions from pull requests.</p>
              </div>
              <button className="btn btn-ghost" style={{ color: 'var(--success)', borderColor: 'rgba(16,185,129,0.3)' }}>✓ Connected</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Slack Integration</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Send and receive confirmation nudges.</p>
              </div>
              <button className="btn btn-primary">Connect Slack</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Jira Software</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Link PRs to Jira ticket context.</p>
              </div>
              <button className="btn btn-primary">Connect Jira</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Confidence Thresholds</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Configure how AI extractions are handled based on confidence score.</p>
          
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Auto-Approve</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>&gt;= 90%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Soft Nudge (DM)</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--warning)' }}>70% - 89%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Nudge (Channel)</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--high)' }}>50% - 69%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Requires Review Queue</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--critical)' }}>&lt; 50%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
