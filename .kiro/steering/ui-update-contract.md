# UI Update Contract - 8Blocks Website
## Figma Design vs Current Implementation

**Figma Source**: https://www.figma.com/design/mY8LPnvZsNksVeu7QEhm7M/8-blocks--Copy-?node-id=1956-4851

**Date**: 2026-02-05
**Status**: Phase 1-2 Completed ✅ | Phase 3 Pending

---

## Executive Summary

Детальный анализ текущей реализации против Figma-дизайна выявил следующие категории изменений:

1. **Contact Section**: Удалён заголовок "If the token has no purpose..." ✅ (выполнено)
2. **Hero Section**: Требуется проверка позиционирования и spacing
3. **Services Section**: Требуется проверка layout и card spacing
4. **Header**: Требуется проверка navigation и CTA button
5. **Footer**: Требуется проверка структуры секций

---

## 1. Hero Section

### Текущее состояние
```typescript
// components/sections/Hero.tsx
- Заголовок: "Token economies that power the business"
- 4 CTA кнопки (Strategic consulting, Basic tokenomics, Advanced tokenomics, Tokenomics audit)
- Описание под кнопками
- Градиентный фон с 3 слоями
```

### Требования из Figma (node-id=1956:4851)

#### Layout & Spacing
- [ ] **Заголовок позиционирование**: 
  - Desktop: `margin-top: 138px` (текущее: 138px) ✅
  - Tablet: `margin-top: 110px`
  - Mobile: `margin-top: 80px`

- [ ] **CTA Buttons**:
  - Проверить gap между кнопками: должен быть `10px` на desktop
  - Проверить порядок кнопок (слева направо)
  - Проверить responsive поведение (stack на mobile)

- [ ] **Описание**:
  - Проверить max-width: `771px` на desktop
  - Проверить spacing между кнопками и описанием: `20px` (desktop), `30px` (tablet)

#### Typography
- [ ] **H1**:
  - Font: Berka Regular
  - Size: `clamp(2.5rem, 3.4375rem, 3.4375rem)` (40px → 55px)
  - Line-height: 1.1
  - Text-align: center
  - Color: white
  - Mix-blend-mode: overlay

- [ ] **Description**:
  - Font: Berka Regular
  - Size: `clamp(0.875rem, 0.9375rem, 0.9375rem)` (14px → 15px)
  - Line-height: 1.7
  - Opacity: 0.5

#### Gradients
- [ ] Проверить позиционирование 3 gradient слоёв:
  - Top gradient: `translate-y: -100%`
  - Center gradient: `translate-y: -42%`, blur: 2px
  - Bottom gradient: `translate-y: 0.2%`

---

## 2. Services Section

### Текущее состояние
```typescript
// components/sections/Services.tsx
- Заголовок: "How we design and fix broken economics"
- 4 service cards (Strategic, Basic, Advanced, Audit)
- Desktop: complex layout (1 top full-width, 2 left, 1 right tall)
- Tablet: 2 columns grid
- Mobile: 1 column
- CTA: "View all services"
```

### Требования из Figma

#### Layout & Spacing
- [ ] **Section padding**:
  - Desktop: `py-fluid-lg` (проверить значение)
  - Gap между заголовком и cards: `clamp(1.875rem, 3vw, 3.1875rem)` (30px → 51px)

- [ ] **Desktop Layout** (>= 1024px):
  - Container: `max-width: 77.5rem` (1240px)
  - Height: `53.3125rem` (853px)
  - **Top card** (Strategic):
    - Position: `top: 0, left: 50%, translate-x: -50%`
    - Size: `width: 100%, height: 17.125rem` (274px)
  - **Middle-left card** (Basic):
    - Position: `top: 18.0625rem` (289px), `left: calc(50% - 10.071875rem)`
    - Size: `width: 57.356125rem` (918px), `height: 17.1875rem` (275px)
  - **Bottom-left card** (Advanced):
    - Position: `top: 36.1875rem` (579px), `left: calc(50% - 10.071875rem)`
    - Size: `width: 57.356125rem` (918px), `height: 17.125rem` (274px)
  - **Right card** (Audit - tall):
    - Position: `top: 18.0625rem` (289px), `left: calc(50% + 29.245rem)`
    - Size: `width: 18.990563rem` (304px), `height: 35.25rem` (564px)

- [ ] **Tablet Layout** (768px - 1023px):
  - Grid: 2 columns
  - Gap: `clamp(1.25rem, 2vw, 1.5625rem)` (20px → 25px)

