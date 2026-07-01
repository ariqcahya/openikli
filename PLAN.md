# PLAN — OpenSource-IKLI Implementation Plan

## 1. Tujuan Implementasi

Membangun **OpenSource-IKLI** sebagai platform open-source untuk survei, dashboard, pemetaan, dan analisis IKLI yang dapat digunakan oleh semua daerah.

Target akhir:

```text
Next.js fullstack app
PostgreSQL + PostGIS
Monorepo sederhana
Docker Compose
Coolify-ready
Dashboard IKLI lengkap
Peta wilayah dinamis
LLM BYOK via dashboard admin
API key terenkripsi
Export data dan laporan
```

---

## 2. Prinsip Implementasi

1. **Sederhana dulu, scalable nanti.**
   - Jangan memecah service terlalu cepat.
   - Mulai dari Next.js fullstack + PostgreSQL PostGIS.

2. **Skor IKLI harus deterministik.**
   - LLM tidak boleh menghitung skor resmi.
   - LLM hanya untuk analisis komentar, ringkasan, dan rekomendasi awal.

3. **Wilayah harus dinamis.**
   - Tidak boleh hardcode kabupaten/kecamatan/desa.
   - Semua daerah harus dapat mengimpor wilayah sendiri.

4. **LLM harus BYOK dari dashboard.**
   - Tidak menggunakan `OPENAI_API_KEY`, `GEMINI_API_KEY`, atau `ANTHROPIC_API_KEY` di ENV.
   - API key disimpan terenkripsi di database.
   - ENV hanya menyimpan secret sistem seperti `ENCRYPTION_KEY`.

5. **UI clean dan civic.**
   - Jangan terlalu futuristik atau terlalu “AI banget”.
   - Gunakan istilah “Analisis Otomatis”, bukan “Magic AI”.

6. **Open-source friendly.**
   - Dokumentasi harus jelas.
   - Docker Compose harus mudah dipakai.
   - Seed demo data harus tersedia.

---

## 3. Target Arsitektur

```text
Browser
  ↓
Next.js Fullstack App
  ├── Public Survey Form
  ├── Admin Dashboard
  ├── API Routes / Server Actions
  ├── IKLI Scoring Engine
  ├── Map Dashboard
  ├── LLM Analyzer
  ├── Report Export
  └── Settings
  ↓
PostgreSQL + PostGIS
```

Container:

```text
opensource-ikli-web
opensource-ikli-db
```

---

## 4. Struktur Repo

```text
opensource-ikli/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── dashboard/
│       │   ├── admin/
│       │   ├── survey/
│       │   ├── map/
│       │   ├── settings/
│       │   └── api/
│       ├── components/
│       ├── modules/
│       │   ├── auth/
│       │   ├── organization/
│       │   ├── region/
│       │   ├── survey/
│       │   ├── scoring/
│       │   ├── dashboard/
│       │   ├── map/
│       │   ├── ai-settings/
│       │   ├── ai-analysis/
│       │   ├── report/
│       │   └── audit-log/
│       ├── lib/
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── seed.ts
│   ├── shared/
│   └── ui/
│
├── docker-compose.yml
├── .env.example
├── README.md
├── PRD.md
├── PLAN.md
├── TASKS.md
├── DESIGN_GUIDELINES.md
├── CODING_AGENT_PROMPT.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

---

## 5. Phase 0 — Project Foundation

### Goal

Membuat fondasi repo dan aplikasi bisa berjalan lokal serta siap deploy di Coolify.

### Scope

- Setup monorepo.
- Setup Next.js + TypeScript.
- Setup Tailwind CSS.
- Setup shadcn/ui.
- Setup Prisma.
- Setup PostgreSQL + PostGIS.
- Setup Docker Compose.
- Setup linting dan formatting.
- Setup environment variable.
- Setup seed admin awal.
- Setup halaman login basic.
- Setup layout dashboard.

### Deliverable

- Repo bisa dijalankan dengan `docker compose up -d`.
- App bisa diakses di `http://localhost:3000`.
- Database PostGIS aktif.
- Prisma migration berjalan.
- Admin default bisa login.
- Layout dashboard dasar tersedia.

### Acceptance Criteria

- `pnpm install` berhasil.
- `pnpm dev` berhasil.
- `docker compose up -d` berhasil.
- `prisma migrate` berhasil.
- Login admin berhasil.
- Tidak ada dependency API key LLM di ENV.

---

## 6. Phase 1 — Auth, Organization, User Role

### Goal

Membuat struktur multi-organisasi dan role-based access control.

### Scope

- Model user.
- Model organization.
- Model organization_members.
- Role:
  - SUPER_ADMIN
  - ADMIN_DAERAH
  - ANALIS
  - ENUMERATOR
  - VIEWER
