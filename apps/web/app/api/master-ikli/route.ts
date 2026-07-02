import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orgId = session.organizationId;
  if (!orgId) {
    return NextResponse.json({ error: 'Invalid organization context' }, { status: 400 });
  }

  try {
    const dimensis = await prisma.masterDimensi.findMany({
      where: { organizationId: orgId },
      include: {
        unsurs: {
          include: {
            aspeks: true
          },
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(dimensis);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH' && session.role !== 'ANALIS') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const orgId = session.organizationId;
  if (!orgId) {
    return NextResponse.json({ error: 'Invalid organization context' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { type, name, dimensiId, unsurId } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Type and Name are required' }, { status: 400 });
    }

    if (type === 'DIMENSI') {
      const item = await prisma.masterDimensi.create({
        data: {
          name,
          organizationId: orgId
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (type === 'UNSUR') {
      if (!dimensiId) {
        return NextResponse.json({ error: 'dimensiId is required' }, { status: 400 });
      }
      const item = await prisma.masterUnsur.create({
        data: {
          name,
          dimensiId,
          organizationId: orgId
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (type === 'ASPEK') {
      if (!unsurId) {
        return NextResponse.json({ error: 'unsurId is required' }, { status: 400 });
      }
      const item = await prisma.masterAspek.create({
        data: {
          name,
          unsurId,
          organizationId: orgId
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Data master tersebut sudah terdaftar (duplikat)' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
