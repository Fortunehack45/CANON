import { Github, Fingerprint, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 text-neutral-100 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center mb-6 shadow-2xl">
             <Fingerprint className="w-6 h-6 text-neutral-300" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Welcome back</h1>
          <p className="text-neutral-400 text-sm">Sign in to your Black Box account</p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/60 rounded-2xl p-6 shadow-2xl">
          <form action="/api/auth/login" method="POST" className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-medium text-neutral-400 pl-1">Email</label>
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
              <div className="flex items-center justify-between pl-1">
                 <label htmlFor="password" className="text-xs font-medium text-neutral-400">Password</label>
                 <Link href="/auth/reset-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot?</Link>
              </div>
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
              className="w-full bg-white text-black hover:bg-neutral-200 font-medium text-sm rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2 mt-2"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800/60"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-neutral-900/50 px-2 text-neutral-500 rounded-full">Or continue with</span>
            </div>
          </div>

          <button 
            type="button" 
            className="w-full bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-white font-medium text-sm rounded-lg px-4 py-3 transition-all flex items-center justify-center gap-3"
          >
            <Github className="w-4 h-4" /> Provider Login
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-8">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-white hover:underline underline-offset-4 pointer-events-auto">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
