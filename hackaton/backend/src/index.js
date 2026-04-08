import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3001;
const MOCK_API = process.env.MOCK_API_URL || 'http://mock-api:3002';

app.use(cors());
app.use(express.json());

app.get('/api/tables', async (req, res) => {
  const response = await fetch(MOCK_API + '/api/tables');
  res.json(await response.json());
});

app.get('/api/tables/:id', async (req, res) => {
  const response = await fetch(MOCK_API + '/api/tables/' + req.params.id);
  res.json(await response.json());
});

app.post('/api/tables/:id/records', async (req, res) => {
  const response = await fetch(MOCK_API + '/api/tables/' + req.params.id + '/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.status(201).json(await response.json());
});

app.get('/api/documents', async (req, res) => {
  const response = await fetch(MOCK_API + '/api/documents');
  res.json(await response.json());
});

app.post('/api/documents', async (req, res) => {
  const response = await fetch(MOCK_API + '/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.status(201).json(await response.json());
});

app.get('/api/documents/:id', async (req, res) => {
  const response = await fetch(MOCK_API + '/api/documents/' + req.params.id);
  res.json(await response.json());
});

app.put('/api/documents/:id', async (req, res) => {
  const response = await fetch(MOCK_API + '/api/documents/' + req.params.id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.json(await response.json());
});

app.post('/api/ai/generate', async (req, res) => {
  const response = await fetch(MOCK_API + '/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.json(await response.json());
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join-document', (docId) => socket.join('dos:' + docId));
  socket.on('document-change', (data) => socket.to('dos:' + data.docId).emit('document-update', data));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

httpServer.listen(PORT, '0.0.0.0', () => console.log('Backend running on http://0.0.0.0:' + PORT));