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

    const indicators = await prisma.surveyIndicator.findMany({
      where: { surveyId },
      orderBy: { code: 'asc' },
    });

    return NextResponse.json(indicators);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // RBAC guard: SUPER_ADMIN, ADMIN_DAERAH, and ANALIS can manage indicators
  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH' && session.role !== 'ANALIS') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

    const body = await req.json();
    const { code, name, description, dimensi, unsur, aspek } = body;

    if (!code || !name) {
      return NextResponse.json({ error: 'Kode dan Nama Indikator wajib diisi' }, { status: 400 });
    }

    // Check if code already exists for this survey
    const existing = await prisma.surveyIndicator.findFirst({
      where: {
        surveyId,
        code: {
          equals: code,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Indikator dengan kode "${code.toUpperCase()}" sudah terdaftar pada survei ini.` },
        { status: 400 }
      );
    }

    const newIndicator = await prisma.surveyIndicator.create({
      data: {
        surveyId,
        code: code.toUpperCase(),
        name,
        description: description || null,
        dimensi: dimensi || null,
        unsur: unsur || null,
        aspek: aspek || null,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        organizationId: survey.organizationId,
        userId: session.id,
        action: 'CREATE_INDICATOR',
        details: `Membuat indikator ${code.toUpperCase()} - ${name} untuk survei ${surveyId}`,
      },
    });

    return NextResponse.json(newIndicator, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
