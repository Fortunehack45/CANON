export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase-server';
import { ArrowLeft, Clock, Activity, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function DecisionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: decision, error } = await supabase
    .from('decision_records')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !decision) {
    notFound();
  }

  const statusColors = {
    pending_review: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    confirmed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  const statusIcons = {
    pending_review: <Clock className="w-4 h-4" />,
    confirmed: <CheckCircle className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />,
  };

  const StatusIcon = statusIcons[decision.status as keyof typeof statusIcons] || statusIcons.pending_review;
  const statusColor = statusColors[decision.status as keyof typeof statusColors] || statusColors.pending_review;

  return (
    <div className="animate-in max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/decisions" 
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to list
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight mb-3">
              {decision.title}
            </h1>
            <p className="text-lg text-neutral-400">
              {decision.summary_one_liner}
            </p>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap ${statusColor}`}>
            {StatusIcon}
            <span className="capitalize">{decision.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center gap-6 py-4 border-y border-neutral-800/60 mb-8">
        <div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Author</span>
          <span className="text-sm font-medium text-white">{decision.author_github_login || 'Unknown'}</span>
        </div>
        <div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Created</span>
          <span className="text-sm font-medium text-white">{new Date(decision.created_at).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Type</span>
          <span className="text-sm font-medium text-blue-400 capitalize">{decision.decision_type.replace('_', ' ')}</span>
        </div>
        <div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Impact</span>
          <span className="text-sm font-medium text-white flex items-center gap-1.5 capitalize">
            <Activity className="w-3.5 h-3.5 text-neutral-400" />
            {decision.impact}
          </span>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-12">
        {decision.what && (
           <section>
             <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">The Decision</h3>
             <div className="prose prose-invert prose-neutral max-w-none prose-p:leading-relaxed bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/60 font-mono text-sm whitespace-pre-wrap">
               {decision.what}
             </div>
           </section>
        )}

        {decision.why && (
           <section>
             <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">Context & Justification</h3>
             <div className="prose prose-invert prose-neutral max-w-none prose-p:leading-relaxed bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/60 font-mono text-sm whitespace-pre-wrap">
               {decision.why}
             </div>
           </section>
        )}

        {decision.tradeoffs && (
           <section>
             <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">Tradeoffs & Risks</h3>
             <div className="prose prose-invert prose-neutral max-w-none prose-p:leading-relaxed bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/60 font-mono text-sm whitespace-pre-wrap text-yellow-100/80 border-yellow-900/30">
               {decision.tradeoffs}
             </div>
           </section>
        )}
      </div>
      
    </div>
  );
}
