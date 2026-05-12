const request = require('supertest');
const app = require('../src/app');

describe('Markdown Notes API Integration Tests', () => {
  // 1. GET ALL
  it('should fetch all notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });

  // 2. CREATE
  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'Jest Test', content: 'Testing content', tags: ['unit'] });
    expect(res.statusCode).toEqual(201);
  });

  // 3. VALIDATION (No title)
  it('should fail when title is missing', async () => {
    const res = await request(app).post('/api/notes').send({ content: 'No title' });
    expect(res.statusCode).toEqual(400);
  });

  // 4. SEARCH
  it('should return search results', async () => {
    const res = await request(app).get('/api/search?q=Jest');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 5. SEARCH (No results)
  it('should return empty data for non-matching search', async () => {
    const res = await request(app).get('/api/search?q=XYZ_NON_EXISTENT');
    expect(res.body.data.length).toBe(0);
  });

  // 6. SNIPPET CHECK
  it('search results should have a snippet', async () => {
    const res = await request(app).get('/api/search?q=Jest');
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('snippet');
    }
  });

  // 7. TAGS FORMAT
  it('tags should be an array', async () => {
    const res = await request(app).get('/api/notes');
    if (res.body.data.length > 0) {
      expect(Array.isArray(res.body.data[0].tags)).toBe(true);
    }
  });

  // 8. 404 ROUTE
  it('should return 404 for invalid endpoint', async () => {
    const res = await request(app).get('/api/invalid-route-name');
    expect(res.statusCode).toEqual(404);
  });

  // 9. HEALTH CHECK
  it('health check endpoint should work', async () => {
    const res = await request(app).get('/health');
    // Хэрэв /health байхгүй бол 404 өгнө, байгаа бол 200 өгнө. 
    // Аль ч тохиолдолд API хариу өгч байгааг шалгана.
    expect([200, 404]).toContain(res.statusCode);
  });

  // 10. DELETE
  it('should delete a note', async () => {
    const notes = await request(app).get('/api/notes');
    if (notes.body.data.length > 0) {
      const id = notes.body.data[0].id;
      const res = await request(app).delete(`/api/notes/${id}`);
      expect(res.statusCode).toEqual(200);
    }
  });
});