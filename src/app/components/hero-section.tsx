import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useData } from "./data-store";

export function HeroSection() {
  const { heroSlides } = useData();
  const activeSlides = heroSlides
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  // Reset current if out of bounds
  useEffect(() => {
    if (current >= activeSlides.length) setCurrent(0);
  }, [activeSlides.length, current]);

  if (activeSlides.length === 0) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <p className="text-white/30" style={{ fontSize: "14px" }}>히어로 슬라이드가 없습니다. 관리자 페이지에서 추가해주세요.</p>
      </section>
    );
  }

  const slide = activeSlides[current];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0, 1] }}
          className="absolute inset-0"
        >
          <ImageWithFallback src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20">
          <AnimatePresence mode="wait">
            <motion.div key={slide.id}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-white/60 mb-6 tracking-[0.3em]"
                style={{ fontSize: "14px", fontWeight: 400 }}
              >
                {slide.subtitle}
              </motion.p>
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
                  className="text-white tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3rem, 10vw, 9rem)", fontWeight: 700, lineHeight: 0.95 }}
                >
                  {slide.titleLine1}
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
                  className="text-white/40 tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3rem, 10vw, 9rem)", fontWeight: 700, lineHeight: 0.95 }}
                >
                  {slide.titleLine2}
                </motion.h1>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-12 right-6 md:right-20 flex items-center gap-4">
          <span className="text-white/50 tabular-nums" style={{ fontSize: "13px" }}>
            {String(current + 1).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            {activeSlides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className="cursor-pointer group">
                <div className={`h-[2px] transition-all duration-700 ${
                  i === current ? "w-12 bg-white" : "w-6 bg-white/20 group-hover:bg-white/40"
                }`} />
              </button>
            ))}
          </div>
          <span className="text-white/50 tabular-nums" style={{ fontSize: "13px" }}>
            {String(activeSlides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <motion.div
        className="absolute bottom-12 left-6 md:left-20 flex flex-col items-center gap-2"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/50" />
        <span className="text-white/30 tracking-[0.2em]" style={{ fontSize: "10px" }}>SCROLL</span>
      </motion.div>
    </section>
  );
}