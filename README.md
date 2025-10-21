# Angular + React Micro-Frontend Application

A micro-frontend architecture demo showcasing Angular and React applications working together through WebSocket communication, powered by a Node.js backend.

## Features

- **Micro-Frontend Architecture**: Angular and React applications running as separate web components
- **Real-time Synchronization**: WebSocket-based communication between Angular and React apps
- **Interactive Map**: React Leaflet map with click-to-create and click-to-delete location functionality
- **Location Management**: Angular table with search, filtering, and Material Design UI
- **Cross-App Selection**: Click on Angular location card to center React map on that location
- **Standalone Views**: Each application can be opened independently in separate browser tabs

## Quick Start

```bash
docker compose up
```

Open http://localhost:8080 to see both applications running side-by-side.

## Available Views

- **Main Shell**: http://localhost:8080 - Both Angular and React components together
- **Angular Only**: http://localhost:8080/angular-only.html - Just the Angular locations table
- **React Only**: http://localhost:8080/react-only.html - Just the React map

## Architecture

- **Angular**: Location management table with NgRx state management
- **React**: Interactive map with Leaflet, marker clustering, and real-time updates
- **Node.js Backend**: REST API and WebSocket server for data synchronization
- **Nginx**: Reverse proxy serving static files and routing API calls

## Technology Stack

- Angular 20 with Material Design
- React 19 with Leaflet maps
- Node.js with Express and Socket.IO
- Docker Compose for orchestration
- Nginx for serving and proxying