- Login/logout.
- Session guard.
- Middleware role permission.
- Organization switcher jika user punya banyak organisasi.
- CRUD organisasi untuk Super Admin.
- CRUD user untuk Super Admin/Admin Daerah.
- Audit log dasar.

### Deliverable

- Super Admin dapat membuat organisasi.
- Admin Daerah dapat mengelola user di organisasinya.
- User hanya dapat mengakses data organisasinya.
- Role permission berjalan.

### Acceptance Criteria

- Data organisasi tidak bocor antar user.
- Public survey tetap bisa diakses tanpa login.
- Dashboard butuh login.
- Semua aksi penting tercatat di audit log.

---

## 7. Phase 2 — Core Survey Builder

### Goal

Admin dapat membuat survei IKLI, menambahkan pertanyaan, dan mempublikasikannya.

### Scope

- Model surveys.
- Model survey_questions.
- Survey CRUD.
- Question builder.
- Tipe pertanyaan:
  - RATING
  - TEXT
  - TEXTAREA
  - SELECT
  - MULTI_SELECT
  - LOCATION
- Survey status:
  - DRAFT
  - ACTIVE
  - CLOSED
  - ANALYZED
  - ARCHIVED
- Generate public survey ID.
- Generate public link.
- Generate QR code.
- Preview form.
- Duplicate survey.

### Deliverable

- Admin bisa membuat survei.
- Admin bisa menambahkan pertanyaan.
- Admin bisa mempublikasikan survei.
- Link publik tersedia.

### Acceptance Criteria

- Survei DRAFT belum bisa diisi publik.
- Survei ACTIVE bisa diisi publik.
- Survei CLOSED tidak bisa menerima jawaban baru.
- Pertanyaan wajib tervalidasi.
- Urutan pertanyaan dapat diubah.

---

## 8. Phase 3 — Public Survey Form + Responses

### Goal

Responden publik dan enumerator dapat mengisi survei.

### Scope

- Public survey page.
- Mobile-first form.
- Pilih wilayah.
- Pilih jenis infrastruktur.
- Submit jawaban.
- Simpan response.
- Simpan answers.
- Simpan lokasi GPS opsional.
- Success page.
- Response list untuk admin.
- Enumerator input mode.
- Riwayat input enumerator.

### Deliverable

- Responden publik dapat mengisi survei.
- Enumerator dapat input jawaban.
- Admin dapat melihat daftar responden.

### Acceptance Criteria

- Jawaban rating tersimpan.
- Jawaban teks tersimpan.
- Response terkait dengan survey, region, dan infrastructure_type.
- Enumerator hanya melihat input sendiri.
- Form tampil baik di mobile.

---

## 9. Phase 4 — Scoring Engine

### Goal

Sistem dapat menghitung skor IKLI otomatis secara transparan.

### Scope

- Service scoring.
- Hitung skor total.
- Hitung skor per indikator.
- Hitung skor per wilayah.
- Hitung skor per jenis infrastruktur.
- Hitung response_count.
- Konversi skor ke 0–100.
- Kategori:
  - Sangat Baik
  - Baik
  - Cukup
  - Kurang
  - Sangat Kurang
- Snapshot ke tabel `ikli_scores`.
- Recalculate manual.

### Formula Default

```text
Skor 100 = (rata-rata skor / skala maksimal) × 100
```

Jika menggunakan bobot:

```text
Skor Indikator = Σ(skor pertanyaan × bobot) / Σ(bobot)
```

### Deliverable

- Skor IKLI total dapat dihitung.
- Skor per indikator tersedia.
- Skor per wilayah tersedia.
- Skor per jenis infrastruktur tersedia.

### Acceptance Criteria

- Skor tidak menggunakan LLM.
- Setiap skor menyertakan jumlah responden.
- Recalculate menghasilkan skor konsisten.
- Tidak ada skor ditampilkan tanpa konteks response_count.

---

## 10. Phase 5 — Dashboard IKLI

### Goal

Admin, analis, dan viewer dapat membaca hasil survei melalui dashboard.

### Scope

- Dashboard overview.
- Metric cards:
  - IKLI total
  - Kategori
  - Jumlah responden
  - Wilayah tercakup
  - Infrastruktur tercakup
- Chart skor per indikator.
- Chart skor per infrastruktur.
- Ranking wilayah tertinggi/terendah.
- Filter:
  - survey
  - periode
  - wilayah
  - infrastruktur
  - indikator
- Empty state.
- Loading state.
- Error state.

### Deliverable

- Dashboard IKLI dasar siap digunakan.

### Acceptance Criteria

- Dashboard berubah sesuai filter.
- Data kosong tidak error.
- Semua angka memiliki label.
- Tidak ada visual yang terlalu ramai.
- UI mengikuti `DESIGN_GUIDELINES.md`.