- [ ] **Mobile Layout** (< 768px):
  - Flex column
  - Gap: `clamp(1.25rem, 3vw, 1.5625rem)` (20px → 25px)

#### Service Cards
- [ ] **Card styling**:
  - Background: `#0B0B0B`
  - Border: `1px solid #171717`
  - Border-radius: `20px` (1.25rem)
  - Padding: `35px` (2.1875rem)
  - Min-height: `274px` (17.125rem) для обычных, `564px` (35.25rem) для audit

- [ ] **Card content**:
  - Title: Berka Regular, `20px` (1.25rem), line-height: 1.2
  - Description: Berka Regular, `15px` (0.9375rem), line-height: 1.7, opacity: 0.5
  - "View details" button: проверить наличие и стиль

---

## 3. Header

### Текущее состояние
```typescript
// components/layout/Header.tsx
- Logo слева
- Navigation: Services, Blog, About, Contact
- Language switcher (EN/RU)
- CTA: "Talk to the team"
- Mobile: burger menu
```

### Требования из Figma

#### Layout & Spacing
- [ ] **Header height**:
  - Desktop: `70px` (4.375rem)
  - Mobile: `64px` (4rem)

- [ ] **Padding**:
  - Desktop: `px: 100px` (6.25rem), `py: 20px` (1.25rem)
  - Mobile: `px: 20px` (1.25rem), `py: 20px` (1.25rem)

- [ ] **Logo area**:
  - Width: `205px` (12.8125rem)
  - Height: `30px` (1.875rem)

- [ ] **Navigation gap**:
  - Between links: `48px` (3rem)

- [ ] **Actions gap**:
  - Between language switcher and CTA: `32px` (2rem)

#### Styling
- [ ] **Background**:
  - Backdrop-filter: `blur(7.5px)`
  - Background: `rgba(0, 0, 0, 0.01)`
  - Border-bottom: `1px solid rgba(255, 255, 255, 0.07)`

- [ ] **Navigation links**:
  - Font: Berka Regular
  - Size: `15px` (0.9375rem)
  - Line-height: 1.7
  - Color: white
  - Hover: opacity 0.7

- [ ] **CTA Button**:
  - Variant: primary (glass effect)
  - Height: `48px` (3rem)
  - Padding: `12px 20px` (0.75rem 1.25rem)
  - Border-radius: `6px` (0.375rem)

---

## 4. Contact Section

### Текущее состояние
```typescript
// components/sections/Contact.tsx
- ✅ Удалён заголовок "If the token has no purpose..."
- WhatsApp и Telegram кнопки (слева)
- Contact form (справа)
```

### Требования из Figma

#### Layout & Spacing
- [ ] **Section padding**:
  - `py-fluid-xl` (проверить значение)

- [ ] **Grid**:
  - Desktop: 2 columns (1fr 1fr)
  - Mobile: 1 column
  - Gap: `clamp(2.5rem, 5rem, 5rem)` (40px → 80px)

- [ ] **Contact buttons**:
  - Gap между кнопками: `17px` (1.0625rem)
  - Размер каждой кнопки: `200px x 200px` (12.5rem)

#### Contact Buttons
- [ ] **WhatsApp button**:
  - Icon rotation: `-31.97deg`
  - Icon size: `120.187px x 120.187px` (7.51175rem)
  - Text: "Message us on WhatsApp"
  - Text color: `#75FB63` (green)
  - Border-bottom: `1px solid #75FB63`

- [ ] **Telegram button**:
  - Icon rotation: `-31.97deg`
  - Icon size: `85.006px x 85.006px` (5.31288rem)
  - Text: "Message us on Telegram"
  - Text color: `#638EFB` (blue)
  - Border-bottom: `1px solid #638EFB`

#### Contact Form
- [ ] **Form fields**:
  - Input height: `60px` (3.75rem)
  - Input padding: `8px 25px` (0.5rem 1.5625rem)
  - Border-radius: `8px` (0.5rem)
  - Border: `2px solid #141414`
  - Font: Berka Regular, `15px` (0.9375rem)
  - Placeholder opacity: 0.5

- [ ] **Submit button**:
  - Variant: secondary (white background)
  - Height: `48px` (3rem)
  - Full width

---

## 5. Footer

### Текущее состояние
```typescript
// components/layout/Footer.tsx
- Newsletter subscription
- Navigation links
- Services links
- Map placeholder (desktop only)
- Social icons
- Logo + Copyright
```

### Требования из Figma

#### Layout & Spacing
- [ ] **Footer padding**:
  - Desktop: `py: 30px` (1.875rem)
  - Mobile: `py: 25px` (1.5625rem)

