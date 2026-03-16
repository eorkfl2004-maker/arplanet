import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useData } from "./data-store";

const categories = ["ALL", "정기공연", "독주회", "조인트리사이틀", "초청연주", "협업공연", "전시", "티켓"];

export function PortfolioSection() {
  const { ref, inView } = useInView(0.05);
  const [active, setActive] = useState("ALL");
  const { portfolio } = useData();

  const visiblePortfolio = portfolio.filter((p) => p.visible !== false);
  const filtered = active === "ALL" ? visiblePortfolio : visiblePortfolio.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="bg-[#0a0a0a] py-20 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
              className="text-white/45 tracking-[0.4em] mb-4"
              style={{ fontSize: "12px" }}
            >
              PROJECTS & CONCERTS
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
                className="text-white tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.8rem, 5vw, 4rem)", fontWeight: 600, lineHeight: 1.1 }}
              >
                Projects
              </motion.h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-1"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-2.5 py-1 transition-all duration-400 cursor-pointer tracking-[0.05em] ${
                  active === cat
                    ? "bg-white text-black"
                    : "text-white/30 hover:text-white/60"
                }`}
                style={{ fontSize: "11px", fontWeight: 500 }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                {project.reservationLink ? (
                  <a
                    href={project.reservationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group cursor-pointer relative overflow-hidden block"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#111]">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-black/40 md:bg-black/0 md:group-hover:bg-black/50 transition-all duration-700" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-6">
                      <div className="flex justify-between items-start">
                        <span className="text-white/50 md:text-white/0 md:group-hover:text-white/50 transition-all duration-500 tracking-[0.1em]" style={{ fontSize: "10px" }}>
                          {project.client}
                        </span>
                        <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-white/20 md:border-white/0 md:group-hover:border-white/30 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500">
                          <ArrowUpRight size={12} className="text-white" />
                        </div>
                      </div>
                      <div className="md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700">
                        <p className="text-white/40 md:text-white/0 md:group-hover:text-white/40 transition-all duration-500 tracking-[0.1em] mb-1" style={{ fontSize: "10px" }}>
                          {project.category} — {project.year}
                        </p>
                        <h3
                          className="text-white md:text-white/0 md:group-hover:text-white transition-all duration-500"
                          style={{ fontSize: "clamp(0.8rem, 1.5vw, 1.2rem)", fontWeight: 500 }}
                        >
                          {project.title}
                        </h3>
                        {project.desc && (
                          <p className="text-white/35 md:text-white/0 md:group-hover:text-white/35 transition-all duration-500 mt-1 hidden md:block" style={{ fontSize: "13px", fontWeight: 300 }}>
                            {project.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                ) : (
                <Link
                  to={`/portfolio/${project.id}`}
                  className="group cursor-pointer relative overflow-hidden block"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#111]">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/40 md:bg-black/0 md:group-hover:bg-black/50 transition-all duration-700" />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-6">
                    <div className="flex justify-between items-start">
                      <span className="text-white/50 md:text-white/0 md:group-hover:text-white/50 transition-all duration-500 tracking-[0.1em]" style={{ fontSize: "10px" }}>
                        {project.client}
                      </span>
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-white/20 md:border-white/0 md:group-hover:border-white/30 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500">
                        <ArrowUpRight size={12} className="text-white" />
                      </div>
                    </div>
                    <div className="md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700">
                      <p className="text-white/40 md:text-white/0 md:group-hover:text-white/40 transition-all duration-500 tracking-[0.1em] mb-1" style={{ fontSize: "10px" }}>
                        {project.category} — {project.year}
                      </p>
                      <h3
                        className="text-white md:text-white/0 md:group-hover:text-white transition-all duration-500"
                        style={{ fontSize: "clamp(0.8rem, 1.5vw, 1.2rem)", fontWeight: 500 }}
                      >
                        {project.title}
                      </h3>
                      {project.desc && (
                        <p className="text-white/35 md:text-white/0 md:group-hover:text-white/35 transition-all duration-500 mt-1 hidden md:block" style={{ fontSize: "13px", fontWeight: 300 }}>
                          {project.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All Link */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center mt-10"
          >
            <Link
              to="/portfolio"
              className="px-10 py-3.5 border border-white/[0.1] text-white/40 hover:text-white hover:border-white/25 transition-all duration-500 tracking-[0.15em]"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              VIEW ALL PROJECTS
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}