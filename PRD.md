# PRD — OpenSource-IKLI

## 1. Nama Produk

**OpenSource-IKLI**

Nama publik yang direkomendasikan:

- IKLI Dashboard
- IKLI Open Dashboard
- PetaIKLI
- IKLI Insight
- IKLI Nusantara

Nama kerja yang digunakan dalam dokumen ini:

> **OpenSource-IKLI — Platform Survei, Dashboard, Pemetaan, dan Analisis Indeks Kepuasan Layanan Infrastruktur Berbasis Open Source**

---

## 2. Ringkasan Produk

OpenSource-IKLI adalah aplikasi web open-source untuk membantu pemerintah daerah, instansi, peneliti, dan tim survei dalam mengelola survei IKLI secara digital, menghitung indeks secara otomatis, menampilkan dashboard analitik, memetakan hasil survei berdasarkan wilayah, serta menghasilkan ringkasan dan rekomendasi berbasis analisis otomatis LLM.

Platform ini dirancang agar dapat digunakan oleh berbagai daerah tanpa hardcode wilayah. Setiap daerah dapat mengimpor data wilayah, mengunggah batas peta dalam format GeoJSON, membuat survei IKLI, mengumpulkan jawaban responden, melihat skor per indikator dan per wilayah, serta menjalankan analisis komentar terbuka menggunakan LLM dengan mekanisme **BYOK — Bring Your Own Key** melalui dashboard admin.

LLM tidak digunakan untuk menghitung skor resmi IKLI. Skor dihitung menggunakan rumus deterministik/statistik agar transparan dan dapat diaudit. LLM hanya digunakan untuk membantu menganalisis komentar terbuka, mengelompokkan keluhan, membaca sentimen, menyusun ringkasan, dan membuat rekomendasi awal yang tetap harus ditinjau oleh admin/analis.

---

## 3. Visi Produk

Menjadi platform open-source yang membantu daerah memahami kepuasan masyarakat terhadap layanan infrastruktur secara transparan, berbasis data, mudah dipetakan, dan mudah direplikasi oleh pemerintah daerah mana pun.

---

## 4. Masalah yang Ingin Diselesaikan

Banyak survei kepuasan layanan infrastruktur masih dilakukan secara manual menggunakan formulir, spreadsheet, atau sistem yang terpisah. Akibatnya:

1. data responden sulit dikonsolidasikan;
2. hasil survei lambat dianalisis;
3. peta wilayah belum terhubung langsung dengan skor;
4. komentar terbuka responden sulit dibaca satu per satu;
5. rekomendasi perbaikan sering disusun manual;
6. laporan akhir membutuhkan waktu lama;
7. setiap daerah harus membuat sistem sendiri dari awal;
8. tidak ada platform open-source yang mudah dipasang dan dikembangkan bersama.

OpenSource-IKLI menjawab masalah tersebut dengan menyediakan satu platform terintegrasi untuk survei, scoring, dashboard, pemetaan wilayah, analisis otomatis, dan export laporan.

---

## 5. Tujuan Produk

### 5.1 Tujuan Utama

Membangun platform open-source yang memungkinkan setiap daerah untuk:

- membuat survei IKLI digital;
- mengumpulkan data responden;
- menghitung skor IKLI otomatis;
- melihat dashboard per indikator, wilayah, dan jenis infrastruktur;
- memetakan skor IKLI secara dinamis;
- menganalisis komentar terbuka dengan LLM BYOK;
- menyusun rekomendasi awal berbasis data;
- mengekspor data dan laporan.

### 5.2 Tujuan Teknis

- Mudah diinstal menggunakan Docker Compose.
- Mudah dideploy di Coolify.
- Menggunakan monorepo sederhana.
- Memiliki data wilayah yang dinamis.
- Mendukung PostgreSQL + PostGIS untuk peta.
- Tidak mengharuskan API key LLM melalui ENV.
- API key LLM dapat dimasukkan melalui dashboard admin dan disimpan terenkripsi.
- Tetap bisa berjalan walaupun LLM belum dikonfigurasi.
- Cocok untuk komunitas open-source.

---

## 6. Non-Goals

Versi awal tidak bertujuan untuk:

- menggantikan sistem perencanaan pembangunan daerah;
- menjadi sistem e-budgeting;
- menjadi sistem pengadaan;
- menjadi aplikasi mobile native;
- menghitung biaya konstruksi;
- melakukan verifikasi lapangan otomatis;
- membuat keputusan final tanpa validasi manusia;
- menggantikan analis atau pejabat pengambil kebijakan;
- menyediakan API key LLM bawaan dari pengembang.

---

## 7. Target Pengguna

### 7.1 Super Admin

Pengelola platform atau maintainer instance.

Kebutuhan:

- mengelola organisasi daerah;
- mengelola user global;
- mengelola template survei;
- mengatur konfigurasi sistem;
- melakukan maintenance data referensi.

