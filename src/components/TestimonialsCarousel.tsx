import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    quote: "Genzio completely transformed our SDR team's workflow. We went from sending hundreds of manual emails a week to fully automating our pipeline.",
    author: "Sarah Jenkins",
    role: "VP of Sales",
    company: "TechFlow",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    tag: "Faster Launch"
  },
  {
    id: 2,
    quote: "The deliverability protection is the best I have seen. Our open rates went from 15% to over 40% in just two weeks.",
    author: "Michael Chang",
    role: "Founder",
    company: "GrowthStack",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    tag: "More Replies"
  },
  {
    id: 3,
    quote: "We use the agency white-label feature for all our clients. It's seamless, powerful, and looks incredibly professional.",
    author: "Elena Rodriguez",
    role: "Marketing Director",
    company: "ScaleUp Agency",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    tag: "Cleaner Campaigns"
  },
  {
    id: 4,
    quote: "Finally, a cold outreach tool that looks great and actually works. The analytics dashboard alone is worth the price.",
    author: "David Peterson",
    role: "Head of Growth",
    company: "Nexa",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    tag: "Better Tracking"
  },
  {
    id: 5,
    quote: "Connecting our custom SMTP servers was a breeze. Genzio handles everything else smoothly in the background.",
    author: "Lisa Wang",
    role: "Operations Lead",
    company: "CloudSync",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    tag: "Faster Launch"
  }
];

