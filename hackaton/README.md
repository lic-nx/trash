# WikiLive - Live Tables in Text

🏆 **Hackathon Project** - A module for a live wiki system where text and tables become a unified tool for collaboration and knowledge management.

## 🎯 Overview

WikiLive integrates seamlessly into **MWS Tables** platform, providing a full-featured text-based knowledge base with live table synchronization, AI assistance, and collaborative editing.

## ✨ Key Features

### Core
- 📝 **Block-based Rich Text Editor** - Notion-like editing experience
- 📊 **Live Tables Integration** - Real-time sync with MWS Tables
- 🔗 **Context Links** - Connect documents, tables, and external resources
- 👥 **Collaborative Editing** - Real-time collaboration support

### Views
- 📋 Table View
- 📅 Calendar View
- 📈 Kanban Board
- 🗓️ Gantt Chart

### AI Features
- 🤖 AI Co-Author for content generation
- 💡 Smart suggestions and auto-linking
- 📄 Document summarization
- 🔍 Intelligent search

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WikiLive Frontend                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Block Editor│  │ Live Tables │  │    AI Assistant     │  │
│  │   (TipTap)  │  │  (Widgets)  │  │   (Open Source LLM) │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    WikiLive Backend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  REST API   │  │  WebSocket  │  │    LLM Connector    │  │
│  │   Server    │  │   Server    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MWS Tables API                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Tables    │  │   Records   │  │      Relations      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
wikilive/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # State management
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend server
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   └── utils/           # Utility functions
│   └── package.json
├── mock-api/                # Mock MWS Tables API
│   ├── data/                # Mock data
│   └── server.js            # Mock API server
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd wikilive

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:3001
- Mock API at http://localhost:3002

### Development

```bash
# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Run mock API only
npm run dev:mock
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TipTap** - Block-based editor
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.io** - Real-time communication

### AI
- **Ollama** - Local LLM runtime
- **Llama 3 / Mistral** - Open source models

### Infrastructure
- **Docker** - Containerization
- **SQLite** - Local database

## 📖 API Documentation

### WikiLive API Endpoints

#### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Create new document
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

#### Tables
- `GET /api/tables` - List all tables
- `GET /api/tables/:id` - Get table with data
- `POST /api/tables/:id/records` - Create record
- `PUT /api/tables/:id/records/:recordId` - Update record
- `DELETE /api/tables/:id/records/:recordId` - Delete record

#### AI
- `POST /api/ai/generate` - Generate content
- `POST /api/ai/suggest` - Get suggestions
- `POST /api/ai/summarize` - Summarize content

## 🤝 Team

- Your Team Name Here

## 📄 License

MIT

## 🎬 Demo Scenarios

### Scenario 1: Sprint Planning
1. Create new document "Sprint 42"
2. Embed live Tasks table
3. Switch to Kanban view
4. AI generates sprint summary
5. Live updates when tasks change

### Scenario 2: Knowledge Base Article
1. Use `/ai generate outline` for structure
2. Embed related tables
3. Create context links
4. Export to PDF

---

Built with ❤️ for MWS Tables Hackathon