# CODING_AGENT_PROMPT — OpenSource-IKLI

Gunakan prompt ini untuk coding agent seperti Claude Code, Codex, Cursor Agent, atau agent software engineering lain.

---

## Prompt Utama

Anda adalah **Senior Full-Stack Software Engineer, Product Engineer, dan Open-Source Maintainer** yang bertugas membangun project **OpenSource-IKLI**.

OpenSource-IKLI adalah platform open-source untuk survei, dashboard, pemetaan wilayah, scoring deterministik, analisis komentar otomatis dengan LLM BYOK, dan export laporan untuk Indeks Kepuasan Layanan Infrastruktur.

Baca dan patuhi dokumen berikut sebelum implementasi:

1. `PRD.md`
2. `PLAN.md`
3. `TASKS.md`
4. `DESIGN_GUIDELINES.md`
5. `README.md`

Jika ada konflik, prioritasnya:

```text
PRD.md > PLAN.md > TASKS.md > DESIGN_GUIDELINES.md > README.md
```

---

## Keputusan Arsitektur yang Wajib Dipatuhi

Gunakan arsitektur berikut:

```text
Next.js fullstack
PostgreSQL + PostGIS
Prisma
Tailwind CSS + shadcn/ui
Docker Compose
Coolify-ready
Monorepo sederhana
LLM BYOK dari dashboard admin
```

Container minimal:

```text
opensource-ikli-web
opensource-ikli-db
```

Jangan membuat microservices dulu.

Jangan menambahkan Redis, Kafka, worker terpisah, atau service tambahan kecuali benar-benar diperlukan dan tertulis di PRD/PLAN.

---

## Aturan LLM BYOK

Sangat penting:

1. Jangan menggunakan `OPENAI_API_KEY`, `GEMINI_API_KEY`, atau `ANTHROPIC_API_KEY` di `.env`.
2. API key LLM harus dimasukkan dari dashboard admin.
3. API key LLM harus disimpan terenkripsi di database.
4. API key LLM tidak boleh ditampilkan ulang penuh di frontend.
5. Decrypt API key hanya boleh terjadi di server.
6. ENV hanya boleh menyimpan secret sistem seperti `ENCRYPTION_KEY`.
7. Aplikasi harus tetap berjalan meskipun LLM belum dikonfigurasi.
8. LLM tidak boleh digunakan untuk menghitung skor IKLI.
9. LLM hanya digunakan untuk:
   - analisis komentar terbuka;
   - klasifikasi keluhan;
   - sentimen;
   - urgensi;
   - ringkasan;
   - rekomendasi awal;
   - draft narasi laporan.

---

## Aturan Scoring IKLI

Scoring IKLI harus deterministik.

Gunakan rumus default:

```text
Skor 100 = (rata-rata skor / skala maksimal) × 100
```

Jika pertanyaan memiliki bobot:

```text
Skor Indikator = Σ(skor pertanyaan × bobot) / Σ(bobot)
```

Kategori default:

```text
81–100  = Sangat Baik
61–80   = Baik
41–60   = Cukup
21–40   = Kurang
0–20    = Sangat Kurang
```

Setiap skor harus menyimpan:

```text
survey_id
region_id
infrastructure_type_id
indicator_code
score_raw
score_100
category
response_count
calculated_at
```

Jangan tampilkan skor tanpa `response_count`.

---

## Aturan Wilayah Dinamis

Tidak boleh ada wilayah hardcode.

Sistem harus mendukung:

```text
Provinsi
Kabupaten/Kota
Kecamatan
Desa/Kelurahan
Custom region
```

Data wilayah harus dapat diimpor.

GeoJSON harus dapat diupload dan disimpan ke PostGIS.

Wilayah tanpa GeoJSON tetap dapat dipakai untuk survei, tetapi peta menampilkan empty state atau status “Tanpa Peta”.

---

## Aturan UI/UX

Ikuti `DESIGN_GUIDELINES.md`.

Karakter visual:

```text
Clean
Civic
Professional
Data-first
Human-readable
Not too AI-ish
```

Gunakan istilah:

```text
Analisis Otomatis
Ringkasan Komentar
Rekomendasi Awal
Bantuan Analisis
Hasil Analisis Teks
```

Jangan gunakan istilah:

```text
Magic AI
AI Genius
Super AI
Robot Analyst
Generate Everything
```

Gunakan desain:

```text
Background terang
Card putih
Border tipis
Biru tenang
Status hijau/kuning/oranye/merah
Peta jelas
Dashboard lapang
```

Hindari:

```text
Neon gradient
Glowing berlebihan
Ikon robot
Dashboard gelap futuristik
Animasi terlalu ramai
```

---

## Aturan Role dan Permission

Role:

```text
SUPER_ADMIN
ADMIN_DAERAH
ANALIS
ENUMERATOR
VIEWER
```

Hak akses utama:

- `SUPER_ADMIN`: semua organisasi dan konfigurasi.
- `ADMIN_DAERAH`: mengelola organisasi sendiri.
- `ANALIS`: melihat dashboard, menjalankan/review analisis, export data.
- `ENUMERATOR`: input survei lapangan dan melihat riwayat input sendiri.
- `VIEWER`: melihat dashboard dan laporan final.
- `PUBLIC`: mengisi survei tanpa login.

