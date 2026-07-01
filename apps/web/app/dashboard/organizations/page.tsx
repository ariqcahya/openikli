'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Organization {
  id: string;
  name: string;
  type: string;
  address: string | null;
  contactEmail: string | null;
  logoUrl: string | null;
  _count?: {
    members: number;
  };
}

export default function OrganizationsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'LAINNYA',
    address: '',
    contactEmail: '',
    logoUrl: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Delete State
  const [deletingOrg, setDeletingOrg] = useState<Organization | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal mengunggah logo');
      }

      const result = await res.json();
      setFormData(prev => ({ ...prev, logoUrl: result.url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  useEffect(() => {
    checkAccessAndLoad();
  }, []);

  const checkAccessAndLoad = async () => {
    try {
      setLoading(true);
      setError(null);

      const sessionRes = await fetch('/api/auth/session');
      if (!sessionRes.ok) throw new Error('Gagal memeriksa sesi pengguna');
      const sessionData = await sessionRes.json();

      if (!sessionData.session) {
        router.push('/login');
        return;
      }

      if (sessionData.session.role !== 'SUPER_ADMIN') {
        router.push('/dashboard');
        return;
      }

      setCurrentUser(sessionData.session);

      const res = await fetch('/api/organizations');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal memuat data organisasi');
      }
      const data = await res.json();
      setOrganizations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal memuat data organisasi');
      }
      const data = await res.json();
      setOrganizations(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOpenAddModal = () => {
    setEditingOrg(null);
    setFormData({
      name: '',
      type: 'LAINNYA',
      address: '',
      contactEmail: '',
      logoUrl: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      type: org.type,
      address: org.address || '',
      contactEmail: org.contactEmail || '',
      logoUrl: org.logoUrl || '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama organisasi wajib diisi.');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);

      const url = editingOrg ? `/api/organizations/${editingOrg.id}` : '/api/organizations';
      const method = editingOrg ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Terjadi kesalahan saat menyimpan data.');
      }

      await fetchOrganizations();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteOrg = async () => {
    if (!deletingOrg) return;

    try {
      setDeleteSubmitting(true);
      const res = await fetch(`/api/organizations/${deletingOrg.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus organisasi.');
      }

      await fetchOrganizations();
      setDeletingOrg(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
            Kelola Organisasi
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">
            Manajemen penyewa multi-tenant (Multi-Organization) untuk membagi batasan administrasi.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Organisasi
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-text-secondary">Memuat data organisasi...</p>
        </div>
      ) : error ? (
        <div className="bg-danger-soft border border-danger/20 rounded-xl p-6 text-center max-w-xl mx-auto">
          <AlertTriangle className="w-10 h-10 text-danger mx-auto mb-3" />
          <h3 className="text-lg font-medium text-danger-text">Gagal Memuat Organisasi</h3>
          <p className="text-sm text-danger-text/80 mt-1">{error}</p>
          <button
            onClick={fetchOrganizations}
            className="mt-4 px-4 py-2 bg-white border border-danger/30 text-sm font-medium rounded-lg text-danger-text hover:bg-danger-soft transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : organizations.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center shadow-sm">
          <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary">Belum Ada Organisasi</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
            Daftar organisasi masih kosong. Mulai dengan menambahkan organisasi baru.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-6 inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Organisasi Pertama
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Nama Organisasi
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Tipe
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Email Kontak
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Anggota
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Alamat
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-1 bg-slate-100 border border-slate-200 text-primary rounded-lg overflow-hidden flex items-center justify-center w-9 h-9">
                          {org.logoUrl ? (
                            <img src={org.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-5 h-5 text-text-secondary" />
                          )}
                        </div>
                        <span className="font-medium text-text-primary">{org.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {org.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary text-sm">
                      {org.contactEmail || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary text-sm font-medium">
                      {org._count?.members ?? 0} orang
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm max-w-xs truncate">
                      {org.address || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(org)}
                          className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-soft rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingOrg(org)}
                          className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger-soft rounded-md transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-surface rounded-xl shadow-lg border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-text-primary text-lg">
                {editingOrg ? 'Edit Organisasi' : 'Tambah Organisasi baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-secondary p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-danger-soft border border-danger/10 text-danger-text text-sm rounded-lg flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Logo Organisasi
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Preview Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-text-muted" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload-input"
                    />
                    <label
                      htmlFor="logo-upload-input"
                      className="cursor-pointer inline-flex items-center px-3.5 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      {uploadingLogo ? 'Mengunggah...' : 'Pilih File Gambar'}
                    </label>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logoUrl: '' })}
                        className="ml-2 inline-flex items-center px-2 py-2 border border-danger/20 text-sm font-medium rounded-lg text-danger bg-danger-soft hover:bg-danger/10 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                    <p className="text-xs text-text-muted mt-1.5">
                      PNG, JPG, atau SVG (Maks. 2MB).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Nama Organisasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dinas PU Kabupaten Banyumas"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Tipe Organisasi
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  >
                    <option value="PROVINSI">PROVINSI</option>
                    <option value="KABUPATEN">KABUPATEN</option>
                    <option value="KOTA">KOTA</option>
                    <option value="INSTANSI">INSTANSI</option>
                    <option value="LAINNYA">LAINNYA</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    placeholder="nama@organisasi.go.id"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Alamat Kantor
                </label>
                <textarea
                  rows={3}
                  placeholder="Jl. Jenderal Sudirman No. 1, Purwokerto"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors text-sm font-medium shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {formSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-surface rounded-xl shadow-lg border border-border p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-danger-soft text-danger rounded-full flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-text-primary">
                  Hapus Organisasi?
                </h3>
                <p className="text-sm text-text-secondary">
                  Apakah Anda yakin ingin menghapus <strong>{deletingOrg.name}</strong>? Tindakan ini tidak dapat dibatalkan dan semua data anggota serta survei di bawah organisasi ini akan ikut terhapus.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
              <button
                disabled={deleteSubmitting}
                onClick={() => setDeletingOrg(null)}
                className="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                disabled={deleteSubmitting}
                onClick={handleDeleteOrg}
                className="inline-flex items-center justify-center px-4 py-2 bg-danger hover:bg-danger-hover text-white rounded-lg transition-colors text-sm font-medium shadow-sm disabled:opacity-75"
              >
                {deleteSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
