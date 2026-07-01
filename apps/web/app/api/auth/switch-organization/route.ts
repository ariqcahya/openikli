import { NextResponse } from 'next/server';
import { getSession, SESSION_SECRET } from '@/lib/auth';
import { prisma } from 'database';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only SUPER_ADMIN can switch organizations globally
  if (session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { organizationId } = await req.json();

    if (!organizationId) {
      // Switch back to "Global System" / default
      const payload = {
        ...session,
        organizationId: null,
        organizationName: null,
      };
      const token = jwt.sign(payload, SESSION_SECRET || 'ganteme-secret-session-32-chars-key', { expiresIn: '24h' });
      cookies().set('ikli_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      return NextResponse.json({ success: true });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const payload = {
      ...session,
      organizationId: organization.id,
      organizationName: organization.name,
    };

    const token = jwt.sign(payload, SESSION_SECRET || 'ganteme-secret-session-32-chars-key', { expiresIn: '24h' });
    cookies().set('ikli_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
