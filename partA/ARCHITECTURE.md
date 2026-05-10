# Architecture — Markdown Note-taking App

## Stack
| Layer | Technology | Шалтгаан |
|-------|-----------|----------|
| Backend | Node.js + Express | Хялбар REST API, npm экосистем |
| Database | SQLite (better-sqlite3) | File-based, тохиргоо шаардахгүй |
| Frontend | React (Vite) | Component-based, хурдан dev |
| PDF | puppeteer / html-pdf-node | Markdown → HTML → PDF |
| Testing | Jest + supertest | Express-тай сайн нийцдэг |

---

## Module diagram

```mermaid
graph TB
    subgraph Frontend["Frontend (React SPA)"]
        UI[NoteList] --> NE[NoteEditor]
        UI --> NS[SearchBar]
        NE --> PV[MarkdownPreview]
        NE --> PE[PDFExportBtn]
    end

    subgraph Backend["Backend (Express API)"]
        R[Router] --> NC[NotesController]
        R --> SC[SearchController]
        NC --> NS2[NoteService]
        SC --> NS2
        NS2 --> DB[(SQLite DB)]
    end

    Frontend -->|HTTP REST| Backend
```

---

## Layer diagram

```mermaid
graph LR
    A[React UI] -->|fetch JSON| B[Express Routes]
    B --> C[Controllers]
    C --> D[Services]
    D --> E[(SQLite)]
    C -->|PDF gen| F[html-pdf-node]
```

---

## Data flow — Note үүсгэх

```mermaid
sequenceDiagram
    participant U as User
    participant F as React
    participant A as Express API
    participant D as SQLite

    U->>F: Note бичиж Save дарна
    F->>A: POST /api/notes {title, content, tags}
    A->>D: INSERT INTO notes ...
    D-->>A: {id: 42}
    A-->>F: 201 {id, title, content, tags, createdAt}
    F->>U: Note жагсаалтад нэмэгдэнэ
```

---

## Directory бүтэц

```
bie-daalt-13/
├── partB/
│   ├── src/
│   │   ├── app.js          # Express app setup
│   │   ├── db/
│   │   │   └── database.js # SQLite connection + migrations
│   │   ├── routes/
│   │   │   ├── notes.js    # /api/notes CRUD
│   │   │   └── search.js   # /api/search
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── tests/
│   │   ├── notes.test.js
│   │   └── search.test.js
│   └── frontend/
│       └── src/
│           ├── App.jsx
│           ├── components/
│           └── api/
```