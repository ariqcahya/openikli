import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH' && session.role !== 'ANALIS') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (!type) {
    return NextResponse.json({ error: 'Type query parameter is required' }, { status: 400 });
  }

  try {
    if (type === 'DIMENSI') {
      await prisma.masterDimensi.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    }

    if (type === 'UNSUR') {
      await prisma.masterUnsur.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    }

    if (type === 'ASPEK') {
      await prisma.masterAspek.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