### 7.2 Admin Daerah

Operator utama dari pemerintah daerah atau instansi pengguna.

Kebutuhan:

- mengatur profil daerah;
- mengimpor wilayah;
- mengunggah GeoJSON;
- membuat survei;
- mengatur pertanyaan;
- mengelola enumerator;
- mengatur LLM BYOK;
- melihat dashboard lengkap;
- mengekspor data dan laporan.

### 7.3 Analis / Peneliti

Tim yang membaca hasil survei dan menyusun analisis.

Kebutuhan:

- melihat dashboard;
- membaca skor indikator;
- melihat peta wilayah;
- menganalisis komentar;
- meninjau hasil LLM;
- mengedit rekomendasi;
- mengekspor data analisis.

### 7.4 Enumerator

Petugas lapangan yang membantu pengisian survei.

Kebutuhan:

- mengisi survei untuk responden;
- memilih wilayah;
- mencatat lokasi;
- menambahkan komentar;
- melihat riwayat input sendiri.

### 7.5 Viewer / Pimpinan

Pimpinan daerah, kepala dinas, stakeholder, atau pihak yang hanya membaca hasil.

Kebutuhan:

- melihat ringkasan IKLI;
- melihat peta;
- melihat ranking wilayah;
- melihat rekomendasi prioritas;
- mengunduh laporan final.

### 7.6 Responden Publik

Masyarakat yang mengisi survei.

Kebutuhan:

- membuka link survei;
- memilih wilayah;
- menjawab pertanyaan;
- memberi komentar;
- mengirim jawaban dengan mudah dari perangkat mobile.

---

## 8. Role dan Hak Akses

| Fitur | Super Admin | Admin Daerah | Analis | Enumerator | Viewer | Publik |
|---|---:|---:|---:|---:|---:|---:|
| Kelola organisasi | Ya | Tidak | Tidak | Tidak | Tidak | Tidak |
| Kelola user | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Kelola template survei | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Buat survei | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Edit survei | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Publikasi survei | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Isi survei | Tidak | Ya | Ya | Ya | Tidak | Ya |
| Import wilayah | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Upload GeoJSON | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Lihat dashboard | Ya | Ya | Ya | Terbatas | Ya | Tidak |
| Lihat peta IKLI | Ya | Ya | Ya | Terbatas | Ya | Tidak |
| Jalankan analisis otomatis | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| Review hasil AI | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| Atur provider LLM | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Input API key LLM | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Lihat log LLM | Ya | Ya | Terbatas | Tidak | Tidak | Tidak |
| Export Excel | Ya | Ya | Ya | Tidak | Ya | Tidak |
| Export laporan | Ya | Ya | Ya | Tidak | Ya | Tidak |

---

## 9. Prinsip Produk

### 9.1 Open Source First

Aplikasi harus mudah dipasang, dipelajari, dikembangkan ulang, dan dikontribusikan oleh komunitas.

### 9.2 Daerah-Agnostic

Tidak boleh ada wilayah yang hardcode. Semua data wilayah harus dapat diimpor oleh pengguna.

### 9.3 Data-First

Dashboard harus menampilkan angka, peta, grafik, dan rekomendasi dengan konteks yang jelas.

### 9.4 AI as Assistant

LLM hanya sebagai alat bantu analisis, bukan pengambil keputusan final.

### 9.5 Scoring Transparan

Semua skor IKLI harus dihitung dengan rumus yang jelas dan dapat diaudit.

### 9.6 Clean Civic Design

Tampilan harus bersih, profesional, tidak terlalu “AI banget”, dan cocok untuk penggunaan instansi.

---

## 10. Arsitektur Produk

### 10.1 Arsitektur Sederhana

```text
Browser
  ↓
Next.js Fullstack App
  ├── Public Survey Form
  ├── Admin Dashboard
  ├── API Route
  ├── IKLI Scoring Engine
  ├── Map Dashboard
  ├── LLM Analyzer
  ├── Report Export
  └── Settings
  ↓
PostgreSQL + PostGIS
```

### 10.2 Container

Versi awal cukup menggunakan dua container:

```text
opensource-ikli-web
opensource-ikli-db
```

Service:

```text
opensource-ikli-web  → Next.js fullstack app
opensource-ikli-db   → PostgreSQL + PostGIS
```

### 10.3 Deployment Target

- Docker Compose
- Coolify
- VPS umum
- Local development

---

## 11. Tech Stack

| Kebutuhan | Teknologi |
|---|---|
| Frontend | Next.js + TypeScript |
| Backend | Next.js API Route / Server Actions |
| Database | PostgreSQL + PostGIS |
| ORM | Prisma |
| Spatial Query | Raw SQL + PostGIS |
| UI | Tailwind CSS + shadcn/ui |
| Map | MapLibre GL atau Leaflet |
| Chart | ECharts atau Recharts |
| Auth | Auth.js atau custom session |
| Export Excel | xlsx |
| Export DOCX | docx |
| LLM | BYOK provider |
| Deploy | Docker Compose + Coolify |
| Monorepo | pnpm workspace / Turborepo opsional |

