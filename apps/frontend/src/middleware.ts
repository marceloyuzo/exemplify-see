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

  // Se for login e já tiver token válido -> manda para home (/)
  if (pathname === '/login' && token) {
    try {
      const payload = jwtDecode<TokenPayload>(token)
      const currentTime = Math.floor(Date.now() / 1000)

      if (payload.exp > currentTime) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    } catch {
      return NextResponse.next()
    }
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const payload = jwtDecode<TokenPayload>(token)

    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp < currentTime) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname.startsWith('/painel-administrador')) {
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  } catch (err) {
    console.error('Erro ao validar token no middleware:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
