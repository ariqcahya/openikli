import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: surveyId, questionId } = params;

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

    const question = await prisma.surveyQuestion.findUnique({
      where: { id: questionId, surveyId },
    });

    if (!question) {
      return NextResponse.json({ error: 'Pertanyaan tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const { indicatorCode, indicatorName, questionText, questionType, helpText, weight, isRequired, options, sortOrder } = body;

    const updatedQuestion = await prisma.surveyQuestion.update({
      where: { id: questionId },
      data: {
        indicatorCode: indicatorCode !== undefined ? indicatorCode : undefined,
        indicatorName: indicatorName !== undefined ? indicatorName : undefined,
        questionText: questionText !== undefined ? questionText : undefined,
        questionType: questionType !== undefined ? questionType : undefined,
        helpText: helpText !== undefined ? helpText : undefined,
        weight: weight !== undefined ? parseFloat(weight) : undefined,
        isRequired: isRequired !== undefined ? !!isRequired : undefined,
        options: options !== undefined ? options : undefined,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : undefined,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: surveyId, questionId } = params;

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

    const question = await prisma.surveyQuestion.findUnique({
      where: { id: questionId, surveyId },
    });

    if (!question) {
      return NextResponse.json({ error: 'Pertanyaan tidak ditemukan' }, { status: 404 });
    }

    await prisma.surveyQuestion.delete({
      where: { id: questionId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