---

## 12. Struktur Monorepo

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
├── DESIGN_GUIDELINES.md
├── PRD.md
├── PLAN.md
├── TASKS.md
├── CODING_AGENT_PROMPT.md
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

---

## 13. Modul Produk

### 13.1 Auth

Fitur:

- Login admin.
- Logout.
- Session management.
- Role-based access control.
- Reset password.
- Invite user.
- Aktivasi akun.

Requirement:

- User publik tidak perlu login untuk mengisi survei.
- Dashboard hanya dapat diakses user terdaftar.
- Setiap user dapat menjadi anggota organisasi tertentu.
- Super Admin dapat mengelola semua organisasi.
- Admin Daerah hanya mengelola organisasi sendiri.

### 13.2 Organisasi Daerah

Fitur:

- Buat organisasi.
- Edit profil organisasi.
- Upload logo.
- Pilih tipe organisasi.
- Atur tahun/periode aktif.
- Atur skala default survei.
- Atur informasi instansi.

Field organisasi:

```text
id
name
type
province_code
city_code
logo_url
address
contact_email
settings
created_at
updated_at
```

Tipe organisasi:

```text
PROVINSI
KABUPATEN
KOTA
INSTANSI
LAINNYA
```

### 13.3 User dan Role

Fitur:

- Tambah user.
- Edit user.
- Nonaktifkan user.
- Assign role.
- Assign organisasi.
- Lihat aktivitas user.

Role:

```text
SUPER_ADMIN
ADMIN_DAERAH
ANALIS
ENUMERATOR
VIEWER
```

### 13.4 Wilayah Dinamis

Fitur:

- Import data wilayah dari CSV/Excel.
- Tambah wilayah manual.
- Edit wilayah.
- Hapus wilayah jika belum digunakan.
- Relasi parent-child wilayah.
- Upload GeoJSON.
- Preview peta.
- Validasi geometri.
- Mapping GeoJSON ke wilayah.
- Deteksi wilayah tanpa peta.
- Deteksi wilayah tanpa responden.

Struktur wilayah:

```text
Provinsi
  └── Kabupaten/Kota
      └── Kecamatan
          └── Desa/Kelurahan
```

Field wilayah:

```text
id
organization_id
parent_id
level
name
bps_code
kemendagri_code
geometry
center_lat
center_lng
created_at
updated_at
```

Level wilayah:

```text
PROVINCE
CITY
DISTRICT
VILLAGE
CUSTOM
```

Acceptance criteria:

- Admin dapat mengimpor wilayah dari file CSV.
- Admin dapat mengunggah GeoJSON.
- Sistem dapat menampilkan preview wilayah di peta.
- Wilayah dapat dipakai sebagai filter dashboard.
- Skor IKLI dapat dipetakan ke wilayah.

### 13.5 Jenis Infrastruktur

Fitur:

- CRUD jenis infrastruktur.
- Aktif/nonaktif jenis infrastruktur.
- Urutan tampilan.
- Warna/icon opsional.

Default jenis infrastruktur:

```text
Jalan
Jembatan
Drainase
Irigasi
Air Bersih
Sanitasi
Persampahan
Penerangan Jalan Umum
Fasilitas Publik
Permukiman
Lainnya
```

Field:

```text
id
organization_id
code
name
description
is_active
sort_order
created_at
updated_at
```

### 13.6 Survei IKLI

Fitur:

- Buat survei.
- Edit survei.
- Duplikasi survei.
- Publikasi survei.
- Tutup survei.
- Arsipkan survei.
- Generate link publik.
- Generate QR code.
- Atur skala rating.
- Atur periode survei.
- Atur target responden.
- Atur wilayah cakupan.
- Atur jenis infrastruktur.

Status survei:

```text
DRAFT
ACTIVE
CLOSED
ANALYZED
ARCHIVED
```

Field survei:

```text
id
organization_id
title
description
year
period_label
status
scoring_scale
start_date
end_date
settings
created_by
created_at
updated_at
```

Acceptance criteria:

- Admin dapat membuat survei baru.
- Admin dapat menambahkan pertanyaan.
- Admin dapat mempublikasikan survei.
- Sistem menghasilkan link publik.
- Responden dapat mengisi survei aktif.
- Survei yang ditutup tidak bisa menerima jawaban baru.

### 13.7 Builder Pertanyaan

Fitur:

- Tambah pertanyaan.
- Edit pertanyaan.
- Hapus pertanyaan.
- Urutkan pertanyaan.
- Atur bobot.
- Atur indikator.
- Atur wajib/tidak wajib.
- Atur jenis jawaban.
- Preview form.

