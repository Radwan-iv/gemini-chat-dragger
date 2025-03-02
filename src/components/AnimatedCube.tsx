
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCubeProps {
  className?: string;
  size?: number;
}

const AnimatedCube: React.FC<AnimatedCubeProps> = ({ 
  className,
  size = 80 
}) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;
    
    let rotateX = 0;
    let rotateY = 0;
    let requestId: number;
    
    const animate = () => {
      rotateX += 0.3;
      rotateY += 0.5;
      
      if (cube) {
        cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
      
      requestId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);
  
  return (
    <div className={cn("relative", className)}>
      <div 
        ref={cubeRef}
        className="relative transition-transform duration-300"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Front face */}
        <div 
          className="cube-face bg-primary/80 backdrop-blur-sm border border-white/20"
          style={{ 
            transform: `translateZ(${size/2}px)`,
          }}
        />
        
        {/* Back face */}
        <div 
          className="cube-face bg-primary/60 backdrop-blur-sm border border-white/20"
          style={{ 
            transform: `rotateY(180deg) translateZ(${size/2}px)`,
          }}
        />
        
        {/* Right face */}
        <div 
          className="cube-face bg-primary/70 backdrop-blur-sm border border-white/20"
          style={{ 
            transform: `rotateY(90deg) translateZ(${size/2}px)`,
          }}
        />
        
        {/* Left face */}
        <div 
          className="cube-face bg-primary/70 backdrop-blur-sm border border-white/20"
          style={{ 
            transform: `rotateY(-90deg) translateZ(${size/2}px)`,
          }}
        />
        
        {/* Top face */}
        <div 
          className="cube-face bg-primary/90 backdrop-blur-sm border border-white/20"
          style={{ 
            transform: `rotateX(90deg) translateZ(${size/2}px)`,
          }}
        />
        
        {/* Bottom face */}
        <div 
          className="cube-face bg-primary/50 backdrop-blur-sm border border-white/20"
          style={{ 
            transform: `rotateX(-90deg) translateZ(${size/2}px)`,
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedCube;
