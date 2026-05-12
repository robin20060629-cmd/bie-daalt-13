# AI Usage Report — Markdown Note-taking App

**F.CSM311 Бие даалт 13 — В хэсэг**  
**Огноо:** 2026-05-10  
**Хэрэглэсэн AI:** Claude (Anthropic) — claude.ai  

---

## 1. Юуг AI хийсэн, юуг өөрөө хийсэн?

### AI хийсэн зүйлс

**Архитектур төлөвлөлт (Part A):**  
AI-тай хамтран stack сонголт хийсэн. Гурван сонголт (Node.js+Express, Python+FastAPI, Node.js+Fastify+PostgreSQL) харьцуулахад AI тус бүрийн давуу болон сул талыг тайлбарласан. SQLite FTS5 full-text search built-in байдаг тул тусдаа search service хэрэггүй гэдгийг AI-аас сурсан — энэ мэдлэг надад байгаагүй.

**Database schema:**  
`notes_fts` virtual table болон FTS5 trigger-ийн syntax-г AI санал болгосон. SQLite FTS5-ийн `snippet()` функцийг ч AI-аас олж мэдсэн.

**Error handler middleware:**  
Express-ийн 4 argument error handler (`err, req, res, next`) pattern-г AI тайлбарлаж, production mode-д stack trace нуух аргыг санал болгосон.

**Slash command бичиглэл:**  
4 slash command-ийн бүтэц, агуулга AI-тай хамтран бичсэн. Ялангуяа OWASP Top 10 жагсаалтыг `/security` command-д багтаахад AI туслалцаа үзүүлсэн.

### Өөрөө хийсэн зүйлс

**Бизнес логик шийдвэр:**  
Tag системийг many-to-many relationship-аар зохион байгуулах шийдвэрийг өөрөө гаргасан. AI note-д tag array шууд хадгалах (JSON column) санал болгосон боловч хайлт, шүүлтийн хувьд relational approach илүү тохиромжтой гэж өөрөө шийдсэн.

**Frontend бүтэц:**  
React компонентуудын задаргаа (NoteList, NoteEditor, SearchBar, MarkdownPreview) өөрөө тодорхойлсон.

**Тест кейс бичих:**  
AI edge case санал болгосон боловч тест кодыг гараар бичсэн. Ялангуяа `beforeEach`-д database цэвэрлэх логик болон `afterAll`-д холболт хаах — тест isolation-г өөрөө хариуцсан.

**Debugging:**  
`better-sqlite3` synchronous API болон `html-pdf-node` async API хоёрыг нэгтгэхэд асуудал гарсан. AI шалтгааныг тайлбарласан боловч `async/await` зөв байрлуулах ажлыг өөрөө хийсэн.

---

## 2. Hallucination жишээнүүд — AI буруу зүйл санал болгосон

### Жишээ 1: `node-htmlpdf` санал болгосон

**Нөхцөл:** PDF export feature хийхэд AI `node-htmlpdf` package ашиглахыг санал болгосон.

**Асуудал:** `npm install node-htmlpdf` хийхэд package deprecated болсон, сүүлийн update 2019 онд байсан, Node.js 18+ дээр ажиллахгүй гэсэн warning гарсан.

**Яаж олж мэдсэн:** `npm install` хийхэд deprecation warning гарсан. npm-д шалгахад last publish 2019/02/14 байсан.

**Засвар:** `html-pdf-node` ашигласан — идэвхтэй хадгалагддаг, puppeteer-д суурилсан, Node 18+ дэмждэг.

**Сургамж:** AI package санал болгохдоо version, activity шалгадаггүй байж болно. `npm` дээр ямагт шалгах хэрэгтэй.

### Жишээ 2: FTS5 trigger syntax алдаа

**Нөхцөл:** AI FTS5 auto-sync trigger дараах байдлаар бичихийг санал болгосон:

```sql
-- AI санал болгосон (БУРУУ)
CREATE TRIGGER notes_au AFTER UPDATE ON notes BEGIN
  DELETE FROM notes_fts WHERE rowid = old.id;
  INSERT INTO notes_fts VALUES (new.id, new.title, new.content);
END;
```

**Асуудал:** FTS5 virtual table-аас `DELETE` шууд хийх боломжгүй. Runtime error гарсан: `cannot DELETE from fts5 table`.

**Яаж олж мэдсэн:** Database migration ажиллуулахад SQLite error гарсан. SQLite FTS5 official documentation шалгасан.