Tipe pertanyaan:

```text
RATING
TEXT
TEXTAREA
SELECT
MULTI_SELECT
LOCATION
FILE
```

Field pertanyaan:

```text
id
survey_id
indicator_code
indicator_name
question_text
question_type
help_text
weight
is_required
options
sort_order
created_at
updated_at
```

Indikator default:

```text
Kualitas
Aksesibilitas
Keamanan
Kenyamanan
Pemeliharaan
Manfaat
Kecepatan Penanganan
Kepuasan Umum
```

### 13.8 Form Responden Publik

Fitur:

- Halaman survei publik.
- Mobile-first.
- Pilih wilayah.
- Pilih jenis infrastruktur.
- Isi pertanyaan rating.
- Isi komentar terbuka.
- GPS opsional.
- Konfirmasi sebelum submit.
- Halaman sukses setelah submit.
- Proteksi submit berulang sederhana.

UX requirement:

- Form harus ringan.
- Tidak perlu login.
- Bahasa mudah dipahami masyarakat.
- Validasi error harus ramah.
- Tampilkan progress jika pertanyaan banyak.

Acceptance criteria:

- Responden dapat membuka link survei.
- Responden dapat memilih wilayah.
- Responden dapat mengisi rating.
- Responden dapat memberi komentar.
- Jawaban tersimpan ke database.
- Responden melihat halaman sukses.

### 13.9 Enumerator

Fitur:

- Enumerator login.
- Input survei atas nama responden.
- Lihat daftar survei aktif.
- Lihat riwayat input sendiri.
- Catatan lapangan.
- Lokasi GPS.
- Mode input cepat.

Acceptance criteria:

- Enumerator hanya dapat melihat data input sendiri.
- Enumerator tidak dapat mengubah konfigurasi survei.
- Enumerator tidak dapat melihat dashboard strategis penuh.

### 13.10 Scoring Engine

Prinsip:

Scoring IKLI tidak menggunakan LLM. Scoring harus menggunakan rumus deterministik.

Fitur:

- Hitung skor per jawaban rating.
- Hitung skor per indikator.
- Hitung skor per jenis infrastruktur.
- Hitung skor per wilayah.
- Hitung skor total survei.
- Konversi skor ke skala 0–100.
- Kategori nilai.
- Recalculate manual.
- Simpan snapshot skor.

Rumus default:

Jika skala rating adalah 1–5:

```text
Skor 100 = (Rata-rata skor / 5) × 100
```

Jika skala rating adalah 1–4:

