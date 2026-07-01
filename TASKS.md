# TASKS — OpenSource-IKLI

Dokumen ini berisi daftar pekerjaan implementasi OpenSource-IKLI. Gunakan checklist ini sebagai acuan eksekusi bertahap.

Status:

- `[ ]` Belum dikerjakan
- `[~]` Sedang dikerjakan
- `[x]` Selesai
- `[!]` Perlu review

---

## Phase 0 — Project Foundation

### Repository

- [ ] Inisialisasi Git repository.
- [ ] Tambahkan `README.md`.
- [ ] Tambahkan `CONTRIBUTING.md`.
- [ ] Tambahkan `LICENSE`.
- [ ] Tambahkan `.gitignore`.
- [ ] Tambahkan `.env.example`.


### Monorepo

- [ ] Setup `pnpm workspace`.
- [ ] Buat `apps/web`.
- [ ] Buat `packages/database`.
- [ ] Buat `packages/shared`.
- [ ] Buat `packages/ui`.
- [ ] Setup root `package.json`.
- [ ] Setup workspace scripts:
  - [ ] `dev`
  - [ ] `build`
  - [ ] `lint`
  - [ ] `typecheck`
  - [ ] `test`
  - [ ] `db:migrate`
  - [ ] `db:seed`

### Web App

- [ ] Setup Next.js.
- [ ] Setup TypeScript.
- [ ] Setup Tailwind CSS.
- [ ] Setup shadcn/ui.
- [ ] Setup base layout.
- [ ] Setup dashboard shell.
- [ ] Setup public survey layout.
- [ ] Setup theme tokens sesuai spesifikasi desain UI/UX.

### Database

- [ ] Setup Prisma.
- [ ] Setup PostgreSQL + PostGIS.
- [ ] Buat database package.
- [ ] Buat initial migration.
- [ ] Enable extension PostGIS.
- [ ] Setup Prisma client.
- [ ] Setup seed admin.

### Docker

- [ ] Buat `docker-compose.yml`.
- [ ] Buat `apps/web/Dockerfile`.
- [ ] Pastikan service `opensource-ikli-db` berjalan.
- [ ] Pastikan service `opensource-ikli-web` berjalan.
- [ ] Test `docker compose up -d`.
- [ ] Dokumentasikan deploy via Docker Compose.

### Quality

- [ ] Setup ESLint.
- [ ] Setup Prettier.
- [ ] Setup TypeScript strict mode.
- [ ] Setup test framework minimal.
- [ ] Pastikan build sukses.
- [ ] Pastikan lint sukses.
- [ ] Pastikan typecheck sukses.

---

## Phase 1 — Auth, Organization, User Role

### Database Models

- [ ] Buat model `User`.
- [ ] Buat model `Organization`.
- [ ] Buat model `OrganizationMember`.
- [ ] Buat enum role:
  - [ ] `SUPER_ADMIN`
  - [ ] `ADMIN_DAERAH`
  - [ ] `ANALIS`
  - [ ] `ENUMERATOR`
  - [ ] `VIEWER`
- [ ] Buat model `AuditLog`.
- [ ] Migration database.

### Auth

- [ ] Implement login.
- [ ] Implement logout.
- [ ] Implement session.
- [ ] Implement password hashing.
- [ ] Implement `getCurrentUser`.
- [ ] Implement route guard.
- [ ] Implement middleware dashboard auth.
- [ ] Implement public route exception untuk survei publik.

### RBAC

- [ ] Implement permission helper.
- [ ] Implement organization scope helper.
- [ ] Implement role guard.
- [ ] Pastikan user hanya melihat data organisasi sendiri.
- [ ] Pastikan Super Admin bisa melihat semua organisasi.

### Organization UI

- [ ] Halaman daftar organisasi.
- [ ] Form tambah organisasi.
- [ ] Form edit organisasi.
- [ ] Upload logo organisasi.
- [ ] Organization switcher.
- [ ] Empty state organisasi.

### User Management UI

- [ ] Halaman daftar user.
- [ ] Form tambah user.
- [ ] Form edit user.
- [ ] Assign role.
- [ ] Nonaktifkan user.
- [ ] Audit log perubahan user.

### Acceptance

- [ ] Super Admin dapat login.
- [ ] Super Admin dapat membuat organisasi.
- [ ] Admin Daerah dapat mengelola user organisasinya.
- [ ] Viewer tidak dapat mengubah data.
- [ ] Enumerator tidak dapat mengakses dashboard penuh.
- [ ] Audit log tercatat.

---

## Phase 2 — Core Survey Builder

### Database Models

