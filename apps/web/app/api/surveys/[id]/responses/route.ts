import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: surveyId } = params;

  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survei tidak ditemukan' }, { status: 404 });
    }

    // Only ACTIVE surveys can accept responses
    if (survey.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Pengisian survei ini sedang ditutup atau belum aktif.' }, { status: 400 });
    }

    const body = await req.json();
    const {
      regionId,
      infrastructureTypeId,
      respondentAge,
      respondentGender,
      respondentJob,
      gpsLat,
      gpsLng,
      notes,
      answers, // Expected: [{ questionId: string, ratingValue?: number, textValue?: string }]
    } = body;

    // Optional authentication check for Enumerator
    const session = await getSession();
    const isEnumerator = session?.role === 'ENUMERATOR';

    const response = await prisma.$transaction(async (tx) => {
      // 1. Create Response
      const newResponse = await tx.surveyResponse.create({
        data: {
          surveyId,
          regionId: regionId || null,
          infrastructureTypeId: infrastructureTypeId || null,
          respondentAge: respondentAge ? parseInt(respondentAge, 10) : null,
          respondentGender: respondentGender || null,
          respondentJob: respondentJob || null,
          gpsLat: gpsLat ? parseFloat(gpsLat) : null,
          gpsLng: gpsLng ? parseFloat(gpsLng) : null,
          notes: notes || null,
          isEnumeratorInput: isEnumerator,
          enumeratorId: isEnumerator && session ? session.id : null,
        },
      });

      // 2. Create Answers
      if (answers && Array.isArray(answers) && answers.length > 0) {
        await tx.surveyAnswer.createMany({
          data: answers.map((ans) => ({
            responseId: newResponse.id,
            questionId: ans.questionId,
            ratingValue: ans.ratingValue !== undefined ? parseInt(ans.ratingValue, 10) : null,
            textValue: ans.textValue !== undefined ? String(ans.textValue) : null,
          })),
        });
      }

      return newResponse;
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    // Scoping check for non-SUPER_ADMIN
    if (session.role !== 'SUPER_ADMIN') {
      if (survey.organizationId !== session.organizationId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Filtering based on role: ENUMERATOR only sees their own inputs
    let whereClause: any = { surveyId };
    if (session.role === 'ENUMERATOR') {
      whereClause.enumeratorId = session.id;
    }

    const responses = await prisma.surveyResponse.findMany({
      where: whereClause,
      include: {
        region: {
          select: { name: true, level: true },
        },
        infrastructureType: {
          select: { name: true, code: true },
        },
        answers: {
          include: {
            question: {
              select: { questionText: true, indicatorCode: true, indicatorName: true, questionType: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(responses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
