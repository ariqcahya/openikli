import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let whereClause: any = {};

    // Scoping: ADMIN_DAERAH / ANALIS / VIEWER only see their own organization's surveys.
    // SUPER_ADMIN sees switched organization's surveys or all if no active org selected.
    if (session.role !== 'SUPER_ADMIN') {
      if (!session.organizationId) {
        return NextResponse.json({ error: 'User does not belong to any organization' }, { status: 400 });
      }
      whereClause.organizationId = session.organizationId;
    } else if (session.organizationId) {
      whereClause.organizationId = session.organizationId;
    }

    const surveys = await prisma.survey.findMany({
      where: whereClause,
      include: {
        organization: {
          select: { name: true },
        },
        _count: {
          select: {
            questions: true,
            responses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(surveys);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only SUPER_ADMIN and ADMIN_DAERAH can create surveys.
  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, year, periodLabel, scoringScale, startDate, endDate } = body;

    if (!title || !year || !periodLabel) {
      return NextResponse.json({ error: 'Judul, Tahun, dan Label Periode wajib diisi' }, { status: 400 });
    }

    // Determine target organization
    const targetOrgId = session.organizationId;
    if (!targetOrgId) {
      return NextResponse.json(
        { error: 'Silakan pilih atau masuk ke dalam konteks organisasi terlebih dahulu.' },
        { status: 400 }
      );
    }

    const newSurvey = await prisma.survey.create({
      data: {
        organizationId: targetOrgId,
        title,
        description,
        year: parseInt(year, 10),
        periodLabel,
        scoringScale: scoringScale ? parseInt(scoringScale, 10) : 5,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdBy: session.name,
      },
    });

    return NextResponse.json(newSurvey);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
