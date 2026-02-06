import { Button } from '@/components/ui';
import { Container } from '@/components/layout';

const services = [
  'Strategic consulting',
  'Basic tokenomics',
  'Advanced tokenomics',
  'Tokenomics audit',
];

export default function Hero() {
  return (
    <section className="relative w-full h-[600px] lg:h-hero-fluid bg-black overflow-hidden">
      {/* Background gradient - mobile vs desktop */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          backgroundImage: 'url(/assets/hero-bg-mobile.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          backgroundImage: 'url(/assets/hero-bg-test.svg)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Color-burn overlay (Figma: #D9D9D9 mix-blend-mode: color-burn) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#d9d9d9',
          mixBlendMode: 'color-burn',
        }}
      />

      {/* Content container - NO z-index here so mix-blend-mode on h1 can blend through to the bg */}
      <Container className="relative flex flex-col items-center justify-between h-full pt-[115px] pb-[91px] lg:py-[138px]">
        {/* Heading — mobile: blend overlay+soft-light, desktop: plain white */}
        <div className="relative w-full max-w-[375px] lg:max-w-[1127px]">
          {/* Mobile: overlay blend h1 */}
          <h1
            className="lg:hidden text-[40px] font-berka font-normal leading-[1.1] text-center w-full text-transparent bg-white bg-clip-text mix-blend-overlay [-webkit-text-fill-color:transparent]"
          >
            Token economies
            <br />
            that power the business
          </h1>
          {/* Mobile: soft-light duplicate */}
          <h1
            className="lg:hidden absolute inset-0 text-[40px] font-berka font-normal leading-[1.1] text-center w-full text-transparent bg-white bg-clip-text mix-blend-soft-light [-webkit-text-fill-color:transparent]"
            aria-hidden="true"
          >
            Token economies
            <br />
            that power the business
          </h1>
          {/* Desktop: plain white text */}
          <h1
            className="hidden lg:block text-[clamp(2.5rem,5vw,4.0625rem)] font-berka font-normal leading-[1.1] text-center w-full text-white"
          >
            Token economies
            <br />
            that power the business
          </h1>
        </div>

        {/* Bottom content - z-10 to stay above background */}
        <div className="relative z-10 flex flex-col items-start lg:items-center gap-[12px] lg:gap-[30px] w-full">
          {/* CTA Buttons - full width scroll on mobile */}
          <div className="w-screen lg:w-full -ml-[clamp(1.25rem,6.25vw,6.25rem)] lg:ml-0 overflow-x-auto lg:overflow-visible scrollbar-hide px-[20px] lg:px-0">
            {/* Mobile: tag-style buttons */}
            <div className="flex gap-[12px] lg:hidden min-w-min">
              {services.map((name) => (
                <button
                  key={name}
                  className="bg-[rgba(233,233,233,0.12)] h-[36px] px-[15px] py-[10px] rounded-[8px] flex items-center justify-center font-berka font-medium text-[13px] leading-[1.5] text-white whitespace-nowrap shrink-0"
                >
                  {name}
                </button>
              ))}
            </div>
            {/* Desktop: Button component */}
            <div className="hidden lg:flex gap-[10px] justify-center">
              {services.map((name) => (
                <Button key={name} variant="primary" className="whitespace-nowrap flex-shrink-0">
                  {name}
                </Button>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="font-berka font-medium lg:font-normal text-[13px] lg:text-[15px] leading-[1.5] lg:leading-[1.7] text-center text-white opacity-50 max-w-[349px] lg:max-w-[771px] lg:w-full">
            We help businesses turn tokens from one-time fundraising tools into working economic instruments. Tokens are embedded into products and operations, so usage and demand drive lasting value, not speculation.
          </p>
        </div>
      </Container>

      {/* Bottom fade gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[90px] lg:h-[150px] pointer-events-none z-20"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 100%)'
        }}
      />
    </section>
  );
}
