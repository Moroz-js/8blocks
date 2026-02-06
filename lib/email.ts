import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface ThankYouEmailData {
  name: string;
  email: string;
  message: string;
  locale: 'en' | 'ru';
}

// Create reusable transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  // Validate required config
  if (!config.host || !config.auth.user || !config.auth.pass) {
    throw new Error('SMTP configuration is incomplete. Check your environment variables.');
  }

  return nodemailer.createTransport(config);
};

// Generic email sender
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || '8 Blocks'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email sent successfully to:', options.to);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

// Generate thank you email template
function generateThankYouEmailTemplate(data: ThankYouEmailData): { html: string; text: string; subject: string } {
  const isRussian = data.locale === 'ru';

  const translations = {
    en: {
      subject: 'Thank You for Contacting 8 Blocks',
      greeting: `Hello ${data.name},`,
      thankYou: 'Thank you for reaching out to us!',
      received: 'We have received your message and our team will review it shortly. We typically respond within 24-48 hours.',
      yourMessage: 'Your message:',
      nextSteps: 'What happens next?',
      step1: 'Our team will carefully review your inquiry',
      step2: 'We will prepare a detailed response',
      step3: 'You will receive a personalized reply to your email',
      needHelp: 'If you have any urgent questions in the meantime, feel free to reply to this email.',
      signature: 'Best regards,',
      team: 'The 8 Blocks Team',
      footer: 'This is an automated confirmation email. Please do not reply to this message.',
    },
    ru: {
      subject: 'Спасибо за обращение в 8 Blocks',
      greeting: `Здравствуйте, ${data.name}!`,
      thankYou: 'Благодарим вас за обращение к нам!',
      received: 'Мы получили ваше сообщение, и наша команда скоро его рассмотрит. Обычно мы отвечаем в течение 24-48 часов.',
      yourMessage: 'Ваше сообщение:',
      nextSteps: 'Что будет дальше?',
      step1: 'Наша команда внимательно изучит ваш запрос',
      step2: 'Мы подготовим подробный ответ',
      step3: 'Вы получите персонализированный ответ на ваш email',
      needHelp: 'Если у вас возникнут срочные вопросы, можете ответить на это письмо.',
      signature: 'С уважением,',
      team: 'Команда 8 Blocks',
      footer: 'Это автоматическое письмо-подтверждение. Пожалуйста, не отвечайте на это сообщение.',
    },
  };

  const t = isRussian ? translations.ru : translations.en;

  // HTML template
  const html = `
<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #1a1a1a;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #75fb63;">8 Blocks</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #ffffff;">${t.greeting}</h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                ${t.thankYou}
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                ${t.received}
              </p>

              <!-- Message Block -->
              <div style="background-color: #141414; border-left: 4px solid #75fb63; padding: 20px; margin: 0 0 30px; border-radius: 4px;">
                <p style="margin: 0 0 10px; font-size: 14px; font-weight: 600; color: #75fb63; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${t.yourMessage}
                </p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #cccccc; white-space: pre-wrap;">
                  ${data.message}
                </p>
              </div>

              <!-- Next Steps -->
              <div style="margin: 0 0 30px;">
                <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #ffffff;">${t.nextSteps}</h3>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 30px; vertical-align: top; padding-top: 2px;">
                            <div style="width: 24px; height: 24px; background-color: #75fb63; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #000000;">1</div>
                          </td>
                          <td style="font-size: 15px; line-height: 1.6; color: #e0e0e0; padding-left: 12px;">
                            ${t.step1}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 30px; vertical-align: top; padding-top: 2px;">
                            <div style="width: 24px; height: 24px; background-color: #75fb63; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #000000;">2</div>
                          </td>
                          <td style="font-size: 15px; line-height: 1.6; color: #e0e0e0; padding-left: 12px;">
                            ${t.step2}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 30px; vertical-align: top; padding-top: 2px;">
                            <div style="width: 24px; height: 24px; background-color: #75fb63; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #000000;">3</div>
                          </td>
                          <td style="font-size: 15px; line-height: 1.6; color: #e0e0e0; padding-left: 12px;">
                            ${t.step3}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                ${t.needHelp}
              </p>

              <p style="margin: 0 0 5px; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                ${t.signature}
              </p>
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #75fb63;">
                ${t.team}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #1a1a1a;">
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #666666;">
                ${t.footer}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain text version
  const text = `
${t.greeting}

${t.thankYou}

${t.received}

${t.yourMessage}
${data.message}

${t.nextSteps}
1. ${t.step1}
2. ${t.step2}
3. ${t.step3}

${t.needHelp}

${t.signature}
${t.team}

---
${t.footer}
  `.trim();

  return {
    html,
    text,
    subject: t.subject,
  };
}

// Send thank you email to form submitter
export async function sendThankYouEmail(data: ThankYouEmailData): Promise<void> {
  const { html, text, subject } = generateThankYouEmailTemplate(data);

  await sendEmail({
    to: data.email,
    subject,
    html,
    text,
  });
}

// Optional: Send notification to admin about new contact form submission
export async function sendAdminNotification(data: ThankYouEmailData): Promise<void> {
  const adminEmail = process.env.SMTP_ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.log('Admin email not configured, skipping notification');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="margin: 0 0 20px; color: #333333;">New Contact Form Submission</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #666666; width: 120px;">Name:</td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #333333;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #666666;">Email:</td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #333333;"><a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">${data.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #666666;">Language:</td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #333333;">${data.locale === 'ru' ? 'Русский' : 'English'}</td>
      </tr>
      <tr>
        <td style="padding: 12px 12px 0; font-weight: 600; color: #666666; vertical-align: top;">Message:</td>
        <td style="padding: 12px 12px 0; color: #333333; white-space: pre-wrap;">${data.message}</td>
      </tr>
    </table>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999999; font-size: 13px;">
      Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Language: ${data.locale === 'ru' ? 'Русский' : 'English'}

Message:
${data.message}

Submitted at ${new Date().toISOString()}
  `.trim();

  await sendEmail({
    to: adminEmail,
    subject: `New Contact Form: ${data.name}`,
    html,
    text,
  });
}
