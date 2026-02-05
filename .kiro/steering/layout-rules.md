# Правила вёрстки проекта 8Blocks

## Источник дизайна

**Figma**: https://www.figma.com/design/R2ijMvjeixu7I2O2N4YxWI/8-blocks--Copy-

**ВАЖНО**: При любых изменениях в вёрстке, отличающихся от дизайна Figma, необходимо:
1. Явно указать причину изменения
2. Предоставить ссылку на конкретный node в Figma для сравнения
3. Получить подтверждение перед реализацией

## Стек технологий

### Frontend
- **Framework**: Next.js (React) с App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (рекомендуется) или CSS Modules
- **Адаптивность**: Fluid/responsive подход с использованием rem + vw/clamp()

### Backend
- **Database**: PostgreSQL (через Prisma ORM)
- **API**: Next.js API Routes (REST API)
- **Admin Panel**: Внутренняя админка на Next.js для управления контентом
- **Auth**: Собственная система аутентификации (session-based)

### Интернационализация
- **Мультиязычность**: Поддержка нескольких языков (минимум EN/RU)
- **i18n**: Next.js internationalization или next-intl

### SEO
- **Sitemap**: Автогенерация sitemap.xml
- **Robots.txt**: Настроенный robots.txt
- **Микроразметка**: 
  - Schema.org BlogPosting для статей
  - Schema.org Organization для компании
  - Open Graph и Twitter Cards

## Типографика

### Шрифт
- **Семейство**: Berka
- **Начертания**: Regular (400), Medium (500)
- **Загрузка**: Preload для оптимизации LCP

### Типографическая шкала (адаптивная)

**Базовый размер**: 16px = 1rem (root font-size)

**Подход**: Использовать `clamp()` для плавной адаптации между breakpoints

```css
/* Desktop/H1 */
font-size: clamp(2.5rem, 3.4375rem, 3.4375rem);  /* 40px → 55px */
font-weight: 400;
line-height: 1.1;
letter-spacing: 0;

/* Desktop/H2 */
font-size: clamp(1.75rem, 2.1875rem, 2.1875rem);  /* 28px → 35px */
font-weight: 400;
line-height: 1.25;
letter-spacing: 0;

/* Desktop/H3 */
font-size: clamp(1.25rem, 1.5625rem, 1.5625rem);  /* 20px → 25px */
font-weight: 400;
line-height: 1.2;
letter-spacing: 0;

/* Desktop/H4 */
font-size: clamp(1.125rem, 1.25rem, 1.25rem);  /* 18px → 20px */
font-weight: 400;
line-height: 1.3;
letter-spacing: 0;

/* Desktop/Body regular */
font-size: clamp(0.875rem, 0.9375rem, 0.9375rem);  /* 14px → 15px */
font-weight: 400;
line-height: 1.7;
letter-spacing: 0;

/* Desktop/Body bold */
font-size: clamp(0.875rem, 0.9375rem, 0.9375rem);  /* 14px → 15px */
font-weight: 500;
line-height: 1.5;
letter-spacing: 0;

/* Desktop/Caption */
font-size: clamp(0.75rem, 0.8125rem, 0.8125rem);  /* 12px → 13px */
font-weight: 500;
line-height: 1.5;
letter-spacing: 0;
```

**Tailwind config пример**:
```js
fontSize: {
  'h1': ['clamp(2.5rem, 3.4375rem, 3.4375rem)', { lineHeight: '1.1' }],
  'h2': ['clamp(1.75rem, 2.1875rem, 2.1875rem)', { lineHeight: '1.25' }],
  'h3': ['clamp(1.25rem, 1.5625rem, 1.5625rem)', { lineHeight: '1.2' }],
  'h4': ['clamp(1.125rem, 1.25rem, 1.25rem)', { lineHeight: '1.3' }],
  'body': ['clamp(0.875rem, 0.9375rem, 0.9375rem)', { lineHeight: '1.7' }],
  'caption': ['clamp(0.75rem, 0.8125rem, 0.8125rem)', { lineHeight: '1.5' }],
}
```

## Цветовая палитра

### Основные цвета
```
Background:
  - Primary: #000000 (черный)
  - Secondary: #0B0B0B (темно-серый)
  - Tertiary: #29292A (серый для кнопок)

Text:
  - Primary: #FFFFFF (белый)
  - Secondary: rgba(255, 255, 255, 0.5) (50% opacity)
  - Tertiary: rgba(255, 255, 255, 0.4) (40% opacity)

Borders:
  - Primary: rgba(255, 255, 255, 0.2)
  - Secondary: rgba(255, 255, 255, 0.07)
  - Dark: #141414, #171717

Accent:
  - Purple: #C53DFF
  - Green: #75FB63
  - Blue: #638EFB

Overlays:
  - Glass: rgba(255, 255, 255, 0.14)
  - Dark glass: rgba(0, 0, 0, 0.01)
  - Tag background: rgba(233, 233, 233, 0.12)
  - Input background: rgba(255, 255, 255, 0.08)
```

