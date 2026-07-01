import { NextResponse } from 'next/server';
import { prisma } from 'database';
import { getSession } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only Admin can delete responses
  if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;

  try {
    const response = await prisma.surveyResponse.findUnique({
      where: { id },
      include: {
        survey: true,
      },
    });

    if (!response) {
      return NextResponse.json({ error: 'Respons tidak ditemukan' }, { status: 404 });
    }

    // Scoping check for non-SUPER_ADMIN
    if (session.role !== 'SUPER_ADMIN') {
      if (response.survey.organizationId !== session.organizationId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    await prisma.surveyResponse.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
