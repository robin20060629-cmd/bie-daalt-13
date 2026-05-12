# ADR-001: Stack сонголт — Node.js + Express + SQLite

**Огноо:** 2026-05-10  
**Статус:** Accepted  
**Шийдвэр гаргасан:** AI planning session-д суурилан

---

## Нөхцөл байдал (Context)

Markdown Note-taking App-ийг 2 долоо хоногт барих шаардлагатай. Сэдэв нь:
- Note CRUD
- Full-text search
- Tag систем
- PDF export
- React frontend

Stack сонголт нь хөгжүүлэлтийн хурд, суралцахын хялбар, deploy хялбар байдалд нөлөөлнө.

---

## Авч үзсэн сонголтууд

1. **Node.js + Express + SQLite** (сонгосон)
2. Python + FastAPI + SQLite
3. Node.js + Fastify + PostgreSQL

Дэлгэрэнгүй: `partA/STACK-COMPARISON.md`

---

## Шийдвэр (Decision)

**Node.js + Express + SQLite** ашиглана.

---

## Шалтгаан (Rationale)

- **JS нэгдмэл байдал**: Frontend (React) болон backend аль аль нь JavaScript — context switch байхгүй, type definition хуваалцана.
- **SQLite FTS5**: Full-text search нь built-in, тусдаа Elasticsearch/Meilisearch гэх мэт service хэрэггүй.
- **Zero setup**: `notes.db` нэг файл — Docker, connection string, migration tool хэрэггүй.
- **Хугацаа**: 2 долоо хоног богино — хамгийн хурдан эхлэх боломжтой stack.

---

## Үр дагавар (Consequences)

**Эерэг:**
- npm install хийгээд л ажиллана
- JS/TS ecosystem бүрэн ашиглах боломж
- SQLite FTS5 хурдан хайлт

**Сөрөг:**
- SQLite concurrent write-д сул (энэ апп-д single-user тул хамаагүй)
- Express нь FastAPI-тай харьцуулахад auto Swagger docs үгүй — OpenAPI yaml гараар
- Production scale-д (10k+ users) хожим PostgreSQL руу шилжих хэрэгтэй болж болно

---

## Хянасан: AI Session
`partA/ai-sessions/plan.md` файлд харна уу.