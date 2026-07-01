import React from 'react';
import { redirect } from 'next/navigation';
import { getSession, clearSession } from '@/lib/auth';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Map,
  Settings,
  BrainCircuit,
  LogOut,
  UserCheck,
  Building2,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Survei', href: '#', icon: FileSpreadsheet, disabled: true },
    { name: 'Data Responden', href: '#', icon: Users, disabled: true },
    { name: 'Peta Wilayah', href: '#', icon: Map, disabled: true },
    { name: 'Analisis Komentar', href: '#', icon: BrainCircuit, disabled: true },
    { name: 'Pengaturan', href: '#', icon: Settings, disabled: true },
  ];

  return (
    <div className="flex-1 flex overflow-hidden h-screen bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-surface">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo / Header */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <Building2 className="w-6 h-6 text-primary mr-2" />
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              OpenSource-IKLI
            </span>
          </div>

          {/* User Info Card */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-background border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-medium">
                {session.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {session.name}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {session.phone}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex flex-col space-y-1.5">
              <div className="flex items-center text-xs text-text-secondary">
                <span className="font-semibold mr-1">Org:</span>
                <span className="truncate">{session.organizationName || 'Super Tenant'}</span>
              </div>
              <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary-soft text-primary-text w-fit">
                {session.role}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  {item.disabled ? (
                    <span className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-text-muted cursor-not-allowed group">
                      <Icon className="mr-3 h-5 w-5 text-text-muted" />
                      {item.name}
                      <span className="ml-auto text-[10px] bg-border px-1.5 py-0.5 rounded text-text-secondary">
                        Nanti
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-colors group"
                    >
                      <Icon className="mr-3 h-5 w-5 text-text-secondary group-hover:text-text-primary" />
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-border">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header Mobile / Topbar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-surface md:border-b-0">
          <div className="flex items-center md:hidden">
            <button className="text-text-secondary hover:text-text-primary focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-3 text-lg font-semibold tracking-tight text-text-primary">
              OpenSource-IKLI
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1 text-xs text-text-secondary">
            <span>Organisasi:</span>
            <span className="font-semibold text-text-primary">
              {session.organizationName || 'Global System'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-text-secondary hidden sm:inline">
              Tahun Survei Aktif: <strong className="text-text-primary">2026</strong>
            </span>
            <div className="h-8 w-px bg-border hidden sm:block"></div>
            <div className="flex items-center text-sm font-medium text-text-primary">
              <span className="mr-2 h-2 w-2 rounded-full bg-success"></span>
              Sistem Aktif
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
