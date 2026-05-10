const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const notesRouter = require('./routes/notes');
const searchRouter = require('./routes/search');
const errorHandler = require('./middleware/errorHandler');
 
const app = express();
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
 
// Routes
app.use('/api/notes', notesRouter);
app.use('/api/search', searchRouter);
 
// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));
 
// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
 
// Error handler
app.use(errorHandler);
 
const PORT = process.env.PORT || 3001;
 
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Markdown Notes API running on http://localhost:${PORT}`);
  });
}
 
module.exports = app;
 