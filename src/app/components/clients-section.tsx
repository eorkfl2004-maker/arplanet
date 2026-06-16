import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";

const partners = [
  "ACC 예술극장", "광주예술의전당", "광주문화재단", "북구청",
  "푸른지오아트홀", "디벨롭스토리즈", "바이오닷플랫폼",
  "국립아시아문화전당", "전남대학교", "순천대학교",
];

export function ClientsSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section className="bg-black py-24 md:py-32 border-t border-white/[0.04]" ref={ref}>
      <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-white/30 tracking-[0.4em] mb-16 text-center"
          style={{ fontSize: "11px" }}
        >
          PARTNERS & VENUES
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-0"
        >
          {partners.map((client, i) => (
            <motion.div
              key={client}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
              className="border border-white/[0.04] py-8 md:py-10 flex items-center justify-center group cursor-default hover:bg-white/[0.02] transition-colors duration-500"
            >
              <span
                className="text-white/15 group-hover:text-white/40 transition-colors duration-500 tracking-[0.05em] text-center"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                {client}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}