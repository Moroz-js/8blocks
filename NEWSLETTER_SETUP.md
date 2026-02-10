# Newsletter Setup Instructions

## Database Migration

After pulling these changes, run the following commands to update your database:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply the migration
npx prisma migrate dev --name add_newsletter_subscription

# For production
npx prisma migrate deploy
```

## Environment Variables

No new environment variables are needed. The newsletter feature uses the existing SMTP configuration:

- `SMTP_HOST` - Your SMTP server
- `SMTP_PORT` - SMTP port (usually 587)
- `SMTP_SECURE` - Set to `false` for port 587
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `SMTP_FROM` - Sender email (hello@8blocks.io)
- `ADMIN_EMAIL` - Admin notification email (vm@xmethod.de)

## Features

### User Flow
1. User enters email in footer newsletter form (mobile or desktop)
2. Email is saved to database
3. User receives confirmation email with newsletter details
4. Admin receives notification about new subscription
5. Success message displayed to user

### Admin Notifications
Admins receive an email for each new subscription with:
- Subscriber email
- Preferred language (en/ru)
- Subscription timestamp

### Email Templates
Both user confirmation and admin notification emails are styled with:
- Dark theme matching the 8Blocks brand
- Responsive design
- Clear unsubscribe instructions
- Bilingual support (English/Russian)

## API Endpoints

### POST /api/newsletter
Handles newsletter subscriptions.

**Request Body:**
```json
{
  "email": "user@example.com",
  "locale": "en" | "ru"
}
```

**Response:**
- `200` - Success
- `400` - Invalid email or missing required fields
- `409` - Email already subscribed
- `500` - Server error

## Database Schema

```prisma
model NewsletterSubscription {
  id             String   @id @default(cuid())
  email          String   @unique
  locale         String   @default("en")
  subscribedAt   DateTime @default(now())
  unsubscribedAt DateTime?
  
  @@index([email])
  @@index([subscribedAt])
}
```

## Testing

Test the newsletter locally:

1. Ensure your local `.env.local` has SMTP credentials
2. Navigate to the homepage
3. Scroll to footer
4. Enter a test email
5. Check that:
   - Success message appears
   - Confirmation email arrives
   - Admin notification arrives
   - Database entry is created

## Managing Subscriptions

To view all subscriptions:
```bash
npx prisma studio
```

Then navigate to the `NewsletterSubscription` table.

## Future Enhancements

Potential features to consider:
- Unsubscribe link functionality
- Email verification (double opt-in)
- Admin dashboard for managing subscribers
- Export subscribers to CSV
- Integration with email marketing platforms (Mailchimp, SendGrid, etc.)
