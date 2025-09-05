import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const protectedPaths = [
    '/plano-de-aula',
    '/repositorio',
    '/painel-administrador',
  ]
  const authPaths = ['/login']
  const { pathname } = request.nextUrl

  // Para rotas protegidas
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // OTIMIZAÇÃO: Verificar cookie primeiro (mais rápido)
    const hasAuthCookie = request.cookies.has('accessToken')

    if (!hasAuthCookie) {
      // Se nem cookie tem, redirecionar direto sem fazer fetch
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Se tem cookie, aí sim fazer a verificação completa
    try {
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          method: 'GET',
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
        },
      )

      if (!verifyResponse.ok) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      console.error('Auth verification failed:', error)
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Para páginas de login
  if (authPaths.some((path) => pathname.startsWith(path))) {
    // OTIMIZAÇÃO: Se não tem cookie, nem precisa verificar
    const hasAuthCookie = request.cookies.has('accessToken')

    if (!hasAuthCookie) {
      return NextResponse.next() // Permitir acesso ao login
    }

    // Se tem cookie, verificar se ainda está válido
    try {
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          method: 'GET',
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
        },
      )

      if (verifyResponse.ok) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      // Se falhou a verificação, permitir acesso ao login
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/plano-de-aula/:path*',
    '/repositorio/:path*',
    '/painel-administrador/:path*',
    '/login',
  ],
}
