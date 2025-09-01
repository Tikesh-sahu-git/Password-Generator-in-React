import PasswordGenerator from "./components/PasswordGenerator";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const App = () => {
  const appRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // Create animated background elements
    const createAnimatedBackground = () => {
      const background = backgroundRef.current;
      if (!background) return;
      
      // Clear any existing elements
      background.innerHTML = '';
      
      // Create floating shapes
      for (let i = 0; i < 8; i++) {
        const shape = document.createElement('div');
        shape.className = 'absolute rounded-full';
        
        // Random properties
        const size = Math.random() * 150 + 50;
        const colors = [
          'from-purple-500/10 to-pink-500/10',
          'from-blue-500/10 to-cyan-500/10',
          'from-indigo-500/10 to-purple-500/10',
          'from-pink-500/10 to-rose-500/10'
        ];
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        
        shape.className += ` bg-gradient-to-r ${colorClass}`;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.left = `${Math.random() * 100}%`;
        
        background.appendChild(shape);
        
        // Animate with GSAP
        gsap.to(shape, {
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          duration: Math.random() * 10 + 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        
        gsap.to(shape, {
          rotation: 360,
          duration: Math.random() * 20 + 20,
          repeat: -1,
          ease: "none"
        });
      }
    };

    // Animate the entire app container
    gsap.fromTo(appRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Create the animated background
    createAnimatedBackground();

    // Handle window resize to recreate background
    const handleResize = () => {
      createAnimatedBackground();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={appRef} className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"></div>
      
      <div className="w-full max-w-xl relative z-10">
        <PasswordGenerator />
      </div>
    </div>
  );
};

export default App;