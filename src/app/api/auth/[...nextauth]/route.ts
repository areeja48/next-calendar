import  handlers  from 'next-auth/next'; // ✅ CORRECT PATH for App Router
import { authOptions } from '@/lib/auth';

export const { GET, POST } = handlers(authOptions);