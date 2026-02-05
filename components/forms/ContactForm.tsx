'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ContactFormProps {
  locale: 'en' | 'ru';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  submit?: string;
}

export function ContactForm({ locale, onSuccess, onError }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const translations = {
    en: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send Message',
      success: 'Thank you! Your message has been sent successfully.',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'your@email.com',
      messagePlaceholder: 'Tell us about your project...',
      errors: {
        nameRequired: 'Name is required',
        nameMin: 'Name must be at least 2 characters',
        nameMax: 'Name must be less than 100 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        messageRequired: 'Message is required',
        messageMin: 'Message must be at least 10 characters',
        messageMax: 'Message must be less than 2000 characters',
        submitError: 'Failed to send message. Please try again.',
      },
    },
    ru: {
      name: 'Имя',
      email: 'Email',
      message: 'Сообщение',
      submit: 'Отправить',
      success: 'Спасибо! Ваше сообщение успешно отправлено.',
      namePlaceholder: 'Ваше имя',
      emailPlaceholder: 'ваш@email.com',
      messagePlaceholder: 'Расскажите о вашем проекте...',
      errors: {
        nameRequired: 'Имя обязательно',
        nameMin: 'Имя должно содержать минимум 2 символа',
        nameMax: 'Имя должно содержать максимум 100 символов',
        emailRequired: 'Email обязателен',
        emailInvalid: 'Пожалуйста, введите корректный email',
        messageRequired: 'Сообщение обязательно',
        messageMin: 'Сообщение должно содержать минимум 10 символов',
        messageMax: 'Сообщение должно содержать максимум 2000 символов',
        submitError: 'Не удалось отправить сообщение. Попробуйте снова.',
      },
    },
  };

  const t = translations[locale];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t.errors.nameRequired;
    } else if (formData.name.length < 2) {
      newErrors.name = t.errors.nameMin;
    } else if (formData.name.length > 100) {
      newErrors.name = t.errors.nameMax;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errors.emailInvalid;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t.errors.messageRequired;
    } else if (formData.message.length < 10) {
      newErrors.message = t.errors.messageMin;
    } else if (formData.message.length > 2000) {
      newErrors.message = t.errors.messageMax;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setErrors({ submit: t.errors.submitError });
      
      if (onError) {
        onError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-[1.25rem]">
      <Input
        id="contact-name"
        name="name"
        type="text"
        label={t.name}
        placeholder={t.namePlaceholder}
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        disabled={isSubmitting}
        variant="bordered"
      />

      <Input
        id="contact-email"
        name="email"
        type="email"
        label={t.email}
        placeholder={t.emailPlaceholder}
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isSubmitting}
        variant="bordered"
      />

      <div className="w-full">
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white/90">
          {t.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder={t.messagePlaceholder}
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`w-full px-[1.5625rem] py-[0.75rem] rounded-lg transition-colors text-[0.9375rem] font-normal placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
            errors.message
              ? 'border-2 border-[#ff0300] bg-[#000000] text-white focus:border-[#ff0300] focus:ring-[#ff0300]/50'
              : 'border-2 border-[#141414] bg-[#000000] text-white focus:border-white/20 focus:ring-white/20'
          }`}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-2 text-sm text-[#ff0300]">{errors.message}</p>
        )}
      </div>

      {errors.submit && (
        <div className="rounded-lg bg-[#ff0300]/10 border border-[#ff0300] p-4">
          <p className="text-sm text-[#ff0300]">{errors.submit}</p>
        </div>
      )}

      {submitSuccess && (
        <div className="rounded-lg bg-[#75fb63]/10 border border-[#75fb63] p-4">
          <p className="text-sm text-[#75fb63]">{t.success}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="secondary"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? '...' : t.submit}
      </Button>
    </form>
  );
}
