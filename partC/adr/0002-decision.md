# ADR-002: Tag систем — JSON column vs Many-to-many

**Огноо:** 2026-05-10  
**Статус:** Accepted  
**Нөхцөл байдал:** Part B build явцад

---

## Нөхцөл байдал

Note-д tag нэмэх feature хэрэгжүүлэхдээ хадгалах аргыг сонгох шаардлагатай болсон.

---

## Авч үзсэн сонголтууд

### Сонголт 1: JSON column
```sql
ALTER TABLE notes ADD COLUMN tags TEXT DEFAULT '[]';
-- "tags" = '["work","personal","urgent"]'
```
**Давуу тал:** Нэг хүснэгт, энгийн query  
**Сул тал:** Tag-аар шүүхэд `LIKE '%"work"%'` — slow, хэврэг

### Сонголт 2: Many-to-many (сонгосон) ✅
```sql
CREATE TABLE tags (id, name UNIQUE);
CREATE TABLE note_tags (note_id, tag_id, PRIMARY KEY(note_id, tag_id));
```
**Давуу тал:** `JOIN`-ээр хурдан шүүлт, tag rename нэг газарт  
**Сул тал:** 3 хүснэгт, арай нарийн query

---

## Шийдвэр

**Many-to-many** хэрэгжүүлнэ (`tags` + `note_tags` хүснэгт).

---

## Шалтгаан

1. **Tag-аар шүүлт** нь гол feature — `JOIN` нь `LIKE` шалгалтаас хурдан бөгөөд найдвартай.
2. **Data integrity** — tag нэрийг нэг газарт (`UNIQUE`) хадгалж, давхардал арилгана.
3. **Ирээдүйн өргөтгөл** — tag-д цвет, тайлбар нэмэх боломж хялбар.

AI энэ шийдвэрт JSON column санал болгосон боловч хайлт болон шүүлтийн шаардлага дагуу relational approach зөв гэж өөрөө шийдсэн.

---

## Үр дагавар

- `setNoteTags()` helper функц transaction-гүйгээр ажиллаж байгаа — өргөтгөлд transaction нэмэх шаардлагатай болж болно
- Note устгахад `ON DELETE CASCADE` tag холболтыг автомат устгана

---

## AI-тай ярилцсан тэмдэглэл
`partB/ai-sessions/` доторх session log-уудад харна уу.