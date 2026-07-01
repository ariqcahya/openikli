import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { prisma } from 'database';

export const SESSION_SECRET = process.env.SESSION_SECRET || 'ganteme-secret-session-32-chars-key';

export interface SessionUser {
  id: string;
  phone: string;
  name: string;
  organizationId: string | null;
  role: string | null;
  organizationName: string | null;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('ikli_session')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SESSION_SECRET) as any;
    return {
      id: decoded.id,
      phone: decoded.phone,
      name: decoded.name,
      organizationId: decoded.organizationId || null,
      role: decoded.role || null,
      organizationName: decoded.organizationName || null,
    };
  } catch (err) {
    return null;
  }
}

export async function setSession(user: { id: string; phone: string; name: string }) {
  // Get user membership info
  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
    include: { organization: true },
  });

  const payload = {
    id: user.id,
    phone: user.phone,
    name: user.name,
    organizationId: membership?.organizationId || null,
    role: membership?.role || null,
    organizationName: membership?.organization?.name || null,
  };

  const token = jwt.sign(payload, SESSION_SECRET, { expiresIn: '24h' });

  cookies().set('ikli_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export function clearSession() {
  cookies().set('ikli_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
}
