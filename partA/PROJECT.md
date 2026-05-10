# Project: Personal Task Tracker

## Brief
MacOS орчинд Next.js 14 болон Prisma ашиглан хөгжүүлсэн, хайлт болон шүүлтүүрийн цогц систем бүхий даалгавар удирдах аппликейшн.

## In Scope (Хийх зүйлс)
- **Task CRUD:** Title, description, status (TODO/IN_PROGRESS/DONE), priority, dueDate, tags.
- **Search & Filter:** Keyword search (title, desc), Filter (status, priority, date range).
- **State Management:** URL-д filter/search state хадгалах (?status=TODO&q=meeting).
- **Backend:** Server-side rendering (Prisma), REST API routes (/api/tasks).
- **Validation:** Zod schema (client + server).
- **UI:** Responsive UI (Tailwind CSS).
