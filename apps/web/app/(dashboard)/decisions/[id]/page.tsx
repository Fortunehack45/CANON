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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 max-w-5xl mx-auto space-y-10">
      
      {/* Header Section */}
      <div className="space-y-6">
        <Link 
          href="/decisions" 
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-accent transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Intelligence
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-foreground leading-[1.1]">
              {decision.title}
            </h1>
            <p className="text-xl text-foreground-secondary leading-relaxed font-medium">
              {decision.summary_one_liner}
            </p>
          </div>
          
          <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider ${statusColor}`}>
            {StatusIcon}
            <span>{decision.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-surface-1 border border-border rounded-premium shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-foreground-dim uppercase tracking-widest">Architect</span>
          <div className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[10px]">⬡</div>
            {decision.author_github_login || 'System'}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-foreground-dim uppercase tracking-widest">Log Date</span>
          <div className="text-sm font-semibold text-foreground">{new Date(decision.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-foreground-dim uppercase tracking-widest">Dimension</span>
          <div className="text-sm font-semibold text-accent capitalize">{decision.decision_type.replace('_', ' ')}</div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-foreground-dim uppercase tracking-widest">Impact Factor</span>
          <div className={`text-sm font-semibold flex items-center gap-1.5 capitalize ${
            decision.impact === 'critical' ? 'text-red-400' :
            decision.impact === 'high' ? 'text-orange-400' :
            decision.impact === 'medium' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            <Activity className="w-4 h-4 opacity-70" />
            {decision.impact}
          </div>
        </div>
      </div>

      {/* Content Clusters */}
      <div className="grid grid-cols-1 gap-12">
        {decision.what && (
           <section className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="h-px flex-1 bg-border" />
               <h3 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em] px-2">Operational Change</h3>
               <div className="h-px flex-1 bg-border" />
             </div>
             <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-3xl p-8 font-mono text-sm leading-relaxed text-foreground-secondary whitespace-pre-wrap border-l-4 border-l-accent">
               {decision.what}
             </div>
           </section>
        )}

        {decision.why && (
           <section className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="h-px flex-1 bg-border" />
               <h3 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em] px-2">Strategic Rationale</h3>
               <div className="h-px flex-1 bg-border" />
             </div>
             <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-3xl p-8 leading-relaxed text-foreground-secondary whitespace-pre-wrap">
               {decision.why}
             </div>
           </section>
        )}

        {decision.tradeoffs && (
           <section className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="h-px flex-1 bg-border" />
               <h3 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em] px-2">Compromise Analysis</h3>
               <div className="h-px flex-1 bg-border" />
             </div>
             <div className="bg-warning-bg backdrop-blur-sm border border-warning/20 rounded-3xl p-8 leading-relaxed text-warning/90 whitespace-pre-wrap text-sm italic">
               <div className="flex items-center gap-2 mb-2 font-bold not-italic uppercase tracking-wider text-[10px] text-warning">
                 <Activity className="w-3 h-3" /> Risk Assessment
               </div>
               {decision.tradeoffs}
             </div>
           </section>
        )}
      </div>
    </div>
  );
}