**Засвар:** `'delete'` command ашиглах зөв syntax:
```sql
INSERT INTO notes_fts(notes_fts, rowid, title, content) VALUES ('delete', old.id, old.title, old.content);
```

**Сургамж:** AI-ийн SQLite FTS5 мэдлэг дутуу байсан. Баримт бичгийг заавар шалгах нь чухал.

---

## 3. Security/License анхааралд авсан зүйлс

### Security жишээ: FTS5 query injection

**Асуудал:** `/api/search?q=` endpoint-д хэрэглэгчийн input шууд FTS5 MATCH query-д орж байсан. FTS5 нь SQL injection биш боловч өөрийн syntax дагуу `AND`, `OR`, `NOT` оператор дэмждэг тул хэрэглэгч `"* NOT *"` гэх мэт query оруулж бүх note-г FTS result-аас хассан тохиолдол.

**Илэрсэн байдал:** `/security` slash command ажиллуулсан үед AI энэ asуудлыг анхааруулсан.

**Засвар:** FTS5 query-д invalid syntax орвол `try/catch`-аар барьж 400 status буцаасан:
```javascript
} catch (err) {
  if (err.message.includes('fts5')) {
    return res.status(400).json({ error: 'Invalid search query syntax' });
  }
  throw err;
}
```

**Сургамж:** AI-аас гарсан код security perspective-ээс шалгах нь заавал хэрэгтэй — AI "ажиллах" кодыг "аюулгүй" кодтой адилтгадаггүй.

---

## 4. Юуг AI-аар хурдан хийсэн?

- **Boilerplate код**: Express app.js, middleware бүтэц, CORS тохиргоо — 5 минутад хийсэн. Өөрөө хийвэл 30+ минут болох байсан.
- **SQL schema**: `notes`, `tags`, `note_tags` хүснэгтийн DDL — AI нэг удаад зөв бичсэн.
- **Документ бичих**: ARCHITECTURE.md-ийн Mermaid диаграм syntax-г AI санал болгосон — өөрөө судлах байсан бол 1+ цаг болох байсан.
- **OpenAPI yaml бүтэц**: API баримт бичгийн format AI тайлбарласан.

---

## 5. Юуг AI-аар удаан хийсэн?

- **`html-pdf-node` тохиргоо**: Deprecated package санал болгосон тул дахин судалж, шинэ library олж, тохируулахад нэмэлт цаг зарцуулсан.
- **FTS5 trigger debug**: AI-ийн буруу syntax засахад SQLite documentation уншиж судлах хэрэг болсон — энэ нь AI ашиглаагүй байсан бол documentation-аас шууд зөв хийх байсан байж болно.
- **Тайлбар нэг бүрийг шалгах**: AI бичсэн бүх кодыг ойлгож, шалгах шаардлагатай байсан — "copy-paste" хийгээд л ажиллуулах арга бас эрсдэлтэй гэдгийг ойлгосон.

---

## 6. Skill atrophy — "AI байхгүй" цаг гарсан уу?

Тийм. Нэг тохиолдолд интернэт тасарсан үед `better-sqlite3` API-г ашиглах хэрэг болсон. AI туслалцаагүйгээр official documentation уншаад өөрөө шийдсэн — гэхдээ анхандаа AI-г хэтэрхий хамааралтай болчихоод байснаа мэдрэв.

**Дүгнэлт:** AI нь хурдасгагч хэрэгсэл — орлуулагч биш. Суурь ойлголтгүйгээр AI-г ашиглах нь code-г "дуусгах" боловч өөрийн мэдлэгийг хөгжүүлдэггүй. Тиймээс AI санал болгосон бүх зүйлийг ойлгохыг хичээсэн — шууд copy хийгүй.

---

## Дүгнэлт

Энэ бие даалтаар AI-тай хамтран ажиллах практик workflow эзэмшсэн:

1. **Spec → AI → Review → Integrate** — AI-г design partner болгон ашигласан
2. AI-ийн hallucination-г npm, official docs-аар баталгаажуулах дадал сурсан
3. Security шалгалтыг кодын нэг хэсэг болгох (slash commands) практик хэрэгтэй гэдгийг мэдсэн
4. "AI бичсэн" гэж зарлахгүй байх — AI output-ийг өөрийн мэдлэгээр шүүж, засаж, хариуцлага үүрэх чухал

*Нийт AI session: 8+ цаг | Нийт кодын ~40% AI санал болгосон, ~60% өөрөө засварлаж бичсэн*