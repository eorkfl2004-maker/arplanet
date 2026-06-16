import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { Award } from "lucide-react";
import { useData } from "./data-store";

export function AwardsSection() {
  const { ref, inView } = useInView(0.1);
  const { awards } = useData();

  const sortedAwards = [...awards].filter(a => a.visible !== false).sort((a, b) => a.order - b.order);

  if (sortedAwards.length === 0) return null;

  return (
    <section id="awards" className="bg-black py-16 md:py-24 border-t border-white/[0.04]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-white/30 tracking-[0.4em] mb-4"
          style={{ fontSize: "11px" }}
        >
          AWARDS & GRANTS
        </motion.p>
        <div className="overflow-hidden mb-10">
          <motion.h2
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
            className="text-white tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 5vw, 4rem)", fontWeight: 600, lineHeight: 1.1 }}
          >
            Awards
          </motion.h2>
        </div>

        <div>
          {sortedAwards.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
              className="border-t border-white/[0.06] last:border-b"
            >
              <div className="py-5 md:py-7 flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                <div className="flex items-center gap-4 md:w-40 shrink-0">
                  <Award size={14} className="text-white/15 hidden md:block" />
                  <span className="text-white/30 tabular-nums" style={{ fontSize: "13px", fontWeight: 400 }}>
                    {award.year}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-white/80"
                    style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)", fontWeight: 400 }}
                  >
                    {award.title}
                  </h3>
                  <p className="text-white/30 mt-1" style={{ fontSize: "12px", fontWeight: 300 }}>
                    {award.organizer}
                  </p>
                  {award.desc && (
                    <p
                      className="text-white/20 mt-2 hidden md:block max-w-2xl"
                      style={{ fontSize: "12px", lineHeight: 1.7, fontWeight: 300 }}
                    >
                      {award.desc}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
