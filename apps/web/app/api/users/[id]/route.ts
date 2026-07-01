import { NextResponse } from 'next/server';
import { prisma } from 'database';
import * as bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: targetUserId } = params;

  try {
    const body = await req.json();
    const { name, phone, password, role, organizationId, isActive } = body;

    // Get current target user membership
    const targetMembership = await prisma.organizationMember.findFirst({
      where: { userId: targetUserId },
    });

    if (!targetMembership && session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Role-based restrictions
    if (session.role === 'ADMIN_DAERAH') {
      if (targetMembership?.organizationId !== session.organizationId) {
        return NextResponse.json({ error: 'Forbidden: User is in another organization' }, { status: 403 });
      }
      if (role && role === 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Forbidden: Admin Daerah cannot assign Super Admin role' }, { status: 403 });
      }
      if (organizationId && organizationId !== session.organizationId) {
        return NextResponse.json({ error: 'Forbidden: Admin Daerah cannot change user organization' }, { status: 403 });
      }
    }

    // Prepare user update data
    const userUpdateData: any = {};
    if (name) userUpdateData.name = name;
    if (phone) {
      // Check duplicate phone
      const duplicateUser = await prisma.user.findFirst({
        where: { phone, NOT: { id: targetUserId } },
      });
      if (duplicateUser) {
        return NextResponse.json({ error: 'Phone number already registered to another user' }, { status: 400 });
      }
      userUpdateData.phone = phone;
    }
    if (password) {
      userUpdateData.password = await bcrypt.hash(password, 10);
    }
    if (typeof isActive === 'boolean') {
      userUpdateData.isActive = isActive;
    }

    // Update in transaction
    await prisma.$transaction(async (tx) => {
      // Update User
      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: targetUserId },
          data: userUpdateData,
        });
      }

      // Update Membership
      if (role || organizationId) {
        const membershipUpdateData: any = {};
        if (role) membershipUpdateData.role = role;
        if (organizationId && session.role === 'SUPER_ADMIN') {
          membershipUpdateData.organizationId = organizationId;
        }

        if (targetMembership) {
          await tx.organizationMember.update({
            where: { id: targetMembership.id },
            data: membershipUpdateData,
          });
        } else {
          // If they somehow didn't have membership
          await tx.organizationMember.create({
            data: {
              userId: targetUserId,
              organizationId: organizationId || session.organizationId!,
              role: role || 'VIEWER',
            },
          });
        }
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'UPDATE_USER',
          userId: session.id,
          organizationId: session.organizationId || null,
          details: `Mengubah data pengguna ID: ${targetUserId}. Parameter terubah: ${Object.keys(userUpdateData).join(', ')}${role ? `, role: ${role}` : ''}`,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_DAERAH')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: targetUserId } = params;

  try {
    // Get target membership
    const targetMembership = await prisma.organizationMember.findFirst({
      where: { userId: targetUserId },
    });

    if (session.role === 'ADMIN_DAERAH') {
      if (!targetMembership || targetMembership.organizationId !== session.organizationId) {
        return NextResponse.json({ error: 'Forbidden: User is in another organization' }, { status: 403 });
      }
    }

    // Cannot delete yourself
    if (session.id === targetUserId) {
      return NextResponse.json({ error: 'Cannot delete your own user account' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.delete({
        where: { id: targetUserId },
      });

      await tx.auditLog.create({
        data: {
          action: 'DELETE_USER',
          userId: session.id,
          organizationId: session.organizationId || null,
          details: `Menghapus pengguna ID: ${targetUserId}`,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
