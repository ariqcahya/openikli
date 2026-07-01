import { NextResponse } from 'next/server';
import { prisma } from 'database';
import * as bcrypt from 'bcryptjs';
import { setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    // 1. Validation
    if (!phone || !password) {
      return NextResponse.json(
        { message: 'Nomor HP dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // 2. Find User
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: 'Nomor HP atau password salah.' },
        { status: 401 }
      );
    }

    // 3. Verify Password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Nomor HP atau password salah.' },
        { status: 401 }
      );
    }

    // 4. Set Session
    await setSession({
      id: user.id,
      phone: user.phone,
      name: user.name,
    });

    // 5. Create Audit Log (Optional but good practice)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        details: 'User logged in successfully via web form.',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan sistem saat memproses login.' },
      { status: 500 }
    );
  }
}
