import { Instagram } from "lucide-react";
import { Link } from "react-router";
import { useData } from "./data-store";

export function Footer() {
  const { siteLogo } = useData();
  const logoSrc = siteLogo || "/logo.png";
  return (
    <footer className="bg-black border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        {/* Top: Logo + Columns */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:w-1/3">
            {logoSrc ? (
              <img src={logoSrc} alt="ARPLANET" className="h-16 md:h-20 w-auto mb-3" />
            ) : (
              <span className="text-white tracking-[0.25em] block mb-3" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "0.3em" }}>
                ARPLANET
              </span>
            )}
            <p className="text-white/20 tracking-[0.05em]" style={{ fontSize: "11px", fontWeight: 300 }}>
              classical music
            </p>
            <p className="text-white/25 mt-3" style={{ fontSize: "12px", lineHeight: 1.8, fontWeight: 300 }}>
              청년 예술인들과 함께 클래식 음악의<br className="hidden md:block" /> 새로운 가능성을 열어갑니다.
            </p>
          </div>

          {/* Columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <p className="text-white/40 tracking-[0.2em] mb-4" style={{ fontSize: "9px", fontWeight: 500 }}>
                BUSINESS
              </p>
              <ul className="space-y-2">
                {["공연 기획", "아티스트 육성", "브랜딩 지원", "ARTFLOH"].map((l) => (
                  <li key={l}>
                    <a href="#services" className="text-white/20 hover:text-white/50 transition-colors duration-500" style={{ fontSize: "12px", fontWeight: 300 }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-white/40 tracking-[0.2em] mb-4" style={{ fontSize: "9px", fontWeight: 500 }}>
                LINKS
              </p>
              <ul className="space-y-2">
                {[
                  { label: "홈페이지", href: "https://arplanet.co.kr/" },
                  { label: "인스타그램", href: "https://www.instagram.com/arplanet_/" },
                  { label: "블로그", href: "https://blog.naver.com/arplanet_" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50 transition-colors duration-500" style={{ fontSize: "12px", fontWeight: 300 }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-white/40 tracking-[0.2em] mb-4" style={{ fontSize: "9px", fontWeight: 500 }}>
                CONTACT
              </p>
              <div className="space-y-1.5 text-white/20" style={{ fontSize: "12px", fontWeight: 300 }}>
                <p>대표이사: 최혜지</p>
                <p>광주광역시 북구 대자로 146 3F</p>
              </div>
              <a
                href="https://www.instagram.com/arplanet_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-8 h-8 border border-white/[0.06] items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all duration-500 mt-4"
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/15" style={{ fontSize: "10px", fontWeight: 300 }}>
            &copy; 2024-2026 ARPLANET. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <Link to="/terms" className="text-white/15 hover:text-white/40 transition-colors duration-500" style={{ fontSize: "10px", fontWeight: 300 }}>
              이용약관
            </Link>
            <Link to="/privacy" className="text-white/15 hover:text-white/40 transition-colors duration-500" style={{ fontSize: "10px", fontWeight: 300 }}>
              개인정보처리방침
            </Link>
            <Link
              to="/login"
              className="text-white/[0.08] hover:text-white/25 transition-colors duration-500"
              style={{ fontSize: "10px", fontWeight: 300 }}
            >
              관리자
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
