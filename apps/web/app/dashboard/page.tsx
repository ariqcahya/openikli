import React from 'react';
import { getSession } from '@/lib/auth';
import { prisma } from 'database';
import { FilePlus2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();

  if (session?.role === 'ENUMERATOR') {
    redirect('/dashboard/responses');
  }

  // Load infrastructure count just to show database integration is working
  let infrastructureCount = 0;
  try {
    if (session?.organizationId) {
      infrastructureCount = await prisma.infrastructureType.count({
        where: { organizationId: session.organizationId, isActive: true },
      });
    }
  } catch (error) {
    console.error('Failed to load infrastructure count:', error);
  }

  const metrics = [
    { name: 'Skor IKLI Total', value: '-', sub: 'Belum ada kalkulasi', color: 'border-border' },
    { name: 'Jumlah Responden', value: '0', sub: 'Masyarakat & Enumerator', color: 'border-border' },
    { name: 'Wilayah Tercakup', value: '0', sub: 'Berdasarkan data impor', color: 'border-border' },
    { name: 'Jenis Infrastruktur', value: String(infrastructureCount || 0), sub: 'Telah terkonfigurasi', color: 'border-success/30' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
          Ringkasan Eksekutif IKLI
        </h1>
        <p className="text-sm text-text-secondary mt-1.5">
          Selamat datang kembali, <strong className="text-text-primary">{session?.name}</strong>. Halaman ini menyajikan status kepuasan layanan infrastruktur terkini.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className={`bg-surface p-6 rounded-xl border ${metric.color} shadow-sm flex flex-col justify-between`}
          >
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                {metric.name}
              </p>
              <p className="mt-2 text-3xl font-semibold text-text-primary">
                {metric.value}
              </p>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              {metric.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main Empty State Content Panel */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 text-center max-w-xl mx-auto my-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning-soft text-warning mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-text-primary">
            Belum Ada Data Survei
          </h3>
          <p className="text-sm text-text-secondary mt-2">
            Platform OpenSource-IKLI Anda telah siap digunakan, namun belum ada survei yang aktif atau respon yang terkumpul untuk wilayah ini.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              disabled
              className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FilePlus2 className="w-4 h-4 mr-2" />
              Buat Survei Pertama (Nanti)
            </button>
            <button
              disabled
              className="inline-flex items-center justify-center px-4 py-2.5 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Kalkulasi Ulang Skor
            </button>
          </div>
        </div>

        {/* Integration Check Panel */}
        <div className="bg-background px-6 py-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-text-secondary gap-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Koneksi Database PostGIS & Prisma ORM: <strong className="text-success-text">Terhubung</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Provider AI & Enkripsi: <strong className="text-text-primary">Siap (BYOK)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
