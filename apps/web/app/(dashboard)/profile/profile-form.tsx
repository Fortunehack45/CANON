'use client';

import { useState } from 'react';
import { User, MapPin, Globe, Twitter, Linkedin, Save, Loader2, Sparkles } from 'lucide-react';
import { updateProfile } from './actions';

interface Props {
  initialData: {
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    location: string | null;
    website: string | null;
    twitter: string | null;
    linkedin: string | null;
    avatarUrl: string | null;
  };
}

export function ProfileForm({ initialData }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    bio: initialData.bio || '',
    location: initialData.location || '',
    website: initialData.website || '',
    twitter: initialData.twitter || '',
    linkedin: initialData.linkedin || '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-dim mb-1.5 block">Full Name</span>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:border-accent/40 focus:bg-surface-3 transition-all outline-none"
                placeholder="Your name"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-dim mb-1.5 block">Location</span>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:border-accent/40 focus:bg-surface-3 transition-all outline-none"
                placeholder="San Francisco, CA"
              />
            </div>
          </label>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-dim mb-1.5 block">Website</span>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
              <input
                type="url"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:border-accent/40 focus:bg-surface-3 transition-all outline-none"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-dim mb-1.5 block">Twitter / X</span>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
              <input
                type="text"
                value={formData.twitter}
                onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:border-accent/40 focus:bg-surface-3 transition-all outline-none"
                placeholder="@username"
              />
            </div>
          </label>
        </div>
      </div>

      <label className="block col-span-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground-dim mb-1.5 block">Professional Bio</span>
        <textarea
          value={formData.bio}
          onChange={e => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm font-medium leading-relaxed focus:border-accent/40 focus:bg-surface-3 transition-all outline-none resize-none"
          placeholder="Tell world about your engineering philosophy..."
        />
      </label>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-3 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover transition-all disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? 'Saving...' : 'Save Profile'}
        </button>

        {success && (
          <div className="flex items-center gap-2 text-success text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
            <Sparkles className="w-4 h-4" /> Changes applied
          </div>
        )}
      </div>
    </form>
  );
}
