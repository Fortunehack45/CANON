'use server';

import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('--- SignIn Start ---', { email });
  
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('SignIn Supabase error:', error.message);
      return redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
    }

    console.log('SignIn success, redirecting...');
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') throw err;
    console.error('SignIn unexpected error:', err.message);
    return redirect(`/auth/login?error=${encodeURIComponent('Internal server error during sign in.')}`);
  }

  redirect('/');
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  console.log('--- SignUp Start ---', { email, name });

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      console.error('SignUp Supabase error:', error.message);
      return redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
    }

    console.log('SignUp success, redirecting...');
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') throw err;
    console.error('SignUp unexpected error:', err.message);
    return redirect(`/auth/signup?error=${encodeURIComponent('Internal server error during sign up.')}`);
  }

  redirect('/');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}
