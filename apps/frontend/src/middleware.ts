import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
  sub: string
  email: string
  firebaseUid: string
  photoURL?: string
  role: 'admin' | 'user'
  iat: number
  exp: number
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('accessToken')?.value

  const publicRoutes = ['/', '/etapas-da-abordagem', '/login']
  const isPublicRoute =
    publicRoutes.some((route) => route !== '/' && pathname.startsWith(route)) ||
    pathname === '/'

  // Rotas públicas → deixam passar
  if (isPublicRoute) {
    if (pathname === '/login' && token) {
      try {
        const payload = jwtDecode<TokenPayload>(token)
        const currentTime = Math.floor(Date.now() / 1000)
        if (payload.exp > currentTime)
          return NextResponse.redirect(new URL('/', req.url))
      } catch {}
    }
    return NextResponse.next()
  }

  // Rotas privadas → precisa de token
  if (!token) return NextResponse.redirect(new URL('/login', req.url))

  try {
    const payload = jwtDecode<TokenPayload>(token)
    const currentTime = Math.floor(Date.now() / 1000)

    // Token expirado → remove cookie e redireciona
    if (payload.exp < currentTime) {
      const res = NextResponse.redirect(new URL('/login', req.url))
      res.cookies.set('accessToken', '', { maxAge: 0, path: '/' })
      return res
    }

    // Controle de role: apenas admin pode acessar painel
    if (
      pathname.startsWith('/painel-administrador') &&
      payload.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Outros caminhos privados → qualquer usuário autenticado pode acessar
    return NextResponse.next()
  } catch (err) {
    console.error('Erro ao validar token no middleware:', err)
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.set('accessToken', '', { maxAge: 0, path: '/' })
    return res
  }
}

// Matcher específico para rotas privadas
export const config = {
  matcher: [
    '/plano-de-aula/:path*',
    '/repositorio/:path*',
    '/painel-administrador/:path*',
  ],
}