```text
Skor 100 = (Rata-rata skor / 4) × 100
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

Acceptance criteria:

- Sistem dapat menghitung skor otomatis setelah data masuk.
- Sistem dapat menghitung ulang skor ketika admin memilih recalculate.
- Setiap skor menyimpan jumlah responden.
- Dashboard tidak boleh menampilkan skor tanpa jumlah responden.
- Rumus dapat dilihat oleh admin.

### 13.11 Dashboard

Fitur utama:

- IKLI total.
- Kategori IKLI.
- Jumlah responden.
- Jumlah wilayah tercakup.
- Skor per indikator.
- Skor per jenis infrastruktur.
- Skor per wilayah.
- Ranking wilayah terbaik.
- Ranking wilayah terendah.
- Indikator prioritas.
- Filter periode.
- Filter wilayah.
- Filter infrastruktur.
- Filter indikator.

Komponen dashboard:

```text
Metric cards
Bar chart
Line chart
Radar chart
Ranking table
Insight panel
Map preview
```

Acceptance criteria:

- Admin dapat melihat ringkasan IKLI.
- Dashboard berubah sesuai filter.
- Setiap grafik dapat dibaca dengan jelas.
- Data kosong menampilkan empty state.
- Dashboard dapat digunakan tanpa LLM.

### 13.12 Peta IKLI

Fitur:

- Peta wilayah dinamis.
- Choropleth map berdasarkan skor.
- Tooltip wilayah.
- Detail wilayah.
- Filter jenis infrastruktur.
- Filter indikator.
- Filter periode.
- Layer titik keluhan.
- Layer skor total.
- Layer skor per infrastruktur.
- Legend warna.
- Empty state jika GeoJSON belum tersedia.

Tooltip peta:

```text
Nama wilayah
Skor IKLI
Kategori
Jumlah responden
Keluhan dominan
```

Warna peta:

```text
Sangat Baik     Hijau tua
Baik            Hijau muda
Cukup           Kuning
Kurang          Oranye
Sangat Kurang   Merah
Tidak ada data  Abu-abu
```

Acceptance criteria:

- Peta dapat menampilkan batas wilayah dari GeoJSON.
- Wilayah berubah warna sesuai skor.
- Klik wilayah menampilkan detail.
- Filter wilayah dan infrastruktur bekerja.
- Wilayah tanpa data tampil abu-abu.

### 13.13 AI Settings / LLM BYOK

Prinsip:

API key LLM tidak dimasukkan melalui ENV. Admin memasukkan provider dan API key melalui dashboard.

Fitur:

- Pilih provider LLM.
- Masukkan API key.
- Masukkan base URL untuk provider custom.
- Pilih model.
- Test koneksi.
- Simpan konfigurasi terenkripsi.
- Hapus konfigurasi.
- Lihat status konfigurasi.
- Lihat log penggunaan.

Provider awal:

```text
OpenAI
Google Gemini
Anthropic Claude
Ollama
OpenAI-Compatible
```

Field database:

```text
id
organization_id
provider
model
base_url
encrypted_api_key
is_active
last_test_status
last_tested_at
created_by
created_at
updated_at
```

Security requirement:

- API key tidak boleh disimpan plain text.
- API key harus dienkripsi di database.
- API key tidak boleh dikirim ulang ke frontend.
- Frontend hanya menampilkan masked key.
- Decrypt hanya terjadi di server.
- ENCRYPTION_KEY tetap disimpan di ENV server.

Acceptance criteria:

- Admin dapat menyimpan API key dari dashboard.
- Sistem dapat melakukan test koneksi.
- API key tersimpan terenkripsi.
- API key tidak tampil penuh di UI.
- Analisis otomatis menggunakan konfigurasi organisasi terkait.
- Aplikasi tetap berjalan tanpa konfigurasi LLM.

### 13.14 Analisis Otomatis LLM

Fitur:

- Analisis komentar terbuka.
- Klasifikasi keluhan.
- Deteksi sentimen.
- Deteksi tingkat urgensi.
- Ringkasan komentar.
- Rekomendasi awal.
- Ringkasan per wilayah.
- Ringkasan per jenis infrastruktur.
- Review hasil analisis.
- Edit hasil analisis.
- Setujui/tolak hasil analisis.
- Regenerate hasil analisis.

Output analisis:

```json
{
  "summary": "Mayoritas responden mengeluhkan jalan berlubang dan drainase buruk.",
  "topics": ["jalan rusak", "drainase", "genangan"],
  "sentiment": "negatif",
  "severity": "tinggi",
  "recommendation": "Prioritaskan perbaikan jalan dan normalisasi drainase di wilayah dengan skor rendah."
}
```

Status analisis:

```text
NOT_ANALYZED
PROCESSING
NEEDS_REVIEW
APPROVED
REJECTED
FAILED
```

Acceptance criteria:

- Analis dapat menjalankan analisis otomatis.
- Sistem membaca komentar terbuka.
- Sistem menyimpan hasil analisis.
- Hasil analisis dapat diedit.
- Hasil analisis dapat disetujui.
- Setiap hasil analisis menampilkan disclaimer bahwa perlu ditinjau.

### 13.15 Rekomendasi Prioritas

Fitur:

- Ranking wilayah prioritas.
- Ranking indikator prioritas.
- Rekomendasi per wilayah.
- Rekomendasi per infrastruktur.
- Penanda urgensi.
- Alasan berbasis data.
- Review/edit rekomendasi.

Formula prioritas default:

```text
Prioritas = skor IKLI rendah
          + jumlah keluhan tinggi
          + sentimen negatif tinggi
          + jumlah responden cukup
          + tingkat urgensi tinggi
