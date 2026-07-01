import { PrismaClient, Role, OrganizationType, RegionLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Default Organization
  const org = await prisma.organization.upsert({
    where: { id: 'default-org-id-0000-0000-000000000000' },
    update: {},
    create: {
      id: 'default-org-id-0000-0000-000000000000',
      name: 'Dinas Pekerjaan Umum Kabupaten Banyumas',
      type: OrganizationType.KABUPATEN,
      contactEmail: 'dpu@banyumaskab.go.id',
      address: 'Jl. Jenderal Sudirman No. 1, Purwokerto',
      settings: {
        defaultScoringScale: 5,
        defaultPeriod: '2026'
      }
    }
  });
  console.log(`Created organization: ${org.name}`);

  // 2. Create Default User (Super Admin)
  const phone = '081234567890';
  const rawPassword = 'adminpassword123';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { phone },
    update: {
      password: hashedPassword
    },
    create: {
      phone,
      password: hashedPassword,
      name: 'Super Admin IKLI',
      isActive: true
    }
  });
  console.log(`Created admin user with phone: ${admin.phone} and password: ${rawPassword}`);

  // 3. Create membership linking admin to org
  const membership = await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: admin.id
      }
    },
    update: {
      role: Role.SUPER_ADMIN
    },
    create: {
      organizationId: org.id,
      userId: admin.id,
      role: Role.SUPER_ADMIN
    }
  });
  console.log(`Created membership role: ${membership.role}`);

  // 4. Create Default Infrastructure Types
  const defaultInfrastructures = [
    { code: 'jalan', name: 'Jalan', description: 'Infrastruktur jalan raya, kabupaten, dan lingkungan' },
    { code: 'jembatan', name: 'Jembatan', description: 'Jembatan penyeberangan dan jembatan kendaraan' },
    { code: 'drainase', name: 'Drainase', description: 'Saluran pembuangan air hujan/drainase kota' },
    { code: 'irigasi', name: 'Irigasi', description: 'Saluran irigasi pertanian' },
    { code: 'air_bersih', name: 'Air Bersih', description: 'Akses dan jaringan air bersih/minum' },
    { code: 'sanitasi', name: 'Sanitasi', description: 'Sistem pengolahan air limbah domestik/cubluk' },
    { code: 'persampahan', name: 'Persampahan', description: 'Tempat pembuangan sampah dan sistem angkut' },
    { code: 'pju', name: 'Penerangan Jalan Umum', description: 'Lampu penerangan jalan' },
    { code: 'fasilitas_publik', name: 'Fasilitas Publik', description: 'Taman, trotoar, dan fasilitas umum lainnya' },
    { code: 'permukiman', name: 'Permukiman', description: 'Jalan lingkungan permukiman dan penataan kawasan' },
    { code: 'lainnya', name: 'Lainnya', description: 'Infrastruktur lainnya' }
  ];

  let order = 1;
  for (const infra of defaultInfrastructures) {
    await prisma.infrastructureType.upsert({
      where: {
        organizationId_code: {
          organizationId: org.id,
          code: infra.code
        }
      },
      update: {
        name: infra.name,
        description: infra.description,
        sortOrder: order
      },
      create: {
        organizationId: org.id,
        code: infra.code,
        name: infra.name,
        description: infra.description,
        sortOrder: order,
        isActive: true
      }
    });
    order++;
  }
  console.log('Seeded default infrastructure types successfully.');

  // 5. Seed default regions
  const sampleDistricts = [
    {
      name: 'Kecamatan Purwokerto Timur',
      bpsCode: '3302110',
      villages: [
        { name: 'Kelurahan Arcawinangun', bpsCode: '3302110001' },
        { name: 'Kelurahan Kranji', bpsCode: '3302110002' },
      ],
    },
    {
      name: 'Kecamatan Purwokerto Selatan',
      bpsCode: '3302120',
      villages: [
        { name: 'Kelurahan Karangklesem', bpsCode: '3302120001' },
        { name: 'Kelurahan Tanjung', bpsCode: '3302120002' },
      ],
    },
  ];

  for (const dist of sampleDistricts) {
    const parentRegion = await prisma.region.upsert({
      where: { id: `dist-id-${dist.bpsCode}` },
      update: {
        name: dist.name,
        bpsCode: dist.bpsCode,
      },
      create: {
        id: `dist-id-${dist.bpsCode}`,
        organizationId: org.id,
        name: dist.name,
        bpsCode: dist.bpsCode,
        level: RegionLevel.DISTRICT,
      },
    });

    for (const vil of dist.villages) {
      await prisma.region.upsert({
        where: { id: `vil-id-${vil.bpsCode}` },
        update: {
          name: vil.name,
          bpsCode: vil.bpsCode,
        },
        create: {
          id: `vil-id-${vil.bpsCode}`,
          organizationId: org.id,
          parentId: parentRegion.id,
          name: vil.name,
          bpsCode: vil.bpsCode,
          level: RegionLevel.VILLAGE,
        },
      });
    }
  }
  console.log('Seeded sample regions successfully.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
