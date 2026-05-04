import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intl = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  return intl(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
