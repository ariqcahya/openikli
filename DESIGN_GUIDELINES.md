# Design Guidelines — OpenSource-IKLI

## 1. Karakter Produk

OpenSource-IKLI harus terasa sebagai **platform data publik yang bersih, kredibel, modern, dan mudah dipercaya**.

Karakter utama:

- **Clean**: tampilan lapang, tidak ramai, tidak banyak ornamen.
- **Human**: bahasa sederhana, tidak kaku, mudah dipahami operator daerah.
- **Data-first**: angka, peta, grafik, dan rekomendasi tampil jelas.
- **Government-ready**: profesional, rapi, cocok untuk pemda/instansi.
- **Open-source friendly**: sederhana, mudah dikonfigurasi, tidak terlalu branded.
- **Not too AI-ish**: AI hadir sebagai fitur bantu, bukan identitas visual utama.

Produk ini bukan chatbot, bukan dashboard futuristik neon, dan bukan aplikasi yang terlihat seperti template AI startup. OpenSource-IKLI harus terasa seperti **alat kerja resmi untuk membaca kondisi layanan infrastruktur daerah**.

---

## 2. Prinsip Desain

### 2.1 Clarity First

Setiap halaman harus menjawab tiga pertanyaan:

1. Data apa yang sedang dilihat?
2. Wilayah/periode mana yang sedang dianalisis?
3. Tindakan apa yang bisa dilakukan berikutnya?

Hindari elemen visual yang tidak membantu pengambilan keputusan.

### 2.2 Calm Interface

Gunakan ruang kosong yang cukup, warna netral, dan hierarki yang jelas.

Jangan gunakan:

- gradient berlebihan;
- neon color;
- glowing card;
- ikon robot;
- ilustrasi AI yang terlalu futuristik;
- animasi berlebihan;
- efek kaca/glassmorphism yang terlalu ramai.

Boleh menggunakan visual modern, tetapi tetap harus terasa **tenang dan administratif**.

### 2.3 AI as Assistant, Not Main Character

Fitur AI/LLM hanya ditampilkan sebagai **Analisis Otomatis** atau **Insight Bantu**.

Gunakan istilah:

- Analisis Otomatis
- Ringkasan Komentar
- Rekomendasi Awal
- Bantuan Analisis
- Hasil Analisis Teks

Hindari istilah yang terlalu AI banget:

- Magic AI
- Super AI
- AI Genius
- Ask Robot
- AI Miracle
- Powered by AI everywhere
- Generate Everything

AI tidak boleh terlihat seperti pengambil keputusan final. Selalu beri konteks:

> Rekomendasi ini dihasilkan dari data survei dan perlu ditinjau oleh admin/analis sebelum digunakan dalam laporan resmi.

---

## 3. Visual Personality

### 3.1 Kesan Utama

Tampilan harus terasa:

```text
Bersih
Tenang
Profesional
Terstruktur
Data-driven
Mudah dipakai
Tidak berlebihan
```

### 3.2 Kesan yang Harus Dihindari

Hindari kesan:

```text
Terlalu startup AI
Terlalu ramai
Terlalu teknis
Terlalu gelap
Terlalu banyak animasi
Terlalu banyak warna
Terlalu seperti template admin murah
```

---

## 4. Warna

Gunakan palet warna yang netral dan civic-friendly.

### 4.1 Base Colors

```text
Background utama      : #F8FAFC
Surface/card          : #FFFFFF
Border                : #E2E8F0
Text utama            : #0F172A
Text sekunder         : #475569
Text muted            : #94A3B8
```

### 4.2 Primary Color

Gunakan biru yang tenang, bukan biru neon.

```text
Primary               : #2563EB
Primary hover         : #1D4ED8
Primary soft          : #DBEAFE
Primary text          : #1E40AF
```

Makna: kredibel, administratif, data, pemerintah, terpercaya.

### 4.3 Secondary / Success Color

Gunakan hijau lembut untuk status baik/positif.

```text
Success               : #16A34A
Success soft          : #DCFCE7
Success text          : #166534
```

### 4.4 Warning Color

Gunakan amber untuk perhatian/prioritas sedang.

```text
Warning               : #D97706
Warning soft          : #FEF3C7
Warning text          : #92400E
```

### 4.5 Danger Color

Gunakan merah matang untuk prioritas tinggi/masalah serius.

```text
Danger                : #DC2626
Danger soft           : #FEE2E2
Danger text           : #991B1B
```

### 4.6 Map Choropleth Colors

