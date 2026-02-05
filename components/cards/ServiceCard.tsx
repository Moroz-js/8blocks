import { Button } from '@/components/ui';
import Image from 'next/image';

interface ServiceCardProps {
  title: string;
  description: string;
  variant?: 'default' | 'large';
  cardType?: 'strategic' | 'basic' | 'advanced' | 'audit';
}

export default function ServiceCard({ 
  title, 
  description, 
  variant = 'default',
  cardType = 'strategic'
}: ServiceCardProps) {
  const isLarge = variant === 'large';
  
  // Exact widths from Figma for text blocks (desktop only)
  const textWidths = {
    strategic: 'lg:w-[460px]',
    basic: 'lg:w-[340px]',
    advanced: 'lg:w-[450px]',
    audit: 'lg:w-[234px]'
  };

  // Map card types to images
  const imageMap = {
    strategic: '/assets/services/service-1.png',
    basic: '/assets/services/service-2.png',
    advanced: '/assets/services/service-3.png',
    audit: '/assets/services/service-4.png'
  };
  
  return (
    <div 
      className={`
        bg-[#0b0b0b] 
        border border-[#171717] 
        rounded-[clamp(0.75rem,1.25rem,1.25rem)]
        overflow-hidden 
        relative
        flex flex-col
        ${isLarge ? 'min-h-[clamp(17.125rem,35.25rem,35.25rem)]' : 'min-h-[clamp(17.125rem,17.125rem,17.125rem)]'}
        lg:h-auto
        p-[clamp(1.25rem,2.1875rem,2.1875rem)]
      `}
    >
      {/* Background Image - positioned in bottom right */}
      <div className={`absolute pointer-events-none ${
        cardType === 'strategic'
          ? 'inset-0 w-full h-full'
          : cardType === 'advanced' 
          ? 'top-[2.1875rem] right-[8.125rem] h-full' 
          : cardType === 'audit'
          ? 'bottom-[10.25rem] left-[-2.5rem] h-[9.84rem] w-[18.990625rem]'
          : 'bottom-0 right-0 h-full'
      }`}>
        <Image
          src={imageMap[cardType]}
          alt=""
          width={cardType === 'strategic' ? 1200 : 400}
          height={cardType === 'strategic' ? 800 : 400}
          className={
            cardType === 'strategic' 
              ? 'w-full h-full object-cover' 
              : cardType === 'audit' 
              ? 'h-full w-full object-contain' 
              : 'h-full w-auto object-contain'
          }
          quality={95}
        />
      </div>

      {/* Text content */}
      <div className={`flex flex-col gap-[clamp(0.625rem,0.625rem,0.625rem)] ${textWidths[cardType]} w-full relative z-10`}>
        <h3 className="text-[clamp(1.25rem,1.5625rem,1.5625rem)] leading-[1.2] font-['Berka'] font-normal text-white">
          {title}
        </h3>
        <p className="text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] font-['Berka'] font-normal text-white opacity-50">
          {description}
        </p>
      </div>
      
      {/* Button - pushed to bottom */}
      <Button variant="primary" className={`max-w-[125px] mt-auto relative z-10 ${cardType === 'audit' ? 'mx-auto' : ''}`}>
        View details
      </Button>
    </div>
  );
}
