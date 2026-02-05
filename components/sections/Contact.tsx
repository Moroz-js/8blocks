'use client';

import { ContactForm } from '@/components/forms/ContactForm';
import { Container } from '@/components/layout';
import { useLocale } from 'next-intl';

export default function Contact() {
  const locale = useLocale() as 'en' | 'ru';

  return (
    <section className="w-full py-fluid-xl">
      <Container>
        <div className="w-full max-w-[37.5rem] mx-auto">
          <ContactForm locale={locale} />
        </div>
      </Container>
    </section>
  );
}
