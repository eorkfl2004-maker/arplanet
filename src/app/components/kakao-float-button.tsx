import { useData } from "./data-store";
import { useLocation } from "react-router";
import { useCallback } from "react";

const KAKAO_LOGO_PATH = "/kakao-logo.png";

export function KakaoFloatButton() {
  const { kakaoChannelUrl, kakaoLogo } = useData();
  const kakaoLogoSrc = kakaoLogo || "/kakao-logo.png";
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isLogin = location.pathname === "/login";

  /**
   * 모바일에서 target="_blank"로 카카오톡 링크를 열면
   * 카카오톡 앱이 URL을 가로채는 과정에서 "없는 링크" 오류가 발생할 수 있음.
   * 모바일: 현재 창에서 직접 이동 (window.location.href)
   * PC: 새 탭으로 열기 (window.open)
   */
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!kakaoChannelUrl) return;

    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // 모바일: 현재 창에서 직접 이동하여 카카오톡 앱이 정상적으로 처리하도록 함
      window.location.href = kakaoChannelUrl;
    } else {
      // PC: 새 탭에서 열기
      window.open(kakaoChannelUrl, "_blank", "noopener,noreferrer");
    }
  }, [kakaoChannelUrl]);

  if (isAdmin || isLogin || !kakaoChannelUrl) return null;

  return (
    <a
      href={kakaoChannelUrl}
      onClick={handleClick}
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 group"
      title="카카오톡 플러스 채널 문의"
    >
      {/* 모바일: 44x44, 데스크톱: 56x56 */}
      <div className="w-11 h-11 md:w-14 md:h-14 rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-all duration-300">
        <img src={kakaoLogoSrc} alt="카카오톡 채널" className="w-full h-full object-cover" />
      </div>
      {/* 데스크톱 전용 툴팁 */}
      <div className="absolute bottom-full right-0 mb-2.5 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none hidden md:block">
        <span className="text-white/70" style={{ fontSize: "11px", fontWeight: 400 }}>
          카카오톡으로 문의하기
        </span>
        <div className="absolute top-full right-5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#1a1a1a]" />
      </div>
    </a>
  );
}