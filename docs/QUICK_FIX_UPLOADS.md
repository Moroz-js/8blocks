# Быстрое исправление загрузки изображений

## TL;DR - Что делать на сервере

```bash
# 1. Перейти в директорию проекта
cd /var/www/8blocks.io

# 2. Обновить код
git pull origin main

# 3. Создать директорию uploads (если её нет)
mkdir -p public/uploads
chmod -R 755 public/uploads

# 4. Обновить nginx конфигурацию
sudo cp nginx/8blocks.io.conf /etc/nginx/sites-available/8blocks.io.conf
sudo nginx -t
sudo systemctl reload nginx

# 5. Пересобрать и перезапустить контейнеры
docker compose down
docker compose up -d --build

# 6. Проверить
docker compose ps
ls -la public/uploads/
```

## Проверка работы

1. Зайти в админку: `https://8blocks.io/admin`
2. Создать/редактировать пост
3. Загрузить изображение
4. Проверить что файл появился:
   ```bash
   ls -la /var/www/8blocks.io/public/uploads/
   ```
5. Открыть URL изображения в браузере

## Если не работает

### Проверить права
```bash
ls -la /var/www/8blocks.io/public/
# uploads должен быть доступен для чтения (755)

# Если нет доступа:
chmod -R 755 /var/www/8blocks.io/public/uploads
```

### Проверить bind mount
```bash
docker compose exec app ls -la /app/public/uploads
# Должны быть те же файлы что и на хосте
```

### Проверить nginx
```bash
# Логи nginx
sudo tail -f /var/log/nginx/8blocks.io.error.log

# Проверить конфигурацию
sudo nginx -t

# Убедиться что путь правильный
grep -A5 "location /uploads" /etc/nginx/sites-available/8blocks.io.conf
```

### Проверить docker logs
```bash
docker compose logs app --tail=50
```

## Автоматический деплой

После следующего push в main всё применится автоматически через GitHub Actions.

Или запустите деплой вручную:
1. Зайдите на GitHub → Actions
2. Выберите "Deploy to Production"
3. Нажмите "Run workflow"
