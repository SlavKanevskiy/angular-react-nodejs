-- Create database (run manually if needed)
-- CREATE DATABASE locations_db;

-- Connect to locations_db and execute:

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lon DECIMAL(11, 8) NOT NULL
);

-- Test data
INSERT INTO locations (name, lat, lon) VALUES
  ('Eiffel Tower', 48.85837009, 2.29447866),
  ('Red Square', 55.75370903, 37.62091636),
  ('Statue of Liberty', 40.68925095, -74.04449463);


