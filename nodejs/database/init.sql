-- Создание базы данных (выполнить вручную если нужно)
-- CREATE DATABASE locations_db;

-- Подключиться к locations_db и выполнить:

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lon DECIMAL(11, 8) NOT NULL
);

-- Тестовые данные
INSERT INTO locations (name, lat, lon) VALUES
  ('Эйфелева башня', 48.85837009, 2.29447866),
  ('Красная площадь', 55.75370903, 37.62091636),
  ('Статуя Свободы', 40.68925095, -74.04449463);


