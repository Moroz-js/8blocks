import ServiceCard from '@/components/cards/ServiceCard';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';

// Mock data - will be replaced with database data later
const services = [
  {
    id: 1,
    title: 'Strategic consulting',
    description: 'We design the economic strategy behind the system. This includes defining token logic, incentives, and partner structure for Web3 projects and businesses entering tokenized ecosystems.',
    cardType: 'strategic' as const,
  },
  {
    id: 2,
    title: 'Basic tokenomics',
    description: 'A foundational token economics model covering supply, emission, and distribution, built to keep the system stable from day one.',
    cardType: 'basic' as const,
  },
  {
    id: 3,
    title: 'Advanced tokenomics',
    description: 'A deeper token economics model for complex ecosystems, extending the foundation with treasury logic, incentive systems, liquidity mechanics, and internal flows.',
    cardType: 'advanced' as const,
  },
  {
    id: 4,
    title: 'Tokenomics audit',
    description: 'A full assessment of an existing token economy, identifying structural risks, broken incentive loops, and scaling bottlenecks.',
    variant: 'large' as const,
    cardType: 'audit' as const,
  },
];

export default function Services() {
  return (
    <section id="services" className="w-full py-fluid-lg">
      <Container className="flex flex-col gap-[clamp(1.875rem,3vw,3.1875rem)] items-center">
        {/* Section Title */}
        <h2 className="text-h2 font-berka font-normal text-white w-full text-left">
          How we design and fix broken economics
        </h2>

        {/* Services Grid - Responsive: Desktop (complex layout) → Tablet (2 cols) → Mobile (1 col) */}
        
        {/* Desktop: CSS Grid layout (>= 1024px) */}
        <div className="hidden lg:grid w-full grid-cols-[1fr_18.990625rem] gap-[1.1875rem] auto-rows-[17.125rem]">
          {/* Top card - full width spanning both columns */}
          <div className="col-span-2">
            <ServiceCard
              title={services[0].title}
              description={services[0].description}
              cardType={services[0].cardType}
            />
          </div>

          {/* Left column - 2 cards stacked */}
          <div className="flex flex-col gap-[1.1875rem]">
            <ServiceCard
              title={services[1].title}
              description={services[1].description}
              cardType={services[1].cardType}
            />
            <ServiceCard
              title={services[2].title}
              description={services[2].description}
              cardType={services[2].cardType}
            />
          </div>

          {/* Right card - tall, spanning 2 rows */}
          <div className="row-span-2">
            <ServiceCard
              title={services[3].title}
              description={services[3].description}
              variant="large"
              cardType={services[3].cardType}
            />
          </div>
        </div>

        {/* Tablet: 2 columns grid (768px - 1023px) */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-[clamp(1.25rem,2vw,1.5625rem)] w-full">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              cardType={service.cardType}
              variant={service.variant}
            />
          ))}
        </div>

        {/* Mobile: 1 column (< 768px) */}
        <div className="flex md:hidden flex-col gap-[clamp(1.25rem,3vw,1.5625rem)] w-full">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              cardType={service.cardType}
              variant={service.variant}
            />
          ))}
        </div>

        {/* CTA Button */}
        <Button variant="secondary">
          Talk to the team
        </Button>
      </Container>
    </section>
  );
}
