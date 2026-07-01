import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const queryOrgId = searchParams.get('organizationId');

  let targetOrgId = queryOrgId;

  // If no query organizationId, check active session
  if (!targetOrgId) {
    const session = await getSession();
    if (session?.organizationId) {
      targetOrgId = session.organizationId;
    }
  }

  if (!targetOrgId) {
    return NextResponse.json({ error: 'organizationId wajib disertakan' }, { status: 400 });
  }

  try {
    const regions = await prisma.region.findMany({
      where: { organizationId: targetOrgId },
      include: {
        parent: {
          select: { name: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(regions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
