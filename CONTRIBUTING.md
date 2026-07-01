# Contributing to OpenSource-IKLI

Terima kasih ingin berkontribusi ke OpenSource-IKLI.

## Prinsip Kontribusi

- Ikuti spesifikasi fitur dan roadmap yang tertera di GitHub Issues.
- Jangan membuat fitur di luar scope tanpa mendiskusikannya terlebih dahulu melalui issue/discussion.
- Jangan menambahkan API key atau secret ke repositori.
- Jangan menggunakan LLM/AI untuk perhitungan skor IKLI (perhitungan harus deterministik).
- Jangan menulis kode wilayah secara hardcode (gunakan relasi database wilayah).
- Gunakan desain UI/UX yang bersih, modern, dan profesional sesuai dengan standar usability.

## Setup Lokal

```bash
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Sebelum Pull Request

Jalankan pengujian lokal berikut untuk memastikan tidak ada eror:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

## Pull Request Checklist

- [ ] Fitur berjalan sesuai spesifikasi di issue/roadmap.
- [ ] Tampilan UI konsisten dengan tema aplikasi dan responsif.
- [ ] Tidak ada secret/API key yang tidak sengaja ter-commit.
- [ ] Pemeriksaan hak akses (role permission) sudah diterapkan.
- [ ] Keamanan pembatasan data organisasi (organization scoping) aman.
- [ ] Status kosong (empty state), loading, dan error tersedia pada UI.
- [ ] Dokumentasi atau README diperbarui jika ada perubahan skema/setup.

