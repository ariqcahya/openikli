import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: surveyId } = params;

  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survei tidak ditemukan' }, { status: 404 });
    }

    // Scoping check: non-SUPER_ADMIN must match organization
    if (session.role !== 'SUPER_ADMIN' && survey.organizationId !== session.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Read query parameters
    const { searchParams } = new URL(req.url);
    const regionId = searchParams.get('regionId') || undefined;
    const infrastructureTypeId = searchParams.get('infrastructureTypeId') || undefined;
    const indicatorCode = searchParams.get('indicatorCode') || undefined;

    // Build Prisma query condition
    const whereClause: any = { surveyId };

    if (regionId !== undefined) {
      whereClause.regionId = regionId === 'null' ? null : regionId;
    }
    if (infrastructureTypeId !== undefined) {
      whereClause.infrastructureTypeId = infrastructureTypeId === 'null' ? null : infrastructureTypeId;
    }
    if (indicatorCode !== undefined) {
      whereClause.indicatorCode = indicatorCode;
    }

    const scores = await prisma.ikliScore.findMany({
      where: whereClause,
      include: {
        region: {
          select: { name: true, level: true },
        },
        infrastructureType: {
          select: { name: true, code: true },
        },
      },
      orderBy: [
        { indicatorCode: 'asc' },
        { calculatedAt: 'desc' },
      ],
    });

    return NextResponse.json(scores);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
