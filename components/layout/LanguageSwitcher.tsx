'use client';

import { usePathname, useRouter, type Locale } from '@/i18n/routing';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Get the opposite locale
  const targetLocale: Locale = currentLocale === 'en' ? 'ru' : 'en';

  const handleLocaleChange = () => {
    // next-intl's usePathname returns the path without locale prefix,
    // and useRouter().push handles locale prefixing automatically
    router.push(pathname, { locale: targetLocale });
  };

  return (
    <button
      onClick={handleLocaleChange}
      className="w-[1.375rem] h-[1.375rem] flex items-center justify-center rounded-md text-caption font-medium transition-all bg-white/14 text-white backdrop-blur-[2px] hover:bg-white/20"
      aria-label={`Switch to ${targetLocale.toUpperCase()}`}
    >
      {targetLocale.toUpperCase()}
    </button>
  );
}
