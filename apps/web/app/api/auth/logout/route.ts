import { NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/auth';
import { prisma } from 'database';

export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      // Log logout event
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          organizationId: session.organizationId,
          action: 'LOGOUT',
          details: 'User logged out successfully.',
        },
      });
    }

    clearSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan sistem saat memproses logout.' },
      { status: 500 }
    );
  }
}
