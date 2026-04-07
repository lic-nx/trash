# WikiLive Setup Instructions

## Quick Setup

### Step 1: Fix package.json files

The package.json files may have extra quotes. To fix them, delete and recreate with proper JSON:

**frontend/package.json:**
```json
{
  "name": "wikilive-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "lucide-react": "^0.303.0",
    "uuid": "^9.0.0",
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^9.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

**backend/package.json:**
```json
{
  "name": "wikilive-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "socket.io": "^4.7.2",
    "uuid": "^9.0.0"
  }
}
```

**mock-api/package.json:**
```json
{
  "name": "wikilive-mock-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "uuid": "^9.0.0"
  }
}
```

**package.json (root):**
```json
{
  "name": "wikilive",
  "version": "1.0.0",
  "scripts": {
    "dev": "npx concurrently \"npm run dev:mock\" \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "dev:mock": "cd mock-api && npm run dev",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install && cd ../mock-api && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

### Step 2: Install Dependencies

```powershell
# Install all dependencies
npm run install:all
```

### Step 3: Run the Project

```powershell
# Start all services
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Mock API: http://localhost:3002

## Manual Setup (if needed)

If the scripts don't work, run each service separately:

```powershell
# Terminal 1 - Mock API
cd mock-api
npm install
npm run dev

# Terminal 2 - Backend
cd backend
npm install
npm run dev

# Terminal 3 - Frontend
cd frontend
npm install
npm run dev
```

## Test the Setup

1. Open http://localhost:3000 in your browser
2. Create a new document
3. Type `/` to see the block menu
4. Try adding different block types
5. Click "Tables" button to embed a table
6. Click "AI" button to use AI assistant

## Troubleshooting

### Port already in use
If ports 3000, 3001, or 3002 are in use, update the port numbers in:
- frontend/vite.config.ts
- backend/src/index.js
- mock-api/server.js

### TypeScript errors
Make sure all dependencies are installed:
```powershell
cd frontend
npm install
```

### CORS errors
Make sure all servers have CORS enabled (they do by default).

## Next Steps After Setup

1. Customize the mock data in mock-api/server.js
2. Connect to real MWS Tables API
3. Add your team name to README.md
4. Prepare your demo scenarios
5. Record a demo video

Good luck with the hackathon! 🚀