- [ ] Buat model `Survey`.
- [ ] Buat model `SurveyQuestion`.
- [ ] Buat enum survey status:
  - [ ] `DRAFT`
  - [ ] `ACTIVE`
  - [ ] `CLOSED`
  - [ ] `ANALYZED`
  - [ ] `ARCHIVED`
- [ ] Buat enum question type:
  - [ ] `RATING`
  - [ ] `TEXT`
  - [ ] `TEXTAREA`
  - [ ] `SELECT`
  - [ ] `MULTI_SELECT`
  - [ ] `LOCATION`
  - [ ] `FILE`
- [ ] Migration database.

### Survey CRUD

- [ ] Halaman daftar survei.
- [ ] Form buat survei.
- [ ] Form edit survei.
- [ ] Detail survei.
- [ ] Duplicate survei.
- [ ] Publish survei.
- [ ] Close survei.
- [ ] Archive survei.
- [ ] Empty state survei.

### Question Builder

- [ ] Tambah pertanyaan.
- [ ] Edit pertanyaan.
- [ ] Hapus pertanyaan.
- [ ] Reorder pertanyaan.
- [ ] Atur indikator.
- [ ] Atur bobot.
- [ ] Atur wajib/tidak wajib.
- [ ] Atur opsi untuk select/multi-select.
- [ ] Preview form.
- [ ] Validasi pertanyaan.

### Public Link

- [ ] Generate public ID.
- [ ] Generate public URL.
- [ ] Generate QR code.
- [ ] Copy link button.
- [ ] Preview public survey.

### Acceptance

- [ ] Admin dapat membuat survei.
- [ ] Admin dapat membuat pertanyaan rating dan teks.
- [ ] Admin dapat publish survei.
- [ ] Public link tersedia.
- [ ] DRAFT tidak bisa diisi publik.
- [ ] ACTIVE bisa diisi publik.
- [ ] CLOSED tidak bisa diisi publik.

---

## Phase 3 — Public Survey Form + Responses

### Database Models

- [ ] Buat model `SurveyResponse`.
- [ ] Buat model `SurveyAnswer`.
- [ ] Tambahkan relasi ke survey.
- [ ] Tambahkan relasi ke region.
- [ ] Tambahkan relasi ke infrastructure type.
- [ ] Tambahkan metadata responden opsional.
- [ ] Migration database.

### Public Survey Form

- [ ] Halaman public survey.
- [ ] Load survey by public ID.
- [ ] Validasi survey ACTIVE.
- [ ] Tampilkan deskripsi survei.
- [ ] Pilih wilayah.
- [ ] Pilih jenis infrastruktur.
- [ ] Render question dynamically.
- [ ] Validasi required questions.
- [ ] Submit response.
- [ ] Success page.
- [ ] Mobile-first layout.

### Enumerator Mode

- [ ] Halaman survei aktif untuk enumerator.
- [ ] Input responden oleh enumerator.
- [ ] Riwayat input enumerator.
- [ ] Catatan lapangan.
- [ ] GPS opsional.

### Admin Responses

- [ ] Halaman daftar responden.
- [ ] Detail jawaban responden.
- [ ] Filter by survey.
- [ ] Filter by region.
- [ ] Filter by infrastructure.
- [ ] Export basic placeholder.

### Acceptance

- [ ] Public user dapat submit survei.
- [ ] Jawaban tersimpan.
- [ ] Jawaban rating dan text tersimpan sesuai pertanyaan.
- [ ] Enumerator dapat input survei.
- [ ] Enumerator hanya melihat input sendiri.
- [ ] Admin dapat melihat daftar responden.

---

## Phase 4 — Scoring Engine

### Scoring Service

- [ ] Implement helper konversi skor ke 0–100.
- [ ] Implement kategori skor.
- [ ] Implement weighted average.
- [ ] Implement score per indicator.
- [ ] Implement score per infrastructure.
- [ ] Implement score per region.
- [ ] Implement total IKLI.
- [ ] Implement response_count.

### Database

- [ ] Buat model `IkliScore`.
- [ ] Tambahkan field:
  - [ ] survey_id
  - [ ] region_id
  - [ ] infrastructure_type_id
  - [ ] indicator_code
  - [ ] score_raw
  - [ ] score_100
  - [ ] category
  - [ ] response_count
  - [ ] calculated_at
- [ ] Migration database.
- [ ] Index untuk query dashboard.

### API

- [ ] Endpoint recalculate score.
- [ ] Endpoint get scores.
- [ ] Endpoint dashboard summary.
- [ ] Authorization guard.

### UI

