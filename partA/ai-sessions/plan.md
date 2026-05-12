# AI Planning Session — Plan хэсэг

**Огноо:** 2026-05-10
**Хэрэглэсэн AI:** Claude (Anthropic) — claude.ai
**Зорилго:** Markdown Note-taking App-ийн архитектур, stack, директор бүтэц тодорхойлох

---

## Session товч

### Асуулт 1: Stack сонголт
**Би:** "Markdown note-taking app хийхэд ямар stack ашиглах вэ? Node.js+Express, Python+FastAPI, эсвэл Node.js+Fastify+PostgreSQL?"

**AI:** Node.js + Express + SQLite санал болгосон. Гол шалтгаан:
- React frontend-тай JS нэгдмэл байдал
- SQLite FTS5 full-text search built-in
- 2 долоо хоногт хурдан барих боломж
- Zero-config database

### Асуулт 2: Архитектур
**Би:** "Модулийн бүтцийг яаж зохион байгуулах вэ?"

**AI:** Давхарга бүтэц санал болгосон:
- Routes → Controllers → Services → Database
- Frontend: components + api layer тусдаа

### Асуулт 3: Full-text search
**Би:** "SQLite дээр full-text search яаж хийх вэ?"

**AI:** FTS5 virtual table ашиглахыг санал болгосон:
```sql
CREATE VIRTUAL TABLE notes_fts USING fts5(title, content, content=notes);
```
Trigger-ээр автомат sync хийнэ.

### Асуулт 4: PDF export
**Би:** "PDF export-д ямар library ашиглах вэ?"

**AI:** `html-pdf-node` санал болгосон — markdown → HTML → PDF pipeline:
- `marked` library markdown-г HTML болгоно
- `html-pdf-node` HTML-г PDF болгоно

---

## AI санал болгосон зүйлсийн шалгалт

| AI санал | Баталгаажуулсан эсэх | Тайлбар |
|---------|---------------------|---------|
| SQLite FTS5 | ✅ | SQLite 3.9+ built-in, better-sqlite3 дэмждэг |
| html-pdf-node | ✅ | npm-д байна, puppeteer-д суурилсан |
| Express 4 | ✅ | Тогтвортой, сайн баримтжуулсан |
| Jest + supertest | ✅ | Express API тестэд стандарт хэрэгсэл |

## Халлюцинаци анхаарал
- AI `express-validator` санал болгосон — шалгаад `zod` илүү энгийн байсан тул өөрчилсөн
- AI `node-htmlpdf` санал болгосон — deprecated байсан, `html-pdf-node` ашигласан

---

*Тэмдэглэл: Chat history товчилсон — бүрэн session claude.ai дээр хадгалагдсан*