# Contributing to WikiLive

## Project Overview

WikiLive is a live knowledge management system that integrates text documents with dynamic tables. It's built as a module for the MWS Tables platform.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- TanStack Query for data fetching
- Socket.io for real-time updates

### Backend
- Node.js with Express
- Socket.io for WebSockets
- RESTful API design

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names

### Component Structure
```typescript
interface ComponentProps {
  // Props here
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return <div>...</div>
}
```

### State Management
- Use Zustand for global state
- Use TanStack Query for server state
- Use local state for UI-only state

### API Calls
- Use the api client in services/
- Handle loading and error states
- Use TanStack Query for caching

## File Organization

```
src/
├── components/     # React components
├── stores/         # Zustand stores
├── services/       # API clients
├── hooks/          # Custom hooks
├── utils/          # Helper functions
└── types/          # TypeScript types
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit PR with description
5. Address review feedback

## Questions?

Check existing issues or create a new one.
