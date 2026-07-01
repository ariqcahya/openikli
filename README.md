# OpenSource-IKLI

**OpenSource-IKLI** adalah platform open-source untuk survei, dashboard, pemetaan wilayah, scoring, analisis komentar otomatis, dan export laporan **Indeks Kepuasan Layanan Infrastruktur**.

Platform ini dirancang agar dapat digunakan oleh kabupaten, kota, provinsi, instansi, peneliti, dan komunitas tanpa hardcode wilayah.

---

## Fitur Utama

- Survei IKLI digital
- Public survey form
- Dashboard skor IKLI
- Scoring deterministik
- Peta wilayah dinamis
- Import wilayah
- Upload GeoJSON
- PostgreSQL + PostGIS
- Analisis komentar dengan LLM
- BYOK LLM via dashboard admin
- API key LLM terenkripsi
- Export Excel
- Draft laporan DOCX
- Multi-organisasi
- Role-based access control
- Coolify-ready

---

## Prinsip Penting

```text
LLM tidak menghitung skor IKLI.
LLM hanya membantu analisis komentar dan rekomendasi awal.
Skor IKLI dihitung dengan rumus deterministik agar transparan dan dapat diaudit.
```

API key LLM tidak menggunakan ENV. Admin memasukkan API key melalui dashboard dan sistem menyimpannya secara terenkripsi di database.

---

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend | Next.js + TypeScript |
| Backend | Next.js API Routes / Server Actions |
| Database | PostgreSQL + PostGIS |
| ORM | Prisma |
| UI | Tailwind CSS + shadcn/ui |
| Map | MapLibre GL / Leaflet |
| Chart | Recharts / ECharts |
| LLM | BYOK provider |
| Deploy | Docker Compose + Coolify |

---

## Struktur Repo

```text
opensource-ikli/
├── apps/
│   └── web/
├── packages/
│   ├── database/
│   ├── shared/
│   └── ui/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start Local

```bash
git clone https://github.com/ariqcahya/openikli.git
cd openikli
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Buka:

```text
http://localhost:3001
```

### Akun Login Bawaan (Seed Data)

Setelah melakukan `pnpm db:seed`, Anda dapat masuk ke dashboard menggunakan kredensial bawaan berikut (seluruh akun menggunakan password: `adminpassword123`):

*   **Super Admin**:
    *   **Nomor HP**: `081234567890`
    *   **Role**: `SUPER_ADMIN`
*   **Admin Daerah**:
    *   **Nomor HP**: `081234567891`
    *   **Role**: `ADMIN_DAERAH`
*   **Analis**:
    *   **Nomor HP**: `081234567892`
    *   **Role**: `ANALIS`
*   **Enumerator**:
    *   **Nomor HP**: `081234567893`
    *   **Role**: `ENUMERATOR`
*   **Viewer**:
    *   **Nomor HP**: `081234567894`
    *   **Role**: `VIEWER`

---

## Quick Start Docker Compose

```bash
git clone https://github.com/ariqcahya/openikli.git
cd openikli
cp .env.example .env
docker compose up -d
```

Buka:

```text
http://localhost:3000
```

---

## Deploy di Coolify

1. Fork repository.
2. Buka Coolify.
3. Buat project baru.
4. Add Resource.
5. Pilih repository.
6. Pilih build pack: Docker Compose.
7. Pilih `docker-compose.yml`.
8. Isi ENV:
   - `POSTGRES_PASSWORD`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `ENCRYPTION_KEY`
   - `APP_URL`
9. Set domain.
10. Deploy.

---

## Environment Variable

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

Tidak perlu:

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

API key LLM dimasukkan dari dashboard admin secara terenkripsi.

---

## Role

- `SUPER_ADMIN`
- `ADMIN_DAERAH`
- `ANALIS`
- `ENUMERATOR`
- `VIEWER`
- `PUBLIC`

---

## Modul

- Auth
- Organization
- User & Role
- Region
- GeoJSON
- Survey
- Public Form
- Scoring
- Dashboard
- Map
- AI Settings
- AI Analysis
- Recommendation
- Export
- Report
- Audit Log

---

## License

Proyek ini dirilis di bawah lisensi:

```text
MIT License
```

