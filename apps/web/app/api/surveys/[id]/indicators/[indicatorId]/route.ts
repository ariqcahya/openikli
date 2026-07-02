import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string; indicatorId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // RBAC guard: SUPER_ADMIN, ADMIN_DAERAH, and ANALIS can manage indicators
  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH' && session.role !== 'ANALIS') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: surveyId, indicatorId } = params;

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

    const indicator = await prisma.surveyIndicator.findUnique({
      where: { id: indicatorId },
    });

    if (!indicator || indicator.surveyId !== surveyId) {
      return NextResponse.json({ error: 'Indikator tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const { code, name, description } = body;

    if (!code || !name) {
      return NextResponse.json({ error: 'Kode dan Nama Indikator wajib diisi' }, { status: 400 });
    }

    // Check if code has changed and if new code conflicts
    if (code.toLowerCase() !== indicator.code.toLowerCase()) {
      const existing = await prisma.surveyIndicator.findFirst({
        where: {
          surveyId,
          code: {
            equals: code,
            mode: 'insensitive',
          },
          id: {
            not: indicatorId,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: `Indikator dengan kode "${code.toUpperCase()}" sudah terdaftar.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.surveyIndicator.update({
      where: { id: indicatorId },
      data: {
        code: code.toUpperCase(),
        name,
        description: description || null,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        organizationId: survey.organizationId,
        userId: session.id,
        action: 'UPDATE_INDICATOR',
        details: `Mengubah indikator ${indicator.code} -> ${code.toUpperCase()} untuk survei ${surveyId}`,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; indicatorId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // RBAC guard: SUPER_ADMIN, ADMIN_DAERAH, and ANALIS can manage indicators
  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH' && session.role !== 'ANALIS') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: surveyId, indicatorId } = params;

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

    const indicator = await prisma.surveyIndicator.findUnique({
      where: { id: indicatorId },
    });

    if (!indicator || indicator.surveyId !== surveyId) {
      return NextResponse.json({ error: 'Indikator tidak ditemukan' }, { status: 404 });
    }

    await prisma.surveyIndicator.delete({
      where: { id: indicatorId },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        organizationId: survey.organizationId,
        userId: session.id,
        action: 'DELETE_INDICATOR',
        details: `Menghapus indikator ${indicator.code} untuk survei ${surveyId}`,
      },
    });

    return NextResponse.json({ success: true, message: 'Indikator berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
