# Contributing to OpenSource-IKLI

Terima kasih ingin berkontribusi ke OpenSource-IKLI.

## Prinsip Kontribusi

- Ikuti `PRD.md`.
- Ikuti `DESIGN_GUIDELINES.md`.
- Jangan membuat fitur di luar scope tanpa issue/discussion.
- Jangan menambahkan API key atau secret ke repo.
- Jangan membuat scoring IKLI menggunakan LLM.
- Jangan membuat wilayah hardcode.
- Jangan membuat UI terlalu “AI-ish”.

## Setup Lokal

```bash
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Sebelum Pull Request

Jalankan:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

## Pull Request Checklist

- [ ] Fitur sesuai PRD/PLAN/TASKS.
- [ ] UI sesuai design guidelines.
- [ ] Tidak ada secret.
- [ ] Role permission dicek.
- [ ] Organization scoping aman.
- [ ] Empty/loading/error state tersedia.
- [ ] Dokumentasi diperbarui jika perlu.
