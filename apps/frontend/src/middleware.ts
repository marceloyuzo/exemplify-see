// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
  sub: string
  email: string
  firebaseUid: string
  role: 'admin' | 'user'
  photoURL: string
  iat: number
  exp: number
}

const PUBLIC_ROUTES = ['/login', '/register']
const ADMIN_ROUTES = ['/painel-administrador/usuarios']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value
  const url = req.nextUrl.clone()

  let isAdmin = false

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token)
      isAdmin = decoded.role === 'admin'
    } catch (err) {
      // token inválido, tratar como não autenticado
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Bloqueia acesso a páginas privadas sem token
  if (!token && !PUBLIC_ROUTES.includes(url.pathname)) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Bloqueia acesso ao painel admin se não for admin
  if (ADMIN_ROUTES.some((path) => url.pathname.startsWith(path)) && !isAdmin) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Bloqueia usuário autenticado de acessar rotas públicas
  if (token && PUBLIC_ROUTES.includes(url.pathname)) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
