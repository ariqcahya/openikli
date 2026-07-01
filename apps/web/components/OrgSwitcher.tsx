'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
}

interface OrgSwitcherProps {
  organizations: Organization[];
  currentOrgId: string | null;
}

export default function OrgSwitcher({ organizations, currentOrgId }: OrgSwitcherProps) {
  const router = useRouter();
  const [switching, setSwitching] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = e.target.value;
    try {
      setSwitching(true);
      const res = await fetch('/api/auth/switch-organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId || null }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengganti organisasi');
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-50 border border-border px-2 py-1 rounded-lg">
      <Building2 className="w-4 h-4 text-text-secondary" />
      <select
        value={currentOrgId || ''}
        disabled={switching}
        onChange={handleChange}
        className="bg-transparent text-xs font-medium text-text-primary focus:outline-none cursor-pointer disabled:opacity-50"
      >
        <option value="">Global System (Super Admin)</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
}