Untuk peta skor IKLI, gunakan gradasi yang mudah dibaca:

```text
Sangat Baik           : #15803D
Baik                  : #65A30D
Cukup                 : #F59E0B
Kurang                : #EA580C
Sangat Kurang         : #DC2626
Tidak ada data        : #CBD5E1
```

Gunakan legenda yang jelas. Jangan hanya mengandalkan warna; tampilkan juga angka skor dan kategori.

---

## 5. Tipografi

Gunakan font modern yang netral.

Rekomendasi:

```text
Font utama            : Inter
Alternatif            : Geist, Source Sans 3, IBM Plex Sans
Font angka/dashboard  : Inter / Geist
```

### 5.1 Ukuran Font

```text
Page title            : 28–32px / semibold
Section title         : 20–24px / semibold
Card title            : 14–16px / medium
Body                  : 14–16px / regular
Caption               : 12–13px / regular
Metric number         : 28–40px / semibold
Table text            : 13–14px
```

### 5.2 Gaya Teks

Gunakan gaya bahasa yang lugas.

Contoh baik:

> Skor IKLI menunjukkan tingkat kepuasan masyarakat terhadap layanan infrastruktur pada periode survei ini.

Contoh yang dihindari:

> Dengan kekuatan AI revolusioner, sistem kami mengungkap insight menakjubkan dari data daerah Anda.

---

## 6. Layout

### 6.1 Struktur Halaman Dashboard

Gunakan struktur konsisten:

```text
Header halaman
  ├── Judul
  ├── Deskripsi singkat
  └── Filter periode/wilayah

Ringkasan utama
  ├── Skor IKLI
  ├── Jumlah responden
  ├── Wilayah tercakup
  └── Prioritas utama

Konten analisis
  ├── Grafik indikator
  ├── Peta wilayah
  ├── Ranking wilayah
  └── Ringkasan komentar

Tindakan
  ├── Analisis otomatis
  ├── Export Excel
  └── Export laporan
```

### 6.2 Grid

Gunakan grid sederhana:

```text
Desktop:
- 12 column grid
- Gap 24px
- Container max-width 1440px

Tablet:
- 6 column grid
- Gap 20px

Mobile:
- 1 column
- Gap 16px
```

### 6.3 Spacing

Gunakan spacing konsisten:

```text
xs      4px
sm      8px
md      16px
lg      24px
xl      32px
2xl     48px
```

Card dashboard sebaiknya tidak terlalu padat.

---

## 7. Komponen UI

### 7.1 Card Statistik

Card statistik harus menampilkan:

```text
Label
Angka utama
Keterangan singkat
Perubahan/tren jika ada
```

Contoh:

```text
Skor IKLI
78,42
Kategori: Baik
Naik 3,2 poin dari periode sebelumnya
```

Gaya:

- background putih;
- border tipis;
- radius 12px;
- shadow sangat halus;
- tidak perlu gradient.

### 7.2 Button

Gunakan button sederhana.

```text
Primary button        : aksi utama
Secondary button      : aksi pendukung
Ghost button          : aksi ringan
Danger button         : hapus/reset
```

Contoh label button:

```text
Buat Survei
Lihat Dashboard
Jalankan Analisis
Export Excel
Upload GeoJSON
Simpan Pengaturan
```

Hindari label terlalu teknis:

```text
Execute AI Pipeline
Trigger LLM Engine
Run Smart Magic
```

### 7.3 Table

Table harus nyaman untuk data pemerintahan yang banyak.

Wajib ada:

- search;
- filter;
- sort;
- pagination;
- sticky header jika data panjang;
- empty state;
- export jika relevan.

Kolom angka harus rata kanan. Kolom teks rata kiri.

### 7.4 Form

Form survei harus sederhana dan tidak menakutkan responden.

Prinsip:

- satu pertanyaan terlihat jelas;
- instruksi pendek;
- validasi ramah;
- progress indicator jika pertanyaan banyak;
- tombol submit jelas.

Contoh validasi:

> Pilih wilayah terlebih dahulu sebelum mengirim jawaban.

Bukan:

> Error: region_id is required.

### 7.5 Filter

Filter dashboard harus selalu terlihat.

Filter utama:

```text
Periode survei
Wilayah
Jenis infrastruktur
Indikator
Status data
```

Gunakan filter chip setelah pengguna memilih filter.

Contoh:

```text
Periode: 2026
Wilayah: Purwokerto Utara
Infrastruktur: Jalan
```

---

## 8. Dashboard Design

### 8.1 Halaman Dashboard Utama

