import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useData } from "./data-store";

export function NewsSection() {
  const { ref, inView } = useInView(0.05);
  const { posts } = useData();

  const publishedPosts = posts.filter((p) => p.status === "published");

  const handleClick = (link?: string) => {
    if (link && link.trim()) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="news" className="bg-black py-20 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
              className="text-white/50 tracking-[0.4em] mb-4"
              style={{ fontSize: "12px" }}
            >
              LATEST NEWS
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
                className="text-white tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.8rem, 5vw, 4rem)", fontWeight: 600, lineHeight: 1.1 }}
              >
                News
              </motion.h2>
            </div>
          </div>
        </div>

        {publishedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <p className="text-white/20" style={{ fontSize: "14px" }}>아직 게시된 소식이 없습니다.</p>
          </motion.div>
        ) : (
          <div>
            {publishedPosts.map((news, i) => {
              const hasLink = news.link && news.link.trim();
              return (
                <motion.article
                  key={news.id}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                  className={`border-t border-white/[0.06] group ${hasLink ? "cursor-pointer" : ""}`}
                  onClick={() => handleClick(news.link)}
                >
                  <div className="py-5 md:py-7 flex flex-col md:flex-row md:items-center gap-2 md:gap-0 transition-all duration-500 hover:px-4">
                    <div className="flex items-center gap-4 md:w-64 shrink-0">
                      <span className="text-white/20 tabular-nums" style={{ fontSize: "13px" }}>
                        {news.date}
                      </span>
                      <span className="text-white/30 tracking-[0.15em]" style={{ fontSize: "10px", fontWeight: 500 }}>
                        {news.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className="text-white/80 group-hover:text-white transition-colors duration-500"
                          style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.3rem)", fontWeight: 400 }}
                        >
                          {news.title}
                        </h3>
                        {hasLink && <ExternalLink size={12} className="text-white/20 shrink-0" />}
                      </div>
                      <p
                        className="text-white/25 mt-2 hidden md:block max-w-2xl group-hover:text-white/40 transition-colors duration-500"
                        style={{ fontSize: "14px", lineHeight: 1.7, fontWeight: 300 }}
                      >
                        {news.content}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-white/0 group-hover:text-white/40 transition-all duration-500 shrink-0 hidden md:block group-hover:translate-x-1"
                    />
                  </div>
                </motion.article>
              );
            })}
            <div className="border-t border-white/[0.06]" />
          </div>
        )}
      </div>
    </section>
  );
}