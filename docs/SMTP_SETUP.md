# SMTP Configuration Guide

This document explains how to configure SMTP for sending thank you emails from contact forms.

## Required Environment Variables

Add these variables to your `.env.local` file:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@8blocks.com
SMTP_FROM_NAME=8 Blocks
SMTP_ADMIN_EMAIL=admin@8blocks.com
```

## Provider-Specific Configuration

### Gmail

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account Settings → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Configuration**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com
   SMTP_FROM_NAME=8 Blocks
   ```

**Note**: Gmail has a limit of 500 emails per day for free accounts.

### SendGrid

1. **Create SendGrid account** at https://sendgrid.com
2. **Generate API Key**:
   - Go to Settings → API Keys → Create API Key
   - Choose "Full Access" or "Mail Send" permissions
3. **Configuration**:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   SMTP_FROM_NAME=8 Blocks
   ```

**Benefits**: Reliable delivery, detailed analytics, free tier (100 emails/day).

### Mailgun

1. **Create Mailgun account** at https://mailgun.com
2. **Get SMTP credentials**:
   - Go to Sending → Domain settings → SMTP credentials
3. **Configuration**:
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=postmaster@your-domain.mailgun.org
   SMTP_PASSWORD=your-mailgun-smtp-password
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   SMTP_FROM_NAME=8 Blocks
   ```

### Amazon SES

1. **Create AWS account** and enable SES
2. **Verify email addresses** or domain
3. **Create SMTP credentials** in SES console
4. **Configuration**:
   ```env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-ses-smtp-username
   SMTP_PASSWORD=your-ses-smtp-password
   SMTP_FROM_EMAIL=verified@yourdomain.com
   SMTP_FROM_NAME=8 Blocks
   ```

**Benefits**: Very cost-effective for high volume, excellent deliverability.

### Yandex Mail (Яндекс.Почта)

Popular choice for Russian businesses:

1. **Create Yandex Mail** account at https://mail.yandex.ru
2. **Enable IMAP/SMTP**:
   - Go to Settings → Mail clients → Enable IMAP
3. **Configuration**:
   ```env
   SMTP_HOST=smtp.yandex.ru
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your-email@yandex.ru
   SMTP_PASSWORD=your-password
   SMTP_FROM_EMAIL=your-email@yandex.ru
   SMTP_FROM_NAME=8 Blocks
   ```

### Mail.ru

Another popular Russian email provider:

1. **Create Mail.ru** account at https://mail.ru
2. **Enable external apps**:
   - Settings → Security → Enable access for external apps
3. **Configuration**:
   ```env
   SMTP_HOST=smtp.mail.ru
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your-email@mail.ru
   SMTP_PASSWORD=your-password
   SMTP_FROM_EMAIL=your-email@mail.ru
   SMTP_FROM_NAME=8 Blocks
   ```

## Testing SMTP Configuration

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your SMTP credentials

3. Restart your development server:
   ```bash
   npm run dev
   ```

4. Test the contact form at http://localhost:3000

5. Check the console logs for email sending status

## How It Works

When a user submits the contact form:

1. **Form validation** happens on the client side
2. **API validation** happens on the server (`/api/contact`)
3. **Thank you email** is sent to the user (in their language - EN/RU)
4. **Admin notification** is sent to `SMTP_ADMIN_EMAIL` (if configured)
5. **Success response** is returned to the user

### Email Templates

The system includes two email templates:

#### 1. Thank You Email (to user)
- Bilingual support (English/Russian)
- Professional branded design
- Dark theme matching website
- Message confirmation
- Next steps information
- Mobile-responsive HTML

#### 2. Admin Notification (to admin)
- Clean summary of submission
- User contact details
- Message content
- Timestamp
- Direct email link

## Troubleshooting

### Email not sending

1. **Check environment variables** - Make sure all required variables are set
2. **Check console logs** - Look for error messages
3. **Verify SMTP credentials** - Test with a simple email client
4. **Check firewall** - Ensure ports 587/465 are not blocked
5. **Check spam folder** - Emails might be flagged as spam initially

### Gmail "Less secure app" error

Gmail no longer supports "less secure apps". You must:
- Enable 2-Factor Authentication
- Generate an App Password
- Use the app password instead of your regular password

### SendGrid domain authentication

For better deliverability with SendGrid:
1. Verify your sending domain
2. Set up SPF and DKIM records
3. Configure custom return path

### Rate limits

Most providers have rate limits:
- **Gmail**: 500/day (free), 2000/day (Workspace)
- **SendGrid**: 100/day (free), pay for more
- **Mailgun**: 5000/month (free trial)
- **Amazon SES**: Pay-as-you-go, very cheap

## Security Best Practices

1. **Never commit** `.env.local` to git (already in `.gitignore`)
2. **Use app-specific passwords** when available
3. **Rotate passwords** regularly
4. **Use environment variables** for all credentials
5. **Enable 2FA** on email accounts
6. **Monitor usage** for unusual activity
7. **Use dedicated sending domains** for production

## Production Deployment

For production, set environment variables in your hosting platform:

### Vercel
```bash
vercel env add SMTP_HOST
vercel env add SMTP_PORT
# ... add all SMTP variables
```

### Railway
Add environment variables in the project settings dashboard.

### Docker
Add to `docker-compose.yml`:
```yaml
environment:
  - SMTP_HOST=${SMTP_HOST}
  - SMTP_PORT=${SMTP_PORT}
  # ... etc
```

## Email Template Customization

Email templates are in `lib/email.ts`:

- **HTML template**: Full branded design with inline CSS
- **Text template**: Plain text fallback for email clients that don't support HTML
- **Bilingual**: Supports English and Russian based on form locale

To customize:
1. Edit `generateThankYouEmailTemplate()` function
2. Modify HTML/CSS for design changes
3. Update translations for text changes

## API Reference

### `sendThankYouEmail(data)`

Sends a thank you email to the form submitter.

```typescript
await sendThankYouEmail({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, I need help...',
  locale: 'en'
});
```

### `sendAdminNotification(data)`

Sends a notification to admin about new submission (optional).

```typescript
await sendAdminNotification({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, I need help...',
  locale: 'en'
});
```

### `sendEmail(options)`

Generic email sender for custom emails.

```typescript
await sendEmail({
  to: 'recipient@example.com',
  subject: 'Custom Subject',
  html: '<h1>HTML Content</h1>',
  text: 'Plain text content'
});
```

## Support

For issues or questions:
- Check the [nodemailer documentation](https://nodemailer.com/)
- Review provider-specific SMTP documentation
- Check server logs for detailed error messages
