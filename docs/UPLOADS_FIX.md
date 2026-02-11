# Инструкция по исправлению загрузки изображений

## Проблема
Загруженные изображения возвращают 404 на продакшене.

## Причина
Файлы загружались в Docker volume, который недоступен для nginx. Nginx пытался читать файлы из файловой системы хоста, но не находил их.

## Решение
1. Изменить Docker volume на bind mount (`./public/uploads`)
2. Настроить nginx для прямой раздачи файлов из директории uploads на хосте

## Что было исправлено:
- ✅ `docker-compose.yml` - volume заменен на bind mount
- ✅ `deploy.yml` - директория создается на хосте с правильными правами
- ✅ `nginx/8blocks.io.conf` - добавлен блок для раздачи `/uploads/`

## Шаги для применения на сервере:

### 1. Обновить репозиторий
Код уже обновлен, нужно только задеплоить:
```bash
cd /var/www/8blocks.io
git pull origin main
```

### 2. Обновить nginx конфигурацию
```bash
# Скопировать новую конфигурацию
sudo cp nginx/8blocks.io.conf /etc/nginx/sites-available/8blocks.io.conf

# Проверить что путь правильный (должен совпадать с PROJECT_DIR)
# В конфиге указано:
# alias /var/www/8blocks.io/public/uploads/;
```

**Важно:** Если ваш проект находится в другом месте, отредактируйте путь в nginx конфигурации:
```bash
sudo nano /etc/nginx/sites-available/8blocks.io.conf
# Измените путь alias на правильный
```

### 3. Создать директорию uploads (если её нет)
```bash
cd /var/www/8blocks.io
mkdir -p public/uploads
chmod -R 755 public/uploads
```

### 4. Проверить и применить nginx конфигурацию
```bash
# Проверить синтаксис
sudo nginx -t

# Если всё ОК, перезагрузить nginx
sudo systemctl reload nginx
```

### 5. Задеплоить обновления через GitHub Actions
После push в main ветку, деплой произойдет автоматически. Или запустите вручную через GitHub Actions.

**Автоматически выполнится:**
- Создание `public/uploads` на хосте
- Установка правильных прав (755)
- Пересборка контейнеров с bind mount

### 6. Проверить работу
```bash
# Проверить что контейнер запущен
docker compose ps

# Проверить bind mount
docker compose exec app ls -la /app/public/uploads

# Загрузить тестовое изображение через админку
# Проверить файл на хосте
ls -la /var/www/8blocks.io/public/uploads/

# Проверить через браузер или curl
curl -I https://8blocks.io/uploads/[filename].png
```

## Альтернативное решение (если не работает)

Если nginx не может получить доступ к файлам, можно использовать API route который уже есть в проекте:

1. В `components/admin/ImageUpload.tsx` ничего менять не нужно - путь `/uploads/...` корректный
2. Next.js будет раздавать файлы через `/api/uploads/[...path]` route
3. Убедитесь что Next.js приложение запущено и имеет права на чтение файлов

## Проверка логов
```bash
# Логи nginx
sudo tail -f /var/log/nginx/8blocks.io.error.log

# Логи Next.js (если используется PM2)
pm2 logs
```

## Что было изменено

### 1. docker-compose.yml
```yaml
# Было (Docker volume - недоступен для nginx):
volumes:
  - uploads:/app/public/uploads

# Стало (bind mount - доступен для nginx):
volumes:
  - ./public/uploads:/app/public/uploads
```

### 2. .github/workflows/deploy.yml
- Создание директории `public/uploads` на хосте
- Установка прав доступа (755)
- Теперь директория существует и на хосте, и в контейнере (один и тот же путь)

### 3. nginx/8blocks.io.conf
- Добавлен блок `location /uploads/` для прямой раздачи файлов
- Путь: `/var/www/8blocks.io/public/uploads/`
- Кэш на 1 год для оптимизации
- Фильтрация только изображений (безопасность)

## Как это работает теперь

```
┌─────────────────────────────────────────────┐
│ Админка загружает файл                      │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ API /api/admin/upload сохраняет в:          │
│ /app/public/uploads/ (внутри контейнера)    │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ Bind mount связывает:                       │
│ Контейнер: /app/public/uploads/             │
│ Хост: /var/www/8blocks.io/public/uploads/   │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ Nginx читает файлы с хоста напрямую:        │
│ /var/www/8blocks.io/public/uploads/         │
│ и раздает по URL: /uploads/filename.png     │
└─────────────────────────────────────────────┘
```

## Проверка после деплоя
```bash
# Должен вернуть 200 или 404 (если файла нет), но не 502/503
curl -I https://8blocks.io/uploads/test.png

# Проверить что файлы синхронизированы
docker compose exec app ls -la /app/public/uploads/
ls -la /var/www/8blocks.io/public/uploads/
# Должны показать одни и те же файлы
```
