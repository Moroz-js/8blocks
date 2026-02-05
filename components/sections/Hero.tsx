import { Button } from '@/components/ui';
import { Container } from '@/components/layout';

export default function Hero() {
  return (
    <section className="relative w-full h-hero-fluid bg-black overflow-hidden">
      {/* Background gradient - exported from Figma */}
      <div
        className="absolute inset-0 pointer-events-none"
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

      {/* Content container */}
      <Container className="relative z-10 flex flex-col items-center justify-between h-full py-[80px] md:py-[110px] lg:py-[138px]">
        {/* Heading */}
        <div className="relative">
          {/* Main heading with overlay blend */}
          <h1 className="text-[clamp(2.5rem,5vw,4.0625rem)] font-berka font-normal leading-[1.1] text-center text-white mix-blend-overlay w-full max-w-[350px] md:max-w-[600px] lg:max-w-[1127px]">
            Token economies
            <br />
            that power the business
          </h1>
          {/* Duplicate heading for glow effect */}
          <h1
            className="absolute top-0 left-1/2 -translate-x-1/2 text-[clamp(2.5rem,5vw,4.0625rem)] font-berka font-normal leading-[1.1] text-center text-white mix-blend-overlay opacity-80 w-full max-w-[380px] md:max-w-[650px] lg:max-w-[1245px]"
            aria-hidden="true"
          >
            Token economies
            <br />
            that power the business
          </h1>
        </div>

        {/* Bottom content */}
        <div className="flex flex-col items-center gap-[20px] md:gap-[30px] w-full max-w-[799px]">
          {/* CTA Buttons */}
          <div className="w-full overflow-x-auto md:overflow-visible scrollbar-hide px-[20px] md:px-0">
            <div className="flex gap-[10px] min-w-min md:justify-center">
              <Button variant="primary" className="whitespace-nowrap flex-shrink-0">Strategic consulting</Button>
              <Button variant="primary" className="whitespace-nowrap flex-shrink-0">Basic tokenomics</Button>
              <Button variant="primary" className="whitespace-nowrap flex-shrink-0">Advanced tokenomics</Button>
              <Button variant="primary" className="whitespace-nowrap flex-shrink-0">Tokenomics audit</Button>
            </div>
          </div>

          {/* Description */}
          <p className="font-berka font-medium text-[15px] leading-[1.5] text-center text-white opacity-50 w-full px-[20px] md:px-0 md:max-w-[600px] lg:max-w-[771px]">
            We help businesses turn tokens from one-time fundraising tools into working economic instruments. Tokens are embedded into products and operations, so usage and demand drive lasting value, not speculation.
          </p>
        </div>
      </Container>

      {/* Bottom fade gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[150px] pointer-events-none z-20"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 100%)'
        }}
      />
    </section>
  );
}
