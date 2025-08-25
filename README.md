# WB Tariffs Service

Сервис для регулярного получения тарифов Wildberries (короба) и их сохранения в PostgreSQL, а также выгрузки актуальных тарифов в Google Sheets.

## 📖 Описание

Сервис выполняет 2 задачи:

1. **Регулярное получение тарифов WB**
    - Ежечасно обращается к API Wildberries:  
      `https://common-api.wildberries.ru/api/v1/tariffs/box`
    - Данные сохраняются в PostgreSQL в таблицу `box_tariffs_daily`
    - В течение одного дня данные обновляются (upsert)

2. **Регулярное обновление Google Sheets**
    - Из БД данные выгружаются в произвольное количество Google Sheets по их ID
    - Таблица формируется на листе `stocks_coefs`
    - Данные сортируются по возрастанию коэффициента

---

## ⚙️ Технологии

- Node.js 22
- TypeScript
- PostgreSQL 16
- knex.js (миграции и работа с БД)
- node-cron (планировщик)
- Google Sheets API

---

## 📂 Структура проекта

```bash
.
├── src
│   ├── app.ts                 # точка входа
│   ├── jobs/                  # cron-задачи
│   ├── services/              # логика API WB и работы с БД
│   ├── config/
│   │   ├── env/               # валидация и загрузка .env
│   │   └── knex/knexfile.ts   # knex-конфиг
│   ├── postgres/migrations/   # миграции
│   └── utils/                 # утилиты
├── Dockerfile
├── compose.yaml
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Запуск

### Подготовка окружения

Создайте **.env** в корне проекта (см. пример в **.env.example**):
```
# Postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# App
NODE_ENV=production
APP_PORT=3000

# Wildberries API
WB_API_KEY=<ваш токен>
WB_TARIFFS_URL=https://common-api.wildberries.ru/api/v1/tariffs/box

# Google Sheets
GOOGLE_SHEETS_IDS=<id_1>,<id_2>
GOOGLE_CREDENTIALS_JSON_BASE64=<base64 credentials.json>
```
⚠️ В репозитории есть **.env.example** — используйте его как шаблон,
реальные ключи и пароли в git не добавлять.

#### 1. Запуск базы данных
```
docker compose up -d --build postgres
```

#### 2. Запуск приложения в Docker
```
docker compose up -d --build app
```

#### 3. Проверить логи:
```
docker logs -f wb-app
```
---
## Локальная разработка
Для запуска приложения в режиме разработки:

```
npm run dev
```
Выполнить миграции:
```
npm run knex:dev migrate latest
```
---
## 🧪 Проверка работы

Убедиться, что в базе создана таблица:
```
\dt
select * from box_tariffs_daily;
```

Можно проверить через docker:
```
docker exec -it wb-postgres psql -U postgres -d postgres -c "select count(*) from box_tariffs_daily;"
```
Если данные выгрузились, в ответе будет количество строк.

Проверить Google Sheets — должен появиться лист stocks_coefs с данными.

После запуска приложение сразу делает один запрос к WB API,  
затем **CRON выполняет синхронизацию каждый час**.

----
## 📦 Полная пересборка
```
docker compose down --rmi local --volumes
docker compose up --build
```
---

## 📑 Задание выполнено

Репозиторий содержит:

 - код приложения
 - compose.yaml
 - Dockerfile
 - миграции для БД
 - README с инструкцией для запуска