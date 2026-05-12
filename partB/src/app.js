const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const notesRouter = require('./routes/notes');
const searchRouter = require('./routes/search');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/notes', notesRouter);
app.use('/api/search', searchRouter);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

const PORT = 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Markdown Notes API running on http://localhost:${PORT}`));
}

module.exports = app;
// Health check нэмэх
app.get('/health', (req, res) => res.json({ status: 'ok' }));