- [ ] Tombol recalculate.
- [ ] Tampilkan status kalkulasi terakhir.
- [ ] Tampilkan rumus scoring.
- [ ] Empty state jika belum ada jawaban.

### Tests

- [ ] Unit test scoring scale 1–5.
- [ ] Unit test scoring scale 1–4.
- [ ] Unit test weighted score.
- [ ] Unit test kategori skor.
- [ ] Unit test response_count.

### Acceptance

- [ ] Skor tidak menggunakan LLM.
- [ ] Skor konsisten pada recalculate.
- [ ] Setiap skor menyertakan response_count.
- [ ] Skor tampil dengan kategori.
- [ ] Data antar organisasi tidak bercampur.

---

## Phase 5 — Dashboard IKLI

### Dashboard Overview

- [ ] Metric card IKLI total.
- [ ] Metric card kategori.
- [ ] Metric card jumlah responden.
- [ ] Metric card wilayah tercakup.
- [ ] Metric card infrastruktur tercakup.
- [ ] Tampilkan periode survei aktif.

### Charts

- [ ] Chart skor per indikator.
- [ ] Chart skor per infrastruktur.
- [ ] Ranking wilayah tertinggi.
- [ ] Ranking wilayah terendah.
- [ ] Indikator prioritas.
- [ ] Trend antarperiode jika data tersedia.

### Filters

- [ ] Filter survey.
- [ ] Filter periode.
- [ ] Filter wilayah.
- [ ] Filter infrastruktur.
- [ ] Filter indikator.
- [ ] Filter chips.

### UX

- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Responsive desktop/tablet/mobile.
- [ ] Copywriting sesuai guideline.

### Acceptance

- [ ] Dashboard bisa dibuka oleh Admin, Analis, Viewer.
- [ ] Filter memengaruhi data.
- [ ] Tidak ada angka tanpa label.
- [ ] Tidak ada skor tanpa response_count.
- [ ] UI clean, civic, tidak AI-ish.

---

## Phase 6 — Dynamic Region + GeoJSON

### Database

- [ ] Buat model `Region`.
- [ ] Tambahkan field:
  - [ ] organization_id
  - [ ] parent_id
  - [ ] level
  - [ ] name
  - [ ] bps_code
  - [ ] kemendagri_code
  - [ ] geometry
  - [ ] center_lat
  - [ ] center_lng
- [ ] Enable PostGIS.
- [ ] Tambahkan spatial index.
- [ ] Migration database.

### Region CRUD

- [ ] Halaman daftar wilayah.
- [ ] Tree wilayah.
- [ ] Tambah wilayah.
- [ ] Edit wilayah.
- [ ] Hapus wilayah jika belum digunakan.
- [ ] Filter level wilayah.
- [ ] Search wilayah.

### Import Wilayah

- [ ] Template CSV.
- [ ] Upload CSV.
- [ ] Validasi kolom.
- [ ] Preview hasil import.
- [ ] Simpan import.
- [ ] Error report.

### GeoJSON

- [ ] Upload GeoJSON.
- [ ] Validasi format.
- [ ] Mapping feature ke region.
- [ ] Simpan geometry ke PostGIS.
- [ ] Preview geometry.
- [ ] Error jika geometry invalid.
- [ ] Status wilayah tanpa peta.

### Acceptance

- [ ] Wilayah tidak hardcode.
- [ ] CSV wilayah dapat diimport.
- [ ] GeoJSON valid dapat diupload.
- [ ] GeoJSON invalid menampilkan error jelas.
- [ ] Wilayah dapat dipakai dalam form survei dan dashboard.

---

## Phase 7 — Map Dashboard

### Map Core

- [ ] Install MapLibre GL atau Leaflet.
- [ ] Buat halaman Peta IKLI.
- [ ] Endpoint GeoJSON wilayah + score.
- [ ] Render choropleth layer.
- [ ] Render legend.
- [ ] Render tooltip.
- [ ] Render detail sidebar.
- [ ] Render wilayah tanpa data sebagai abu-abu.

### Filters

- [ ] Filter survey.
- [ ] Filter wilayah.
- [ ] Filter infrastruktur.
- [ ] Filter indikator.
- [ ] Filter kategori skor.

### Tooltip

- [ ] Nama wilayah.
- [ ] Skor IKLI.
- [ ] Kategori.
- [ ] Jumlah responden.
- [ ] Keluhan dominan jika tersedia.

### Point Layer

- [ ] Render titik lokasi keluhan jika data GPS tersedia.
- [ ] Toggle layer titik.
- [ ] Tooltip titik keluhan.

### Acceptance

