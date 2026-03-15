import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useData } from "./data-store";
import { Footer } from "./footer";

const categories = ["ALL", "정기공연", "독주회", "조인트리사이틀", "초청연주", "협업공연", "전시", "티켓"];

export function PortfolioList() {
  const [active, setActive] = useState("ALL");
  const { portfolio } = useData();

  const visiblePortfolio = portfolio.filter((p) => p.visible !== false);
  const filtered = active === "ALL" ? visiblePortfolio : visiblePortfolio.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Header */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-10"
          style={{ fontSize: "12px" }}
        >
          <ArrowLeft size={14} /> 홈으로
        </Link>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-white/30 tracking-[0.4em] mb-4"
          style={{ fontSize: "11px" }}
        >
          ALL PROJECTS & CONCERTS
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
            className="text-white tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 600, lineHeight: 1.1 }}
          >
            Projects
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/30 mt-4 max-w-xl"
          style={{ fontSize: "14px", lineHeight: 1.8, fontWeight: 300 }}
        >
          아르플래닛이 기획하고 참여한 모든 공연과 프로젝트를 한눈에 확인하세요.
        </motion.p>
      </div>

      {/* Filter */}
      <div className="border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-1 py-4"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 transition-all duration-400 cursor-pointer tracking-[0.05em] ${
                  active === cat
                    ? "bg-white text-black"
                    : "text-white/30 hover:text-white/60"
                }`}
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Count */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-6">
        <p className="text-white/20" style={{ fontSize: "12px" }}>
          총 <span className="text-white/50">{filtered.length}</span>개 프로젝트
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
              >
                <Link
                  to={`/portfolio/${project.id}`}
                  className="group cursor-pointer relative overflow-hidden block"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#111]">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 md:bg-black/0 md:group-hover:bg-black/50 transition-all duration-700" />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-6">
                    <div className="flex justify-between items-start">
                      <span
                        className="text-white/50 md:text-white/0 md:group-hover:text-white/50 transition-all duration-500 tracking-[0.1em]"
                        style={{ fontSize: "9px" }}
                      >
                        {project.client}
                      </span>
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-white/20 md:border-white/0 md:group-hover:border-white/30 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500">
                        <ArrowUpRight size={12} className="text-white" />
                      </div>
                    </div>
                    <div className="md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700">
                      <p
                        className="text-white/40 md:text-white/0 md:group-hover:text-white/40 transition-all duration-500 tracking-[0.1em] mb-1"
                        style={{ fontSize: "9px" }}
                      >
                        {project.category} — {project.year}
                      </p>
                      <h3
                        className="text-white md:text-white/0 md:group-hover:text-white transition-all duration-500"
                        style={{ fontSize: "clamp(0.75rem, 1.5vw, 1.2rem)", fontWeight: 500 }}
                      >
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </Link>

                {/* Below card info (always visible) */}
                <div className="pt-3 pb-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white/20 tracking-[0.1em]" style={{ fontSize: "9px" }}>
                      {project.category}
                    </span>
                    <span className="text-white/15" style={{ fontSize: "9px" }}>
                      {project.year}
                    </span>
                    {project.blogContent && project.blogContent.length > 0 && (
                      <span
                        className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400/60"
                        style={{ fontSize: "8px" }}
                      >
                        BLOG
                      </span>
                    )}
                  </div>
                  <h4 className="text-white/70 truncate" style={{ fontSize: "13px", fontWeight: 500 }}>
                    {project.title}
                  </h4>
                  <p className="text-white/25 mt-0.5 truncate" style={{ fontSize: "11px", fontWeight: 300 }}>
                    {project.client}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-white/20" style={{ fontSize: "14px" }}>
              해당 카테고리의 프로젝트가 없습니다.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}