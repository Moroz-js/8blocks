import Image from 'next/image';
import { Container } from '@/components/layout';

export default function CallToAction() {
  return (
    <section className="w-full py-[clamp(3.125rem,6vw,6.25rem)]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_417px] gap-[clamp(2.5rem,5vw,5rem)] items-center">
          {/* Left Column: Text */}
          <div className="flex flex-col gap-[clamp(0.625rem,1vw,0.625rem)]">
            <h2 className="font-['Berka'] font-normal text-[clamp(1.5625rem,2vw,1.5625rem)] leading-[1.2] text-white">
              If the token has no purpose, the project has no future
            </h2>
            <p className="font-['Berka'] font-normal text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] text-white opacity-50">
              We define the token's role and connect it directly to revenue and operations.
            </p>
          </div>

          {/* Right Column: Contact Buttons */}
          <div className="flex gap-[1.0625rem] items-center justify-center lg:justify-end">
            {/* WhatsApp */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[12.5rem] h-[12.5rem] group"
              aria-label="Message us on WhatsApp"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[6.25rem] h-[6.25rem] flex items-center justify-center">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-[#75FB63] opacity-40 blur-[40px]" />
                <div className="relative w-[5rem] h-[5rem] rounded-full bg-[#75FB63] flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 0C8.954 0 0 8.954 0 20c0 3.531.923 6.853 2.539 9.735L.063 39.938l10.454-2.524A19.913 19.913 0 0020 40c11.046 0 20-8.954 20-20S31.046 0 20 0zm0 36.667c-3.118 0-6.048-.86-8.548-2.351l-.61-.368-6.329 1.531 1.594-6.188-.399-.632A16.588 16.588 0 013.333 20c0-9.204 7.463-16.667 16.667-16.667S36.667 10.796 36.667 20 29.204 36.667 20 36.667z" fill="white"/>
                    <path d="M29 24.5c-.5-.25-3-1.5-3.5-1.625-.5-.125-.75-.25-1.125.25-.375.5-1.25 1.625-1.5 1.875-.25.375-.625.375-1.125.125-.5-.25-2.125-.75-4-2.5-1.5-1.375-2.5-3-2.75-3.5-.25-.5 0-.75.25-1 .25-.25.5-.625.75-.875.25-.25.375-.5.5-.75.125-.375.125-.625 0-.875-.125-.25-1.125-2.625-1.5-3.625-.375-1-.75-.875-1.125-.875h-.875c-.375 0-.875.125-1.375.625-.5.5-1.875 1.875-1.875 4.5s1.875 5.25 2.125 5.625c.25.375 3.75 5.75 9.125 8 1.25.5 2.25.875 3 1.125.125 0 2.375.75 2.75.75.875 0 2.625-.375 3-.1.375-.75.375-1.375.25-1.5-.125-.25-.5-.375-1-.625z" fill="white"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-[0.815rem] left-1/2 -translate-x-1/2 flex flex-col gap-[0.3125rem] items-center">
                <p className="font-['Berka'] font-medium text-[0.8125rem] leading-[1.5] text-[#75fb63] border-b border-[#75fb63] whitespace-nowrap">
                  Message us on WhatsApp
                </p>
              </div>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[12.5rem] h-[12.5rem] group"
              aria-label="Message us on Telegram"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[6.25rem] h-[6.25rem] flex items-center justify-center">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-[#638EFB] opacity-40 blur-[40px]" />
                <div className="relative w-[5rem] h-[5rem] rounded-full bg-[#638EFB] flex items-center justify-center">
                  <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
                    <path d="M30.7276 1.89331L25.7276 25.8933C25.3276 27.6433 24.1776 28.1433 22.6776 27.2683L15.3276 21.5183L11.7776 24.8933C11.3776 25.2933 11.0276 25.6433 10.2276 25.6433L10.7276 18.1433L24.8276 5.39331C25.4276 4.89331 24.6776 4.51831 23.8276 5.01831L6.97764 15.8933L-0.272363 13.5183C-1.87236 12.8933 -1.87236 11.7683 0.227637 10.8933L28.7276 0.143311C30.0776 -0.481689 31.2776 0.393311 30.7276 1.89331Z" fill="white"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-[0.815rem] left-1/2 -translate-x-1/2 flex flex-col gap-[0.3125rem] items-center">
                <p className="font-['Berka'] font-medium text-[0.8125rem] leading-[1.5] text-[#638efb] border-b border-[#638efb] whitespace-nowrap">
                  Message us on Telegram
                </p>
              </div>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
