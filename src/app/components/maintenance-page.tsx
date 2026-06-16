import { motion } from "motion/react";

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
        className="text-center max-w-lg"
      >
        <p className="text-white/20 tracking-[0.5em] mb-8" style={{ fontSize: "10px", fontWeight: 400 }}>
          ARPLANET
        </p>

        <div className="w-12 h-[1px] bg-white/15 mx-auto mb-10" />

        <h1
          className="text-white mb-6 tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)", fontWeight: 600, lineHeight: 1.2 }}
        >
          현재 홈페이지
          <br />
          <span className="text-white/30">리뉴얼 중입니다.</span>
        </h1>

        <p className="text-white/25 leading-relaxed" style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.8 }}>
          더 나은 서비스로 곧 찾아뵙겠습니다.
          <br />
          불편을 드려 죄송합니다.
        </p>

        <div className="w-12 h-[1px] bg-white/10 mx-auto mt-10" />

        <p className="text-white/15 mt-6" style={{ fontSize: "11px", fontWeight: 300 }}>
          문의: arplanet@naver.com
        </p>
      </motion.div>
    </div>
  );
}