Urutan tampilan:

1. Skor IKLI total
2. Jumlah responden
3. Wilayah tercakup
4. Indikator terendah
5. Peta skor wilayah
6. Grafik skor per indikator
7. Ranking wilayah prioritas
8. Ringkasan komentar
9. Rekomendasi awal

### 8.2 Metric Card

Contoh metric card:

```text
IKLI Total
78,42
Baik

2.134 Responden
27 Kecamatan
301 Desa/Kelurahan
```

Jangan terlalu banyak angka dalam satu card.

### 8.3 Grafik

Gunakan grafik seperlunya.

Rekomendasi:

```text
Bar chart        : perbandingan indikator/wilayah
Line chart       : tren antarperiode
Radar chart      : profil indikator
Pie chart        : gunakan terbatas
Map              : visual utama untuk wilayah
```

Hindari 3D chart.

### 8.4 Ranking Prioritas

Ranking harus mudah dibaca.

Contoh:

```text
1. Kecamatan A
Skor IKLI: 58,4
Masalah dominan: Jalan rusak, drainase
Urgensi: Tinggi

2. Kecamatan B
Skor IKLI: 61,2
Masalah dominan: Air bersih
Urgensi: Sedang
```

Selalu tampilkan alasan prioritas, bukan hanya angka.

---

## 9. Map Design

### 9.1 Prinsip Peta

Peta adalah fitur utama, tetapi jangan membuatnya terlalu rumit.

Peta harus bisa menjawab:

```text
Wilayah mana yang skornya rendah?
Masalah apa yang dominan?
Berapa responden di wilayah itu?
Apa rekomendasi awalnya?
```

### 9.2 Tooltip Peta

Saat hover/click wilayah:

```text
Kecamatan Purwokerto Utara
Skor IKLI: 76,8
Kategori: Baik
Responden: 184
Keluhan dominan: Drainase, PJU
```

### 9.3 Sidebar Peta

Sidebar peta berisi:

```text
Filter wilayah
Filter jenis infrastruktur
Legenda skor
Ringkasan wilayah terpilih
Tombol lihat detail
```

### 9.4 Empty Geometry State

Jika wilayah belum punya GeoJSON:

> Peta belum tersedia untuk wilayah ini. Upload file GeoJSON untuk menampilkan batas wilayah pada dashboard.

Tampilkan tombol:

```text
Upload GeoJSON
Lihat panduan format
```

---

## 10. LLM / Analisis Otomatis UI

### 10.1 Penamaan Fitur

Gunakan label:

```text
Analisis Otomatis
Ringkasan Komentar
Rekomendasi Awal
Klasifikasi Keluhan
Analisis Sentimen
```

Jangan gunakan label yang terlalu AI:

```text
AI Brain
Magic Insight
Robot Analyst
Super Generate
```

### 10.2 Tampilan Hasil Analisis

Hasil LLM harus tampil sebagai insight yang bisa direview.

Struktur:

```text
Ringkasan
Tema utama
Sentimen umum
Wilayah prioritas
Rekomendasi awal
Catatan validasi
```

Tambahkan badge:

```text
Perlu Ditinjau
Sudah Disetujui
Diedit Analis
```

### 10.3 Disclaimer Halus

Tampilkan di area hasil AI:

> Hasil analisis otomatis membantu merangkum komentar responden. Tinjau kembali sebelum digunakan dalam laporan resmi.

Jangan membuat disclaimer terlalu menakutkan.

### 10.4 Loading State Analisis

Saat analisis berjalan:

> Sistem sedang membaca komentar responden dan menyusun ringkasan awal.

Hindari:

> AI sedang berpikir keras dengan kecerdasan super.

---

## 11. BYOK LLM Settings UI

Halaman:

```text
Pengaturan → Analisis Otomatis
```

Isi halaman:

```text
Status konfigurasi
Provider aktif
Model aktif
Base URL opsional
API key
Test koneksi
Log penggunaan
```

### 11.1 Input API Key

Tampilan:

```text
Provider
[ OpenAI / Gemini / Claude / Ollama / OpenAI-compatible ]

Model
[ input/select model ]

API Key
[ *************** ]

Base URL
[ opsional ]

[Test Koneksi]
[Simpan Pengaturan]
```

Setelah disimpan, API key tidak ditampilkan penuh.

Tampilkan:

```text
API key tersimpan: sk-••••••••••••A7d9
```

### 11.2 Empty State AI Settings

Jika belum dikonfigurasi:

