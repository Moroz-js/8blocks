import Image from 'next/image';
import { Container } from '@/components/layout';

export default function Partners() {
  // New partner logos from /assets/partners/
  const partners = [
    { src: '/assets/partners/1.png', alt: 'Partner 1' },
    { src: '/assets/partners/2.png', alt: 'Partner 2' },
    { src: '/assets/partners/3.png', alt: 'Partner 3' },
    { src: '/assets/partners/4.png', alt: 'Partner 4' },
    { src: '/assets/partners/5.png', alt: 'Partner 5' },
    { src: '/assets/partners/6.png', alt: 'Partner 6' },
    { src: '/assets/partners/7.png', alt: 'Partner 7' },
    { src: '/assets/partners/8.png', alt: 'Partner 8' },
    { src: '/assets/partners/9.png', alt: 'Partner 9' },
  ];

  return (
    <section className="w-full py-fluid-xl overflow-hidden">
      {/* Title in container */}
      <Container className="mb-[clamp(1.875rem,3vw,3.125rem)] lg:mt-[3.125rem]">
        <h2 className="font-['Berka'] font-normal text-[clamp(1.5625rem,2.1875rem,2.1875rem)] leading-[1.25] text-white w-full text-left">
          Our partners
        </h2>
      </Container>

      {/* Marquee - full width, breaks out of container */}
      <div className="relative w-full overflow-hidden lg:mb-[3.125rem]">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-[100px] bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[100px] bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        
        {/* Marquee track - duplicate logos for seamless loop */}
        <div className="flex gap-[clamp(2.5rem,5vw,5rem)] animate-marquee hover:pause">
          {/* First set of logos */}
          {partners.map((partner, index) => (
            <div
              key={`first-${index}`}
              className="relative flex-shrink-0 w-[clamp(8rem,12vw,12.5rem)] h-[4rem] flex items-center justify-center"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                className="object-contain opacity-70"
                sizes="200px"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {partners.map((partner, index) => (
            <div
              key={`second-${index}`}
              className="relative flex-shrink-0 w-[clamp(8rem,12vw,12.5rem)] h-[4rem] flex items-center justify-center"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                className="object-contain opacity-70"
                sizes="200px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
