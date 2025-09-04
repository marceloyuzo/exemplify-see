// middleware.ts
import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { jwtDecode } from 'jwt-decode'

// interface TokenPayload {
//   sub: string
//   email: string
//   firebaseUid: string
//   role: 'admin' | 'user'
//   photoURL: string
//   iat: number
//   exp: number
// }

// Rotas que qualquer pessoa pode acessar, token ou não
// const PUBLIC_ROUTES = ['/login', '/register', '/', '/etapas-da-abordagem']

// // Rotas que apenas admin pode acessar
// const ADMIN_ROUTES = ['/painel-administrador']

export function middleware() {
  // const token = req.cookies.get('accessToken')?.value
  // const url = req.nextUrl.clone()
  // let isAdmin = false
  // // Decodifica o token se existir
  // if (token) {
  //   try {
  //     const decoded = jwtDecode<TokenPayload>(token)
  //     isAdmin = decoded.role === 'admin'
  //   } catch (err) {
  //     // token inválido, tratar como não autenticado
  //     url.pathname = '/login'
  //     return NextResponse.redirect(url)
  //   }
  // }
  // // 1️⃣ Rotas públicas: sempre acessível, token ou não
  // if (PUBLIC_ROUTES.includes(url.pathname)) {
  //   return NextResponse.next()
  // }
  // // 2️⃣ Rotas privadas: só admin pode acessar
  // if (ADMIN_ROUTES.some((path) => url.pathname.startsWith(path))) {
  //   if (!token || !isAdmin) {
  //     url.pathname = '/' // ou '/' se preferir
  //     return NextResponse.redirect(url)
  //   }
  //   return NextResponse.next()
  // }
  // // 3️⃣ Demais rotas privadas: só precisa estar logado (token válido)
  // if (!token) {
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
