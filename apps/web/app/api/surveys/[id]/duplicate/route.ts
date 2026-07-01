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

  const { id } = params;

  try {
    // Find the original survey
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survei asal tidak ditemukan' }, { status: 404 });
    }

    // Access Scoping
    if (session.role !== 'SUPER_ADMIN') {
      if (survey.organizationId !== session.organizationId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Duplicate in a transaction
    const newSurvey = await prisma.$transaction(async (tx) => {
      const duplicated = await tx.survey.create({
        data: {
          organizationId: survey.organizationId,
          title: `Salinan - ${survey.title}`,
          description: survey.description,
          year: survey.year,
          periodLabel: survey.periodLabel,
          status: 'DRAFT', // Duplicate always starts as DRAFT
          scoringScale: survey.scoringScale,
          startDate: survey.startDate,
          endDate: survey.endDate,
          settings: survey.settings || undefined,
          createdBy: session.name,
        },
      });

      // Duplicate questions
      if (survey.questions.length > 0) {
        await tx.surveyQuestion.createMany({
          data: survey.questions.map((q) => ({
            surveyId: duplicated.id,
            indicatorCode: q.indicatorCode,
            indicatorName: q.indicatorName,
            questionText: q.questionText,
            questionType: q.questionType,
            helpText: q.helpText,
            weight: q.weight,
            isRequired: q.isRequired,
            options: q.options || undefined,
            sortOrder: q.sortOrder,
          })),
        });
      }

      return duplicated;
    });

    return NextResponse.json(newSurvey);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
