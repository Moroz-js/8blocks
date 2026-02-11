# Быстрое исправление загрузки изображений

## TL;DR - Что делать на сервере

```bash
# 1. Перейти в директорию проекта
cd /var/www/8blocks.io

# 2. Обновить код
git pull origin main

# 3. Создать директорию uploads с правильными правами
mkdir -p public/uploads

# ВАЖНО: Установить владельца UID 1001 (nextjs пользователь в контейнере)
sudo chown -R 1001:1001 public/uploads
# ИЛИ если не работает, дать полные права (менее безопасно):
# chmod -R 777 public/uploads

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

# 7. Проверить логи если не работает
docker compose logs app --tail=50
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

### Проверить права (САМАЯ ЧАСТАЯ ПРОБЛЕМА)
```bash
ls -la /var/www/8blocks.io/public/
# uploads должен принадлежать UID 1001 (nextjs в контейнере)

# Если владелец не 1001:
sudo chown -R 1001:1001 /var/www/8blocks.io/public/uploads

# Если всё ещё не работает, используйте 777 (временно):
chmod -R 777 /var/www/8blocks.io/public/uploads

# После загрузки файла можно вернуть 755:
chmod -R 755 /var/www/8blocks.io/public/uploads
```

### Проверить логи Docker
```bash
docker compose logs app --tail=50 -f
# Смотрите на ошибки типа "EACCES" или "Permission denied"
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
