# Markdown Note-taking App

> F.CSM311 Бие даалт 13 — AI-Assisted Software Construction

Markdown форматаар тэмдэглэл хөтлөх, бүрэн текст хайлт хийх, PDF экспорт хийх веб апп.

---

## Features

- 📝 **Note CRUD** — тэмдэглэл үүсгэх, засах, устгах
- 🔍 **Full-text search** — гарчиг болон контентоор хайх (SQLite FTS5)
- 🏷️ **Tag систем** — note-д олон tag нэмэх, tag-аар шүүх
- 👁️ **Markdown preview** — бичихийн зэрэгцээ харах
- 📄 **PDF export** — note-ийг PDF болгон татах

---

## Stack

| | |
|--|--|
| Backend | Node.js 20 + Express 4 |
| Database | SQLite (better-sqlite3) |
| Frontend | React 18 + Vite |
| Testing | Jest + supertest |

---

## Хурдан эхлэх

```bash
# 1. Clone
git clone https://github.com/<username>/bie-daalt-13.git
cd bie-daalt-13

# 2. Backend
cd partB
npm install
npm run dev       # http://localhost:3001

# 3. Frontend (шинэ terminal)
cd partB/frontend
npm install
npm run dev       # http://localhost:5173

# 4. Тест
cd partB
npm test
```

---

## API Endpoints

| Method | URL | Тайлбар |
|--------|-----|---------|
| GET | `/api/notes` | Бүх note жагсаалт |
| POST | `/api/notes` | Шинэ note үүсгэх |
| GET | `/api/notes/:id` | Нэг note авах |
| PUT | `/api/notes/:id` | Note засах |
| DELETE | `/api/notes/:id` | Note устгах |
| GET | `/api/search?q=...` | Full-text хайлт |
| GET | `/api/notes/:id/pdf` | PDF export |

Дэлгэрэнгүй: `partB/openapi.yaml`

---

## Директор бүтэц

```
bie-daalt-13/
├── CLAUDE.md           # AI гарын авлага
├── partA/              # Plan
├── partB/              # Build (эх код)
│   ├── src/
│   ├── tests/
│   └── frontend/
└── partC/              # Reflect
```

---

## Тест ажиллуулах

```bash
cd partB
npm test                 # бүх тест
npm run test:coverage    # coverage report
```

---