---

## 11. Phase 6 — Dynamic Region + GeoJSON

### Goal

Wilayah dapat dikelola secara dinamis dan digunakan untuk peta.

### Scope

- Model regions.
- Import CSV/Excel wilayah.
- Tambah/edit wilayah manual.
- Relasi parent-child.
- Kode BPS.
- Kode Kemendagri.
- Upload GeoJSON.
- Validasi GeoJSON.
- Simpan geometry ke PostGIS.
- Preview peta.
- Deteksi wilayah tanpa geometry.
- Deteksi geometry tidak valid.
- Template import wilayah.
- Template GeoJSON.

### Deliverable

- Admin dapat mengimpor wilayah.
- Admin dapat upload GeoJSON.
- Wilayah dapat tampil di peta.

### Acceptance Criteria

- Tidak ada wilayah hardcode.
- GeoJSON valid bisa disimpan.
- GeoJSON invalid memberi error yang jelas.
- Wilayah tanpa peta tetap bisa dipakai untuk survei.
- Parent-child wilayah berjalan.

---

## 12. Phase 7 — Map Dashboard

### Goal

Skor IKLI dapat dipetakan secara dinamis.

### Scope

- Map page.
- Choropleth layer.
- Warna berdasarkan kategori skor.
- Tooltip wilayah.
- Detail sidebar.
- Filter:
  - survey
  - wilayah
  - infrastruktur
  - indikator
- Legend.
- Wilayah tanpa data tampil abu-abu.
- Optional point layer untuk lokasi keluhan.
- Endpoint GeoJSON map.

### Deliverable

- Peta skor IKLI per wilayah.

### Acceptance Criteria

- Wilayah berubah warna sesuai skor.
- Klik wilayah menampilkan detail.
- Tooltip memuat skor, kategori, responden.
- Filter map berfungsi.
- Map tetap berjalan jika sebagian wilayah belum punya data.

---

## 13. Phase 8 — AI Settings / LLM BYOK

### Goal

Admin dapat memasukkan API key LLM dari dashboard.

### Scope

- Model organization_llm_settings.
- Model llm_usage_logs.
- UI pengaturan Analisis Otomatis.
- Provider:
  - OpenAI
  - Gemini
  - Anthropic
  - Ollama
  - OpenAI-Compatible
- Input model.
- Input base URL.
- Input API key.
- Masked key display.
- Test koneksi.
- Simpan encrypted API key.
- Hapus konfigurasi.
- Audit log.

### Security Requirement

- API key tidak boleh masuk ENV.
- API key tidak boleh disimpan plain text.
- API key tidak boleh dikirim ulang ke frontend.
- Decrypt hanya di server.
- ENCRYPTION_KEY di ENV wajib.
- Role yang boleh mengatur:
  - SUPER_ADMIN
  - ADMIN_DAERAH

### Deliverable

- Admin dapat mengatur provider LLM dari dashboard.
- LLM config tersimpan aman.

### Acceptance Criteria

- Test koneksi berhasil untuk provider valid.
- API key tampil hanya masked.
- Tanpa LLM, aplikasi tetap jalan.
- Analis tidak dapat melihat/mengubah key.
- Semua perubahan setting tercatat di audit log.

---

## 14. Phase 9 — AI Comment Analysis

### Goal

Komentar responden dapat dianalisis otomatis menggunakan LLM BYOK.

### Scope

- Ambil komentar terbuka dari survey_answers.
- Batch analysis.
- Prompt JSON strict.
- Parse response JSON.
- Simpan hasil ke ai_comment_analyses.
- Status:
  - NOT_ANALYZED
  - PROCESSING
  - NEEDS_REVIEW
  - APPROVED
  - REJECTED
  - FAILED
- Review UI.
- Edit hasil.
- Approve/reject.
- Regenerate.
- Log token estimate.
- Error handling.

### Deliverable

- Analis dapat melihat tema keluhan, sentimen, urgensi, dan rekomendasi awal.

### Acceptance Criteria

- LLM hanya digunakan jika konfigurasi aktif.
- Jika LLM gagal, sistem menampilkan error jelas.
- Hasil analisis dapat diedit.
- Hasil analisis default berstatus NEEDS_REVIEW.
- Hasil tidak langsung dianggap final.
- Prompt tidak boleh membuat klaim di luar data.

---

## 15. Phase 10 — Recommendation Engine

### Goal

Sistem dapat menghasilkan rekomendasi prioritas berbasis skor dan hasil analisis.

### Scope

