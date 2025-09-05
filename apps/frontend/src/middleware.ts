import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const protectedPaths = [
    '/plano-de-aula',
    '/repositorio',
    '/painel-administrador',
  ]
  const { pathname } = request.nextUrl
  const authStatus = request.cookies.get('auth-status')?.value

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // Verificar cookie que o frontend consegue ler

    if (authStatus !== 'authenticated') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (authStatus === 'authenticated' && pathname.startsWith('/login')) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}
