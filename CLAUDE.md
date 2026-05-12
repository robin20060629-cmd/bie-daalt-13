# CLAUDE.md

> Claude Code болон AI assistant-уудад зориулсан репо гарын авлага.
> Энэ файлыг **үргэлж эхлээд уншина** — дараа нь код бич.

---

## Төслийн тухай товч

**Markdown Note-taking App** — Node.js/Express REST API + React SPA.  
Хэрэглэгч markdown тэмдэглэл үүсгэж, хайлт хийж, PDF экспорт хийнэ.

---

## Build & Run командууд

```bash
# Backend суулгах + ажиллуулах
cd partB
npm install
npm run dev          # nodemon-тай dev mode (port 3001)
npm start            # production mode

# Frontend суулгах + ажиллуулах
cd partB/frontend
npm install
npm run dev          # Vite dev server (port 5173)

# Тест ажиллуулах
cd partB
npm test             # Jest бүх тест
npm run test:watch   # watch mode

# Database reset
cd partB
npm run db:reset     # notes.db устгаж дахин үүсгэнэ
```

---

## Code conventions

### Файл нэрлэлт
- `camelCase.js` — JS файлууд
- `PascalCase.jsx` — React компонентууд
- `kebab-case.md` — Markdown файлууд

### API хариу формат
```json
// Амжилттай
{ "data": { ... }, "message": "OK" }

// Алдаа
{ "error": "Not found", "code": 404 }
```

### Commit формат — Conventional Commits
```
feat: тэмдэглэл үүсгэх endpoint нэмсэн
fix: хайлтын тэг шүүлт засварлав
docs: README-д API жишээ нэмсэн
test: notes CRUD тест нэмсэн
refactor: NoteService дахин зохион байгуулав
chore: dependencies шинэчилсэн
```

### AI ашигласан commit
```
feat: PDF export feature нэмсэн

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## No-go zones 🚫

> Эдгээр зүйлийг **хэзээ ч хийхгүй** — асуухад ч гэсэн татгалзана:

1. **`notes.db` файлыг commit хийхгүй** — `.gitignore`-д байна
2. **`node_modules/` commit хийхгүй**
3. **Port 3001-ийг өөрчлөхгүй** — frontend proxy тохиргоотой уялдсан
4. **Synchronous file I/O ашиглахгүй** `fs.readFileSync` биш `fs.promises` хэрэглэ
5. **`eval()` ашиглахгүй** — security risk
6. **Raw SQL-д user input шууд оруулахгүй** — parameterized query үргэлж ашиглана
7. **`console.log` production code-д үлдээхгүй** — logger ашиглана

---

## Архитектурын шийдвэрүүд

| # | Шийдвэр | Файл |
|---|---------|------|
| ADR-001 | Stack сонголт: Node.js + Express + SQLite | `partA/adr/0001-stack-decision.md` |
| ADR-002 | *(build явцад нэмэгдэнэ)* | `partC/adr/0002-*.md` |

---

## Slash командууд

`.claude/commands/` доторх командуудыг `/review`, `/test` гэх мэтээр ажиллуулна.

| Команд | Зорилго |
|--------|---------|
| `/review` | Security + robustness шалгалт |
| `/test` | Edge case тест үүсгэх |
| `/docs` | JSDoc + README шинэчлэх |
| `/commit` | Conventional commit message үүсгэх |
| `/security` | OWASP Top 10 шалгалт |
| `/refactor` | Clean code pattern санал болгох |