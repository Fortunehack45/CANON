'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: {
  name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('users')
    .update({
      name: formData.name,
      bio: formData.bio,
      location: formData.location,
      website: formData.website,
      twitter: formData.twitter,
      linkedin: formData.linkedin,
    })
    .eq('id', user.id);

  if (error) {
    console.error('updateProfile error:', error);
    throw new Error('Failed to update profile');
  }

  revalidatePath('/profile');
  revalidatePath(`/profile/${user.id}`);
}