- [ ] Peta menampilkan wilayah dari GeoJSON.
- [ ] Warna wilayah sesuai kategori skor.
- [ ] Tooltip tampil saat hover/click.
- [ ] Detail sidebar tampil saat klik.
- [ ] Filter peta bekerja.
- [ ] Map tetap berjalan jika ada wilayah tanpa data.

---

## Phase 8 — AI Settings / LLM BYOK

### Database

- [ ] Buat model `OrganizationLlmSetting`.
- [ ] Buat model `LlmUsageLog`.
- [ ] Tambahkan field encrypted_api_key.
- [ ] Migration database.

### Encryption

- [ ] Implement encrypt helper.
- [ ] Implement decrypt helper.
- [ ] Gunakan `ENCRYPTION_KEY`.
- [ ] Validasi ENCRYPTION_KEY tersedia.
- [ ] Jangan log API key.

### Provider Client

- [ ] Implement interface `LlmProvider`.
- [ ] Implement OpenAI client.
- [ ] Implement Gemini client.
- [ ] Implement Anthropic client.
- [ ] Implement Ollama client.
- [ ] Implement OpenAI-compatible client.
- [ ] Implement test connection.

### UI Settings

- [ ] Halaman Pengaturan → Analisis Otomatis.
- [ ] Pilih provider.
- [ ] Input model.
- [ ] Input base URL.
- [ ] Input API key.
- [ ] Test koneksi.
- [ ] Simpan setting.
- [ ] Hapus setting.
- [ ] Masked key display.
- [ ] Log penggunaan.

### Security

- [ ] Hanya Super Admin/Admin Daerah yang bisa edit.
- [ ] Analis tidak bisa melihat/mengubah key.
- [ ] Frontend tidak menerima key asli.
- [ ] Audit log perubahan setting.

### Acceptance

- [ ] API key tidak ada di ENV.
- [ ] API key tersimpan terenkripsi.
- [ ] API key tampil masked.
- [ ] Test koneksi berhasil/gagal dengan pesan jelas.
- [ ] Aplikasi tetap jalan tanpa LLM.

---

## Phase 9 — AI Comment Analysis

### Database

- [ ] Buat model `AiCommentAnalysis`.
- [ ] Field topics.
- [ ] Field sentiment.
- [ ] Field severity.
- [ ] Field summary.
- [ ] Field recommendation.
- [ ] Field confidence.
- [ ] Field review_status.
- [ ] Field model/provider.
- [ ] Migration database.

### Analysis Service

- [ ] Ambil komentar terbuka.
- [ ] Batch komentar.
- [ ] Buat prompt JSON strict.
- [ ] Call LLM provider dari setting organisasi.
- [ ] Parse JSON.
- [ ] Validasi schema.
- [ ] Simpan hasil.
- [ ] Simpan usage log.
- [ ] Handle error provider.
- [ ] Retry terbatas jika perlu.

### UI

- [ ] Halaman Analisis Otomatis.
- [ ] Tombol Jalankan Analisis.
- [ ] Tampilkan progress.
- [ ] Tampilkan hasil ringkasan.
- [ ] Tampilkan top topics.
- [ ] Tampilkan sentiment.
- [ ] Tampilkan severity.
- [ ] Tampilkan rekomendasi.
- [ ] Edit hasil.
- [ ] Approve hasil.
- [ ] Reject hasil.
- [ ] Regenerate hasil.

### Acceptance

- [ ] Analisis berjalan jika LLM aktif.
- [ ] Jika LLM belum aktif, tampilkan empty state.
- [ ] Hasil default `NEEDS_REVIEW`.
- [ ] Hasil dapat diedit.
- [ ] Hasil dapat disetujui.
- [ ] Tidak ada klaim di luar data.

---

## Phase 10 — Recommendation Engine

### Data

- [ ] Ambil skor wilayah.
- [ ] Ambil skor indikator.
- [ ] Ambil response_count.
- [ ] Ambil hasil AI analysis.
- [ ] Ambil sentiment dan severity.
- [ ] Ambil top topics.

### Formula

- [ ] Implement prioritas berdasarkan skor rendah.
- [ ] Implement bobot jumlah keluhan.
- [ ] Implement bobot sentiment negatif.
- [ ] Implement bobot severity.
- [ ] Implement threshold response_count.
- [ ] Simpan ranking prioritas.

### AI Recommendation

- [ ] Buat prompt rekomendasi.
- [ ] Sertakan evidence data.
- [ ] Parse hasil.
- [ ] Simpan rekomendasi.
- [ ] Review/edit/approve/reject.

### UI

