import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      // Note: In production you might want to require email confirmation.
      // For this demo, we assume auto-confirm or that the user handles it.
    },
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/signup?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  // Redirect to a check-email page or dashboard depending on confirm settings
  return NextResponse.redirect(new URL('/', request.url));
}
