import { createDecision } from './actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewDecisionPage() {
  return (
    <div className="animate-in max-w-3xl mx-auto pb-20">
      <div className="page-header mb-8 flex items-center gap-4">
        <Link 
          href="/decisions" 
          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="page-title">Record a Decision</h1>
          <p className="page-subtitle">Document a technical choice for the team.</p>
        </div>
      </div>

      <form action={createDecision} className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 sm:p-8 space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white border-b border-neutral-800/80 pb-2">Basic Info</h3>
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-neutral-300">Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="e.g. Migrate to Upstash Redis for Queue Management"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary_one_liner" className="text-sm font-medium text-neutral-300">Summary (One liner)</label>
            <input 
              type="text" 
              id="summary_one_liner" 
              name="summary_one_liner" 
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Brief summary of what changed and why"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="decision_type" className="text-sm font-medium text-neutral-300">Type</label>
              <select 
                id="decision_type" 
                name="decision_type"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="architecture">Architecture</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="data_model">Data Model</option>
                <option value="security">Security</option>
                <option value="tooling">Tooling</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="impact" className="text-sm font-medium text-neutral-300">Impact Level</label>
              <select 
                id="impact" 
                name="impact"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white border-b border-neutral-800/80 pb-2">Context & Details</h3>
          
          <div className="space-y-2">
            <label htmlFor="what" className="text-sm font-medium text-neutral-300">What is the decision?</label>
            <textarea 
              id="what" 
              name="what" 
              rows={4}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
              placeholder="Markdown supported..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="why" className="text-sm font-medium text-neutral-300">Why are we doing this?</label>
            <textarea 
              id="why" 
              name="why" 
              rows={4}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
              placeholder="Business value, constraints, scale requirements..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tradeoffs" className="text-sm font-medium text-neutral-300">Tradeoffs & Risks</label>
            <textarea 
              id="tradeoffs" 
              name="tradeoffs" 
              rows={3}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
              placeholder="What are the downsides? What did we choose NOT to do?"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800">
          <button 
            type="submit"
            className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-medium rounded-lg px-6 py-3 transition-colors"
          >
            <Save className="w-4 h-4" /> Save Decision
          </button>
        </div>
      </form>
    </div>
  );
}