- [ ] Panel prioritas wilayah.
- [ ] Panel prioritas indikator.
- [ ] Rekomendasi per wilayah.
- [ ] Evidence block.
- [ ] Status review.
- [ ] Tombol edit/approve/reject.

### Acceptance

- [ ] Rekomendasi punya alasan berbasis data.
- [ ] Viewer hanya melihat rekomendasi approved.
- [ ] Rekomendasi dapat diedit.
- [ ] Tidak ada keputusan final tanpa review.

---

## Phase 11 — Export

### XLSX

- [ ] Export responses.
- [ ] Export scores.
- [ ] Export AI analysis.
- [ ] Export recommendations.
- [ ] Export sesuai filter.
- [ ] Anonimkan data responden jika dipilih.

### UI

- [ ] Tombol export di dashboard.
- [ ] Tombol export di responses.
- [ ] Tombol export di analysis.
- [ ] Loading state.
- [ ] Error state.

### Acceptance

- [ ] File bisa dibuka di Excel.
- [ ] Export tidak mencampur data organisasi.
- [ ] Export mengikuti filter.
- [ ] Data sensitif bisa dianonimkan.

---

## Phase 12 — Report Generator

### Report Template

- [ ] Buat struktur laporan.
- [ ] Ringkasan eksekutif.
- [ ] Metodologi.
- [ ] Profil responden.
- [ ] Hasil skor total.
- [ ] Hasil indikator.
- [ ] Hasil wilayah.
- [ ] Hasil peta.
- [ ] Analisis komentar.
- [ ] Rekomendasi.
- [ ] Lampiran.

### DOCX

- [ ] Generate DOCX.
- [ ] Isi tabel skor.
- [ ] Isi ringkasan.
- [ ] Isi rekomendasi.
- [ ] Download DOCX.

### PDF

- [ ] Optional PDF export.
- [ ] Gunakan HTML to PDF atau server-side render.

### Acceptance

- [ ] Laporan bisa dibuat tanpa LLM.
- [ ] Narasi LLM bisa diedit.
- [ ] Angka laporan berasal dari scoring engine.
- [ ] File dapat diunduh.

---

## Phase 13 — Open Source Release

### Docs

- [ ] README install lokal.
- [ ] README deploy Coolify.
- [ ] Guide import wilayah.
- [ ] Guide upload GeoJSON.
- [ ] Guide LLM BYOK.
- [ ] Guide survey builder.
- [ ] Guide export.
- [ ] Contributor guide.
- [ ] Code of conduct.

### Demo

- [ ] Seed demo organisasi.
- [ ] Seed demo wilayah.
- [ ] Seed demo survei.
- [ ] Seed demo responses.
- [ ] Contoh CSV wilayah.
- [ ] Contoh GeoJSON.

### GitHub

- [ ] Issue template bug.
- [ ] Issue template feature.
- [ ] Pull request template.
- [ ] Release notes.
- [ ] Tag `v1.0.0`.

### Acceptance

- [ ] Developer baru bisa menjalankan project dari README.
- [ ] Admin daerah bisa install via Docker Compose.
- [ ] Coolify deployment jelas.
- [ ] Demo data tersedia.
- [ ] Lisensi tersedia.

---

## Cross-Cutting Tasks

### Security

- [ ] Tidak ada API key LLM di ENV.
- [ ] API key terenkripsi.
- [ ] Session aman.
- [ ] Password di-hash.
- [ ] RBAC di server.
- [ ] Organization scoping di semua query.
- [ ] Audit log aksi penting.
- [ ] Jangan log secret.

### Performance

- [ ] Index untuk foreign key.
- [ ] Index untuk organization_id.
- [ ] Index untuk survey_id.
- [ ] Spatial index untuk geometry.
- [ ] Pagination table.
- [ ] Cache/snapshot skor.
- [ ] Optimasi query dashboard.

### UX

- [ ] Empty state.
- [ ] Loading state.
- [ ] Error state.
- [ ] Toast messages.
- [ ] Responsive layout.
- [ ] Validasi form ramah.
- [ ] Copywriting clean dan civic.

### Testing

- [ ] Unit test scoring.
- [ ] Unit test encryption.
- [ ] Unit test permission.
- [ ] Unit test LLM JSON parser.
- [ ] Integration test public survey submit.
- [ ] Integration test recalculate score.
- [ ] Integration test organization scoping.

### Documentation

- [ ] Update README.md setiap penyelesaian fase.
- [ ] Update berkas checklist tugas setiap rilis fitur.
- [ ] Tambahkan screenshot demo jika sudah ada UI.
- [ ] Tambahkan troubleshooting Coolify.
