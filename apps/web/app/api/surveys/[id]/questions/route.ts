import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH') {
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

    // Access Scoping
    if (session.role !== 'SUPER_ADMIN') {
      if (survey.organizationId !== session.organizationId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await req.json();
    const { indicatorCode, indicatorName, questionText, questionType, helpText, weight, isRequired, options, sortOrder } = body;

    if (!indicatorCode || !indicatorName || !questionText || !questionType) {
      return NextResponse.json(
        { error: 'Indikator, Nama Indikator, Teks Pertanyaan, dan Tipe Pertanyaan wajib diisi' },
        { status: 400 }
      );
    }

    // Find current max sortOrder
    const maxSort = await prisma.surveyQuestion.aggregate({
      where: { surveyId },
      _max: { sortOrder: true },
    });

    const nextSortOrder = sortOrder !== undefined ? parseInt(sortOrder, 10) : (maxSort._max.sortOrder || 0) + 1;

    const newQuestion = await prisma.surveyQuestion.create({
      data: {
        surveyId,
        indicatorCode,
        indicatorName,
        questionText,
        questionType,
        helpText,
        weight: weight !== undefined ? parseFloat(weight) : 1.0,
        isRequired: isRequired !== undefined ? !!isRequired : true,
        options: options || undefined,
        sortOrder: nextSortOrder,
      },
    });

    return NextResponse.json(newQuestion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Batch PUT to reorder questions
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH') {
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

    // Access Scoping
    if (session.role !== 'SUPER_ADMIN') {
      if (survey.organizationId !== session.organizationId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const { orders } = await req.json(); // Expected: { orders: [{ id: "q1", sortOrder: 1 }, ...] }

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json({ error: 'Data urutan tidak valid' }, { status: 400 });
    }

    await prisma.$transaction(
      orders.map((o) =>
        prisma.surveyQuestion.update({
          where: { id: o.id, surveyId },
          data: { sortOrder: o.sortOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
