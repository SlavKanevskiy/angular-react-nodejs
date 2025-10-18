export const config = {
  ports: {
    backend: 3000,
    frontend: 4200,
    postgres: 5432
  },

  baseUrl: typeof window !== 'undefined' && window.location.port === '8080' ? '' : 'http://localhost:3000',

  api: {
    locations: '/api/locations',
    locationsGenerate: '/api/locations/generate'
  },

  db: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    name: 'locations_db'
  }
};

export const apiUrl = {
  locations: `${config.baseUrl}${config.api.locations}`,
  generate: `${config.baseUrl}${config.api.locationsGenerate}`
};
export const wsUrl = config.baseUrl;

