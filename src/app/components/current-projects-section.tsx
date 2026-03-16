import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { ExternalLink, Ticket, Calendar, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useData } from "./data-store";

/** Unsplash URL이면 고해상도 파라미터를 붙여 반환 */
function toHighRes(src: string) {
  if (src.includes("unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", "1200");
    url.searchParams.set("q", "90");
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }
  return src;
}

export function CurrentProjectsSection() {
  const { ref, inView } = useInView(0.1);
  const { currentProjects } = useData();

  const activeProjects = [...currentProjects]
    .filter((p) => p.active)
    .sort((a, b) => a.order - b.order);

  if (activeProjects.length === 0) return null;

  return (
    <div ref={ref} id="ticket" className="py-8 md:py-20 px-4 md:px-12 lg:px-16 border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-white/45 tracking-[0.3em] md:tracking-[0.4em] mb-3 md:mb-8 text-center"
          style={{ fontSize: "11px" }}
        >
          TICKET
        </motion.p>

        <div className="overflow-hidden mb-6 md:mb-12 text-center">
          <motion.h2
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
            className="text-white tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.3rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.2 }}
          >
            진행 중인 공연 바로 예매하기
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className={`grid gap-4 md:gap-6 ${
            activeProjects.length === 1
              ? "max-w-[264px] mx-auto"
              : activeProjects.length === 2
              ? "grid-cols-2 max-w-[460px] md:max-w-[614px] mx-auto"
              : "grid-cols-2 md:grid-cols-3 max-w-[614px] md:max-w-[806px] mx-auto"
          }`}
        >
          {activeProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              className="group"
            >
              <a
                href={project.reservationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block cursor-pointer"
              >
                <div className="aspect-[2/3] overflow-hidden relative mb-2 md:mb-3 bg-black/40">
                  <ImageWithFallback
                    src={toHighRes(project.image)}
                    alt={project.title}
                    className="w-full h-full object-contain group-hover:scale-[1.03] transition-all duration-700"
                    style={{ imageRendering: "auto" } as React.CSSProperties}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                  {/* Ticket overlay */}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-2.5 md:py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Ticket size={10} className="text-white md:hidden" />
                    <Ticket size={12} className="text-white hidden md:block" />
                    <span className="text-white tracking-[0.1em] hidden md:inline" style={{ fontSize: "10px", fontWeight: 500 }}>
                      예매하기
                    </span>
                    <ExternalLink size={8} className="text-white/60 md:hidden" />
                    <ExternalLink size={10} className="text-white/60 hidden md:block" />
                  </div>
                </div>
              </a>
              <div>
                <h3
                  className="text-white mb-0.5 md:mb-1 group-hover:text-white/80 transition-colors truncate"
                  style={{ fontSize: "clamp(0.75rem, 1.8vw, 0.95rem)", fontWeight: 500 }}
                >
                  {project.title}
                </h3>
                {/* Performance date/day/time info */}
                {(project.performanceDate || project.performanceDay || project.performanceTime) && (
                  <div className="flex flex-col gap-0.5 mb-1 md:mb-1.5">
                    {(project.performanceDate || project.performanceDay) && (
                      <div className="flex items-center gap-1">
                        <Calendar size={9} className="text-white/25 shrink-0 md:hidden" />
                        <Calendar size={10} className="text-white/25 shrink-0 hidden md:block" />
                        <span className="text-white/50" style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.75rem)", fontWeight: 400 }}>
                          {project.performanceDate}{project.performanceDay ? ` (${project.performanceDay})` : ""}
                        </span>
                      </div>
                    )}
                    {project.performanceTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={9} className="text-white/25 shrink-0 md:hidden" />
                        <Clock size={10} className="text-white/25 shrink-0 hidden md:block" />
                        <span className="text-white/50" style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.75rem)", fontWeight: 400 }}>
                          {project.performanceTime}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {project.description && (
                  <p
                    className="text-white/30 line-clamp-2 mb-1.5 md:mb-2"
                    style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.7rem)", fontWeight: 300, lineHeight: 1.6 }}
                  >
                    {project.description}
                  </p>
                )}
                {/* 바로 예매하기 button */}
                <a
                  href={project.reservationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  <Ticket size={9} className="text-white/50 md:hidden" />
                  <Ticket size={11} className="text-white/50 hidden md:block" />
                  <span className="text-white/60 hover:text-white tracking-[0.05em]" style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.7rem)", fontWeight: 400 }}>
                    바로 예매하기
                  </span>
                  <ExternalLink size={7} className="text-white/30 md:hidden" />
                  <ExternalLink size={9} className="text-white/30 hidden md:block" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}