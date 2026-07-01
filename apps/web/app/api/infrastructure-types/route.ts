import { NextResponse } from 'next/server';
import { prisma } from 'database';

export async function GET() {
  try {
    const types = await prisma.infrastructureType.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(types);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