## Spacing & Layout

### Контейнеры (адаптивные)
```css
/* Max width */
max-width: 90rem;  /* 1440px */

/* Content width */
max-width: 77.5rem;  /* 1240px */

/* Padding horizontal (адаптивный) */
padding-inline: clamp(1.25rem, 6.25vw, 6.25rem);  /* 20px → 100px */
```

### Отступы (gap) в rem
```css
/* Micro */
0.125rem  /* 2px */
0.3125rem /* 5px */
0.4375rem /* 7px */

/* Small */
0.625rem  /* 10px */
0.75rem   /* 12px */
0.9375rem /* 15px */
1rem      /* 16px */

/* Medium */
1.25rem   /* 20px */
1.5625rem /* 25px */
1.875rem  /* 30px */
2rem      /* 32px */

/* Large */
2.5rem    /* 40px */
3rem      /* 48px */
3.125rem  /* 50px */

/* XL */
6.25rem   /* 100px */
7.8125rem /* 125px */
10.9375rem /* 175px */
```

**Адаптивные отступы с clamp()**:
```css
gap: clamp(1.25rem, 3vw, 3.125rem);  /* 20px → 50px */
margin-block: clamp(3.125rem, 6vw, 6.25rem);  /* 50px → 100px */
```

## Компоненты

### Header
```css
height: clamp(4rem, 4.375rem, 4.375rem);  /* 64px → 70px */
background: backdrop-blur(7.5px) + rgba(0,0,0,0.01);
border-bottom: 1px solid rgba(255,255,255,0.07);
padding: 1.25rem clamp(1.25rem, 6.25vw, 6.25rem);  /* 20px, 20px → 100px */
```

### Footer
```css
min-height: 22.5625rem;  /* 361px */
/* Sections: Newsletter, Navigation, Services, Map, Social */
```

### Buttons
```css
/* Primary */
height: 3rem;  /* 48px */
padding: 0.75rem 1.25rem;  /* 12px 20px */
border-radius: 0.375rem;  /* 6px */
background: rgba(255, 255, 255, 0.14) + backdrop-blur(2px);
font: Berka Medium 0.9375rem;  /* 15px */

/* Secondary (white) */
background: #FFFFFF;
color: #000000;
```

### Cards (Blog)
```css
/* Default size */
width: clamp(18rem, 23.125rem, 23.125rem);  /* 288px → 370px */
aspect-ratio: 397.67 / 250;  /* для изображения */
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 0.5rem;  /* 8px */
gap: 0.9375rem;  /* 15px */

/* Big size */
width: 100%;  /* full container */
max-width: 77.5rem;  /* 1240px */
display: grid;
grid-template-columns: 1fr 1fr;  /* horizontal layout */
gap: 2.5rem;  /* 40px */

@media (max-width: 768px) {
  grid-template-columns: 1fr;  /* vertical на mobile */
}
```

### Tags
```css
height: 2.25rem;  /* 36px */
padding: 0.625rem 0.9375rem;  /* 10px 15px */
border-radius: 0.5rem;  /* 8px */
background: rgba(233, 233, 233, 0.12);
font: Berka Medium 0.8125rem;  /* 13px */
```

### Input Fields
```css
height: 3.75rem;  /* 60px */
padding: 0.5rem 1.5625rem;  /* 8px 25px */
border-radius: 0.5rem;  /* 8px */
border: 2px solid #141414;
/* или background: rgba(255, 255, 255, 0.08) */
font: Berka Regular 0.9375rem;  /* 15px */

&::placeholder {
  opacity: 0.5;
}
```

### Service Cards
```css
min-height: 17.125rem;  /* 274px */
/* или 35.25rem для audit (564px) */
border: 1px solid #171717;
border-radius: 1.25rem;  /* 20px */
background: #0B0B0B;
padding: 2.1875rem;  /* 35px */
```

## Эффекты

### Blur
```
Header/Footer: backdrop-blur(7.5px)
Buttons: backdrop-blur(2px)
Modals: backdrop-blur(5px)
```

