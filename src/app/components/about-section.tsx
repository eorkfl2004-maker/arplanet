import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useData } from "./data-store";
import { CurrentProjectsSection } from "./current-projects-section";

function renderMainText(text: string) {
  // Split by lines, render **bold** segments
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={li}>
        {li > 0 && <br className="hidden md:block" />}
        {parts.map((part, pi) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <span key={pi} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</span>;
          }
          return <span key={pi}>{part}</span>;
        })}
      </span>
    );
  });
}

export function AboutSection() {
  const { ref, inView } = useInView(0.15);
  const { ref: ref2, inView: inView2 } = useInView(0.15);
  const { ref: ref3, inView: inView3 } = useInView(0.1);
  const { ref: refArtists, inView: inViewArtists } = useInView(0.1);
  const { companyInfo, aboutData, artists } = useData();

  const sortedArtists = [...artists].filter(a => a.visible !== false).sort((a, b) => a.order - b.order);

  return (
    <section id="about" className="bg-black">
      {/* Main Statement */}
      <div ref={ref} className="flex items-center py-12 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="text-white/50 tracking-[0.4em] mb-4 md:mb-8"
            style={{ fontSize: "12px", fontWeight: 400 }}
          >
            ABOUT ARPLANET
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
              className="text-white/90 leading-[1.4] mb-4 md:mb-8"
              style={{ fontSize: "clamp(1.3rem, 3.5vw, 2.6rem)", fontWeight: 300 }}
            >
              {renderMainText(aboutData.mainText)}
            </motion.h2>
          </div>

          {/* Three Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-4 md:gap-12 mt-8 md:mt-14"
          >
            {aboutData.pillars.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }}
                className="border-t border-white/10 pt-6"
              >
                <span className="text-white/20 tracking-[0.1em]" style={{ fontSize: "12px" }}>{item.num}</span>
                <h3 className="text-white/90 mt-4 mb-3" style={{ fontSize: "16px", fontWeight: 500, lineHeight: 1.5 }}>
                  {item.title}
                </h3>
                <p className="text-white/40" style={{ fontSize: "13px", lineHeight: 1.8, fontWeight: 300 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Numbers */}
      <div ref={ref2} className="py-10 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* subtle inner divider */}
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView2 ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="text-white/50 tracking-[0.4em] mb-6 md:mb-10 text-center"
            style={{ fontSize: "12px" }}
          >
            {aboutData.achievementsTitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {aboutData.achievements.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-white/90 tracking-tight" style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)", fontWeight: 200 }}>
                  {stat.num}
                </div>
                <div className="text-white/50 mt-2 tracking-[0.05em]" style={{ fontSize: "13px", fontWeight: 500 }}>
                  {stat.label}
                </div>
                {stat.sub && (
                  <div className="text-white/20 mt-1" style={{ fontSize: "11px" }}>
                    {stat.sub}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Artists */}
      {sortedArtists.length > 0 && (
        <div ref={refArtists} className="py-12 md:py-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            {/* subtle inner divider */}
            <div className="flex items-center gap-4 mb-8 md:mb-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inViewArtists ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
              className="text-white/50 tracking-[0.4em] mb-6 md:mb-10 text-center"
              style={{ fontSize: "12px" }}
            >
              OUR ARTISTS
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inViewArtists ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10"
            >
              {sortedArtists.map((artist, i) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inViewArtists ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  className="group cursor-default"
                >
                  <div className="aspect-[5/6] overflow-hidden mb-3 md:mb-6 relative">
                    <ImageWithFallback
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-[1s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                  <div>
                    <h3 className="text-white/90 mb-1 md:mb-1.5" style={{ fontSize: "16px", fontWeight: 500 }}>
                      {artist.name}
                    </h3>
                    <p className="text-white/50 mb-1 md:mb-2" style={{ fontSize: "13px", fontWeight: 400, letterSpacing: "0.05em" }}>
                      {artist.role}
                    </p>
                    <p className="text-white/25 tracking-[0.15em]" style={{ fontSize: "10px" }}>
                      {artist.instrument}
                    </p>
                    {artist.bio && (
                      <p className="text-white/30 mt-3 hidden md:block" style={{ fontSize: "13px", lineHeight: 1.7, fontWeight: 300 }}>
                        {artist.bio}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Current Projects */}
      <CurrentProjectsSection />

      {/* Company Info */}
      <div ref={ref3} className="py-10 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* subtle inner divider */}
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="text-white/50 tracking-[0.4em] mb-5 md:mb-8" style={{ fontSize: "12px" }}>COMPANY INFO</p>
              <div className="space-y-2 md:space-y-4">
                {[
                  { label: "단체명", value: companyInfo.name },
                  { label: "설립 연월", value: companyInfo.foundedDate },
                  { label: "대표이사", value: companyInfo.ceo },
                  { label: "사무실 위치", value: companyInfo.address },
                ].map((info) => (
                  <div key={info.label} className="flex border-b border-white/[0.06] pb-3 md:pb-4">
                    <span className="text-white/30 w-24 shrink-0" style={{ fontSize: "12px" }}>{info.label}</span>
                    <span className="text-white/70" style={{ fontSize: "13px", fontWeight: 300 }}>{info.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 md:mt-5">
                <p className="text-white/30 mb-3" style={{ fontSize: "12px" }}>사업영역</p>
                <ul className="space-y-1.5 text-white/50" style={{ fontSize: "13px", fontWeight: 300 }}>
                  {companyInfo.businessAreas.map((area, i) => (
                    <li key={i}>· {area}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[200px] md:h-auto overflow-hidden"
            >
              <ImageWithFallback
                src={companyInfo.image}
                alt="Concert Hall"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white/50" style={{ fontSize: "14px", fontWeight: 300 }}>
                  {companyInfo.imageCaption}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}