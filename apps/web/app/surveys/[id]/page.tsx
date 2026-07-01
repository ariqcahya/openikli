'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin,
  User,
  CheckCircle2,
  Building2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Calendar,
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
  options: string[] | any;
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  year: number;
  periodLabel: string;
  status: string;
  scoringScale: number;
  organizationId: string;
  organization?: {
    name: string;
  };
}

interface Region {
  id: string;
  name: string;
  parentId: string | null;
  level: string;
}

interface InfrastructureType {
  id: string;
  name: string;
  code: string;
}

export default function PublicSurveyFormPage() {
  const { id: surveyId } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [infrastructureTypes, setInfrastructureTypes] = useState<InfrastructureType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [regionId, setRegionId] = useState('');
  const [infrastructureTypeId, setInfrastructureTypeId] = useState('');
  const [respondentAge, setRespondentAge] = useState('');
  const [respondentGender, setRespondentGender] = useState('');
  const [respondentJob, setRespondentJob] = useState('');
  const [gpsLat, setGpsLat] = useState<number | null>(null);
  const [gpsLng, setGpsLng] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Question Answers State
  const [answers, setAnswers] = useState<Record<string, { ratingValue?: number; textValue?: string }>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch Survey Detail
        const surveyRes = await fetch(`/api/surveys/${surveyId}`);
        if (!surveyRes.ok) {
          throw new Error('Gagal memuat kuesioner. Pastikan URL benar.');
        }
        const surveyData = await surveyRes.json();
        
        if (surveyData.status !== 'ACTIVE') {
          setError('Kuesioner ini saat ini sedang tidak aktif atau ditutup untuk umum.');
          setLoading(false);
          return;
        }

        setSurvey(surveyData);
        setQuestions(surveyData.questions || []);

        // 2. Fetch Regions based on Survey Organization
        const regionsRes = await fetch(`/api/regions?organizationId=${surveyData.organizationId}`);
        if (regionsRes.ok) {
          const regionsData = await regionsRes.json();
          setRegions(regionsData);
        }

        // 3. Fetch Infrastructure Types
        const infraRes = await fetch('/api/infrastructure-types');
        if (infraRes.ok) {
          const infraData = await infraRes.json();
          setInfrastructureTypes(infraData);
        } else {
          setInfrastructureTypes([
            { id: '1', name: 'Jalan Raya & Jembatan', code: 'JALAN' },
            { id: '2', name: 'Sistem Sanitasi & Limbah', code: 'SANITASI' },
            { id: '3', name: 'Sistem Penyediaan Air Bersih', code: 'AIR_BERSIH' },
            { id: '4', name: 'Fasilitas Persampahan', code: 'PERSAMPAHAN' },
            { id: '5', name: 'Drainase Perkotaan', code: 'DRAINASE' },
          ]);
        }

      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat halaman.');
      } finally {
        setLoading(false);
      }
    }

    if (surveyId) {
      fetchData();
    }
  }, [surveyId]);

  // Geolocation Handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung deteksi lokasi (Geolocation).');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLat(position.coords.latitude);
        setGpsLng(position.coords.longitude);
        setGpsLoading(false);
      },
      (error) => {
        console.error('Error getting geolocation:', error);
        alert('Gagal mendeteksi lokasi. Pastikan izin GPS telah diberikan.');
        setGpsLoading(false);
      }
    );
  };

  // Change Answer Handler
  const handleAnswerChange = (questionId: string, type: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ratingValue: type === 'RATING' ? Number(value) : prev[questionId]?.ratingValue,
        textValue: type !== 'RATING' ? String(value) : prev[questionId]?.textValue,
      },
    }));
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!regionId) {
      alert('Pilih Wilayah Anda terlebih dahulu.');
      return;
    }

    // Check required questions
    for (const q of questions) {
      if (q.isRequired) {
        const ans = answers[q.id];
        if (q.questionType === 'RATING' && (!ans || ans.ratingValue === undefined)) {
          alert(`Pertanyaan "${q.questionText}" wajib diisi.`);
          return;
        }
        if (q.questionType !== 'RATING' && (!ans || !ans.textValue)) {
          alert(`Pertanyaan "${q.questionText}" wajib diisi.`);
          return;
        }
      }
    }

    try {
      setSubmitting(true);
      const answersArray = Object.keys(answers).map((key) => ({
        questionId: key,
        ratingValue: answers[key].ratingValue,
        textValue: answers[key].textValue,
      }));

      const res = await fetch(`/api/surveys/${surveyId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regionId,
          infrastructureTypeId: infrastructureTypeId || null,
          respondentAge: respondentAge || null,
          respondentGender: respondentGender || null,
          respondentJob: respondentJob || null,
          gpsLat,
          gpsLng,
          notes,
          answers: answersArray,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengirimkan tanggapan Anda. Silakan coba lagi.');
      }

      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-text-secondary text-sm">Memuat formulir survei...</p>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="bg-surface max-w-md w-full p-8 rounded-2xl border border-border shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">Terjadi Hambatan</h2>
          <p className="text-text-secondary text-sm mb-6">{error || 'Kuesioner tidak ditemukan.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="bg-surface max-w-md w-full p-8 rounded-2xl border border-border shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-soft text-success mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Terima Kasih!</h2>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            Tanggapan Anda untuk <strong>{survey.title}</strong> telah berhasil disimpan. Kontribusi Anda sangat berharga untuk peningkatan kualitas layanan infrastruktur publik.
          </p>
          <div className="bg-background/50 border border-border p-4 rounded-xl text-left text-xs text-text-secondary space-y-1 mb-6">
            <p><strong>Kuesioner:</strong> {survey.title}</p>
            <p><strong>Periode:</strong> {survey.periodLabel} ({survey.year})</p>
            <p><strong>Waktu Kirim:</strong> {new Date().toLocaleString('id-ID')}</p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="w-full py-2.5 border border-border hover:bg-background text-text-secondary rounded-lg text-sm font-medium transition-colors"
          >
            Kirim Tanggapan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary pb-16">
      {/* Premium Gradient Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Formulir Survei Masyarakat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            {survey.title}
          </h1>
          {survey.description && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {survey.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-text-muted">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-text-muted" />
              <span>Periode: {survey.periodLabel} ({survey.year})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Building2 className="w-4 h-4 text-text-muted" />
              <span>Penyelenggara: {survey.organization?.name || 'Dinas Pekerjaan Umum'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section: Profil Responden */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-6">
            <h3 className="text-base font-bold text-text-primary border-b border-border pb-3 flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Profil Responden & Lokasi</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                  Wilayah / Lokasi Anda <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">-- Pilih Kecamatan / Kelurahan --</option>
                  {regions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name} {reg.parentId ? '(Desa/Kelurahan)' : '(Kecamatan)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                  Jenis Infrastruktur yang Diulas
                </label>
                <select
                  value={infrastructureTypeId}
                  onChange={(e) => setInfrastructureTypeId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">-- Pilih Jenis Infrastruktur --</option>
                  {infrastructureTypes.map((infra) => (
                    <option key={infra.id} value={infra.id}>
                      {infra.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                  Usia Responden (Tahun)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 35"
                  value={respondentAge}
                  onChange={(e) => setRespondentAge(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={respondentGender}
                  onChange={(e) => setRespondentGender(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">-- Pilih Gender --</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Karyawan Swasta"
                  value={respondentJob}
                  onChange={(e) => setRespondentJob(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Geolocation Section */}
            <div className="bg-background/40 border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-text-primary uppercase">Deteksi Lokasi GPS (Koordinat)</h4>
                  <p className="text-xs text-text-secondary mt-1">
                    {gpsLat && gpsLng
                      ? `Koordinat Terdeteksi: ${gpsLat.toFixed(6)}, ${gpsLng.toFixed(6)}`
                      : 'Aktifkan GPS Anda untuk memberikan akurasi data survei.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gpsLoading}
                className="inline-flex items-center px-4 py-2 border border-border text-xs font-medium rounded-lg text-text-secondary hover:bg-surface transition-colors disabled:opacity-50"
              >
                {gpsLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Mendeteksi...
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 mr-2" />
                    Deteksi GPS
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section: Pertanyaan Kuesioner */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-text-primary px-1 flex items-center space-x-2">
              <span>Pertanyaan Penilaian</span>
            </h3>

            {questions.length === 0 ? (
              <div className="bg-surface rounded-xl border border-border p-8 text-center text-sm text-text-secondary">
                Belum ada pertanyaan kuesioner yang dikonfigurasi untuk survei ini.
              </div>
            ) : (
              questions.map((q, idx) => (
                <div key={q.id} className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-text-muted font-mono mb-1">
                        <span>INDIKATOR: {q.indicatorCode}</span>
                        {q.isRequired && (
                          <span className="bg-destructive/10 text-destructive text-[10px] px-1.5 py-0.5 rounded-full font-sans uppercase">
                            Wajib
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-text-primary leading-snug">
                        {idx + 1}. {q.questionText}
                      </h4>
                      {q.helpText && (
                        <p className="text-xs text-text-secondary mt-1">{q.helpText}</p>
                      )}
                    </div>
                  </div>

                  {/* Rendering inputs depending on type */}
                  <div>
                    {q.questionType === 'RATING' && (
                      <div className="flex items-center space-x-2 mt-2">
                        {Array.from({ length: survey.scoringScale }).map((_, scaleIdx) => {
                          const val = scaleIdx + 1;
                          const isSelected = answers[q.id]?.ratingValue === val;
                          return (
                            <button
                              key={scaleIdx}
                              type="button"
                              onClick={() => handleAnswerChange(q.id, 'RATING', val)}
                              className={`w-10 h-10 rounded-full border text-sm font-bold flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-primary border-primary text-white scale-110 shadow-sm'
                                  : 'border-border bg-background hover:bg-surface text-text-secondary'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {(q.questionType === 'TEXT' || q.questionType === 'LOCATION') && (
                      <input
                        type="text"
                        placeholder="Ketik jawaban Anda..."
                        onChange={(e) => handleAnswerChange(q.id, q.questionType, e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                      />
                    )}

                    {q.questionType === 'TEXTAREA' && (
                      <textarea
                        rows={3}
                        placeholder="Ketik deskripsi lengkap atau jawaban Anda di sini..."
                        onChange={(e) => handleAnswerChange(q.id, q.questionType, e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                      />
                    )}

                    {q.questionType === 'SELECT' && (
                      <select
                        onChange={(e) => handleAnswerChange(q.id, q.questionType, e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">-- Pilih opsi --</option>
                        {Array.isArray(q.options) &&
                          q.options.map((opt: any, optIdx: number) => (
                            <option key={optIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section: Catatan / Feedback Tambahan */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text-primary">Catatan atau Masukan Tambahan</h3>
            <textarea
              rows={3}
              placeholder="Berikan masukan tambahan mengenai infrastruktur di sekitar wilayah Anda jika ada..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Submit Button Section */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim Tanggapan...
                </>
              ) : (
                'Kirim Tanggapan Survei'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
