// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Obtém o token dos cookies
  const accessToken = request.cookies.get('accessToken')?.value

  // Define as rotas que precisam de autenticação
  const protectedRoutes = [
    '/plano-de-aula',
    '/repositorio',
    '/painel-administrador',
    // Adicione aqui outras rotas que precisam de proteção
  ]

  // Define rotas públicas (que não precisam de autenticação)
  // const publicRoutes = [
  //   '/login',
  //   '/register',
  //   '/forgot-password',
  //   '/',
  //   '/about',
  //   // Adicione aqui outras rotas públicas
  // ]

  const { pathname } = request.nextUrl

  // Verifica se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  // Verifica se a rota atual é pública
  // const isPublicRoute = publicRoutes.some(
  //   (route) => pathname === route || pathname.startsWith(route),
  // )

  // Se é uma rota protegida e não tem token, redireciona para login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    // Adiciona a URL atual como parâmetro para redirect após login
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se tem token e está tentando acessar páginas de auth, redireciona para dashboard
  if (accessToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Para todas as outras situações, permite o acesso
  return NextResponse.next()
}

// Configuração do matcher - define em quais rotas o middleware deve executar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
