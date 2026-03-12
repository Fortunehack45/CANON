'use server';

import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('SignIn action triggered for:', email);
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('SignIn error:', error.message);
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  console.log('SignIn success, redirecting to /');
  redirect('/');
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  console.log('SignUp action triggered for:', email);
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
    console.error('SignUp error:', error.message);
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  console.log('SignUp success, redirecting to /');
  redirect('/');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}
