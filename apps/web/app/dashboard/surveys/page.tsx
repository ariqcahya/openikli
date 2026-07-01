'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileSpreadsheet,
  Plus,
  Edit,
  Trash2,
  Copy,
  Calendar,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Eye,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  year: number;
  periodLabel: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ANALYZED' | 'ARCHIVED';
  scoringScale: number;
  startDate: string | null;
  endDate: string | null;
  createdBy: string | null;
  organizationId: string;
  organization?: {
    name: string;
  };
  _count?: {
    questions: number;
    responses: number;
  };
}

export default function SurveysPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: '2026',
    periodLabel: '',
    scoringScale: '5',
    startDate: '',
    endDate: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Actions States
  const [deletingSurvey, setDeletingSurvey] = useState<Survey | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const checkAccessAndLoad = async () => {
    try {
      setLoading(true);
      setError(null);

      const sessionRes = await fetch('/api/auth/session');
      if (!sessionRes.ok) {
        router.push('/login');
        return;
      }
      const sessionData = await sessionRes.json();
      if (!sessionData.session) {
        router.push('/login');
        return;
      }

      setCurrentUser(sessionData.session);

      await fetchSurveys();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    try {
      const res = await fetch('/api/surveys');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal memuat data survei');
      }
      const data = await res.json();
      setSurveys(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    checkAccessAndLoad();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSurvey(null);
    setFormData({
      title: '',
      description: '',
      year: '2026',
      periodLabel: 'Tahun 2026',
      scoringScale: '5',
      startDate: '',
      endDate: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Judul survei wajib diisi.');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);

      const url = editingSurvey ? `/api/surveys/${editingSurvey.id}` : '/api/surveys';
      const method = editingSurvey ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Terjadi kesalahan saat menyimpan data.');
      }

      await fetchSurveys();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setDuplicatingId(id);
      const res = await fetch(`/api/surveys/${id}/duplicate`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menduplikasi survei');
      }
      await fetchSurveys();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingSurvey) return;
    try {
      setDeleteSubmitting(true);
      const res = await fetch(`/api/surveys/${deletingSurvey.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus survei');
      }
      await fetchSurveys();
      setDeletingSurvey(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const getStatusBadge = (status: Survey['status']) => {
    const styles = {
      DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
      ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CLOSED: 'bg-amber-50 text-amber-700 border-amber-200',
      ANALYZED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      ARCHIVED: 'bg-slate-200 text-slate-800 border-slate-300',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const isReadOnly = currentUser?.role === 'VIEWER';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-text-secondary">Memuat data survei...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-danger-soft border border-danger/10 text-danger-text rounded-xl flex items-start max-w-2xl">
        <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold">Gagal memuat data</h4>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={checkAccessAndLoad}
            className="mt-3 px-3 py-1.5 bg-danger text-white text-xs font-medium rounded-lg hover:bg-danger-hover transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const isSuperAdminWithoutOrg = currentUser?.role === 'SUPER_ADMIN' && !currentUser?.organizationId;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Kelola Survei</h1>
          <p className="text-sm text-text-secondary mt-1">
            Buat dan kelola instrumen kuesioner survei IKLI untuk daerah/organisasi Anda.
          </p>
        </div>

        {!isReadOnly && !isSuperAdminWithoutOrg && (
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Survei Baru
          </button>
        )}
      </div>

      {isSuperAdminWithoutOrg && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start">
          <Building2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-amber-700" />
          <div>
            <h4 className="font-semibold">Pilih Organisasi Terlebih Dahulu</h4>
            <p className="text-sm mt-1 text-amber-800">
              Sebagai Super Admin, silakan pilih salah satu konteks organisasi di topbar switcher terlebih dahulu untuk mengelola atau membuat kuesioner survei baru.
            </p>
          </div>
        </div>
      )}

      {surveys.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-xl">
          <FileSpreadsheet className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary">Belum Ada Survei</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
            Daftar instrumen survei masih kosong. Mulai dengan membuat draf kuesioner pertama Anda.
          </p>
          {!isReadOnly && !isSuperAdminWithoutOrg && (
            <button
              onClick={handleOpenAddModal}
              className="mt-6 inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Survei Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Judul & Tahun Survei
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Afiliasi Organisasi
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Pertanyaan
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Responden
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {surveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary text-sm">{survey.title}</span>
                        <div className="flex items-center text-xs text-text-muted mt-1 space-x-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {survey.periodLabel} ({survey.year})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary text-sm">
                      {survey.organization?.name || 'Global'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(survey.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-primary font-medium text-sm">
                      {survey._count?.questions || 0} Pertanyaan
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary text-sm">
                      {survey._count?.responses || 0} Terisi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/surveys/${survey.id}`)}
                          className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-soft rounded-md transition-colors"
                          title="Workspace & Desainer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!isReadOnly && (
                          <>
                            <button
                              disabled={duplicatingId === survey.id}
                              onClick={() => handleDuplicate(survey.id)}
                              className="p-1.5 text-text-secondary hover:text-success hover:bg-success-soft rounded-md transition-colors disabled:opacity-50"
                              title="Duplikat Kuesioner"
                            >
                              {duplicatingId === survey.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-success" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setDeletingSurvey(survey)}
                              className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger-soft rounded-md transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
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
                {editingSurvey ? 'Edit Survei' : 'Tambah Survei Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-secondary p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                Hapus
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
                  Judul Survei *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Survei Kepuasan Layanan Jalan & Jembatan"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Tuliskan tujuan atau petunjuk pengisian survei..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Tahun *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Skala Penilaian *
                  </label>
                  <select
                    value={formData.scoringScale}
                    onChange={(e) => setFormData({ ...formData, scoringScale: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  >
                    <option value="4">Skala 4</option>
                    <option value="5">Skala 5</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Label Periode *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Triwulan I, Semester II, Tahunan"
                  value={formData.periodLabel}
                  onChange={(e) => setFormData({ ...formData, periodLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Survei'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 text-danger">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Hapus Survei?</h3>
            </div>
            <p className="text-sm text-text-secondary mt-3">
              Apakah Anda yakin ingin menghapus survei <strong>{deletingSurvey.title}</strong>? Aksi ini akan menghapus seluruh data pertanyaan dan respons terkait secara permanen dan tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setDeletingSurvey(null)}
                className="px-4 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteSubmitting}
                className="px-4 py-2 bg-danger hover:bg-danger-hover text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                {deleteSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
