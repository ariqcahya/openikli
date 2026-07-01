import { NextResponse } from 'next/server';
import { prisma } from 'database';
import * as bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let users;
    if (session.role === 'SUPER_ADMIN') {
      users = await prisma.user.findMany({
        orderBy: { name: 'asc' },
        include: {
          memberships: {
            include: {
              organization: true,
            },
          },
        },
      });
    } else {
      // ADMIN_DAERAH
      if (!session.organizationId) {
        return NextResponse.json({ error: 'User does not belong to any organization' }, { status: 400 });
      }
      users = await prisma.user.findMany({
        where: {
          memberships: {
            some: {
              organizationId: session.organizationId,
            },
          },
        },
        orderBy: { name: 'asc' },
        include: {
          memberships: {
            where: {
              organizationId: session.organizationId,
            },
            include: {
              organization: true,
            },
          },
        },
      });
    }

    // Map to a clean response format
    const formattedUsers = users.map(user => {
      const membership = user.memberships[0];
      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        isActive: user.isActive,
        role: membership?.role || null,
        organizationId: membership?.organizationId || null,
        organizationName: membership?.organization?.name || null,
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, password, role, organizationId } = body;

    // Validation
    if (!name || !phone || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Role-based restrictions
    let targetOrgId = organizationId;
    if (session.role === 'ADMIN_DAERAH') {
      targetOrgId = session.organizationId;
      if (role === 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Admin Daerah cannot create Super Admin users' }, { status: 403 });
      }
    }

    if (!targetOrgId) {
      return NextResponse.json({ error: 'Organization is required' }, { status: 400 });
    }

    // Check duplicate phone
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and membership in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name,
          phone,
          password: hashedPassword,
          isActive: true,
        },
      });

      await tx.organizationMember.create({
        data: {
          userId: u.id,
          organizationId: targetOrgId,
          role,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'CREATE_USER',
          userId: session.id,
          organizationId: session.organizationId || null,
          details: `Membuat pengguna baru: ${name} (${phone}), peran: ${role}, organisasi: ${targetOrgId}`,
        },
      });

      return u;
    });

    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      isActive: newUser.isActive,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
