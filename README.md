psql -U postgres -d locations_db

\dt              -- список таблиц
\d locations     -- структура таблицы
SELECT * FROM locations;  -- посмотреть данные
\q               -- выйти




**Требования:** Node.js 22.6+ (для `--experimental-strip-types`)

## API Endpoints

- `GET /api/locations` - получить все геоточки
- `GET /api/locations/:id` - получить одну точку
- `POST /api/locations` - создать точку
  ```json
  { "name": "Эйфелева башня", "lat": 48.858370, "lon": 2.294479 }
  ```
- `DELETE /api/locations/:id` - удалить точку

## Тест в curl

```bash
# Получить все точки
curl http://localhost:3000/api/locations

# Получить одну точку
curl http://localhost:3000/api/locations/1

# Создать новую точку
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{"name": "Биг-Бен", "lat": 51.5007, "lon": -0.1246}'

# Удалить точку
curl -X DELETE http://localhost:3000/api/locations/1
```
