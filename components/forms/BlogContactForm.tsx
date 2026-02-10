'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/routing';

interface BlogContactFormProps {
  locale: Locale;
}

export function BlogContactForm({ locale }: BlogContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    messenger: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.name}${formData.company ? ` (${formData.company})` : ''}`,
          email: formData.email,
          message: `${formData.messenger ? `Messenger: ${formData.messenger}\n\n` : ''}${formData.message}`,
          locale,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setSubmitSuccess(true);
      setFormData({ name: '', company: '', messenger: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setError(locale === 'ru' ? 'Ошибка отправки. Попробуйте снова.' : 'Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[1.0625rem] w-full max-w-[44.3125rem]">
      {/* Row 1: Name and Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.9375rem]">
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={locale === 'ru' ? 'Ваше имя' : 'Your name'}
          disabled={isSubmitting}
          className="!bg-[rgba(255,255,255,0.08)] h-[3.75rem] px-[1.5625rem] py-[0.5rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
        />
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder={locale === 'ru' ? 'Название компании' : 'Company name'}
          disabled={isSubmitting}
          className="!bg-[rgba(255,255,255,0.08)] h-[3.75rem] px-[1.5625rem] py-[0.5rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
        />
      </div>

      {/* Row 2: Messenger and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.9375rem]">
        <input
          type="text"
          value={formData.messenger}
          onChange={(e) => setFormData({ ...formData, messenger: e.target.value })}
          placeholder={locale === 'ru' ? 'Предпочитаемый мессенджер' : 'Preferred messenger number'}
          disabled={isSubmitting}
          className="!bg-[rgba(255,255,255,0.08)] h-[3.75rem] px-[1.5625rem] py-[0.5rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
        />
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          disabled={isSubmitting}
          className="!bg-[rgba(255,255,255,0.08)] h-[3.75rem] px-[1.5625rem] py-[0.5rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
        />
      </div>

      {/* Row 3: Message (full width, textarea) */}
      <textarea
        required
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder={locale === 'ru' ? 'Кратко опишите ваш проект или вопрос' : 'Briefly describe your project or question'}
        rows={5}
        disabled={isSubmitting}
        className="!bg-[rgba(255,255,255,0.08)] min-h-[9.375rem] px-[1.5625rem] py-[0.75rem] rounded-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20 w-full resize-none disabled:opacity-50"
      />

      {/* Success Message */}
      {submitSuccess && (
        <div className="rounded-lg bg-[#75fb63]/10 border border-[#75fb63] p-4">
          <p className="text-sm text-[#75fb63] font-berka">
            {locale === 'ru' ? '✓ Спасибо! Ваше сообщение успешно отправлено.' : '✓ Thank you! Your message has been sent successfully.'}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-[#ff0300]/10 border border-[#ff0300] p-4">
          <p className="text-sm text-[#ff0300] font-berka">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`backdrop-blur-[2px] bg-white h-[3rem] px-[1.25rem] py-[0.75rem] rounded-[0.375rem] font-berka font-medium text-[0.9375rem] leading-[1.5] text-black hover:bg-white/90 transition-colors mt-[1.875rem] w-[9rem] disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? 'animate-pulse' : ''}`}
      >
        {isSubmitting ? (locale === 'ru' ? 'Отправка...' : 'Sending...') : (locale === 'ru' ? 'Отправить' : 'Send message')}
      </button>
    </form>
  );
}
