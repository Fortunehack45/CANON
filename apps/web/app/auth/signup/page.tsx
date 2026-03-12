import { Fingerprint, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 text-neutral-100 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center mb-6 shadow-2xl">
             <ShieldCheck className="w-6 h-6 text-neutral-300" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Create an account</h1>
          <p className="text-neutral-400 text-sm">Join your team on Black Box</p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/60 rounded-2xl p-6 shadow-2xl">
          <form action="/api/auth/signup" method="POST" className="space-y-4">
            
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-neutral-400 pl-1">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                required
                className="w-full bg-neutral-950 border border-neutral-800/80 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Ada Lovelace"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-medium text-neutral-400 pl-1">Work Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                required
                className="w-full bg-neutral-950 border border-neutral-800/80 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="you@company.com"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-medium text-neutral-400 pl-1">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                required
                className="w-full bg-neutral-950 border border-neutral-800/80 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-neutral-200 font-medium text-sm rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              Start Trial <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        <p className="text-center text-sm text-neutral-500 mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-white hover:underline underline-offset-4 pointer-events-auto">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
