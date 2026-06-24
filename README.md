# Location Manager - Micro-Frontend Demo

A real-time location management system demonstrating micro-frontend architecture with Angular and React collaborating seamlessly through WebSocket and BroadcastChannel synchronization.

## Quick Start

```bash
docker compose up
```
Open http://localhost:8080 to see both applications running side-by-side.

## Architecture

```
        ┌─────────────────────────┐
        │   BroadcastChannel      │
        │  (Cross-tab messaging)  │
        └─────────────────────────┘
         │                       │
┌─────────────────┐    ┌─────────────────┐
│   Angular App   │    │   React App     │
│  (Web Component)│    │  (Web Component)│
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
         │      (Port 8080)        │
         └─────────────────────────┘
                     │
         ┌────────────────────────┐
         │    NestJS Backend      │
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


## Features

### Micro-Frontend Architecture
- **Independent Development**: Angular and React can be developed and deployed independently as Web Components
- **Server-mediated Communication**: Real-time synchronization via WebSocket (create/delete locations)
- **Client-side Communication**: Cross-tab messaging via BroadcastChannel (location selection)
- **Performance with Scale**:
  - Virtual scrolling for handling thousands of locations
  - Marker clustering for efficient map rendering
  - Fast bulk generation on backend/Database

## Functionality

### Angular App (Table View)
- **View all locations** in a scrollable table
- **Search/Filter** locations by name in real-time
- **Select location** to center the map (via BroadcastChannel)
- **Delete locations** by clicking the delete button
- **Generate test data** with bulk creation (1000+ locations)
- **Clear all** locations at once
- **Location count** with proper pluralization

### React App (Map View)
- **Interactive map** with OpenStreetMap tiles
- **Click on map** to create new locations
- **Click markers** to delete locations
- **Marker tooltips** showing location name
- **Auto-center** when location is selected from Angular
- **Marker clustering** for better performance with many locations

### Synchronization
- Changes in Angular table **instantly reflect** on React map via WebSocket
- Changes on React map **instantly reflect** in Angular table via WebSocket
- Location selection in Angular **centers the map** in React via BroadcastChannel

## Available Views

- **Main Shell**: http://localhost:8080 - Both Angular and React components together
- **Angular Only**: http://localhost:8080/angular-only.html - Just the Angular locations table
- **React Only**: http://localhost:8080/react-only.html - Just the React map


## Technology Stack

- Angular 20 with NgRx
- React 19 with Leaflet maps
- NestJS 11 with Socket.IO (WebSocket Gateway)
- PostgreSQL via Prisma ORM
- Docker Compose for orchestration
- Nginx for serving and proxying


### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/locations` | All locations (ordered by id) |
| GET | `/api/locations/:id` | Single location |
| POST | `/api/locations` | Create `{ name, lat, lon }` |
| POST | `/api/locations/generate` | Bulk generate `{ n }` (1–10000) |
| DELETE | `/api/locations` | Delete all |
| DELETE | `/api/locations/:id` | Delete by id |

### WebSocket Events (Socket.IO)

| Event | Payload | Trigger |
|-------|---------|---------|
| `locations:created` | `Location[]` | POST create / generate |
| `location:deleted` | `{}` or `{ id }` | DELETE all / by id |
