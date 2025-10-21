# Angular + React Micro-Frontend Application

A micro-frontend architecture demo showcasing Angular and React applications working together through WebSocket communication, powered by a Node.js backend.

## Quick Start

```bash
docker compose up
```
Open http://localhost:8080 to see both applications running side-by-side.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Angular App   │    │   React App     │
│   (Web Component)│    │   (Web Component)│
│                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Locations   │ │    │ │ Interactive │ │
│ │ Table       │ │    │ │ Map         │ │
│ │ (NgRx)      │ │    │ │ (Leaflet)   │ │
│ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘
         │                       │
         │ HTTP/REST             │ HTTP/REST
         │ WebSocket             │ WebSocket
         └───────────┬───────────┘
                     │
         ┌─────────────────────────┐
         │      Nginx Proxy        │
         │  (Port 8080)            │
         └─────────────────────────┘
                     │
         ┌────────────────────────┐
         │    Node.js Backend     │
         │  ┌─────────────────┐   │
         │  │ REST API        │   │
         │  │ /api/locations  │   │
         │  └─────────────────┘   │
         │  ┌─────────────────┐   │
         │  │ WebSocket Server│   │
         │  │ Socket.IO       │   │
         │  └─────────────────┘   │
         └────────────────────────┘
                     │
         ┌─────────────────────────┐
         │    PostgreSQL DB        │
         │  (via Prisma ORM)       │
         └─────────────────────────┘
```


## Available Views

- **Main Shell**: http://localhost:8080 - Both Angular and React components together
- **Angular Only**: http://localhost:8080/angular-only.html - Just the Angular locations table
- **React Only**: http://localhost:8080/react-only.html - Just the React map


## Technology Stack

- Angular 20 with NGRX
- React 19 with Leaflet maps
- Node.js with Express and Socket.IO
- PostgreSQL via Prisma ORM
- Docker Compose for orchestration
- Nginx for serving and proxying