```

Output rekomendasi:

```text
Wilayah: Kecamatan A
Masalah utama: Jalan rusak dan drainase buruk
Skor IKLI: 58,4
Jumlah responden: 128
Urgensi: Tinggi
Rekomendasi: Prioritaskan perbaikan jalan dan normalisasi drainase.
```

### 13.16 Export

Fitur MVP:

- Export data responden ke Excel.
- Export rekap skor ke Excel.
- Export hasil analisis ke Excel.

Fitur lanjutan:

- Export laporan DOCX.
- Export laporan PDF.
- Export ringkasan dashboard.
- Export rekomendasi prioritas.

Acceptance criteria:

- Admin dapat mengunduh data responden.
- Admin dapat mengunduh rekap skor.
- File export mengikuti filter aktif.
- Data sensitif responden dapat dianonimkan.

### 13.17 Audit Log

Fitur:

- Catat login.
- Catat pembuatan survei.
- Catat publikasi survei.
- Catat import wilayah.
- Catat upload GeoJSON.
- Catat pengaturan LLM.
- Catat analisis otomatis.
- Catat export data.
- Catat perubahan rekomendasi.

Field:

```text
id
organization_id
user_id
action
resource_type
resource_id
metadata
ip_address
user_agent
created_at
```

---

## 14. Database Inti

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

Relasi utama:

```text
organizations 1..n organization_members
organizations 1..n regions
organizations 1..n surveys
surveys 1..n survey_questions
surveys 1..n survey_responses
survey_responses 1..n survey_answers
surveys 1..n ikli_scores
organizations 1..1 organization_llm_settings
survey_answers 1..1 ai_comment_analyses
surveys 1..n ai_recommendations
```

---

## 15. API Requirement

### Auth

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Organization

```text
GET    /api/organizations
POST   /api/organizations
GET    /api/organizations/:id
PATCH  /api/organizations/:id
```

### Region

```text
GET    /api/regions
POST   /api/regions
POST   /api/regions/import
POST   /api/regions/upload-geojson
GET    /api/regions/:id
PATCH  /api/regions/:id
DELETE /api/regions/:id
```

### Survey

```text
GET    /api/surveys
POST   /api/surveys
GET    /api/surveys/:id
PATCH  /api/surveys/:id
POST   /api/surveys/:id/publish
POST   /api/surveys/:id/close
POST   /api/surveys/:id/duplicate
```

### Public Survey

```text
GET  /api/public/surveys/:publicId
POST /api/public/surveys/:publicId/responses
```

### Scoring

```text
POST /api/surveys/:id/recalculate
GET  /api/surveys/:id/scores
GET  /api/surveys/:id/dashboard
```

### Map

```text
GET /api/surveys/:id/map
GET /api/surveys/:id/map/regions
GET /api/surveys/:id/map/points
```

### AI Settings

```text
GET    /api/ai/settings
POST   /api/ai/settings
POST   /api/ai/settings/test
DELETE /api/ai/settings
```

### AI Analysis

```text
POST  /api/surveys/:id/ai/analyze-comments
GET   /api/surveys/:id/ai/analyses
PATCH /api/ai/analyses/:id
POST  /api/ai/analyses/:id/approve
POST  /api/ai/analyses/:id/reject
```

### Export

```text
GET /api/surveys/:id/export/responses.xlsx
GET /api/surveys/:id/export/scores.xlsx
GET /api/surveys/:id/export/analysis.xlsx
```

---

## 16. LLM Prompt Requirement

### 16.1 Prompt Analisis Komentar

System prompt:

```text
Anda adalah analis survei layanan infrastruktur daerah.

Tugas Anda adalah mengubah komentar terbuka responden menjadi JSON terstruktur.

Jangan membuat informasi di luar komentar responden.
Jika informasi tidak tersedia, isi dengan null.
Kembalikan hanya JSON valid.
```

Output wajib:

```json
{
  "topics": [],
  "sentiment": "positive|neutral|negative|mixed",
  "severity": "low|medium|high",
  "summary": "",
  "recommendation": "",
  "is_actionable": true,
  "confidence": 0.0
}
```

### 16.2 Prompt Rekomendasi

System prompt:

```text
Anda adalah analis kebijakan layanan infrastruktur daerah.

Berdasarkan skor IKLI, jumlah responden, wilayah, indikator, dan ringkasan komentar, buat rekomendasi awal yang berbasis data.

Jangan membuat klaim di luar data.
Setiap rekomendasi harus memiliki alasan berbasis skor atau komentar.
```

---

## 17. Design Requirement

Tampilan aplikasi harus mengikuti karakter:

```text
Clean
Civic
Professional
Data-first
Human-readable
Not too AI-ish
```

Prinsip UI:

- Background terang.
- Card putih.
- Border tipis.
- Warna utama biru tenang.
- Warna status hijau, kuning, oranye, merah.
- Tidak menggunakan neon gradient.
- Tidak menggunakan ikon robot sebagai identitas utama.
- AI disebut sebagai “Analisis Otomatis”.
- Dashboard harus lapang dan mudah dibaca.
- Peta menjadi komponen utama, bukan dekorasi.

Navigasi utama:

```text
Dashboard
Peta IKLI
Survei
Responden
Wilayah
Analisis Otomatis
Laporan
Pengaturan
```

---

## 18. Environment Variable

Karena LLM BYOK dikelola lewat dashboard, ENV tidak menyimpan API key LLM.

`.env.example`:

```env
DATABASE_URL=postgresql://ikli:password@opensource-ikli-db:5432/ikli
POSTGRES_PASSWORD=change-me
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me
ENCRYPTION_KEY=change-me-32-bytes
APP_URL=http://localhost:3000
NODE_ENV=production
```

Tidak digunakan:

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

API key LLM dimasukkan melalui dashboard admin dan disimpan terenkripsi di database.

---

## 19. Docker Compose Requirement

Service minimal:

```yaml
services:
  opensource-ikli-db:
    image: postgis/postgis:16-3.4
    restart: unless-stopped
    environment:
      POSTGRES_DB: ikli
      POSTGRES_USER: ikli
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - opensource_ikli_postgres_data:/var/lib/postgresql/data

  opensource-ikli-web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    restart: unless-stopped
    depends_on:
      - opensource-ikli-db
    environment:
      DATABASE_URL: postgresql://ikli:${POSTGRES_PASSWORD}@opensource-ikli-db:5432/ikli
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      APP_URL: ${APP_URL}
    ports:
      - "3000:3000"