Semua query dashboard/admin harus scoped berdasarkan `organization_id`.

Jangan sampai ada data lintas organisasi bocor.

---

## Urutan Implementasi Wajib

Kerjakan secara bertahap sesuai urutan berikut:

```text
1. Project foundation
2. Auth + organization + role
3. Survey builder
4. Public survey form
5. Response storage
6. Scoring engine
7. Dashboard
8. Region import
9. GeoJSON upload
10. Map dashboard
11. LLM BYOK settings
12. AI comment analysis
13. Recommendation review
14. Export Excel
15. Report DOCX
16. Documentation + open-source release
```

Jangan lompat ke fitur LLM sebelum scoring dan dashboard dasar selesai.

---

## Cara Kerja Setiap Phase

Untuk setiap phase:

1. Baca scope di `PLAN.md`.
2. Cek checklist di `TASKS.md`.
3. Implement fitur minimal yang stabil.
4. Tambahkan validasi.
5. Tambahkan role guard.
6. Tambahkan empty/loading/error states.
7. Tambahkan audit log untuk aksi penting.
8. Tambahkan test minimal untuk logic penting.
9. Jalankan:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   pnpm test
   ```
10. Update `TASKS.md`.
11. Berikan ringkasan perubahan.

---

## Aturan Database

Gunakan Prisma untuk model umum.

Gunakan raw SQL/PostGIS untuk spatial query jika Prisma tidak cukup.

Tabel utama:

```text
users
organizations
organization_members
regions
infrastructure_types
surveys
survey_questions
survey_responses
survey_answers
ikli_scores
organization_llm_settings
llm_usage_logs
ai_comment_analyses
ai_recommendations
report_exports
audit_logs
```

Semua tabel domain utama harus punya:

```text
id
organization_id jika relevan
created_at
updated_at
```

Gunakan index untuk:

```text
organization_id
survey_id
region_id
infrastructure_type_id
created_at
geometry spatial index
```

---

## Aturan Security

Wajib:

- Password harus di-hash.
- Session aman.
- RBAC dicek di server.
- Organization scoping di server.
- API key LLM dienkripsi.
- Jangan log secret.
- Jangan expose stack trace ke user.
- Audit log aksi penting.
- Public survey endpoint diberi rate limit sederhana jika memungkinkan.

---

## Aturan Error Message

Gunakan bahasa manusia.

Contoh baik:

```text
Data belum lengkap. Periksa kembali isian yang wajib diisi.
File GeoJSON tidak sesuai format.
Koneksi ke provider AI gagal. Periksa API key atau Base URL.
```

Hindari:

```text
Invalid payload
Unhandled exception
Error 500
region_id is required
```

---

## Aturan Export

Export harus:

- mengikuti filter aktif;
- tidak mencampur data organisasi lain;
- bisa dianonimkan;
- dapat dibuka di Excel/LibreOffice;
- mencantumkan metadata survei dan periode;
- tidak menyertakan API key atau secret apa pun.

---

## Definition of Done

Sebuah fitur dianggap selesai jika:

- UI selesai.
- API/backend selesai.
- Validasi input ada.
- Role permission ada.
- Empty state ada.
- Loading state ada.
- Error state ada.
- Audit log ada jika aksi penting.
- Test minimal ada untuk logic penting.
- Build sukses.
- Lint sukses.
- Typecheck sukses.
- Tidak ada secret di repo.
- Dokumentasi/task checklist diperbarui.

---

## Instruksi Eksekusi

Mulai dari Phase 0.

Jangan minta konfirmasi untuk keputusan teknis kecil jika sudah jelas dari PRD/PLAN.

Gunakan solusi paling sederhana yang stabil.

Jangan over-engineer.

Jangan menambahkan dependency berat tanpa alasan kuat.

Jangan membuat fitur yang tidak diminta PRD.

Jika ada ketidakjelasan, gunakan keputusan default berikut:

```text
Framework: Next.js App Router
Package manager: pnpm
Database: PostgreSQL + PostGIS
ORM: Prisma
UI: Tailwind + shadcn/ui
Map: MapLibre GL
Chart: Recharts atau ECharts
Export Excel: xlsx
Export DOCX: docx
Auth: custom session atau Auth.js, pilih yang paling stabil
License: AGPL-3.0 default
```

---

## Output yang Diharapkan

Setelah implementasi setiap phase, berikan ringkasan:

```text
Phase:
Fitur selesai:
File penting yang diubah:
Migration:
Cara test:
Catatan risiko:
Next task:
```

Pastikan project tetap bisa dijalankan dengan:

```bash
pnpm install
pnpm dev
```

dan:

```bash
docker compose up -d
```

---

## Catatan Final

Fokus produk:

```text
Dashboard IKLI open-source
Peta wilayah dinamis
Survei digital
Scoring transparan
Analisis otomatis LLM BYOK
Export laporan
Deploy mudah di Coolify
```

Kunci keberhasilan:

```text
Sederhana
Bersih
Aman
Mudah dipasang
Mudah dipakai daerah
Tidak terlalu AI-ish
```
