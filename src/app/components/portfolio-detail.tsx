import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useData } from "./data-store";

export function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { portfolio } = useData();

  const project = portfolio.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 mb-6" style={{ fontSize: "14px" }}>프로젝트를 찾을 수 없습니다.</p>
          <Link to="/" className="text-white/50 hover:text-white transition-colors" style={{ fontSize: "13px" }}>
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const hasBlog = project.blogContent && project.blogContent.length > 0;

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0, 1] }}
          className="absolute inset-0"
        >
          <ImageWithFallback src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-6xl mx-auto w-full px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 cursor-pointer"
              style={{ fontSize: "12px" }}
            >
              <ArrowLeft size={14} /> 뒤로 가기
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center gap-4 mb-4"
            >
              <span className="flex items-center gap-1.5 text-white/40" style={{ fontSize: "11px" }}>
                <Tag size={12} /> {project.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/40" style={{ fontSize: "11px" }}>
                <Calendar size={12} /> {project.year}
              </span>
              <span className="flex items-center gap-1.5 text-white/40" style={{ fontSize: "11px" }}>
                <MapPin size={12} /> {project.client}
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
                className="text-white tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", fontWeight: 600, lineHeight: 1.15 }}
              >
                {project.title}
              </motion.h1>
            </div>

            {project.desc && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-white/40 mt-4 max-w-2xl"
                style={{ fontSize: "14px", lineHeight: 1.8, fontWeight: 300 }}
              >
                {project.desc}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
        {hasBlog ? (
          <div className="space-y-10">
            {project.blogContent!.map((block, i) => {
              if (block.type === "text") {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  >
                    {block.value.split("\n\n").map((paragraph, pi) => (
                      <p
                        key={pi}
                        className="text-white/60 mb-6 last:mb-0"
                        style={{ fontSize: "15px", lineHeight: 2, fontWeight: 300 }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                );
              }
              if (block.type === "image") {
                return (
                  <motion.figure
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    className="my-12"
                  >
                    <div className="overflow-hidden">
                      <ImageWithFallback src={block.url} alt={block.caption || ""} className="w-full object-cover" />
                    </div>
                    {block.caption && (
                      <figcaption className="text-white/25 mt-3 text-center" style={{ fontSize: "12px" }}>
                        {block.caption}
                      </figcaption>
                    )}
                  </motion.figure>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center py-16"
          >
            <p className="text-white/15" style={{ fontSize: "14px" }}>아직 상세 내용이 작성되지 않았습니다.</p>
            <p className="text-white/10 mt-2" style={{ fontSize: "12px" }}>관리자 페이지에서 블로그 형태의 상세 글을 작성할 수 있습니다.</p>
          </motion.div>
        )}

        {/* Divider */}
        <div className="border-t border-white/[0.06] mt-16 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/25 tracking-[0.15em] mb-1" style={{ fontSize: "9px", fontWeight: 500 }}>PROJECT INFO</p>
              <p className="text-white/50" style={{ fontSize: "13px" }}>{project.category} · {project.year} · {project.client}</p>
            </div>
            <Link
              to="/portfolio"
              className="px-6 py-2.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all"
              style={{ fontSize: "12px" }}
            >
              모든 프로젝트 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}