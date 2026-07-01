import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
    return NextResponse.json(organizations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, type, address, contactEmail, logoUrl } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        type: type || 'LAINNYA',
        address: address || null,
        contactEmail: contactEmail || null,
        logoUrl: logoUrl || null,
      },
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
