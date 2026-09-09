import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'chave_super_secreta_raed';
const key = new TextEncoder().encode(secretKey);

export async function proxy(request) {
  const session = request.cookies.get('session')?.value;

  // Rotas que queremos proteger
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(session, key, { algorithms: ['HS256'] });
    } catch (error) {
      // Token inválido ou expirado
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redireciona o usuário para /admin se ele já estiver logado e tentar acessar /login
  if (request.nextUrl.pathname === '/login' && session) {
    try {
      await jwtVerify(session, key, { algorithms: ['HS256'] });
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch (error) {
      // Ignora, deixa acessar o login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
