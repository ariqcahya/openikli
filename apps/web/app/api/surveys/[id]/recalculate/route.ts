import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';
import { convertScoreTo100, getScoreCategory, calculateWeightedAverage } from 'shared';

// Helper to match indicator code prefix to infrastructure type
function findInfrastructureTypeForIndicator(
  indicatorCode: string,
  infrastructureTypes: { id: string; code: string }[]
) {
  const normalizedIndicator = indicatorCode.toLowerCase();
  const sortedTypes = [...infrastructureTypes].sort((a, b) => b.code.length - a.code.length);
  for (const infra of sortedTypes) {
    const normalizedCode = infra.code.toLowerCase();
    if (
      normalizedIndicator === normalizedCode ||
      normalizedIndicator.startsWith(normalizedCode + '_') ||
      normalizedIndicator.startsWith(normalizedCode)
    ) {
      return infra;
    }
  }
  return null;
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // RBAC guard: SUPER_ADMIN, ADMIN_DAERAH, and ANALIS can recalculate
  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH' && session.role !== 'ANALIS') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: surveyId } = params;

  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: true,
      },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survei tidak ditemukan' }, { status: 404 });
    }

    // Scoping check: non-SUPER_ADMIN must match organization
    if (session.role !== 'SUPER_ADMIN' && survey.organizationId !== session.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all responses with their answers
    const responses = await prisma.surveyResponse.findMany({
      where: { surveyId },
      include: {
        answers: true,
      },
    });

    // Fetch all infrastructure types for the organization
    const infrastructureTypes = await prisma.infrastructureType.findMany({
      where: { organizationId: survey.organizationId },
    });

    const ratingQuestions = survey.questions.filter((q) => q.questionType === 'RATING');
    const questionMap = new Map(ratingQuestions.map((q) => [q.id, q]));

    // Extract all valid rating answers
    interface RatingAnswerItem {
      responseId: string;
      regionId: string | null;
      questionId: string;
      ratingValue: number;
      weight: number;
      indicatorCode: string;
      infrastructureTypeId: string | null;
    }

    const ratingAnswers: RatingAnswerItem[] = [];
    const uniqueRegions = new Set<string>();
    const uniqueIndicators = new Set<string>();
    const uniqueInfraTypes = new Set<string>();

    for (const resp of responses) {
      if (resp.regionId) {
        uniqueRegions.add(resp.regionId);
      }
      for (const ans of resp.answers) {
        if (ans.ratingValue === null || ans.ratingValue === undefined) continue;
        const q = questionMap.get(ans.questionId);
        if (!q) continue;

        const weight = q.weight !== null && q.weight !== undefined ? Number(q.weight) : 1.0;
        const infra = findInfrastructureTypeForIndicator(q.indicatorCode, infrastructureTypes);

        if (infra) {
          uniqueInfraTypes.add(infra.id);
        }
        uniqueIndicators.add(q.indicatorCode);

        ratingAnswers.push({
          responseId: resp.id,
          regionId: resp.regionId,
          questionId: ans.questionId,
          ratingValue: ans.ratingValue,
          weight,
          indicatorCode: q.indicatorCode,
          infrastructureTypeId: infra ? infra.id : null,
        });
      }
    }

    // Helper to calculate score raw, score 100, category, and response count for a subset
    const calculateMetrics = (subset: RatingAnswerItem[]) => {
      if (subset.length === 0) return null;
      const uniqueResponses = new Set(subset.map((x) => x.responseId));
      const weightedAvgResult = calculateWeightedAverage(subset);
      const score100 = convertScoreTo100(weightedAvgResult.scoreRaw, survey.scoringScale);
      const category = getScoreCategory(score100);

      return {
        scoreRaw: weightedAvgResult.scoreRaw,
        score100,
        category,
        responseCount: uniqueResponses.size,
      };
    };

    const scoreRecordsToInsert: any[] = [];

    // A. Overall Total Survey Score
    const totalMetrics = calculateMetrics(ratingAnswers);
    if (totalMetrics) {
      scoreRecordsToInsert.push({
        surveyId,
        regionId: null,
        infrastructureTypeId: null,
        indicatorCode: 'ALL',
        ...totalMetrics,
      });
    }

    // B. Overall Score per Indicator Code
    for (const indCode of Array.from(uniqueIndicators)) {
      const subset = ratingAnswers.filter((x) => x.indicatorCode === indCode);
      const metrics = calculateMetrics(subset);
      if (metrics) {
        scoreRecordsToInsert.push({
          surveyId,
          regionId: null,
          infrastructureTypeId: null,
          indicatorCode: indCode,
          ...metrics,
        });
      }
    }

    // C. Overall Score per Infrastructure Type
    for (const infraId of Array.from(uniqueInfraTypes)) {
      const subset = ratingAnswers.filter((x) => x.infrastructureTypeId === infraId);
      const metrics = calculateMetrics(subset);
      if (metrics) {
        scoreRecordsToInsert.push({
          surveyId,
          regionId: null,
          infrastructureTypeId: infraId,
          indicatorCode: 'ALL',
          ...metrics,
        });
      }
    }

    // D. Overall Score per Region
    for (const regId of Array.from(uniqueRegions)) {
      const subset = ratingAnswers.filter((x) => x.regionId === regId);
      const metrics = calculateMetrics(subset);
      if (metrics) {
        scoreRecordsToInsert.push({
          surveyId,
          regionId: regId,
          infrastructureTypeId: null,
          indicatorCode: 'ALL',
          ...metrics,
        });
      }
    }

    // E. Score per Indicator Code per Region
    for (const regId of Array.from(uniqueRegions)) {
      for (const indCode of Array.from(uniqueIndicators)) {
        const subset = ratingAnswers.filter((x) => x.regionId === regId && x.indicatorCode === indCode);
        const metrics = calculateMetrics(subset);
        if (metrics) {
          scoreRecordsToInsert.push({
            surveyId,
            regionId: regId,
            infrastructureTypeId: null,
            indicatorCode: indCode,
            ...metrics,
          });
        }
      }
    }

    // F. Score per Infrastructure Type per Region
    for (const regId of Array.from(uniqueRegions)) {
      for (const infraId of Array.from(uniqueInfraTypes)) {
        const subset = ratingAnswers.filter((x) => x.regionId === regId && x.infrastructureTypeId === infraId);
        const metrics = calculateMetrics(subset);
        if (metrics) {
          scoreRecordsToInsert.push({
            surveyId,
            regionId: regId,
            infrastructureTypeId: infraId,
            indicatorCode: 'ALL',
            ...metrics,
          });
        }
      }
    }

    // Database atomic update: Delete existing score calculations, and batch insert new ones
    await prisma.$transaction(async (tx) => {
      await tx.ikliScore.deleteMany({
        where: { surveyId },
      });

      if (scoreRecordsToInsert.length > 0) {
        await tx.ikliScore.createMany({
          data: scoreRecordsToInsert,
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kalkulasi skor IKLI selesai.',
      totalRecordsCalculated: scoreRecordsToInsert.length,
      calculatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
