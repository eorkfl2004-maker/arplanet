import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useData } from "./data-store";

export function LoginPage() {
  const navigate = useNavigate();
  const { setIsLoggedIn, adminPassword, adminAccounts, siteLogo } = useData();
  const logoSrc = siteLogo || "/logo.png";
  const [id, setId] = useState<string>(() => {
    try { return localStorage.getItem("arplanet_saved_id") || ""; } catch { return ""; }
  });
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [shake, setShake] = useState(false);
  const [rememberId, setRememberId] = useState<boolean>(() => {
    try { return !!localStorage.getItem("arplanet_saved_id"); } catch { return false; }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 기존 레거시 로그인 (a1004 / adminPassword) 또는 관리자 계정 배열에서 확인
    const legacyMatch = id === "a1004" && pw === adminPassword;
    const accountMatch = adminAccounts?.some(acc => acc.username === id && acc.password === pw);

    if (legacyMatch || accountMatch) {
      if (rememberId) {
        try { localStorage.setItem("arplanet_saved_id", id); } catch { /* */ }
      } else {
        try { localStorage.removeItem("arplanet_saved_id"); } catch { /* */ }
      }
      setIsLoggedIn(true);
      toast.success("로그인되었습니다.");
      navigate("/admin");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast.error("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <img src={logoSrc} alt="ARPLANET" className="h-24 w-auto mx-auto" />
          <p className="text-white/20 mt-3 tracking-[0.15em]" style={{ fontSize: "11px" }}>
            ADMIN LOGIN
          </p>
        </div>

        <motion.form
          onSubmit={handleLogin}
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <div>
              <label className="text-white/30 tracking-[0.2em] block mb-3" style={{ fontSize: "10px", fontWeight: 500 }}>
                ID
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 focus:border-white/50 py-3 text-white placeholder:text-white/15 focus:outline-none transition-colors duration-500"
                placeholder="아이디를 입력하세요"
                style={{ fontSize: "15px", fontWeight: 300 }}
                autoFocus
              />
            </div>

            <div>
              <label className="text-white/30 tracking-[0.2em] block mb-3" style={{ fontSize: "10px", fontWeight: 500 }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-white/50 py-3 text-white placeholder:text-white/15 focus:outline-none transition-colors duration-500 pr-10"
                  placeholder="비밀번호를 입력하세요"
                  style={{ fontSize: "15px", fontWeight: 300 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors cursor-pointer"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember ID */}
          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRememberId(!rememberId)}
              className={`w-4 h-4 border flex items-center justify-center transition-all cursor-pointer ${rememberId ? "bg-white border-white" : "border-white/20 hover:border-white/40"}`}
            >
              {rememberId && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4.5 7.5L8 2.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className="text-white/30 cursor-pointer select-none" style={{ fontSize: "12px", fontWeight: 300 }} onClick={() => setRememberId(!rememberId)}>
              아이디 기억하기
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-4 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer tracking-[0.15em] flex items-center justify-center gap-2"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            <ArrowRight size={14} />
            로그인
          </button>
        </motion.form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-white/20 hover:text-white/50 transition-colors cursor-pointer tracking-[0.1em]"
            style={{ fontSize: "12px" }}
          >
            홈으로 돌아가기
          </button>
        </div>
      </motion.div>
    </div>
  );
}