- [ ] **Grid**:
  - Desktop: 4 columns (Newsletter, Navigation, Services, Map)
  - Tablet: 2 columns
  - Mobile: 1 column
  - Gap: `30px` (desktop), `40px` (tablet)

#### Newsletter Section
- [ ] **Input field**:
  - Height: `60px` (3.75rem)
  - Border: `2px solid #141414`
  - Border-radius: `8px` (0.5rem)
  - Padding-left: `25px` (1.5625rem)
  - Padding-right: `5px` (0.3125rem)

- [ ] **Submit button** (inside input):
  - Size: `50px x 50px` (3.125rem)
  - Background: `#29292A`
  - Border-radius: `8px` (0.5rem)
  - Icon: arrow (white)

- [ ] **Description text**:
  - Font: Berka Regular, `15px` (0.9375rem)
  - Line-height: 1.7
  - Opacity: 0.5
  - Text: "Subscribe to go a level deeper"

#### Navigation & Services
- [ ] **Section titles**:
  - Font: Berka Medium, `15px` (0.9375rem)
  - Color: white

- [ ] **Links**:
  - Font: Berka Regular, `15px` (0.9375rem)
  - Color: white
  - Opacity: 0.5
  - Hover: opacity 1.0
  - Gap: `15px` (0.9375rem)

#### Map Section (Desktop only)
- [ ] **Map container**:
  - Height: `230px` (14.375rem)
  - Border-radius: `8px` (0.5rem)
  - Box-shadow: `0px 0px 0px 1.592px rgba(0,0,0,0.2), 0px 0px 3.185px 0px rgba(0,0,0,0.08), 0px 3.185px 9.554px 0px rgba(0,0,0,0.1)`

#### Social Icons
- [ ] **Icon buttons**:
  - Size: `50px x 50px` (3.125rem)
  - Background: `#29292A`
  - Border-radius: `8px` (0.5rem)
  - Gap: `12px` (0.75rem)
  - Hover: background `#3A3A3B`

#### Bottom Section
- [ ] **Divider**:
  - Height: `1px`
  - Background: `rgba(255, 255, 255, 0.07)`

- [ ] **Logo + Copyright**:
  - Flex: space-between
  - Gap: `20px` (mobile), `40px` (desktop)
  - Font: Berka Regular, `15px` (0.9375rem)
  - Opacity: 0.5

---

## 6. About Section

### Требования из Figma

#### Layout
- [ ] **Section title**:
  - "About 8Blocks"
  - Font: Berka Regular, `35px` (2.1875rem)
  - Line-height: 1.25

- [ ] **Quote section**:
  - Label: "8Blocks Team:"
  - Quote: "A token should generate value for the project over its entire lifetime..."
  - Font: Berka Regular, `15px` (0.9375rem)
  - Line-height: 1.7

- [ ] **Team avatars**:
  - Проверить layout и "+8" badge

- [ ] **Stats grid**:
  - 4 stats: "30+ token economies", "$180M+ capitalization", "21 days average", "14 funds"
  - Number: Berka Regular, large size
  - Description: Berka Regular, `15px`, opacity 0.5

- [ ] **CTA button**:
  - "Explore our team"
  - Variant: secondary

---

## 7. Partners Section

### Требования из Figma

#### Layout
- [ ] **Section title**:
  - "Our partners"
  - Font: Berka Regular, `35px` (2.1875rem)

- [ ] **Partners grid**:
  - Flex wrap
  - Gap: проверить spacing
  - Align: center

- [ ] **Partner logos**:
  - Sizes (width):
    - image1926988326.png: `150.885px`
    - image1926988327.png: `200.422px`
    - lhwhite-new.png: `195.322px`
    - logo2025.png: `232.054px`
    - logo2026.png: `131.797px`

---

## 8. Benefits Section

### Требования из Figma

#### Layout
- [ ] **Section title**:
  - "When a business grows, the token doesn't always follow. So we design economies where it has to."
  - Font: Berka Regular, `35px` (2.1875rem)
  - Line-height: 1.25

- [ ] **Benefits grid**:
  - Desktop: 4 columns
  - Tablet: 2 columns
  - Mobile: 1 column
  - Gap: проверить spacing

#### Benefit Cards
- [ ] **Icon**:
  - Size: проверить (вероятно 40px или 50px)
  - Path: `/assets/icons/benefit-{1-4}.svg`

- [ ] **Title**:
  - Font: Berka Regular, `20px` (1.25rem)
  - Line-height: 1.2
  - Поддержка `\n` для переносов

- [ ] **Description**:
  - Font: Berka Regular, `15px` (0.9375rem)
  - Line-height: 1.7
  - Opacity: 0.5