volumes:
  opensource_ikli_postgres_data:
```

---

## 20. Coolify Deployment Flow

Langkah deploy:

```text
1. Fork repository OpenSource-IKLI.
2. Buka Coolify.
3. Buat project baru.
4. Add Resource.
5. Pilih Git Repository.
6. Pilih Build Pack: Docker Compose.
7. Pilih file docker-compose.yml.
8. Isi environment variable.
9. Set domain untuk opensource-ikli-web.
10. Deploy.
```

Domain contoh:

```text
https://ikli.nama-daerah.go.id
https://survey.nama-daerah.go.id
https://demo.opensource-ikli.org
```

---

## 21. Open Source Requirement

File wajib:

```text
README.md
PRD.md
DESIGN_GUIDELINES.md
PLAN.md
TASKS.md
CODING_AGENT_PROMPT.md
CONTRIBUTING.md
LICENSE
CODE_OF_CONDUCT.md
.env.example
docker-compose.yml
```

Dokumentasi wajib:

- cara install lokal;
- cara deploy di Coolify;
- cara import wilayah;
- cara upload GeoJSON;
- cara membuat survei;
- cara mengatur LLM BYOK;
- cara export data;
- cara kontribusi.

Lisensi rekomendasi:

```text
AGPL-3.0 untuk core platform
MIT untuk package helper/template jika diperlukan
```

Jika ingin adopsi paling luas:

```text
MIT
```

Jika ingin turunan SaaS tetap membuka source code:

```text
AGPL-3.0
```

---

## 22. Success Metrics

### Adoption Metrics

- jumlah daerah/organisasi yang memasang aplikasi;
- jumlah survei yang dibuat;
- jumlah responden yang masuk;
- jumlah wilayah yang dipetakan;
- jumlah kontributor open-source.

### Product Metrics

- waktu membuat survei pertama;
- waktu import wilayah;
- waktu upload GeoJSON;
- kecepatan dashboard terbuka;
- persentase survei dengan data lengkap;
- jumlah export laporan.

### AI Metrics

- jumlah komentar yang dianalisis;
- tingkat hasil analisis yang disetujui;
- jumlah hasil analisis yang diedit;
- error rate koneksi LLM;
- penggunaan token per organisasi.

### Quality Metrics

- tidak ada API key plain text di database;
- scoring konsisten;
- peta tampil sesuai data;
- export sesuai filter;
- tidak ada data lintas organisasi bocor.

---

## 23. Risiko dan Mitigasi

### Risiko 1 — Data Wilayah Tidak Seragam

Mitigasi:

- sediakan template import;
- validasi kolom;
- preview sebelum simpan;
- dukung kode BPS dan Kemendagri;
- dukung wilayah custom.

### Risiko 2 — GeoJSON Tidak Valid

Mitigasi:

- validasi format file;
- tampilkan pesan error jelas;
- sediakan contoh GeoJSON;
- izinkan wilayah tanpa peta tetap digunakan.

### Risiko 3 — Hasil LLM Tidak Akurat

Mitigasi:

- tampilkan disclaimer;
- hasil harus bisa diedit;
- status perlu ditinjau;
- jangan gunakan LLM untuk scoring;
- simpan prompt dan model yang digunakan.

### Risiko 4 — API Key Bocor

Mitigasi:

- enkripsi API key;
- jangan tampilkan key penuh;
- decrypt hanya di server;
- audit log perubahan setting;
- batasi akses hanya admin.

### Risiko 5 — Dashboard Lambat

Mitigasi:

- cache hasil skor;
- simpan snapshot skor;
- pagination data responden;
- query spatial dioptimasi;
- index database.

### Risiko 6 — Sulit Diinstal

Mitigasi:

- Docker Compose sederhana;
- dokumentasi jelas;
- seed demo data;
- `.env.example`;
- installer script opsional.

---

## 24. Roadmap

### Phase 0 — Project Setup

Target: fondasi repo siap.

Fitur:

- monorepo setup;
- Next.js app;
- Tailwind + shadcn/ui;
- Prisma;
- PostgreSQL + PostGIS;
- Docker Compose;
- auth dasar;
- role dasar;
- seed user admin.

Deliverable:

```text
Repo bisa jalan lokal dan di Coolify.
```

### Phase 1 — Core Survey

Target: survei bisa dibuat dan diisi.

Fitur:

- organisasi;
- user role;
- CRUD survei;
- builder pertanyaan;
- public survey form;
- submit jawaban;
- daftar responden;
- export responden Excel.

Deliverable:

```text
Admin dapat membuat survei dan responden dapat mengisi survei.
```

### Phase 2 — Scoring + Dashboard

Target: skor IKLI bisa dihitung dan dilihat.

Fitur:

- scoring engine;
- skor total;
- skor per indikator;
- skor per wilayah;
- skor per infrastruktur;
- dashboard card;
- chart indikator;
- ranking wilayah.

Deliverable:

```text
Dashboard IKLI dasar siap digunakan.
```

### Phase 3 — Dynamic Region + Map

Target: peta wilayah dinamis.

Fitur:

- import wilayah;
- upload GeoJSON;
- preview peta;
- choropleth map;
- tooltip wilayah;
- filter peta;
- detail wilayah.

Deliverable:

```text
Skor IKLI tampil di peta berdasarkan wilayah.
```

### Phase 4 — LLM BYOK + Analysis

Target: analisis otomatis berjalan.

Fitur:

- UI pengaturan LLM;
- enkripsi API key;
- test koneksi;
- analisis komentar;
- klasifikasi keluhan;
- sentimen;
- urgensi;
- rekomendasi awal;
- review/edit hasil AI.

Deliverable:

```text
Admin dapat memasukkan API key sendiri dan menjalankan analisis otomatis.
```

### Phase 5 — Report Export

Target: laporan siap pakai.

Fitur:

- export rekap skor Excel;
- export analisis Excel;
- draft laporan DOCX;
- ringkasan eksekutif;
- rekomendasi per wilayah;
- lampiran tabel.

Deliverable:

```text
Admin dapat mengekspor laporan hasil IKLI.
```

### Phase 6 — Open Source Release

Target: siap dipakai publik.

Fitur:

- dokumentasi lengkap;
- demo dataset;
- contoh GeoJSON;
- guide Coolify;
- contributor guide;
- issue template;
- release tag v1.0.0.

Deliverable:

```text
OpenSource-IKLI v1.0.0 siap dirilis.
```

---

## 25. Acceptance Criteria MVP

MVP dianggap selesai jika:

1. aplikasi bisa dijalankan dengan Docker Compose;
2. aplikasi bisa dideploy di Coolify;
3. admin dapat login;
4. admin dapat membuat organisasi;
5. admin dapat membuat survei IKLI;
6. admin dapat membuat pertanyaan;
7. responden publik dapat mengisi survei;
8. jawaban tersimpan di database;
9. skor IKLI dihitung otomatis;
10. dashboard menampilkan skor total, indikator, wilayah, dan responden;
11. admin dapat mengimpor wilayah;
12. admin dapat mengunggah GeoJSON;
13. peta menampilkan skor wilayah;
14. admin dapat memasukkan API key LLM dari dashboard;
15. API key disimpan terenkripsi;
16. admin/analis dapat menjalankan analisis komentar;
17. hasil analisis dapat diedit dan disetujui;
18. admin dapat export data Excel;
19. aplikasi tetap berjalan tanpa LLM;
20. tidak ada data lintas organisasi yang bocor.

---

## 26. Definition of Done

Setiap fitur dianggap selesai jika:

- memiliki UI;
- memiliki API/backend logic;
- memiliki validasi input;
- memiliki role permission;
- memiliki empty state;
- memiliki error state;
- memiliki loading state;
- memiliki audit log untuk aksi penting;
- memiliki test minimal untuk logic utama;
- memiliki dokumentasi singkat jika fitur kompleks.

---

## 27. Prioritas Implementasi

Urutan prioritas:

```text
1. Auth + Organization
2. Survey Builder
3. Public Survey Form
4. Response Storage
5. Scoring Engine
6. Dashboard
7. Region Import
8. GeoJSON Upload
9. Map Dashboard
10. LLM BYOK Settings
11. AI Comment Analysis
12. Recommendation Review
13. Export Excel
14. Report DOCX
15. Documentation + Open Source Release
```

---

## 28. Kesimpulan

OpenSource-IKLI adalah platform open-source yang dirancang untuk membantu daerah melakukan survei kepuasan layanan infrastruktur secara digital, transparan, dan berbasis data.

Keunggulan utama:

```text
- Open-source
- Mudah dideploy di Coolify
- Monorepo sederhana
- Dashboard IKLI lengkap
- Peta wilayah dinamis
- PostGIS-ready
- LLM BYOK dari dashboard
- API key terenkripsi
- Skor deterministik
- Bisa digunakan semua daerah
```

Prinsip paling penting:

```text
LLM membantu analisis, tetapi skor resmi tetap dihitung oleh sistem secara transparan.
```

Produk akhir yang dituju:

> Dashboard IKLI open-source yang dapat dipakai oleh kabupaten, kota, provinsi, instansi, peneliti, dan komunitas untuk mengelola survei, membaca kepuasan masyarakat, memetakan wilayah prioritas, dan menyusun rekomendasi perbaikan layanan infrastruktur secara lebih cepat dan akuntabel.
