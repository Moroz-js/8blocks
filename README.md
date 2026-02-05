# 8Blocks Website

Modern, multilingual website for 8Blocks with integrated blog and admin panel.

## Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
copy .env.local.example .env.local

# 3. Start PostgreSQL
docker-compose up -d

# 4. Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

## Features

- ✅ Multilingual support (EN/RU)
- ✅ Blog with categories and tags
- ✅ Rich text editor (Tiptap)
- ✅ Image upload functionality
- ✅ Admin panel for content management
- ✅ PostgreSQL database with Prisma ORM
- ✅ Responsive design with Tailwind CSS
- ✅ SEO optimized

## Admin Access

- URL: http://localhost:3000/admin/login
- Default credentials: Set in `.env.local`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **Editor**: Tiptap (rich text)
- **i18n**: next-intl
- **Auth**: Custom (bcrypt)
- **Testing**: Jest, Playwright

## Project Structure

```
├── app/
│   ├── [locale]/              # Localized pages
│   │   ├── admin/            # Admin panel
│   │   │   ├── login/
│   │   │   └── dashboard/    # Posts, categories, tags
│   │   └── page.tsx          # Homepage
│   └── api/
│       ├── admin/            # Admin API routes
│       └── blog/             # Public blog API
├── components/
│   ├── admin/                # Admin components
│   │   ├── TiptapEditor.tsx
│   │   ├── PostForm.tsx
│   │   └── ImageUpload.tsx
│   ├── layout/               # Header, Footer, Logo
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── prisma.ts             # Prisma client
│   ├── admin-auth.ts         # Authentication
│   └── utils.ts
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
└── public/
    ├── uploads/              # Uploaded images
    └── fonts/                # Custom fonts
```

## Development Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Lint code
npm run test         # Run tests
npm run test:e2e     # E2E tests
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB
npm run db:migrate   # Create migration
npm run db:studio    # Database GUI
npm run db:seed      # Seed database
```

## Design System

The project follows a strict design system based on Figma specifications:

- **Figma**: https://www.figma.com/design/R2ijMvjeixu7I2O2N4YxWI/8-blocks--Copy-
- **Layout Rules**: See `.kiro/steering/layout-rules.md`

### Key Design Tokens

- **Font**: Berka (Regular 400, Medium 500)
- **Colors**: Dark theme (#000, #0B0B0B) with purple/green/blue accents
- **Typography**: Fluid scaling with clamp()
- **Spacing**: rem-based with fluid adaptation
- **Breakpoints**: 640px, 768px, 1024px, 1280px, 1440px

## Documentation

- [Setup Guide](./SETUP.md) - Complete setup instructions
- [Project Structure](./PROJECT_STRUCTURE.md) - Project organization
- [Layout Rules](./.kiro/steering/layout-rules.md) - Design system

## Environment Variables

Required environment variables (see `.env.local.example`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/8blocks?schema=public"
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
UPLOAD_DIR=public/uploads
```

## License

Proprietary - 8Blocks