> Analisis otomatis belum aktif. Tambahkan provider dan API key untuk mulai menganalisis komentar responden.

Tombol:

```text
Atur Provider
```

---

## 12. Empty State

### 12.1 Belum Ada Survei

> Belum ada survei IKLI. Buat survei pertama untuk mulai mengumpulkan data responden.

Tombol:

```text
Buat Survei
```

### 12.2 Belum Ada Responden

> Survei sudah aktif, tetapi belum ada responden yang masuk. Bagikan link atau QR survei kepada masyarakat/enumerator.

Tombol:

```text
Salin Link Survei
Lihat QR Code
```

### 12.3 Belum Ada Wilayah

> Data wilayah belum tersedia. Import wilayah agar hasil survei dapat dipetakan secara dinamis.

Tombol:

```text
Import Wilayah
Upload GeoJSON
```

### 12.4 Belum Ada Analisis Otomatis

> Komentar responden belum dianalisis. Jalankan analisis otomatis untuk melihat tema keluhan dan rekomendasi awal.

Tombol:

```text
Jalankan Analisis
```

---

## 13. Copywriting

### 13.1 Tone

Gunakan tone:

```text
Jelas
Tenang
Profesional
Tidak menggurui
Tidak terlalu teknis
Tidak berlebihan
```

### 13.2 Contoh Copy Baik

```text
Data berhasil disimpan.
Survei berhasil dipublikasikan.
Analisis otomatis selesai.
Wilayah belum memiliki data peta.
Skor dihitung berdasarkan jawaban responden pada periode aktif.
```

### 13.3 Contoh Copy yang Dihindari

```text
Wow! AI berhasil menemukan insight luar biasa.
Data magic berhasil digenerate.
Oopsie, something went wrong.
Error 500.
Invalid payload.
```

---

## 14. Status dan Badge

### 14.1 Status Survei

```text
Draft
Aktif
Ditutup
Dianalisis
Diarsipkan
```

### 14.2 Status Analisis

```text
Belum Dianalisis
Diproses
Perlu Ditinjau
Disetujui
Gagal
```

### 14.3 Status Wilayah

```text
Lengkap
Tanpa Peta
Data Kurang
Tidak Ada Responden
```

---

## 15. Accessibility

Minimal:

- kontras teks harus jelas;
- tombol bisa diakses keyboard;
- grafik punya label;
- peta punya tooltip dan tabel alternatif;
- warna tidak menjadi satu-satunya penanda status;
- form punya label yang jelas;
- error message mudah dipahami.

Contoh untuk peta:

Selain warna, tampilkan juga:

```text
Skor: 58,4
Kategori: Kurang
```

---

## 16. Responsive Design

### Desktop

Fokus pada dashboard lengkap:

```text
Sidebar navigation
Header filter
Metric cards
Map besar
Chart dan table
```

### Tablet

Dashboard tetap nyaman:

```text
Sidebar bisa collapse
Map dan chart stack
Filter menjadi drawer
```

### Mobile

Fokus pada:

```text
Form survei
Ringkasan dashboard
Card list
Tabel sederhana
```

Peta di mobile boleh dibuat lebih sederhana.

---

## 17. Navigation

Sidebar utama:

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

Untuk Super Admin:

```text
Organisasi
Template Survei
Pengguna
Pengaturan Sistem
```

---

## 18. Icon Style

Gunakan ikon outline sederhana.

Rekomendasi:

```text
Lucide Icons
Heroicons
```

Hindari:

- ikon 3D;
- ikon robot;
- ikon otak AI berlebihan;
- ilustrasi futuristik;
- emoji terlalu banyak.

---

## 19. Motion / Animation

Gunakan animasi ringan saja.

Boleh:

```text
Fade in ringan
Skeleton loading
Button hover
Drawer transition
Map zoom
```

Hindari:

```text
Animasi neon
Card melayang berlebihan
Loading AI dengan efek sci-fi
Parallax kompleks
```

Durasi animasi:

```text
150ms - 250ms
```

---

## 20. Design Tokens

Contoh token awal:

```css
:root {
  --background: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;

  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-soft: #dbeafe;

  --success: #16a34a;
  --success-soft: #dcfce7;

  --warning: #d97706;
  --warning-soft: #fef3c7;

  --danger: #dc2626;
  --danger-soft: #fee2e2;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  --shadow-card: 0 1px 2px rgba(15, 23, 42, 0.06);
}
```

---

## 21. Page-Level Guidelines

### 21.1 Login Page

Karakter:

