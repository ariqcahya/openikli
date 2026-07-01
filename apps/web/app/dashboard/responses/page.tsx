'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ChevronDown,
  Trash2,
  ExternalLink,
  Eye,
  Plus,
  MapPin,
  ClipboardList,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  status: string;
  year: number;
  periodLabel: string;
  _count?: {
    questions: number;
    responses: number;
  };
}

interface SurveyAnswer {
  id: string;
  question: {
    questionText: string;
    indicatorCode: string;
    indicatorName: string;
    questionType: string;
  };
  ratingValue: number | null;
  textValue: string | null;
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  createdAt: string;
  region: { name: string; level: string } | null;
  infrastructureType: { name: string; code: string } | null;
  respondentAge: number | null;
  respondentGender: string | null;
  respondentJob: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  notes: string | null;
  isEnumeratorInput: boolean;
  answers: SurveyAnswer[];
}

export default function ResponsesPage() {
  const [session, setSession] = useState<any>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isAdmin = session?.role === 'SUPER_ADMIN' || session?.role === 'ADMIN_DAERAH';
  const isEnumerator = session?.role === 'ENUMERATOR';

  // Fetch Session profile
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setSession(data.session);
          }
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      }
    }
    loadSession();
  }, []);

  // Fetch Surveys list
  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await fetch('/api/surveys');
        if (res.ok) {
          const data = await res.json();
          setSurveys(data);
          if (data.length > 0) {
            setSelectedSurveyId(data[0].id);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Failed to fetch surveys:', err);
      }
    }
    fetchSurveys();
  }, []);

  // Fetch Responses for selected survey
  useEffect(() => {
    async function fetchResponses() {
      if (!selectedSurveyId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/surveys/${selectedSurveyId}/responses`);
        if (res.ok) {
          const data = await res.json();
          setResponses(data);
        }
      } catch (err) {
        console.error('Failed to fetch responses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResponses();
  }, [selectedSurveyId]);

  // Handle delete response
  const handleDeleteResponse = async (responseId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data respons ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/responses/${responseId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setResponses((prev) => prev.filter((r) => r.id !== responseId));
      } else {
        alert('Gagal menghapus respons.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan sistem.');
    }
  };

  const activeSurveys = surveys.filter((s) => s.status === 'ACTIVE');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
            {isEnumerator ? 'Mode Enumerator' : 'Data Responden'}
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">
            {isEnumerator
              ? 'Kelola input kuesioner lapangan Anda dan lihat riwayat kontribusi.'
              : 'Pantau seluruh tanggapan masyarakat, lakukan ekspor data, dan kelola kualitas masukan.'}
          </p>
        </div>
      </div>

      {isEnumerator ? (
        // ==========================================
        // ENUMERATOR MODE
        // ==========================================
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Surveys for Input */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              <span>Pilih Survei Lapangan</span>
            </h3>
            {activeSurveys.length === 0 ? (
              <div className="bg-surface border border-border p-6 rounded-xl text-center text-xs text-text-secondary">
                Tidak ada instrumen survei lapangan yang aktif saat ini.
              </div>
            ) : (
              activeSurveys.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-surface border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-soft text-success mb-2">
                      ACTIVE
                    </div>
                    <h4 className="text-sm font-bold text-text-primary leading-snug">{srv.title}</h4>
                    <p className="text-xs text-text-secondary mt-1.5">
                      Periode: {srv.periodLabel} ({srv.year})
                    </p>
                  </div>
                  <a
                    href={`/surveys/${srv.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Input Kuesioner Baru
                  </a>
                </div>
              ))
            )}
          </div>

          {/* History Submitted by current Enumerator */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Riwayat Input Saya</span>
            </h3>

            {/* Dropdown to filter response history by survey */}
            {surveys.length > 0 && (
              <div className="flex items-center space-x-2">
                <label className="text-xs text-text-secondary font-medium">Filter Survei:</label>
                <select
                  value={selectedSurveyId}
                  onChange={(e) => setSelectedSurveyId(e.target.value)}
                  className="px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-primary"
                >
                  {surveys.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.year})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {loading ? (
              <div className="bg-surface border border-border p-12 rounded-xl text-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                <p className="text-xs text-text-secondary">Memuat riwayat input...</p>
              </div>
            ) : responses.length === 0 ? (
              <div className="bg-surface border border-border p-12 rounded-xl text-center text-sm text-text-secondary">
                Anda belum pernah memasukkan respons untuk kuesioner ini.
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-border text-left">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Wilayah</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Infrastruktur</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">GPS</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface text-xs text-text-primary">
                    {responses.map((resp) => (
                      <tr key={resp.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(resp.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {resp.region?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {resp.infrastructureType?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary font-mono">
                          {resp.gpsLat && resp.gpsLng
                            ? `${resp.gpsLat.toFixed(4)}, ${resp.gpsLng.toFixed(4)}`
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedResponse(resp);
                              setIsDetailOpen(true);
                            }}
                            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary-hover"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ==========================================
        // ADMIN / ANALIS / VIEWER MODE
        // ==========================================
        <div className="space-y-6">
          {/* Survey Selector & Summary metrics */}
          <div className="bg-surface border border-border p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-md w-full">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                Pilih Instrumen Survei
              </label>
              <select
                value={selectedSurveyId}
                onChange={(e) => setSelectedSurveyId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-primary focus:outline-none focus:border-primary"
              >
                {surveys.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.year} - {s.periodLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-8">
              <div className="text-left">
                <p className="text-xs font-medium text-text-secondary uppercase">Total Respons</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {responses.length}
                </p>
              </div>
              <div className="text-left border-l border-border pl-4 md:pl-8">
                <p className="text-xs font-medium text-text-secondary uppercase">Enumerator Input</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {responses.filter((r) => r.isEnumeratorInput).length}
                </p>
              </div>
              <div className="text-left border-l border-border pl-4 md:pl-8">
                <p className="text-xs font-medium text-text-secondary uppercase">Public Input</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {responses.filter((r) => !r.isEnumeratorInput).length}
                </p>
              </div>
            </div>
          </div>

          {/* Table list */}
          {loading ? (
            <div className="bg-surface border border-border p-12 rounded-xl text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
              <p className="text-xs text-text-secondary">Memuat seluruh tanggapan...</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="bg-surface border border-border p-12 rounded-xl text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <h3 className="text-sm font-bold text-text-primary">Belum Ada Tanggapan</h3>
              <p className="text-xs text-text-secondary mt-1">
                Kuesioner ini belum menerima masukan respon dari masyarakat maupun enumerator.
              </p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-left">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase">Tanggal</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase">Profil</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase">Wilayah & Infrastruktur</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase">GPS</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase">Metode</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface text-xs text-text-primary">
                    {responses.map((resp) => (
                      <tr key={resp.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(resp.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">
                            {resp.respondentJob || 'Umum'}
                          </div>
                          <div className="text-[10px] text-text-secondary mt-0.5">
                            {resp.respondentAge ? `${resp.respondentAge} th` : '-'} | {resp.respondentGender || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-text-primary">
                            {resp.region?.name || '-'}
                          </div>
                          <div className="text-[10px] text-primary font-medium mt-0.5">
                            {resp.infrastructureType?.name || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary font-mono">
                          {resp.gpsLat && resp.gpsLng ? (
                            <a
                              href={`https://maps.google.com/?q=${resp.gpsLat},${resp.gpsLng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center hover:text-primary"
                            >
                              <MapPin className="w-3.5 h-3.5 mr-1 text-primary-text" />
                              {resp.gpsLat.toFixed(5)}, {resp.gpsLng.toFixed(5)}
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {resp.isEnumeratorInput ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-soft text-success">
                              Enumerator
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-soft text-primary">
                              Masyarakat
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedResponse(resp);
                              setIsDetailOpen(true);
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 bg-background border border-border text-text-secondary hover:bg-surface rounded-lg font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Detail
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteResponse(resp.id)}
                              className="inline-flex items-center px-2.5 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg font-semibold transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response Answers Detail Modal */}
      {isDetailOpen && selectedResponse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-background">
              <div>
                <h3 className="text-base font-bold text-text-primary">Detail Jawaban Kuesioner</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  ID Respons: {selectedResponse.id}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedResponse(null);
                }}
                className="text-text-secondary hover:text-text-primary text-sm font-semibold px-3 py-1.5 border border-border rounded-lg"
              >
                Tutup
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Profile Details */}
              <div className="bg-background border border-border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-text-secondary font-medium">Usia / Gender</p>
                  <p className="font-bold text-text-primary mt-0.5">
                    {selectedResponse.respondentAge ? `${selectedResponse.respondentAge} Tahun` : '-'} / {selectedResponse.respondentGender || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary font-medium">Pekerjaan</p>
                  <p className="font-bold text-text-primary mt-0.5">
                    {selectedResponse.respondentJob || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary font-medium">Lokasi Wilayah</p>
                  <p className="font-bold text-text-primary mt-0.5">
                    {selectedResponse.region?.name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary font-medium">Infrastruktur</p>
                  <p className="font-bold text-text-primary mt-0.5">
                    {selectedResponse.infrastructureType?.name || '-'}
                  </p>
                </div>
              </div>

              {/* Answers list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Jawaban Pertanyaan</h4>
                {selectedResponse.answers.length === 0 ? (
                  <p className="text-xs text-text-secondary text-center py-4">Tidak ada jawaban tersimpan.</p>
                ) : (
                  selectedResponse.answers.map((ans, idx) => (
                    <div key={ans.id} className="bg-background border border-border rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-start text-xs font-mono text-text-muted">
                        <span>INDIKATOR: {ans.question.indicatorCode} ({ans.question.indicatorName})</span>
                        <span className="font-bold text-primary">{ans.question.questionType}</span>
                      </div>
                      <p className="text-sm font-semibold text-text-primary">
                        {idx + 1}. {ans.question.questionText}
                      </p>
                      
                      {/* Render Answer Value */}
                      <div className="mt-3 pt-2.5 border-t border-border/50">
                        {ans.question.questionType === 'RATING' ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-text-secondary">Nilai Skor:</span>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                              {ans.ratingValue || '-'}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-text-primary">
                            <span className="text-text-secondary block mb-1">Tanggapan:</span>
                            <span className="font-medium bg-surface px-3 py-2 border border-border rounded-lg block whitespace-pre-wrap">
                              {ans.textValue || '-'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Additional Notes */}
              {selectedResponse.notes && (
                <div className="bg-warning-soft/30 border border-warning/20 rounded-xl p-4 space-y-1">
                  <h4 className="text-xs font-bold text-warning-text flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Catatan Masukan Tambahan
                  </h4>
                  <p className="text-xs text-text-primary whitespace-pre-wrap">
                    {selectedResponse.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