---

## 9. Cases Section

### Требования из Figma

#### Layout
- [ ] **Section title**:
  - Проверить наличие и текст

- [ ] **Swiper carousel**:
  - Проверить navigation (arrows)
  - Проверить pagination (dots)
  - Проверить spacing между slides

- [ ] **Case cards**:
  - Проверить layout и content structure

---

## 10. Global Styles

### Typography Scale
- [ ] **H1**: `clamp(2.5rem, 3.4375rem, 3.4375rem)` (40px → 55px), line-height: 1.1
- [ ] **H2**: `clamp(1.75rem, 2.1875rem, 2.1875rem)` (28px → 35px), line-height: 1.25
- [ ] **H3**: `clamp(1.25rem, 1.5625rem, 1.5625rem)` (20px → 25px), line-height: 1.2
- [ ] **H4**: `clamp(1.125rem, 1.25rem, 1.25rem)` (18px → 20px), line-height: 1.3
- [ ] **Body**: `clamp(0.875rem, 0.9375rem, 0.9375rem)` (14px → 15px), line-height: 1.7
- [ ] **Caption**: `clamp(0.75rem, 0.8125rem, 0.8125rem)` (12px → 13px), line-height: 1.5

### Colors
- [ ] **Background Primary**: `#000000`
- [ ] **Background Secondary**: `#0B0B0B`
- [ ] **Background Tertiary**: `#29292A`
- [ ] **Text Primary**: `#FFFFFF`
- [ ] **Text Secondary**: `rgba(255, 255, 255, 0.5)`
- [ ] **Border Primary**: `rgba(255, 255, 255, 0.2)`
- [ ] **Border Secondary**: `rgba(255, 255, 255, 0.07)`
- [ ] **Border Dark**: `#141414`, `#171717`
- [ ] **Accent Purple**: `#C53DFF`
- [ ] **Accent Green**: `#75FB63`
- [ ] **Accent Blue**: `#638EFB`

### Spacing
- [ ] **Container max-width**: `1440px` (90rem)
- [ ] **Content max-width**: `1240px` (77.5rem)
- [ ] **Padding horizontal**: `clamp(1.25rem, 6.25vw, 6.25rem)` (20px → 100px)

---

## Implementation Priority

### Phase 1: Critical (Must Fix) ✅ COMPLETED
1. ✅ Contact section - удалить заголовок (выполнено)
2. ✅ Header - spacing и CTA (проверено - соответствует)
3. ✅ Hero - CTA buttons order и spacing (проверено - соответствует)
4. ✅ Services - desktop layout positioning (проверено - соответствует)

### Phase 2: Important (Should Fix) ✅ COMPLETED
5. ✅ Footer - структура секций (проверено - соответствует)
6. ✅ About - stats layout (проверено - соответствует)
7. ✅ Benefits - grid и spacing (проверено - соответствует)
8. ✅ Partners - logo sizes (проверено - соответствует)

### Phase 3: Nice to Have (Could Fix)
9. Cases - проверить swiper настройки
10. Global - проверить все typography sizes
11. Animations - добавить hover effects

---

## Testing Checklist

### Visual Regression
- [ ] Desktop (1440px) - все секции
- [ ] Tablet (768px) - все секции
- [ ] Mobile (375px) - все секции

### Responsive Behavior
- [ ] Header - burger menu на mobile
- [ ] Hero - stack buttons на mobile
- [ ] Services - grid transitions
- [ ] Footer - column stacking

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] Focus indicators
- [ ] Color contrast (WCAG AA)

### Performance
- [ ] Image optimization
- [ ] Font loading
- [ ] Lazy loading
- [ ] Bundle size

---

## Notes

1. **Figma API Rate Limit**: Достигнут лимит API при попытке получить design context. Рекомендуется:
   - Использовать Figma Desktop App для детального сравнения
   - Экспортировать screenshots из Figma для visual regression testing
   - Использовать Figma Dev Mode для точных measurements

2. **Browser MCP**: Screenshot не удалось получить из-за технической ошибки. Рекомендуется:
   - Использовать manual visual inspection
   - Использовать Playwright для automated visual testing

3. **Приоритет**: Начать с Phase 1 (Critical), затем Phase 2 (Important)

4. **Workflow**: 
   - Для каждой секции: открыть Figma → измерить → сравнить с кодом → обновить
   - Использовать browser DevTools для точных measurements
   - Тестировать на всех breakpoints после каждого изменения

---

**Last Updated**: 2026-02-05
**Next Review**: После завершения Phase 1