```text
Sederhana
Resmi
Tidak terlalu marketing
```

Elemen:

```text
Logo aplikasi
Nama daerah/organisasi jika tersedia
Form login
Link dokumentasi
```

### 21.2 Public Survey Page

Karakter:

```text
Ramah
Mudah dipahami masyarakat
Cepat diisi
Mobile-first
```

Wajib:

```text
Judul survei
Deskripsi singkat
Estimasi waktu pengisian
Progress
Pertanyaan jelas
Submit confirmation
```

### 21.3 Admin Dashboard

Karakter:

```text
Padat data tetapi tetap lapang
Fokus pada ringkasan dan prioritas
```

Wajib:

```text
Filter periode/wilayah
Metric card
Peta
Grafik
Ranking
Insight
```

### 21.4 Region Management

Karakter:

```text
Teknis tetapi tetap dibimbing
```

Wajib:

```text
Import wilayah
Upload GeoJSON
Validasi data
Preview struktur wilayah
Status kelengkapan peta
```

### 21.5 Report Page

Karakter:

```text
Siap laporan
Rapi
Formal
```

Wajib:

```text
Daftar laporan
Status generate
Preview ringkasan
Download Excel/DOCX/PDF
```

---

## 22. UX Rules Khusus IKLI

### 22.1 Jangan Tampilkan Skor Tanpa Konteks

Jangan hanya tampilkan:

```text
58,4
```

Tampilkan:

```text
Skor IKLI: 58,4
Kategori: Kurang
Responden: 128
Indikator terendah: Pemeliharaan jalan
```

### 22.2 Selalu Tampilkan Jumlah Responden

Setiap skor harus punya konteks jumlah data.

```text
Skor: 72,1
Berdasarkan 214 responden
```

### 22.3 Pisahkan Fakta dan Rekomendasi

Fakta:

```text
Skor drainase di Kecamatan A adalah 54,2.
```

Rekomendasi:

```text
Kecamatan A disarankan menjadi prioritas perbaikan drainase.
```

Jangan campur keduanya tanpa label.

### 22.4 Rekomendasi AI Harus Bisa Diedit

Setiap hasil analisis otomatis harus punya aksi:

```text
Setujui
Edit
Tolak
Regenerate
```

---

## 23. Microcopy Penting

### Success

```text
Survei berhasil dipublikasikan.
Data wilayah berhasil diimpor.
Analisis otomatis selesai.
Pengaturan AI berhasil disimpan.
```

### Error

```text
Data belum lengkap. Periksa kembali isian yang wajib diisi.
File GeoJSON tidak sesuai format.
Koneksi ke provider AI gagal. Periksa API key atau Base URL.
```

### Warning

```text
Wilayah ini belum memiliki data peta.
Jumlah responden masih rendah untuk analisis yang kuat.
Hasil analisis otomatis perlu ditinjau sebelum digunakan.
```

---

## 24. Design Do and Don’t

### Do

```text
Gunakan layout lapang.
Gunakan warna netral.
Tampilkan angka dengan konteks.
Beri filter yang jelas.
Buat peta mudah dibaca.
Gunakan bahasa sederhana.
Buat hasil AI bisa direview.
```

### Don’t

```text
Jangan gunakan neon gradient.
Jangan jadikan AI sebagai branding utama.
Jangan tampilkan skor tanpa jumlah responden.
Jangan terlalu banyak chart dalam satu layar.
Jangan gunakan istilah teknis untuk masyarakat.
Jangan simpan API key dalam bentuk plain text.
Jangan tampilkan API key penuh di frontend.
```

---

## 25. Referensi Karakter Visual

Karakter visual yang diinginkan:

```text
Civic dashboard
Open data portal
Modern government analytics
Clean SaaS admin
Public service insight platform
```

Bukan:

```text
AI chatbot dashboard
Crypto dashboard
Gaming dashboard
Neon startup landing page
Dark futuristic command center
```

---

## 26. Final Design Direction

OpenSource-IKLI harus terlihat seperti:

> Platform kerja resmi yang membantu pemerintah daerah memahami kepuasan masyarakat terhadap layanan infrastruktur melalui survei, peta, dashboard, dan analisis otomatis yang transparan.

Visual utamanya:

```text
Putih
Biru tenang
Abu-abu netral
Hijau/kuning/merah untuk status
Peta jelas
Grafik sederhana
Card bersih
Bahasa manusia
AI tidak berlebihan
```

Kesimpulan karakter:

```text
Clean, civic, practical, trustworthy, data-first, human-readable.
```
