import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = (file as any).name || 'upload.png';
    const fileExtension = path.extname(originalName);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExtension}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