- Ranking wilayah prioritas.
- Ranking indikator prioritas.
- Formula prioritas default.
- Rekomendasi AI per wilayah.
- Rekomendasi AI per infrastruktur.
- Review/edit rekomendasi.
- Approve/reject rekomendasi.
- Evidence block:
  - skor
  - response_count
  - top comments
  - sentiment
  - severity
- Dashboard recommendation panel.

### Deliverable

- Admin/analis dapat melihat prioritas perbaikan.

### Acceptance Criteria

- Rekomendasi selalu menyertakan alasan berbasis data.
- Rekomendasi dapat diedit.
- Rekomendasi dapat disetujui.
- Viewer hanya melihat rekomendasi final/approved.

---

## 16. Phase 11 — Export

### Goal

Data dan hasil analisis dapat diekspor.

### Scope MVP

- Export responses XLSX.
- Export scores XLSX.
- Export analysis XLSX.

### Scope Lanjutan

- Export DOCX report.
- Export PDF report.
- Export executive summary.
- Export map snapshot jika memungkinkan.

### Deliverable

- Admin dapat mengunduh data survei dan rekap skor.

### Acceptance Criteria

- Export mengikuti filter aktif.
- Export tidak mencampur data organisasi lain.
- Export data responden bisa dianonimkan.
- File dapat dibuka dengan Excel/LibreOffice.

---

## 17. Phase 12 — Report Generator

### Goal

Sistem dapat membuat draft laporan IKLI.

### Scope

- Template laporan DOCX.
- Ringkasan eksekutif.
- Metodologi.
- Profil responden.
- Hasil IKLI total.
- Hasil per indikator.
- Hasil per wilayah.
- Hasil peta.
- Analisis komentar.
- Rekomendasi.
- Lampiran tabel.
- Review narasi sebelum export.

### Deliverable

- Draft laporan IKLI dapat diunduh.

### Acceptance Criteria

- Laporan bisa dibuat tanpa LLM.
- Jika LLM aktif, narasi ringkasan dapat dibantu LLM.
- Narasi LLM bisa diedit sebelum export.
- Data angka berasal dari scoring engine, bukan LLM.

---

## 18. Phase 13 — Documentation + Open Source Release

### Goal

Membuat project siap dirilis open-source.

### Scope

- README lengkap.
- PRD.
- PLAN.
- TASKS.
- DESIGN_GUIDELINES.
- CODING_AGENT_PROMPT.
- CONTRIBUTING.
- CODE_OF_CONDUCT.
- LICENSE.
- `.env.example`.
- `docker-compose.yml`.
- Demo data.
- Contoh CSV wilayah.
- Contoh GeoJSON.
- Guide Coolify.
- Issue templates.
- Pull request template.

### Deliverable

- Release `v1.0.0`.

### Acceptance Criteria

- Developer baru dapat menjalankan project dari README.
- Admin daerah dapat install via Docker Compose.
- Coolify deployment terdokumentasi.
- Demo data tersedia.
- Lisensi tersedia.

---

## 19. Quality Gate

Sebelum merge, setiap phase harus memenuhi:

- build sukses;
- lint sukses;
- typecheck sukses;
- migration aman;
- seed berjalan;
- basic test berjalan;
- permission diperiksa;
- empty state tersedia;
- error state tersedia;
- loading state tersedia;
- tidak ada secret ter-commit;
- dokumentasi diperbarui.

---

## 20. Production Readiness Checklist

- Database volume persistent.
- Backup instruction tersedia.
- ENV minimal tersedia.
- ENCRYPTION_KEY wajib.
- API key LLM terenkripsi.
- HTTPS via Coolify/domain.
- Rate limit untuk public survey.
- Audit log untuk aksi penting.
- Export tidak bocor antar organisasi.
- Dashboard query dioptimasi.
- PostGIS index tersedia.
- Seed admin bisa diganti setelah install.

---

## 21. Urutan Eksekusi yang Disarankan untuk Coding Agent

1. Baca `PRD.md`.
2. Baca `DESIGN_GUIDELINES.md`.
3. Baca `PLAN.md`.
4. Buat project foundation.
5. Implementasi phase secara berurutan.
6. Jangan lompat ke LLM sebelum scoring dan dashboard dasar selesai.
7. Jangan implementasi microservices dulu.
8. Jangan memasukkan API key LLM di ENV.
9. Selalu update `TASKS.md`.
10. Setelah setiap phase, jalankan build, lint, typecheck, dan test.

---

## 22. Catatan Penting

Keputusan arsitektur final:

```text
Next.js fullstack + PostgreSQL PostGIS + LLM BYOK via dashboard + Docker Compose
```

Keputusan produk final:

```text
Skor IKLI dihitung sistem.
LLM membantu analisis komentar dan rekomendasi.
Wilayah dinamis.
Peta dinamis.
Open-source.
Coolify-ready.
Clean civic dashboard.
```
