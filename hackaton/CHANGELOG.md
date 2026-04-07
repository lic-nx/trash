# Changelog

All notable changes to WikiLive will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Block-based rich text editor with 10+ block types
- Live Tables integration with 4 view modes (Table, Kanban, Calendar, Gantt)
- AI Assistant for content generation, summarization, and suggestions
- Real-time collaboration via WebSocket
- Document search functionality
- Multiple document management
- Auto-save with debounce
- Keyboard shortcuts and navigation
- Slash commands for block insertion
- Context links between documents and tables
- Callout blocks with multiple styles
- Code blocks with syntax highlighting
- List blocks (bullet, numbered, to-do)
- Responsive design with Tailwind CSS

### Changed
- Improved block editor UX with better focus management
- Enhanced table view performance
- Better error handling and loading states

### Technical
- TypeScript for type safety
- Zustand for state management
- TanStack Query for data fetching
- Socket.io for real-time updates
- Vite for fast builds
- Tailwind CSS for styling

### Fixed
- Block navigation with arrow keys
- Auto-save timing issues
- Table view switching

## [0.1.0] - 2024-01-10

### Added
- Initial project setup
- Basic document CRUD operations
- Mock API with sample data
- WebSocket server setup

---

## Version Guidelines

- **MAJOR** (X.0.0): Breaking changes, major features
- **MINOR** (1.X.0): New features, backward compatible
- **PATCH** (1.0.X): Bug fixes, minor improvements
