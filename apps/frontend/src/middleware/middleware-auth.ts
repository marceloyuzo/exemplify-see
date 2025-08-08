// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value

  const url = req.nextUrl.clone()

  if (token && PUBLIC_ROUTES.includes(url.pathname)) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login'],
}