export default function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "200px" });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 50) {
      prevSlide();
    } else if (info.offset.x < -50) {
      nextSlide();
    }
  };

  return (
    <section ref={containerRef} className="py-32 relative bg-black overflow-hidden font-sans border-b border-white/5">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 blur-[80px] rounded-full pointer-events-none transform-gpu translate-z-0"></div>
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-neon-pink/5 blur-[80px] rounded-full pointer-events-none transform-gpu translate-z-0"></div>
      
      {/* Floating Particles */}
      {!isMobile && isInView && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-20"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                willChange: 'transform, opacity'
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: Math.random() * 3 + 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-pink/30 mb-6 bg-neon-pink/5 backdrop-blur-md"
          >
            <span className="text-xs font-mono tracking-widest text-neon-pink uppercase font-bold">Growth Team Stories</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6 text-white tracking-tight">
            Loved by <span className="text-neon-cyan drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]">Modern Outreach Teams</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Real teams use Genzio to launch cleaner campaigns, track replies, and automate outreach without the chaos.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center">
            {/* Cards */}
            <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                   {testimonialsData.map((t, idx) => {
                     let position = -1; // -1 means inactive/hidden
                     if (idx === activeIndex) position = 1; // active/center
                     else if (idx === (activeIndex - 1 + testimonialsData.length) % testimonialsData.length) position = 0; // left
                     else if (idx === (activeIndex + 1) % testimonialsData.length) position = 2; // right

                     if (position === -1) return null;

                     const isCenter = position === 1;
                     let zIndex = isCenter ? 30 : 20;

                     let xOffset = 0;
                     let scale = 1;
                     let opacity = 1;
                     let rotateY = 0;
                     let blur = 0;

                     if (position === 0) {
                       // Left
                       xOffset = isMobile ? -500 : isTablet ? -250 : -320;
                       scale = isMobile ? 0.9 : 0.85;
                       opacity = isMobile ? 0 : 0.5;
                       rotateY = isMobile ? 0 : 15;
                       blur = isMobile ? 0 : 4;
                     } else if (position === 2) {
                       // Right
                       xOffset = isMobile ? 500 : isTablet ? 250 : 320;
                       scale = isMobile ? 0.9 : 0.85;
                       opacity = isMobile ? 0 : 0.5;
                       rotateY = isMobile ? 0 : -15;
                       blur = isMobile ? 0 : 4;
                     }

                     return (
                        <motion.div
                          key={t.id}
                          custom={direction}
                          initial={{ opacity: 0, scale: 0.8, x: direction > 0 ? 500 : -500 }}
                          animate={{ 
                            x: xOffset, 
                            scale: scale, 
                            opacity: opacity, 
                            zIndex, 
                            rotateY: rotateY,
                            filter: `blur(${blur}px)`
                          }}
                          exit={{ opacity: 0, scale: 0.8, x: direction > 0 ? -500 : 500 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className={`absolute w-full max-w-[420px] rounded-[2.5rem] p-8 glass-card border border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl ${isCenter ? 'cursor-grab active:cursor-grabbing hover-glow-cyan' : 'pointer-events-none'}`}
                          drag={isCenter ? "x" : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.2}
                          onDragEnd={isCenter ? handleDragEnd : undefined}
                          onHoverStart={() => isCenter && setIsHovered(true)}
                          onHoverEnd={() => isCenter && setIsHovered(false)}
                          whileHover={isCenter ? { y: -10, boxShadow: "0 0 40px rgba(0,243,255,0.15)" } : {}}
                        >
                            {/* Hover Neon Border & Glow Effect */}
                            {isCenter && (
                              <motion.div 
                                className="absolute inset-0 rounded-[2.5rem] border border-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                animate={{ opacity: isHovered ? 1 : 0 }}
                              />
                            )}

                            {/* Small particles inside card on hover */}
                            {isCenter && isHovered && (
                                <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
                                    {[...Array(5)].map((_, i) => (
                                      <motion.div
                                        key={i}
                                        className="absolute w-1.5 h-1.5 rounded-full bg-neon-pink"
                                        initial={{ x: Math.random() * 400, y: Math.random() * 300 + 100, opacity: 1 }}
                                        animate={{ y: "-100%", opacity: 0 }}
                                        transition={{ duration: 1 + Math.random() * 2, repeat: Infinity }}
                                      />
                                    ))}
                                </div>
                            )}

                            {/* Result Tag */}
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <motion.div 
                                  className={`px-3 py-1.5 rounded-full border text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300 ${isCenter && isHovered ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-white/10 bg-white/5 text-gray-400'}`}
                                  animate={isCenter && isHovered ? { scale: 1.05 } : { scale: 1 }}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isCenter && isHovered ? 'bg-neon-cyan shadow-[0_0_8px_#00f3ff]' : 'bg-gray-500'}`}></span>
                                  {t.tag}
                                </motion.div>
                                <motion.div
                                  animate={isCenter && isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                                >
                                  <Quote className={`w-8 h-8 transition-colors duration-300 ${isCenter && isHovered ? 'text-neon-cyan' : 'text-white/10'}`} fill="currentColor" />
                                </motion.div>
                            </div>

                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 relative z-10 font-sans font-medium">
                              "{t.quote}"
                            </p>

                            <div className="flex items-center gap-4 relative z-10 mt-auto">
                                <div className="relative shrink-0">
                                  <motion.img 
                                    src={t.avatar} 
                                    alt={t.author} 
                                    className="w-14 h-14 rounded-full border-2 border-white/10 object-cover"
                                    animate={isCenter && isHovered ? { borderColor: '#00f3ff' } : {}}
                                  />
                                  <motion.div 
                                    className="absolute -inset-1 rounded-full bg-neon-cyan/20 blur pointer-events-none"
                                    animate={{ opacity: isCenter && isHovered ? 1 : 0 }}
                                  />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-white font-bold font-display truncate">{t.author}</h4>
                                    <p className="text-gray-500 text-sm mt-0.5 truncate">
                                      <span className="text-neon-pink font-medium">{t.role}</span>, {t.company}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                     );
                   })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:px-8 z-40 pointer-events-none">
                <button 
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full glass border border-white/10 text-white flex items-center justify-center pointer-events-auto hover:bg-neon-cyan hover:text-black hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all bg-[#0a0a0f]"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full glass border border-white/10 text-white flex items-center justify-center pointer-events-auto hover:bg-neon-cyan hover:text-black hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all bg-[#0a0a0f]"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
        
        {/* Dot Indicators */}
        <div className="flex justify-center gap-3 mt-12 relative z-20">
            {testimonialsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`transition-all duration-300 rounded-full ${activeIndex === idx ? 'w-8 h-2.5 bg-neon-cyan shadow-[0_0_10px_#00f3ff]' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'}`}
                />
            ))}
        </div>
      </div>
    </section>
  );
}