### Shadows
```
Map: 
  - 0px 0px 0px 1.592px rgba(0,0,0,0.2)
  - 0px 0px 3.185px 0px rgba(0,0,0,0.08)
  - 0px 3.185px 9.554px 0px rgba(0,0,0,0.1)

Service cards (hover):
  - blur(42px) purple gradient
```

### Gradients
```
Hero background:
  - Radial gradients с фиолетовыми оттенками
  - Ellipses с различными размерами и позициями
  - Mix-blend-mode: overlay, plus-lighter, color-burn
```

## Адаптивность

### Подход: Fluid/Responsive Design
Использовать комбинацию `clamp()`, `vw`, и `rem` для плавной адаптации без резких скачков на breakpoints.

### Breakpoints (для media queries)
```css
/* Tailwind config */
screens: {
  'sm': '640px',   /* Mobile landscape */
  'md': '768px',   /* Tablet */
  'lg': '1024px',  /* Laptop */
  'xl': '1280px',  /* Desktop */
  '2xl': '1440px', /* Large Desktop */
}
```

### Правила адаптации

#### 1. Контейнеры (fluid)
```css
/* Вместо фиксированных значений */
padding-inline: clamp(1.25rem, 6.25vw, 6.25rem);  /* 20px → 100px */
max-width: min(90rem, 100% - 2.5rem);  /* 1440px с отступами */
```

#### 2. Типографика (fluid)
```css
/* Используем clamp() для плавного масштабирования */
font-size: clamp(2.5rem, 2rem + 2vw, 3.4375rem);  /* H1: 40px → 55px */
```

#### 3. Grid (responsive)
```css
/* 3 колонки → 2 колонки → 1 колонка */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
gap: clamp(1.25rem, 3vw, 1.5625rem);  /* 20px → 25px */
```

#### 4. Header (responsive)
```css
/* Desktop: полная навигация */
@media (min-width: 1024px) {
  nav { display: flex; }
  .burger-menu { display: none; }
}

/* Mobile: бургер-меню */
@media (max-width: 1023px) {
  nav { display: none; }
  .burger-menu { display: block; }
}
```

#### 5. Cards (responsive)
```css
/* Horizontal → Vertical */
.blog-card-big {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

@media (max-width: 768px) {
  .blog-card-big {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}
```

### Fluid Typography Formula
```css
/* Формула: clamp(MIN, PREFERRED, MAX) */
/* PREFERRED = MIN + (MAX - MIN) * (100vw - MIN_VP) / (MAX_VP - MIN_VP) */

/* Пример для H1: 40px @ 320px → 55px @ 1440px */
font-size: clamp(2.5rem, 2.5rem + (3.4375 - 2.5) * (100vw - 20rem) / (90 - 20), 3.4375rem);

/* Упрощённо: */
font-size: clamp(2.5rem, 2rem + 2vw, 3.4375rem);
```

## Анимации (подготовка)

### Принципы
1. **Плавность**: все transitions должны быть 200-300ms
2. **Easing**: использовать ease-out для появления, ease-in для исчезновения
3. **Hover states**: для всех интерактивных элементов
4. **Scroll animations**: для появления блоков при скролле

### Готовые к анимации элементы
```
- Hero title (fade + scale)
- Service cards (hover effects с gradient)
- Blog cards (hover lift)
- Buttons (hover scale + brightness)
- Navigation (underline animation)
- Images (parallax на hero)
```

## Иконки

### Размеры (в rem)
```css
Small: 1rem, 1.25rem      /* 16px, 20px */
Medium: 1.5rem, 1.875rem  /* 24px, 30px */
Large: 2.5rem, 3.125rem   /* 40px, 50px */
```

### Стиль
- Outline style
- Stroke width: 1.5-2px
- Используются из библиотеки Lucide React или custom SVG
- Всегда указывать `aria-label` или `aria-hidden="true"`

## Изображения

### Форматы
- WebP (основной)
- PNG (fallback)
- SVG (иконки, логотипы)

### Оптимизация
- Lazy loading для всех изображений ниже fold
- Responsive images с srcset
- Blur placeholder при загрузке

## Accessibility

### Обязательные требования
1. **Контрастность**: минимум 4.5:1 для текста
2. **Alt текст**: для всех изображений
3. **Keyboard navigation**: для всех интерактивных элементов
4. **Focus states**: видимые для всех элементов
5. **ARIA labels**: для иконок без текста
6. **Semantic HTML**: правильная иерархия заголовков

## Производительность

### Цели
```
First Contentful Paint: < 1.5s
Largest Contentful Paint: < 2.5s
Time to Interactive: < 3.5s
Cumulative Layout Shift: < 0.1
```

