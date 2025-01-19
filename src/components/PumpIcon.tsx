import { SVGProps } from 'react';

export const PumpIcon = (props: SVGProps<SVGSVGElement>) => (
  <div className={`rounded-full ${props.className || ''}`}>
    <img 
      src="/lovable-uploads/d6587f8f-6d9f-442d-8a60-e60620151ac3.png"
      alt="Oil Pump Icon"
      className="w-full h-full object-cover"
    />
  </div>
);