import { useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useData } from "./data-store";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function ContactSection() {
  const { ref, inView } = useInView(0.1);
  const { setInquiries } = useData();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.company || !form.message) {
      toast.error("필수 항목을 입력해주세요.");
      return;
    }
    setSending(true);
    const inquiry = {
      id: Date.now().toString(),
      ...form,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      read: false,
    };

    // 서버에 문의 저장
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f286b462/inquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(inquiry),
        }
      );
      if (!res.ok) {
        console.error("Failed to save inquiry to server:", await res.text());
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
    }

    // 로컬 상태에도 반영 (관리자가 같은 세션에서 확인할 수 있도록)
    setInquiries((prev) => [inquiry, ...prev]);
    toast.success("문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
    setForm({ name: "", email: "", phone: "", company: "", message: "" });
    setSending(false);
  };

  const inputClass = (field: string) =>
    `w-full bg-transparent border-b ${
      focused === field ? "border-white" : "border-white/10"
    } py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors duration-500`;

  return (
    <section id="contact" className="bg-black py-16 md:py-28" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="text-white/30 tracking-[0.4em] mb-6"
            style={{ fontSize: "11px" }}
          >
            GET IN TOUCH
          </motion.p>

          <div className="overflow-hidden mb-8">
            <motion.h2
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
              className="text-white tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.8rem, 5vw, 4rem)", fontWeight: 600, lineHeight: 1.1 }}
            >
              공연 문의 및
              <br />
              협업 제안
            </motion.h2>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="grid md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-8">
              <div>
                <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px" }}>NAME *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="이름을 입력해주세요"
                  className={inputClass("name")}
                  style={{ fontSize: "15px", fontWeight: 300 }}
                />
              </div>
              <div>
                <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px" }}>EMAIL *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="이메일 주소를 입력해주세요"
                  className={inputClass("email")}
                  style={{ fontSize: "15px", fontWeight: 300 }}
                />
              </div>
              <div>
                <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px" }}>PHONE *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  placeholder="연락처를 입력해주세요"
                  className={inputClass("phone")}
                  style={{ fontSize: "15px", fontWeight: 300 }}
                />
              </div>
              <div>
                <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px" }}>COMPANY / ORGANIZATION *</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  onFocus={() => setFocused("company")}
                  onBlur={() => setFocused(null)}
                  placeholder="소속 기관 또는 단체명"
                  className={inputClass("company")}
                  style={{ fontSize: "15px", fontWeight: 300 }}
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px" }}>MESSAGE *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                rows={3}
                placeholder="공연 기획, 협업, 후원 등 문의 내용을 자유롭게 작성해주세요"
                className={`${inputClass("message")} resize-none`}
                style={{ fontSize: "15px", fontWeight: 300 }}
              />
            </div>

            <div className="mt-10 flex justify-end">
              <button type="submit" disabled={sending} className="group flex items-center gap-3 cursor-pointer disabled:opacity-50">
                <span className="text-white tracking-[0.15em] group-hover:opacity-60 transition-opacity duration-500" style={{ fontSize: "13px", fontWeight: 400 }}>
                  {sending ? "SENDING..." : "SEND MESSAGE"}
                </span>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                  <ArrowRight size={16} className="text-white group-hover:text-black transition-colors duration-500" />
                </div>
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}