import { useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useData } from "./data-store";

export function ServicesSection() {
  const { ref, inView } = useInView(0.05);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { services } = useData();

  const handleClick = (link?: string) => {
    if (link && link.trim()) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="services" className="bg-black py-20 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-white/50 tracking-[0.4em] mb-6"
          style={{ fontSize: "12px" }}
        >
          BUSINESS AREA
        </motion.p>
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
            className="text-white tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 600, lineHeight: 1.2 }}
          >
            아티스트의 연주를
            <br />
            극대화할 수 있는
            <br />
            서포터 인프라 구축
          </motion.h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {services.map((service, i) => {
          const hasLink = service.link && service.link.trim();
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleClick(service.link)}
              className={`border-t border-white/10 last:border-b group ${hasLink ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="px-6 md:px-12 lg:px-20 py-6 md:py-9 flex items-center justify-between transition-all duration-500 hover:bg-white/[0.03]">
                <div className="flex items-center gap-4 md:gap-12 flex-1 min-w-0">
                  <span className="text-white/20 tabular-nums hidden md:block" style={{ fontSize: "14px", fontWeight: 400 }}>
                    {service.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                      <h3
                        className="text-white tracking-[-0.01em] transition-colors duration-500"
                        style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.8rem)", fontWeight: 400 }}
                      >
                        {service.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 tracking-[0.1em] shrink-0 ${
                          service.status === "운영중"
                            ? "bg-white/5 text-white/30"
                            : "bg-white/[0.03] text-white/15"
                        }`}
                        style={{ fontSize: "10px", fontWeight: 500 }}
                      >
                        {service.status}
                      </span>
                      {hasLink && <ExternalLink size={12} className="text-white/15" />}
                    </div>
                  </div>
                  <div className="hidden lg:block flex-1 max-w-md">
                    <p
                      className={`text-white/40 transition-opacity duration-500 ${
                        hoveredIdx === i ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ fontSize: "14px", lineHeight: 1.8 }}
                    >
                      {service.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className={`text-white/20 shrink-0 transition-all duration-500 ${
                    hoveredIdx === i ? "text-white translate-x-1" : ""
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}