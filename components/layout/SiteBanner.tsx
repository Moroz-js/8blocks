'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'site-banner-dismissed';

export function SiteBanner() {
  const t = useTranslations('banner');
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); // 993+

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setIsVisible(true);

    const mq = window.matchMedia('(min-width: 993px)');

    const apply = () => setIsDesktop(mq.matches);
    apply();

    // Safari fallback
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', apply);
      else mq.removeListener(apply);
    };
  }, []);

  // body class только для десктоп-версии (когда баннер сверху и влияет на layout)
  useEffect(() => {
    if (!isVisible) {
      document.body.classList.remove('has-banner');
      return;
    }
    if (isDesktop) document.body.classList.add('has-banner');
    else document.body.classList.remove('has-banner');
  }, [isVisible, isDesktop]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    document.body.classList.remove('has-banner');
  };

  if (!isVisible) return null;

  return (
    <div
      className="
        fixed z-[60]
        max-[992px]:bottom-1 max-[992px]:left-1 max-[992px]:right-1
        max-[992px]:rounded-[20px] max-[992px]:bg-[#141414]
        max-[992px]:border max-[992px]:border-white/10
        max-[992px]:px-[20px] max-[992px]:py-[16px]

        min-[993px]:top-0 min-[993px]:left-0 min-[993px]:right-0
        min-[993px]:bg-black min-[993px]:border-b min-[993px]:border-white/10
      "
    >
      <div
        className="
          relative flex items-center justify-center
          min-[993px]:h-[44px] min-[993px]:px-[20px]
        "
      >
        <p className="font-berka text-[13px] lg:text-[15px] leading-[1.7] text-[#FFC700] text-left pr-[30px] min-[993px]:pr-0">
  {t('message')}
</p>

<button
  onClick={handleDismiss}
  className="absolute right-[-10px] min-[993px]:right-[30px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] flex items-center justify-center text-[#FFC700] hover:opacity-70 transition-opacity"
  aria-label={t('close')}
>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M13 1L1 13M1 1L13 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
