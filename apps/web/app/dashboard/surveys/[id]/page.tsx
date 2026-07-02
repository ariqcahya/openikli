'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  ListPlus,
  Eye,
  Loader2,
  AlertTriangle,
  Save,
  CheckCircle2,
  Trash2,
  Edit2,
  Plus,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  QrCode,
  Download,
  Copy,
  Info,
  BarChart3,
  Calculator,
  Layers,
  MapPin,
  Activity,
} from 'lucide-react';

interface Question {
  id: string;
  indicatorCode: string;
  indicatorName: string;
  questionText: string;
  questionType: 'RATING' | 'TEXT' | 'TEXTAREA' | 'SELECT' | 'MULTI_SELECT' | 'LOCATION' | 'FILE';
  helpText: string | null;
  weight: number;
  isRequired: boolean;
  options: any; // JSON string or array
  sortOrder: number;
}

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
  settings: any;
  organizationId: string;
  organization?: {
    name: string;
  };
  questions: Question[];
}

export default function SurveyWorkspacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id: surveyId } = params;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'detail' | 'builder' | 'preview' | 'scoring'>('builder');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Scoring State
  const [scores, setScores] = useState<any[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [scoresError, setScoresError] = useState<string | null>(null);

  const fetchScores = async () => {
    try {
      setLoadingScores(true);
      setScoresError(null);
      const res = await fetch(`/api/surveys/${surveyId}/scores`);
      if (!res.ok) {
        throw new Error('Gagal mengambil data skor.');
      }
      const data = await res.json();
      setScores(data);
    } catch (err: any) {
      setScoresError(err.message || 'Terjadi kesalahan saat memuat skor.');
    } finally {
      setLoadingScores(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      setScoresError(null);
      const res = await fetch(`/api/surveys/${surveyId}/recalculate`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menghitung ulang skor.');
      }
      await fetchScores();
      alert('Kalkulasi ulang skor kuesioner berhasil diselesaikan!');
    } catch (err: any) {
      setScoresError(err.message || 'Gagal menghitung ulang skor.');
      alert(err.message || 'Gagal menghitung ulang skor.');
    } finally {
      setRecalculating(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'scoring') {
      fetchScores();
    }
  }, [activeTab]);

  // Detail Form State
  const [detailsForm, setDetailsForm] = useState({
    title: '',
    description: '',
    year: 2026,
    periodLabel: '',
    status: 'DRAFT' as Survey['status'],
    scoringScale: 5,
    startDate: '',
    endDate: '',
  });
  const [savingDetails, setSavingDetails] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Question Form State (Modal)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionForm, setQuestionForm] = useState({
    indicatorCode: '',
    indicatorName: '',
    questionText: '',
    questionType: 'RATING' as Question['questionType'],
    helpText: '',
    weight: '1.0',
    isRequired: true,
    optionsRaw: '', // raw string with options separated by newlines
  });
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  // Load Data
  const loadWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);

      // Session
      const sessionRes = await fetch('/api/auth/session');
      if (!sessionRes.ok) {
        router.push('/login');
        return;
      }
      const sessionData = await sessionRes.json();
      setCurrentUser(sessionData.session);

      // Survey details & questions
      const res = await fetch(`/api/surveys/${surveyId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal memuat survei');
      }
      const data = await res.json();
      setSurvey(data);

      // Populate detail form
      setDetailsForm({
        title: data.title,
        description: data.description || '',
        year: data.year,
        periodLabel: data.periodLabel,
        status: data.status,
        scoringScale: data.scoringScale,
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [surveyId]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === 'VIEWER') return;

    try {
      setSavingDetails(true);
      setSaveError(null);
      setSaveSuccess(false);

      const res = await fetch(`/api/surveys/${surveyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detailsForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan detail survei');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Reload details
      const updated = await res.json();
      setSurvey((prev) => (prev ? { ...prev, ...updated } : null));
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      indicatorCode: '',
      indicatorName: '',
      questionText: '',
      questionType: 'RATING',
      helpText: '',
      weight: '1.0',
      isRequired: true,
      optionsRaw: 'Sangat Buruk\nBuruk\nCukup\nBaik\nSangat Baik',
    });
    setQuestionError(null);
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);

    let rawOptions = '';
    if (q.options) {
      try {
        const parsed = Array.isArray(q.options) ? q.options : JSON.parse(q.options as string);
        rawOptions = parsed.join('\n');
      } catch (_) {
        rawOptions = '';
      }
    }

    setQuestionForm({
      indicatorCode: q.indicatorCode,
      indicatorName: q.indicatorName,
      questionText: q.questionText,
      questionType: q.questionType,
      helpText: q.helpText || '',
      weight: q.weight.toString(),
      isRequired: q.isRequired,
      optionsRaw: rawOptions,
    });
    setQuestionError(null);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === 'VIEWER') return;

    if (!questionForm.indicatorCode.trim() || !questionForm.indicatorName.trim() || !questionForm.questionText.trim()) {
      setQuestionError('Indikator, Nama Indikator, dan Teks Pertanyaan wajib diisi.');
      return;
    }

    try {
      setSavingQuestion(true);
      setQuestionError(null);

      // Parse options
      let options: string[] | null = null;
      if (['SELECT', 'MULTI_SELECT'].includes(questionForm.questionType)) {
        options = questionForm.optionsRaw
          .split('\n')
          .map((opt) => opt.trim())
          .filter((opt) => opt.length > 0);

        if (options.length === 0) {
          setQuestionError('Pilihan opsi wajib diisi untuk jenis pertanyaan SELECT/MULTI_SELECT.');
          setSavingQuestion(false);
          return;
        }
      }

      const payload = {
        indicatorCode: questionForm.indicatorCode,
        indicatorName: questionForm.indicatorName,
        questionText: questionForm.questionText,
        questionType: questionForm.questionType,
        helpText: questionForm.helpText || null,
        weight: parseFloat(questionForm.weight) || 1.0,
        isRequired: questionForm.isRequired,
        options: options ? JSON.stringify(options) : null,
      };

      const url = editingQuestion
        ? `/api/surveys/${surveyId}/questions/${editingQuestion.id}`
        : `/api/surveys/${surveyId}/questions`;
      const method = editingQuestion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan pertanyaan');
      }

      // Reload survey data
      const refreshRes = await fetch(`/api/surveys/${surveyId}`);
      const refreshedSurvey = await refreshRes.json();
      setSurvey(refreshedSurvey);

      setIsQuestionModalOpen(false);
    } catch (err: any) {
      setQuestionError(err.message);
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (currentUser?.role === 'VIEWER') return;
    if (!confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) return;

    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions/${qId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus pertanyaan');
      }

      setSurvey((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          questions: prev.questions.filter((q) => q.id !== qId),
        };
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReorder = async (direction: 'up' | 'down', index: number) => {
    if (currentUser?.role === 'VIEWER' || !survey) return;

    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= survey.questions.length) return;

    const updatedQuestions = [...survey.questions];
    // Swap
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[nextIndex];
    updatedQuestions[nextIndex] = temp;

    // Set temporary state for fast UI feedback
    setSurvey({
      ...survey,
      questions: updatedQuestions,
    });

    // Save to API
    try {
      const orders = updatedQuestions.map((q, idx) => ({
        id: q.id,
        sortOrder: idx + 1,
      }));

      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui urutan pertanyaan');
      }
    } catch (err: any) {
      alert(err.message);
      // Reload on error to sync state
      loadWorkspace();
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Tautan disalin ke papan klip!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-text-secondary">Memuat workspace kuesioner...</p>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="p-4 bg-danger-soft border border-danger/10 text-danger-text rounded-xl flex items-start max-w-2xl">
        <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold">Gagal memuat kuesioner</h4>
          <p className="text-sm mt-1">{error || 'Detail survei tidak ditemukan.'}</p>
          <button
            onClick={loadWorkspace}
            className="mt-3 px-3 py-1.5 bg-danger text-white text-xs font-medium rounded-lg hover:bg-danger-hover transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const publicLinkUrl = typeof window !== 'undefined' ? `${window.location.origin}/surveys/${survey.id}` : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicLinkUrl)}`;
  const isReadOnly = currentUser?.role === 'VIEWER';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/dashboard/surveys')}
            className="p-2 border border-border rounded-lg bg-surface hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-text-primary">{survey.title}</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                {survey.status}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Organisasi: {survey.organization?.name || 'Global'} | Periode: {survey.periodLabel} ({survey.year})
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-border w-fit">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'builder'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <ListPlus className="w-4 h-4 mr-2" />
            Desain Pertanyaan
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Pratinjau Form
          </button>
          <button
            onClick={() => setActiveTab('scoring')}
            className={`flex items-center px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'scoring'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Hasil & Scoring
          </button>
          <button
            onClick={() => setActiveTab('detail')}
            className={`flex items-center px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'detail'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan & Distribusi
          </button>
        </div>
      </div>

      {/* Tab CONTENT: builder */}
      {activeTab === 'builder' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Struktur Kuesioner</h2>
              <p className="text-xs text-text-secondary">
                Atur pertanyaan, bobot penilaian (weight) untuk skor IKLI, dan indikator kuesioner.
              </p>
            </div>
            {!isReadOnly && (
              <button
                onClick={handleOpenAddQuestion}
                className="inline-flex items-center px-3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Pertanyaan
              </button>
            )}
          </div>

          {survey.questions.length === 0 ? (
            <div className="text-center py-16 bg-surface border border-border rounded-xl">
              <ListPlus className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <h4 className="text-sm font-medium text-text-primary">Kuesioner Masih Kosong</h4>
              <p className="text-xs text-text-secondary mt-1">
                Mulailah menyusun kuesioner dengan menambahkan kriteria penilaian pertama Anda.
              </p>
              {!isReadOnly && (
                <button
                  onClick={handleOpenAddQuestion}
                  className="mt-4 inline-flex items-center px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Tambah Pertanyaan Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {survey.questions.map((q, idx) => {
                let optionsList: string[] = [];
                if (q.options) {
                  try {
                    optionsList = Array.isArray(q.options) ? q.options : JSON.parse(q.options as string);
                  } catch (_) {}
                }

                return (
                  <div
                    key={q.id}
                    className="p-5 bg-surface border border-border rounded-xl flex items-start space-x-4 shadow-sm hover:border-slate-300 transition-colors"
                  >
                    {/* Position / Sorting controls */}
                    {!isReadOnly && (
                      <div className="flex flex-col items-center space-y-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorder('up', idx)}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-text-secondary"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-text-secondary">{idx + 1}</span>
                        <button
                          disabled={idx === survey.questions.length - 1}
                          onClick={() => handleReorder('down', idx)}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-text-secondary"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[10px] font-semibold rounded uppercase">
                          Indikator: {q.indicatorCode}
                        </span>
                        <span className="px-2 py-0.5 bg-primary-soft text-primary-text text-[10px] font-semibold rounded">
                          {q.questionType}
                        </span>
                        {q.isRequired && (
                          <span className="text-[10px] bg-red-50 border border-red-200 text-red-700 px-1.5 py-0.5 rounded font-medium">
                            Wajib
                          </span>
                        )}
                        <span className="text-[10px] text-text-secondary font-medium">
                          Bobot: <strong>{q.weight}</strong>
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-text-primary">{q.questionText}</h4>
                      {q.helpText && (
                        <p className="text-xs text-text-secondary italic flex items-center">
                          <Info className="w-3.5 h-3.5 mr-1 text-text-muted" />
                          {q.helpText}
                        </p>
                      )}

                      {/* Display options if SELECT/MULTI_SELECT */}
                      {['SELECT', 'MULTI_SELECT'].includes(q.questionType) && optionsList.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {optionsList.map((opt, oIdx) => (
                            <span
                              key={oIdx}
                              className="px-2 py-1 bg-slate-50 border border-border text-xs rounded text-text-secondary"
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {!isReadOnly && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditQuestion(q)}
                          className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-soft rounded-md transition-colors"
                          title="Edit Pertanyaan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger-soft rounded-md transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab CONTENT: preview */}
      {activeTab === 'preview' && (
        <div className="bg-slate-50 border border-border rounded-xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 border-b border-border pb-5">
            <h2 className="text-xl font-bold text-text-primary text-center">{survey.title}</h2>
            {survey.description && (
              <p className="text-sm text-text-secondary text-center whitespace-pre-line">{survey.description}</p>
            )}
          </div>

          <div className="space-y-6">
            {survey.questions.map((q, idx) => {
              let optionsList: string[] = [];
              if (q.options) {
                try {
                  optionsList = Array.isArray(q.options) ? q.options : JSON.parse(q.options as string);
                } catch (_) {}
              }

              return (
                <div key={q.id} className="bg-surface p-5 border border-border rounded-xl space-y-3 shadow-sm">
                  <label className="block text-sm font-semibold text-text-primary">
                    {idx + 1}. {q.questionText} {q.isRequired && <span className="text-danger">*</span>}
                  </label>
                  {q.helpText && <p className="text-xs text-text-secondary">{q.helpText}</p>}

                  {/* Rendering mock fields */}
                  {q.questionType === 'RATING' && (
                    <div className="flex items-center space-x-2 pt-2">
                      {[1, 2, 3, 4, 5].slice(0, survey.scoringScale).map((score) => (
                        <button
                          key={score}
                          type="button"
                          className="w-10 h-10 border border-border hover:border-primary rounded-lg flex items-center justify-center font-bold text-sm text-text-secondary hover:text-primary hover:bg-primary-soft transition-all"
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.questionType === 'TEXT' && (
                    <input
                      type="text"
                      disabled
                      placeholder="Respon jawaban pendek..."
                      className="w-full px-3 py-2 border border-border bg-slate-50 rounded-lg text-sm text-text-muted cursor-not-allowed"
                    />
                  )}

                  {q.questionType === 'TEXTAREA' && (
                    <textarea
                      disabled
                      rows={2}
                      placeholder="Respon deskripsi panjang..."
                      className="w-full px-3 py-2 border border-border bg-slate-50 rounded-lg text-sm text-text-muted cursor-not-allowed resize-none"
                    />
                  )}

                  {q.questionType === 'SELECT' && (
                    <select
                      disabled
                      className="w-full px-3 py-2 border border-border bg-slate-50 rounded-lg text-sm text-text-muted cursor-not-allowed"
                    >
                      <option>Pilih salah satu opsi...</option>
                      {optionsList.map((opt, oIdx) => (
                        <option key={oIdx}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {q.questionType === 'MULTI_SELECT' && (
                    <div className="space-y-1.5 pt-1">
                      {optionsList.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center space-x-2 text-sm text-text-secondary">
                          <input type="checkbox" disabled className="rounded border-border text-primary cursor-not-allowed" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.questionType === 'LOCATION' && (
                    <div className="p-4 border border-dashed border-border rounded-lg bg-slate-50 flex items-center justify-center text-xs text-text-muted font-medium">
                      Simulasi Deteksi Lokasi Koordinat (GPS) Responden
                    </div>
                  )}

                  {q.questionType === 'FILE' && (
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-2 border border-border rounded-lg bg-slate-50 text-xs font-semibold text-text-secondary cursor-not-allowed">
                        Pilih Berkas Lampiran Gambar/Dokumen
                      </div>
                      <span className="text-xs text-text-muted">Tidak ada berkas dipilih</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              disabled
              className="px-6 py-2.5 bg-primary/50 text-white font-medium rounded-lg text-sm cursor-not-allowed"
            >
              Simulasikan Kirim Kuesioner
            </button>
          </div>
        </div>
      )}

      {/* Tab CONTENT: detail */}
      {activeTab === 'detail' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings form */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Pengaturan Informasi Kuesioner</h3>
              <p className="text-xs text-text-secondary">Perbarui metadata dasar dan parameter periode aktif survei.</p>
            </div>

            <form onSubmit={handleSaveDetails} className="space-y-4">
              {saveError && (
                <div className="p-3 bg-danger-soft border border-danger/10 text-danger-text text-sm rounded-lg flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>{saveError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-success-soft border border-success/10 text-success-text text-sm rounded-lg flex items-center animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span>Detail kuesioner berhasil diperbarui!</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status Survei *
                </label>
                <select
                  disabled={isReadOnly}
                  value={detailsForm.status}
                  onChange={(e) => setDetailsForm({ ...detailsForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="DRAFT">DRAFT (Dalam Penyusunan)</option>
                  <option value="ACTIVE">ACTIVE (Menerima Respons Publik)</option>
                  <option value="CLOSED">CLOSED (Formulir Ditutup)</option>
                  <option value="ANALYZED">ANALYZED (Selesai Dianalisis AI)</option>
                  <option value="ARCHIVED">ARCHIVED (Diarsipkan/Riwayat)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Judul Survei *
                </label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={detailsForm.title}
                  onChange={(e) => setDetailsForm({ ...detailsForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Deskripsi
                </label>
                <textarea
                  disabled={isReadOnly}
                  value={detailsForm.description}
                  onChange={(e) => setDetailsForm({ ...detailsForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Tahun Kuesioner *
                  </label>
                  <input
                    type="number"
                    required
                    disabled={isReadOnly}
                    value={detailsForm.year}
                    onChange={(e) => setDetailsForm({ ...detailsForm, year: parseInt(e.target.value, 10) || 2026 })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Skala Penilaian *
                  </label>
                  <select
                    disabled={isReadOnly}
                    value={detailsForm.scoringScale}
                    onChange={(e) => setDetailsForm({ ...detailsForm, scoringScale: parseInt(e.target.value, 10) || 5 })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  disabled={isReadOnly}
                  value={detailsForm.periodLabel}
                  onChange={(e) => setDetailsForm({ ...detailsForm, periodLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    disabled={isReadOnly}
                    value={detailsForm.startDate}
                    onChange={(e) => setDetailsForm({ ...detailsForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    disabled={isReadOnly}
                    value={detailsForm.endDate}
                    onChange={(e) => setDetailsForm({ ...detailsForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {!isReadOnly && (
                <div className="flex justify-end pt-4 border-t border-border mt-4">
                  <button
                    type="submit"
                    disabled={savingDetails}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
                  >
                    {savingDetails ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Distribution card */}
          <div className="bg-surface border border-border rounded-xl shadow-sm p-6 space-y-6 h-fit">
            <div>
              <h3 className="text-base font-bold text-text-primary">Distribusi Publik</h3>
              <p className="text-xs text-text-secondary">Gunakan tautan atau QR code untuk mengumpulkan tanggapan masyarakat.</p>
            </div>

            {survey.status !== 'ACTIVE' ? (
              <div className="p-4 bg-slate-50 border border-border rounded-xl flex items-start text-xs text-text-secondary">
                <Info className="w-4 h-4 mr-2 text-text-muted mt-0.5 flex-shrink-0" />
                <span>
                  Tautan kuesioner publik belum aktif. Aktifkan status survei menjadi <strong>ACTIVE</strong> untuk mulai mengumpulkan jawaban dari masyarakat.
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Public Link */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                    Tautan Formulir Publik
                  </span>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={publicLinkUrl}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-border text-xs rounded-lg text-text-secondary focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyToClipboard(publicLinkUrl)}
                      className="p-1.5 border border-border bg-surface hover:bg-slate-50 rounded-lg text-text-secondary transition-colors"
                      title="Salin Tautan"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={publicLinkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 border border-border bg-surface hover:bg-slate-50 rounded-lg text-text-secondary transition-colors flex items-center justify-center"
                      title="Buka Formulir"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* QR Code generator */}
                <div className="space-y-2 pt-2 flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider self-start">
                    QR Code Formulir
                  </span>
                  <div className="p-3 border border-border bg-white rounded-xl shadow-sm">
                    <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 object-contain" />
                  </div>
                  <a
                    href={qrCodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-border text-xs font-semibold rounded-lg text-text-secondary bg-surface hover:bg-slate-50 transition-colors shadow-sm mt-1"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Unduh Gambar QR
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab CONTENT: scoring */}
      {activeTab === 'scoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Overall score card */}
            <div className="lg:col-span-1 bg-surface border border-border rounded-xl shadow-sm p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary mb-1">Indeks IKLI Keseluruhan</h3>
                <p className="text-xs text-text-secondary mb-6">Nilai rata-rata tertimbang terkonversi dari seluruh tanggapan.</p>
                
                {loadingScores ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                    <p className="text-xs text-text-secondary">Memuat skor...</p>
                  </div>
                ) : (
                  (() => {
                    const totalScoreRecord = scores.find(
                      (s) => s.indicatorCode === 'ALL' && s.regionId === null && s.infrastructureTypeId === null
                    );
                    if (totalScoreRecord) {
                      return (
                        <div className="text-center py-6">
                          <div className="text-6xl font-black text-primary tracking-tight">
                            {totalScoreRecord.score100.toFixed(2)}
                          </div>
                          <div className="text-sm font-semibold text-text-secondary mt-1">
                            Skala 0 - 100
                          </div>
                          <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary-soft text-primary">
                            {totalScoreRecord.category}
                          </div>
                          <div className="text-xs text-text-muted mt-6">
                            Berdasarkan {totalScoreRecord.responseCount} responden
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="text-center py-10 bg-slate-50 border border-dashed border-border rounded-xl">
                        <Activity className="w-8 h-8 text-text-muted mx-auto mb-2" />
                        <p className="text-xs text-text-secondary">Belum ada kalkulasi skor</p>
                      </div>
                    );
                  })()
                )}
              </div>

              {(() => {
                const totalScoreRecord = scores.find(
                  (s) => s.indicatorCode === 'ALL' && s.regionId === null && s.infrastructureTypeId === null
                );
                if (totalScoreRecord) {
                  return (
                    <div className="text-[10px] text-text-muted border-t border-border pt-4 mt-4 self-stretch flex justify-between">
                      <span>Waktu Perhitungan:</span>
                      <span>{new Date(totalScoreRecord.calculatedAt).toLocaleString('id-ID')}</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Right: Controls & Formulas */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-xl shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-text-primary">Mesin Kalkulasi & Parameter</h3>
                <p className="text-xs text-text-secondary">Picu kalkulasi ulang berdasarkan entri data jawaban terbaru di database.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-border rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-text-primary">Kalkulasi Ulang (Recalculate)</h4>
                    <p className="text-xs text-text-secondary">
                      Proses ini akan menghapus cache lama dan menghitung ulang seluruh indikator, infrastruktur, wilayah, dan indeks total.
                    </p>
                  </div>
                  <button
                    onClick={handleRecalculate}
                    disabled={recalculating || loadingScores}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50 flex-shrink-0"
                  >
                    {recalculating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menghitung...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Mulai Kalkulasi
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-secondary">
                <div className="border border-border p-4 rounded-xl space-y-2">
                  <span className="font-bold text-text-primary block">1. Konversi Skala 100</span>
                  <p>Rating pilihan responden ($R$) dikonversi ke skala 100 dengan batas skala maksimum ($S$):</p>
                  <code className="block bg-slate-50 p-2 rounded border text-text-primary font-mono text-[10px] text-center">
                    Skor = ((R - 1) / (S - 1)) * 100
                  </code>
                </div>

                <div className="border border-border p-4 rounded-xl space-y-2">
                  <span className="font-bold text-text-primary block">2. Rata-rata Tertimbang</span>
                  <p>Agregasi skor menggunakan bobot pertanyaan ($W_i$) dan rating kuesioner ($R_i$):</p>
                  <code className="block bg-slate-50 p-2 rounded border text-text-primary font-mono text-[10px] text-center">
                    Weighted Avg = Sum(R_i * W_i) / Sum(W_i)
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown sections */}
          <div className="grid grid-cols-1 gap-6">
            {/* Indicators table */}
            <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-base font-bold text-text-primary">Breakdown Skor per Indikator</h3>
                <p className="text-xs text-text-secondary">Rincian nilai indeks per indikator pertanyaan kuesioner.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border">
                      <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Kode Indikator</th>
                      <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Nilai Raw</th>
                      <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Nilai Skala 100</th>
                      <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Responden</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm text-text-primary">
                    {(() => {
                      const indicatorScores = scores.filter(
                        (s) => s.indicatorCode !== 'ALL' && s.regionId === null && s.infrastructureTypeId === null
                      );
                      if (indicatorScores.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-text-muted">
                              Belum ada data skor indikator. Klik Kalkulasi untuk memproses data.
                            </td>
                          </tr>
                        );
                      }
                      return indicatorScores.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3.5 font-semibold font-mono text-xs">{s.indicatorCode}</td>
                          <td className="px-6 py-3.5">{s.scoreRaw.toFixed(2)}</td>
                          <td className="px-6 py-3.5 font-bold text-primary">{s.score100.toFixed(2)}</td>
                          <td className="px-6 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 border text-slate-700">
                              {s.category}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-text-secondary">{s.responseCount}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Two column grid: Infra and Region */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Infrastructure */}
              <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-base font-bold text-text-primary">Breakdown Skor per Infrastruktur</h3>
                  <p className="text-xs text-text-secondary">Rincian nilai berdasarkan kategori infrastruktur yang bersangkutan.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border">
                        <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Infrastruktur</th>
                        <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Nilai 100</th>
                        <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Responden</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm text-text-primary">
                      {(() => {
                        const infraScores = scores.filter(
                          (s) => s.indicatorCode === 'ALL' && s.regionId === null && s.infrastructureTypeId !== null
                        );
                        if (infraScores.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-text-muted">
                                Belum ada data infrastruktur.
                              </td>
                            </tr>
                          );
                        }
                        return infraScores.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3.5 font-bold flex items-center">
                              <Layers className="w-4 h-4 mr-2 text-text-muted" />
                              {s.infrastructureType?.name || 'Lainnya'}
                            </td>
                            <td className="px-6 py-3.5 font-bold text-primary">{s.score100.toFixed(2)}</td>
                            <td className="px-6 py-3.5">{s.category}</td>
                            <td className="px-6 py-3.5 text-text-secondary">{s.responseCount}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regions */}
              <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-base font-bold text-text-primary">Breakdown Skor per Wilayah</h3>
                  <p className="text-xs text-text-secondary">Rincian sebaran nilai IKLI berdasarkan wilayah administrasi.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border">
                        <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Wilayah</th>
                        <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Nilai 100</th>
                        <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Responden</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm text-text-primary">
                      {(() => {
                        const regionScores = scores.filter(
                          (s) => s.indicatorCode === 'ALL' && s.regionId !== null && s.infrastructureTypeId === null
                        );
                        if (regionScores.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-text-muted">
                                Belum ada data wilayah.
                              </td>
                            </tr>
                          );
                        }
                        return regionScores.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3.5 font-bold flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-text-muted" />
                              {s.region?.name || 'Tidak Diketahui'}
                            </td>
                            <td className="px-6 py-3.5 font-bold text-primary">{s.score100.toFixed(2)}</td>
                            <td className="px-6 py-3.5">{s.category}</td>
                            <td className="px-6 py-3.5 text-text-secondary">{s.responseCount}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-surface rounded-xl shadow-lg border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-text-primary text-lg">
                {editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
              </h3>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="text-text-muted hover:text-text-secondary p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                Hapus
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 space-y-4">
              {questionError && (
                <div className="p-3 bg-danger-soft border border-danger/10 text-danger-text text-sm rounded-lg flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>{questionError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Kode Indikator *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: JALAN_01"
                    value={questionForm.indicatorCode}
                    onChange={(e) => setQuestionForm({ ...questionForm, indicatorCode: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Nama Indikator *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kondisi Fisik Jalan"
                    value={questionForm.indicatorName}
                    onChange={(e) => setQuestionForm({ ...questionForm, indicatorName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Teks Pertanyaan *
                </label>
                <textarea
                  required
                  placeholder="Bagaimana kondisi kelayakan jalan raya di daerah Anda?"
                  value={questionForm.questionText}
                  onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Petunjuk Pengisian / Sub-Teks
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pilih 1 untuk Sangat Rusak s.d. 5 untuk Sangat Mulus"
                  value={questionForm.helpText}
                  onChange={(e) => setQuestionForm({ ...questionForm, helpText: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Jenis Pertanyaan *
                  </label>
                  <select
                    value={questionForm.questionType}
                    onChange={(e) => setQuestionForm({ ...questionForm, questionType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  >
                    <option value="RATING">RATING (Penilaian Skala Angka)</option>
                    <option value="TEXT">TEXT (Jawaban Pendek)</option>
                    <option value="TEXTAREA">TEXTAREA (Deskripsi Panjang)</option>
                    <option value="SELECT">SELECT (Pilihan Tunggal Dropdown)</option>
                    <option value="MULTI_SELECT">MULTI_SELECT (Pilihan Ganda Checkbox)</option>
                    <option value="LOCATION">LOCATION (Deteksi Koordinat/GPS)</option>
                    <option value="FILE">FILE (Lampiran Berkas/Gambar)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Bobot Penilaian (Weight) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={questionForm.weight}
                    onChange={(e) => setQuestionForm({ ...questionForm, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isRequired-check"
                  checked={questionForm.isRequired}
                  onChange={(e) => setQuestionForm({ ...questionForm, isRequired: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="isRequired-check" className="text-sm font-semibold text-text-secondary cursor-pointer">
                  Pertanyaan ini Wajib Diisi (Required)
                </label>
              </div>

              {/* Options display conditionally for SELECT/MULTI_SELECT */}
              {['SELECT', 'MULTI_SELECT'].includes(questionForm.questionType) && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Pilihan Opsi (Satu opsi per baris) *
                  </label>
                  <textarea
                    required
                    placeholder="Sangat Cepat&#10;Cukup Cepat&#10;Lambat"
                    value={questionForm.optionsRaw}
                    onChange={(e) => setQuestionForm({ ...questionForm, optionsRaw: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingQuestion}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
                >
                  {savingQuestion ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Pertanyaan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
