# СРОЧНОЕ ИСПРАВЛЕНИЕ - Выполнить на сервере СЕЙЧАС

## Проблема: {"error":"Failed to upload file"}

Это ошибка прав доступа. Docker контейнер не может писать в директорию на хосте.

## Решение за 2 минуты

### 1. Подключиться к серверу
```bash
ssh user@your-server
```

### 2. Перейти в директорию проекта
```bash
cd /var/www/8blocks.io  # или куда установлен проект
```

### 3. Исправить права доступа (выберите один вариант)

**Вариант А: Безопасный (рекомендуется)**
```bash
# Установить владельца на UID 1001 (nextjs в контейнере)
sudo chown -R 1001:1001 public/uploads
chmod -R 755 public/uploads
```

**Вариант Б: Быстрый (если А не сработал)**
```bash
# Дать полные права всем (работает всегда, но менее безопасно)
chmod -R 777 public/uploads
```

### 4. Перезапустить контейнер (не обязательно, но рекомендуется)
```bash
docker compose restart app
```

### 5. Проверить
```bash
# Посмотреть права
ls -la public/uploads/

# Посмотреть логи
docker compose logs app --tail=20
```

## Проверка работы

1. Зайти в админку: https://8blocks.io/admin
2. Создать/редактировать пост
3. Попробовать загрузить изображение
4. Должно работать!

## Если всё ещё не работает

### Проверить что директория существует
```bash
ls -la public/
# Должна быть директория uploads/
```

### Создать если нет
```bash
mkdir -p public/uploads
sudo chown -R 1001:1001 public/uploads
chmod -R 755 public/uploads
```

### Проверить bind mount в контейнере
```bash
docker compose exec app ls -la /app/public/
# Должна быть директория uploads/

# Попробовать создать тестовый файл
docker compose exec app touch /app/public/uploads/test.txt
# Если ошибка Permission denied - проблема в правах
```

### Проверить что используется bind mount
```bash
docker compose config | grep -A2 volumes
# Должно быть:
# - ./public/uploads:/app/public/uploads
```

## Если совсем ничего не помогает

### Временное решение: открыть полные права
```bash
cd /var/www/8blocks.io
chmod -R 777 public/uploads
docker compose restart app
```

Это должно сработать 100%. После этого можно разбираться с правильными правами.

## После исправления

Сделать git pull и redeploy для применения улучшений в коде:
```bash
git pull origin main
docker compose up -d --build
```

Новый код включает:
- ✅ Улучшенное логирование ошибок
- ✅ Автоматическое создание директории
- ✅ Правильные права в Dockerfile
- ✅ Улучшенный deploy скрипт
