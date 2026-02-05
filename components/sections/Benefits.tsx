import Image from 'next/image';
import { Container } from '@/components/layout';

const benefits = [
  {
    id: 1,
    icon: '/assets/icons/benefit-1.svg',
    title: 'Business-linked\neconomics',
    description: 'Token value is structurally tied to usage, not market sentiment. When the business grows, demand has no choice but to follow.',
  },
  {
    id: 2,
    icon: '/assets/icons/benefit-2.svg',
    title: 'Usage-driven\ndemand',
    description: "Tokens are required to access products, rights, or advantages. People hold them because they're needed, not because they're promised.",
  },
  {
    id: 3,
    icon: '/assets/icons/benefit-3.svg',
    title: 'Stress-tested\ncirculation',
    description: 'Models are tested against real behavior: selling pressure, churn, low liquidity, growth spikes. Because markets never follow best-case scenarios.',
  },
  {
    id: 4,
    icon: '/assets/icons/benefit-4.svg',
    title: 'Controlled growth\nmechanics',
    description: 'Supply, incentives, and circulation scale with operations, without handing control to speculation or market cycles.',
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="w-full py-fluid-lg">
      <Container className="flex flex-col gap-fluid-xs items-start">
        {/* Section Title - Fluid typography: 25px → 28px → 35px */}
        <h2 className="font-berka font-normal text-h2 text-white w-full max-w-[1040px]">
          When a business grows, the token doesn't always follow.{' '}
          <br className="hidden sm:block" />
          <span className="text-text-secondary">
            So we design economies where it has to.
          </span>
        </h2>

        {/* Benefits Grid - Responsive: 1 → 2 → 4 columns */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1.25rem] md:gap-[1.5625rem] lg:gap-[3.125rem] pt-fluid-sm">
          {benefits.map((benefit, index) => (
            <div key={benefit.id} className="flex flex-col gap-[0.625rem] items-start relative">
              {/* Card Content */}
              <div className="flex flex-col gap-[15px] items-start w-full">
                {/* Icon - Fixed 40px */}
                <div className="relative size-[40px] overflow-hidden flex-shrink-0">
                  <Image
                    src={benefit.icon}
                    alt={`${benefit.title.replace(/\n/g, ' ')} icon`}
                    fill
                    className="object-contain"
                    loading="lazy"
                    sizes="40px"
                  />
                </div>
                {/* Title - Fluid typography */}
                <h3 className="font-berka font-normal text-h3 text-white whitespace-pre-line">
                  {benefit.title}
                </h3>
              </div>
              {/* Description - Fluid typography */}
              <p className="font-berka font-normal text-body text-text-secondary w-full">
                {benefit.description}
              </p>

              {/* Vertical divider - Hidden on mobile, shown on desktop between cards */}
              {index < benefits.length - 1 && (
                <div 
                  className="hidden lg:block absolute top-0 h-full w-px" 
                  style={{ 
                    right: 'calc(-3.125rem / 2)',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 15%, rgba(255, 255, 255, 0.1) 85%, rgba(255, 255, 255, 0) 100%)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
