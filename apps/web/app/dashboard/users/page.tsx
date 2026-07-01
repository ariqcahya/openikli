'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, X, AlertTriangle, Loader2, UserCheck, ShieldAlert, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
  role: string | null;
  organizationId: string | null;
  organizationName: string | null;
}

interface Organization {
  id: string;
  name: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'VIEWER',
    organizationId: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch current user session
      const sessionRes = await fetch('/api/auth/session');
      if (!sessionRes.ok) throw new Error('Gagal memeriksa sesi pengguna');
      const sessionData = await sessionRes.json();

      if (!sessionData.session) {
        router.push('/login');
        return;
      }

      if (sessionData.session.role !== 'SUPER_ADMIN' && sessionData.session.role !== 'ADMIN_DAERAH') {
        router.push('/dashboard');
        return;
      }

      setCurrentUser(sessionData.session);

      // 2. Fetch users
      const usersRes = await fetch('/api/users');
      if (!usersRes.ok) {
        const errData = await usersRes.json();
        throw new Error(errData.error || 'Gagal memuat daftar pengguna');
      }
      const usersData = await usersRes.json();
      setUsers(usersData);

      // 3. Fetch organizations if super admin
      if (sessionData.session.role === 'SUPER_ADMIN') {
        const orgRes = await fetch('/api/organizations');
        if (orgRes.ok) {
          const orgData = await orgRes.json();
          setOrganizations(orgData);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      phone: '',
      password: '',
      role: 'VIEWER',
      organizationId: currentUser?.role === 'SUPER_ADMIN' ? '' : currentUser?.organizationId || '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      password: '', // Leave blank unless changing
      role: user.role || 'VIEWER',
      organizationId: user.organizationId || '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Nama dan Nomor HP wajib diisi.');
      return;
    }
    if (!editingUser && !formData.password) {
      setFormError('Password wajib diisi untuk pengguna baru.');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);

      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const payload = { ...formData };
      // Don't send empty password on edit
      if (editingUser && !payload.password) {
        delete (payload as any).password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Terjadi kesalahan saat menyimpan data.');
      }

      // Refresh list
      const usersRes = await fetch('/api/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal mengubah status pengguna.');
      }

      // Update state locally
      setUsers(users.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      setDeleteSubmitting(true);
      const res = await fetch(`/api/users/${deletingUser.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus pengguna.');
      }

      setUsers(users.filter(u => u.id !== deletingUser.id));
      setDeletingUser(null);
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
            Kelola Pengguna
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">
            {currentUser?.role === 'SUPER_ADMIN'
              ? 'Manajemen seluruh akun pengguna internal organisasi dan peran hak akses mereka.'
              : `Manajemen akun pengguna internal untuk organisasi ${currentUser?.organizationName || 'Anda'}.`}
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-text-secondary">Memuat data pengguna...</p>
        </div>
      ) : error ? (
        <div className="bg-danger-soft border border-danger/20 rounded-xl p-6 text-center max-w-xl mx-auto">
          <AlertTriangle className="w-10 h-10 text-danger mx-auto mb-3" />
          <h3 className="text-lg font-medium text-danger-text">Gagal Memuat Pengguna</h3>
          <p className="text-sm text-danger-text/80 mt-1">{error}</p>
          <button
            onClick={initPage}
            className="mt-4 px-4 py-2 bg-white border border-danger/30 text-sm font-medium rounded-lg text-danger-text hover:bg-danger-soft transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center shadow-sm">
          <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary">Belum Ada Pengguna</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
            Belum ada anggota pengguna yang terdaftar. Mulai dengan menambahkan pengguna baru.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-6 inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Pengguna Pertama
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Nama Pengguna
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Nomor HP
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Peran
                  </th>
                  {currentUser?.role === 'SUPER_ADMIN' && (
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Organisasi
                    </th>
                  )}
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Status Akses
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 text-text-secondary rounded-lg">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-text-primary">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary text-sm">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'SUPER_ADMIN'
                          ? 'bg-danger-soft text-danger-text'
                          : user.role === 'ADMIN_DAERAH'
                          ? 'bg-warning-soft text-warning-text'
                          : user.role === 'ENUMERATOR'
                          ? 'bg-primary-soft text-primary-text'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    {currentUser?.role === 'SUPER_ADMIN' && (
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary text-sm">
                        {user.organizationName || <span className="text-text-muted italic">Tidak ada</span>}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={user.id === currentUser?.id}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                          user.isActive ? 'bg-success' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            user.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-soft rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          disabled={user.id === currentUser?.id}
                          className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger-soft rounded-md transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
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
                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap pengguna"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Nomor HP (Login) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center">
                  <Key className="w-3.5 h-3.5 mr-1" />
                  Password {editingUser && '(Kosongkan jika tidak diubah)'} *
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? '••••••••' : 'Password minimal 6 karakter'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Peran / Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  >
                    {currentUser?.role === 'SUPER_ADMIN' && (
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    )}
                    <option value="ADMIN_DAERAH">ADMIN_DAERAH</option>
                    <option value="ANALIS">ANALIS</option>
                    <option value="ENUMERATOR">ENUMERATOR (Pengisi Survei Lapangan)</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </div>

                {currentUser?.role === 'SUPER_ADMIN' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Afiliasi Organisasi *
                    </label>
                    <select
                      required
                      value={formData.organizationId}
                      onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    >
                      <option value="">Pilih Organisasi...</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                )}
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
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-surface rounded-xl shadow-lg border border-border p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-danger-soft text-danger rounded-full flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-text-primary">
                  Hapus Akun Pengguna?
                </h3>
                <p className="text-sm text-text-secondary">
                  Apakah Anda yakin ingin menghapus akun milik <strong>{deletingUser.name}</strong>? Pengguna ini tidak akan bisa login lagi ke sistem. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
              <button
                disabled={deleteSubmitting}
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                disabled={deleteSubmitting}
                onClick={handleDeleteUser}
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
