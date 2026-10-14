import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SITE_ACCESS_COOKIE as COOKIE_NAME } from '@/lib/auth'

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  )
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Constant-time comparison via digests, so the token can't be guessed
// byte-by-byte through response timing.
async function tokenMatches(candidate: string, expected: string) {
  return (await sha256Hex(candidate)) === (await sha256Hex(expected))
}

function deny(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.headers.get('accept')?.includes('application/json')
  ) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
  }
  return new NextResponse(
    `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Permission denied</title></head>
  <body style="font-family: system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0;">
    <div style="text-align: center;">
      <h1 style="font-size: 1.5rem;">Permission denied</h1>
      <p style="color: #666;">You don't have access to this site.</p>
    </div>
  </body>
</html>`,
    { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } }
  )
}

export async function proxy(request: NextRequest) {
  const expected = process.env.SITE_ACCESS_TOKEN

  // Fail closed: if the token isn't configured, nobody gets in.
  if (!expected) {
    return deny(request)
  }

  // First visit with ?token=... — set the cookie and redirect to a clean URL.
  const queryToken = request.nextUrl.searchParams.get('token')
  if (queryToken && (await tokenMatches(queryToken, expected))) {
    const cleanUrl = request.nextUrl.clone()
    cleanUrl.searchParams.delete('token')
    const response = NextResponse.redirect(cleanUrl)
    response.cookies.set(COOKIE_NAME, queryToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return response
  }

  const cookieToken = request.cookies.get(COOKIE_NAME)?.value
  if (cookieToken && (await tokenMatches(cookieToken, expected))) {
    return NextResponse.next()
  }

  return deny(request)
}

export const config = {
  // Protect everything except Next.js internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
