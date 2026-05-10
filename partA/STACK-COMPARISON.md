# Stack Comparison — Markdown Note-taking App

## Харьцуулсан 3 stack

| Шалгуур | **Node.js + Express + SQLite** ✅ | Python + FastAPI + SQLite | Node.js + Fastify + PostgreSQL |
|---------|----------------------------------|--------------------------|-------------------------------|
| Хурд (dev) | ⭐⭐⭐⭐⭐ Маш хурдан | ⭐⭐⭐⭐ Хурдан | ⭐⭐⭐ Дунд (PG setup) |
| Сурахад хялбар | ⭐⭐⭐⭐⭐ JS нэг хэл | ⭐⭐⭐ Python мэдэх хэрэгтэй | ⭐⭐⭐⭐ JS боловч Fastify шинэ |
| React-тай нийцэл | ⭐⭐⭐⭐⭐ JS/TS нэгдмэл | ⭐⭐⭐ 2 хэл хольсон | ⭐⭐⭐⭐⭐ JS нэгдмэл |
| Full-text search | ⭐⭐⭐⭐ SQLite FTS5 | ⭐⭐⭐⭐ SQLite FTS5 | ⭐⭐⭐⭐⭐ pg_trgm, tsvector |
| PDF export | ⭐⭐⭐⭐ puppeteer/html-pdf | ⭐⭐⭐⭐ weasyprint | ⭐⭐⭐⭐ puppeteer |
| Deploy хялбар | ⭐⭐⭐⭐⭐ .db file нэг л зүйл | ⭐⭐⭐⭐ .db file | ⭐⭐ PG server хэрэгтэй |
| Ecosystem | ⭐⭐⭐⭐⭐ npm маш том | ⭐⭐⭐⭐⭐ pip том | ⭐⭐⭐⭐⭐ npm том |
| Production ready | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ FastAPI маш хурдан | ⭐⭐⭐⭐⭐ |

## Яагаад Node.js + Express + SQLite сонгосон бэ?

1. **Нэг хэл** — Frontend (React) болон backend аль аль нь JavaScript. Context switching байхгүй.
2. **SQLite FTS5** — Full-text search built-in, тусдаа search engine хэрэггүй.
3. **Zero-config database** — SQLite file-based тул Docker, PostgreSQL server тохиргоо хэрэггүй. `npm install` хийгээд л ажиллана.
4. **Express ecosystem** — `supertest` тестийн хувьд, `better-sqlite3` performant sync API, `html-pdf-node` PDF-ийн хувьд — бүгд сайн баримтжуулсан.
5. **2 долоо хоногт хүрэлцэнэ** — Хамгийн бага тохиргоо, хамгийн хурдан prototype.

## Сул тал
- SQLite concurrent write-д сул (энэ апп-д хамаагүй, single-user)
- Express нь FastAPI-тай харьцуулахад auto API docs байхгүй (OpenAPI yaml гараар бичнэ)