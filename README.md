# AI Starter Service

Сервис для автоматизации с n8n, который проверяет задачи через API и триггерит вебхуки.

## Установка

```bash
npm install
```

## Настройка

1. Скопируйте `env.example` в `.env`:
```bash
cp env.example .env
```

2. Отредактируйте `.env` файл под ваши нужды:

```env
# Основные настройки сервера
PORT=4000
CHECK_INTERVAL=30000

# URL для API
MAIN_URL=https://main.okk24.com
BASE_URL=https://main.okk24.com

# API endpoints
TASK_GET_ENDPOINT=/bumess/api/task/get
TASK_GET_QUICKLY_ENDPOINT=/bumess/api/task/get_quickly

# Админ данные
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password

# N8N Webhook URL
TRIGGER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook
```

## Запуск

```bash
# Разработка
npm run start-dev

# Продакшн
npm run start

# Сборка
npm run build
```

## Переменные окружения

- `PORT` - порт сервера (по умолчанию 4000)
- `CHECK_INTERVAL` - интервал проверки задач в миллисекундах (по умолчанию 30000)
- `BASE_URL` - базовый URL для API запросов
- `TASK_GET_ENDPOINT` - endpoint для получения задач
- `TASK_GET_QUICKLY_ENDPOINT` - endpoint для быстрого получения задач
- `ADMIN_EMAIL` - email администратора
- `ADMIN_PASSWORD` - пароль администратора
- `TRIGGER_WEBHOOK_URL` - URL n8n вебхука

## Использование

Сервис автоматически:
1. Авторизуется в админ панели
2. Проверяет новые задачи каждые `CHECK_INTERVAL` миллисекунд
3. Триггерит n8n вебхук при появлении новых задач
4. Сохраняет ID последней обработанной задачи в `task.json`

## API Endpoints

- `GET /` - тестовая страница
- `GET /ping` - проверка работоспособности
