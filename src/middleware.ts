import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/route';
 
export default createMiddleware(routing);
 
export const config = {
  matcher: ['/', '/(pt|en)/:path*']
};