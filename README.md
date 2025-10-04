psql -U postgres -d locations_db

\dt              -- список таблиц
\d locations     -- структура таблицы
SELECT * FROM locations;  -- посмотреть данные
\q               -- выйти


# Locations API - Node.js + TypeScript + PostgreSQL

REST API для работы с геоточками (lat, lon, название).

**Технологии:** Node 22+, TypeScript, Express, PostgreSQL, Docker

## Установка

```bash
# Установить зависимости
yarn install

# Сгенерировать Prisma Client
yarn prisma generate
```

## Настройка БД

### Вариант 1: Docker (проще)

```bash
# Запустить PostgreSQL в контейнере
docker-compose up -d

# БД создастся автоматически с тестовыми данными
```

Создай `.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=locations_db
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/locations_db
```

### Вариант 2: Локальная установка

1. Установи PostgreSQL
2. Создай базу данных:
```sql
CREATE DATABASE locations_db;
```
3. Выполни SQL из `database/init.sql`
4. Настрой `.env` со своим паролем

## Запуск

```bash
# Dev режим с автоперезагрузкой (Node 22.6+)
npm run dev

# Обычный режим
npm start
```

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

## Что изучить дальше

1. Middleware (аутентификация, логирование)
2. Валидация данных (joi, zod)
3. Error handling
4. JWT токены
5. Relationships в БД (связи между таблицами)
6. Миграции (knex, sequelize)
7. ORM (Prisma, TypeORM)

