import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";

export function SectionDivider() {
  const { ref, inView } = useInView(0.5);

  return (
    <div ref={ref} className="relative py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-4 md:gap-6">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
            className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent origin-left"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-1 h-1 rounded-full bg-white/15"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
            className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent origin-right"
          />
        </div>
      </div>
    </div>
  );
}
