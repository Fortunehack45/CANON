export default function TeamPage() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Team Directory</h1>
        <p className="page-subtitle">Engineers contributing to the knowledge base</p>
      </div>

      <div style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Decisions Authored</th>
              <th style={{ padding: '1rem' }}>Last Active</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' }} />
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Alice Engineer</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>alice@acme.com</div>
                </div>
              </td>
              <td style={{ padding: '1rem' }}><span className="badge badge-type">Admin</span></td>
              <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>42</td>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>2 hours ago</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border)' }} />
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Bob Developer</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>bob@acme.com</div>
                </div>
              </td>
              <td style={{ padding: '1rem' }}><span className="badge" style={{ border: '1px solid var(--border-subtle)' }}>Engineer</span></td>
              <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>18</td>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>1 day ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
