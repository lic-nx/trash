# WikiLive API Documentation

## Base URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Mock API:** http://localhost:3002

## Documents API

### Get All Documents
```http
GET /api/documents
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Document Title",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

### Get Document by ID
```http
GET /api/documents/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Document Title",
  "content": [...],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Create Document
```http
POST /api/documents
Content-Type: application/json

{
  "title": "New Document",
  "content": []
}
```

### Update Document
```http
PUT /api/documents/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": [...]
}
```

### Delete Document
```http
DELETE /api/documents/:id
```

## Tables API

### Get All Tables
```http
GET /api/tables
```

**Response:**
```json
[
  {
    "id": "tasks",
    "name": "Tasks",
    "recordCount": 5
  }
]
```

### Get Table by ID
```http
GET /api/tables/:id
```

**Response:**
```json
{
  "id": "tasks",
  "name": "Tasks",
  "columns": [
    {
      "id": "title",
      "name": "Title",
      "type": "text"
    }
  ],
  "records": [...],
  "relations": []
}
```

### Create Record
```http
POST /api/tables/:id/records
Content-Type: application/json

{
  "title": "New Task",
  "status": "todo"
}
```

### Update Record
```http
PUT /api/tables/:id/records/:recordId
Content-Type: application/json

{
  "status": "done"
}
```

### Delete Record
```http
DELETE /api/tables/:id/records/:recordId
```

## AI API

### Generate Content
```http
POST /api/ai/generate
Content-Type: application/json

{
  "prompt": "Write a project summary",
  "context": "Optional context"
}
```

**Response:**
```json
{
  "result": "Generated content...",
  "suggestions": ["Add more details", "Create table"]
}
```

### Get Suggestions
```http
POST /api/ai/suggest
Content-Type: application/json

{
  "content": "Document content",
  "type": "format"
}
```

**Response:**
```json
{
  "suggestions": [
    { "type": "link", "text": "Connect to Projects table" }
  ]
}
```

### Summarize
```http
POST /api/ai/summarize
Content-Type: application/json

{
  "content": "Document content to summarize"
}
```

**Response:**
```json
{
  "summary": "Document summary...",
  "keyPoints": ["Point 1", "Point 2"],
  "wordCount": 150,
  "readingTime": "1 min read"
}
```

## Search API

### Search
```http
GET /api/search?q=query
```

**Response:**
```json
{
  "documents": [
    { "id": "uuid", "title": "Document Title" }
  ],
  "tables": [
    { "id": "tasks", "name": "Tasks" }
  ],
  "records": [
    {
      "tableId": "tasks",
      "tableName": "Tasks",
      "recordId": "1",
      "field": "title",
      "value": "Task Title"
    }
  ]
}
```

## WebSocket API

### Connect
```javascript
const socket = io('http://localhost:3001')
```

### Events

#### Join Document
```javascript
socket.emit('join-document', documentId)
```

#### Leave Document
```javascript
socket.emit('leave-document', documentId)
```

#### Send Update
```javascript
socket.emit('document-change', {
  docId: documentId,
  blocks: [...]
})
```

#### Receive Update
```javascript
socket.on('document-update', (data) => {
  console.log('Document updated:', data)
})
```

## Error Responses

### 404 Not Found
```json
{
  "error": "Document not found"
}
```

### 400 Bad Request
```json
{
  "error": "Invalid request body"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- Default: 100 requests per minute
- Can be increased upon request

## Authentication

Currently not implemented. In production, use:
- JWT tokens
- API keys
- OAuth integration

## CORS

CORS is enabled for:
- http://localhost:3000 (development)
- Configurable via environment variables
