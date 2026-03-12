import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/settings/github?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('GitHub OAuth error:', tokenData.error_description);
      return NextResponse.redirect(`${siteUrl}/settings/github?error=oauth_failed`);
    }

    // Fetch GitHub user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github+json',
      },
    });

    const githubUser = await userRes.json();

    if (!githubUser.login) {
      return NextResponse.redirect(`${siteUrl}/settings/github?error=user_fetch_failed`);
    }

    // Update the user record in Supabase
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.redirect(`${siteUrl}/auth/login`);
    }

    await supabase
      .from('users')
      .update({
        github_login: githubUser.login,
        github_user_id: githubUser.id,
        github_access_token: tokenData.access_token,
        github_token_scope: tokenData.scope,
        avatar_url: githubUser.avatar_url,
      })
      .eq('id', authUser.id);

    return NextResponse.redirect(`${siteUrl}/settings/github?success=connected&login=${githubUser.login}`);
  } catch (err) {
    console.error('GitHub callback error:', err);
    return NextResponse.redirect(`${siteUrl}/settings/github?error=internal_error`);
  }
}
