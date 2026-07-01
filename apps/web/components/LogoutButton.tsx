'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-danger hover:bg-danger-soft hover:text-danger-text transition-colors group"
    >
      <LogOut className="mr-3 h-5 w-5 text-danger group-hover:text-danger-text" />
      Keluar
    </button>
  );
}
