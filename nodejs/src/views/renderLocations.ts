import type { Location } from '../../../shared/interfaces.ts';

export function renderLocationsPage(locations: Location[]): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Locations API</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; max-width: 800px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        tr:hover { background-color: #ddd; }
      </style>
    </head>
    <body>
      <h1>📍 Locations Database</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          ${locations.map(loc => `
            <tr>
              <td>${loc.id}</td>
              <td>${loc.name}</td>
              <td>${loc.lat}</td>
              <td>${loc.lon}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p><a href="/api/locations">API: /api/locations</a></p>
    </body>
    </html>
  `;
}

