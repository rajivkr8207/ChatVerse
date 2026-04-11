import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingScreen = ({ onComplete }) => {
  const counterRef = useRef(null);
  const progressRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: onComplete
          });
        }
      });

      // Initial state
      gsap.set([textRef.current, counterRef.current], { opacity: 0, y: 20 });

      tl.to([textRef.current, counterRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      })
      .to({ val: 0 }, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function() {
          const progress = Math.round(this.targets()[0].val);
          if (counterRef.current) counterRef.current.innerText = progress + "%";
          if (progressRef.current) progressRef.current.style.width = progress + "%";
        }
      })
      .to(textRef.current, {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center font-sans"
    >
      <div className="relative flex flex-col items-center gap-8">
        <h1 
          ref={textRef}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-white"
        >
          <span className="chatlogo text-orange-500">chat</span>
          <span className="verse">verse</span>
        </h1>
        
        <div className="flex flex-col items-center gap-4 w-64">
          <div 
            ref={counterRef}
            className="text-4xl font-light text-neutral-400 font-mono"
          >
            0%
          </div>
          <div className="w-full h-[2px] bg-neutral-800 rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-0 transition-all duration-100"
            />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-10 flex gap-4 text-xs tracking-widest text-neutral-600 uppercase">
        <span>Designing the Future</span>
        <span className="w-8 h-[1px] bg-neutral-800 my-auto" />
        <span>V 2.0</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