### Оптимизации
1. Code splitting по роутам
2. Image optimization (Next.js Image)
3. Font preloading
4. CSS critical path
5. Lazy loading компонентов

## Структура компонентов

### Атомарные компоненты
```
- Button
- Input
- Tag
- Icon
- Logo
```

### Молекулы
```
- BlogCard (Default, Big)
- ServiceCard
- Header
- Footer
- Navigation
```

### Организмы
```
- Hero
- ServicesSection
- BlogSection
- PartnersSection
- ContactForm
```

### Страницы
```
- Home (/)
- Blog (/blog)
- Blog Category (/blog/[category])
- Blog Post (/blog/[category]/[slug])
```

## Naming Conventions

### CSS Classes (если используется CSS Modules)
```
BEM methodology:
.block
.block__element
.block__element--modifier
```

### Компоненты
```
PascalCase: BlogCard, ServiceCard, Header
```

### Файлы
```
kebab-case: blog-card.tsx, service-card.module.css
```

## Git Workflow

### Ветки
```
main - production
develop - development
feature/* - новые фичи
fix/* - исправления
```

### Commits
```
feat: добавить компонент BlogCard
fix: исправить отступы в Header
style: обновить цвета кнопок
refactor: переписать ServiceCard на TypeScript
```

## Backend и Admin Panel

### Внутренняя админка
- **URL**: `/admin` (защищена аутентификацией)
- **Технологии**: Next.js App Router + React
- **Роли**: Admin (базовая роль)
- **Функционал**: 
  - Управление постами блога (CRUD)
  - Управление категориями и тегами
  - Загрузка изображений
  - Rich Text Editor (Tiptap)

### Prisma Schema (основные модели)
```prisma
model Post {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  excerpt       String?
  content       String    @db.Text
  featuredImage String?
  published     Boolean   @default(false)
  publishedAt   DateTime?
  locale        String    @default("en")
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [id])
  tags          Tag[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  posts       Post[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Admin {
  id           String   @id @default(cuid())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### PostgreSQL
- **Версия**: 14+
- **Encoding**: UTF-8
- **ORM**: Prisma
- **Миграции**: Prisma Migrate

## SEO и метаданные

### Обязательные элементы

#### 1. Sitemap.xml
```xml
<!-- Автогенерация через Next.js -->
<!-- /sitemap.xml -->
- Все статические страницы
- Динамические blog posts
- Категории блога
- Обновление: при публикации нового контента
```

#### 2. Robots.txt
```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://8blocks.io/sitemap.xml
```

#### 3. Микроразметка Schema.org

**BlogPosting** (для статей):
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "...",
  "image": "...",
  "datePublished": "...",
  "dateModified": "...",
  "author": {
    "@type": "Person",
    "name": "..."
  },
  "publisher": {
    "@type": "Organization",
    "name": "8Blocks",
    "logo": {...}
  }
}
```

**Organization** (для компании):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "8Blocks",
  "url": "https://8blocks.io",
  "logo": "https://8blocks.io/logo.png",
  "sameAs": [
    "https://twitter.com/8blocks",
    "https://t.me/8blocks"
  ]
}
```

#### 4. Open Graph и Twitter Cards
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:type" content="article" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

## Мультиязычность (i18n)

### Поддерживаемые языки
- **Основной**: Английский (EN)
- **Дополнительный**: Русский (RU)
- **Расширение**: возможность добавления других языков

### Реализация
```
Структура URL:
/en/blog/post-slug
/ru/blog/post-slug

Переключатель языка в Header
Хранение локали в cookie/localStorage
```

### Database i18n
- Поле `locale` в модели Post для хранения языка
- Дублирование контента для разных языков
- Фильтрация по locale при запросах

### Next.js i18n
```js
// next.config.js
i18n: {
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  localeDetection: true,
}
```

## Тестирование

### Обязательные проверки
1. **Visual regression**: скриншоты ключевых страниц
2. **Cross-browser**: Chrome, Firefox, Safari, Edge
3. **Responsive**: все breakpoints + fluid между ними
4. **Accessibility**: WAVE, axe DevTools
5. **Performance**: Lighthouse CI
6. **SEO**: проверка микроразметки, sitemap, robots.txt
7. **i18n**: проверка всех языковых версий

---

**Версия**: 2.0
**Дата**: 29.01.2026
**Автор**: Kiro AI + Figma Design Analysis
**Figma**: https://www.figma.com/design/R2ijMvjeixu7I2O2N4YxWI/8-blocks--Copy-
