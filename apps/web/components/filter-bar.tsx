import Link from 'next/link';

export function FilterBar() {
  return (
    <div className="filter-bar">
      <input 
        type="text" 
        placeholder="Search decisions, tags, or authors..." 
        className="search-input" 
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Architecture</button>
        <button className="filter-btn">Data Model</button>
        <button className="filter-btn">Infrastructure</button>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
        <button className="filter-btn">High Impact</button>
      </div>
    </div>
  );
}
