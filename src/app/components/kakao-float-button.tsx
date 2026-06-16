import { useData } from "./data-store";
import { useLocation } from "react-router";
import { useCallback } from "react";
import kakaoLogoImg from "../../imports/image.png";

export function KakaoFloatButton() {
  const { kakaoChannelUrl, kakaoLogo } = useData();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isLogin = location.pathname === "/login";

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!kakaoChannelUrl) return;

    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      window.location.href = kakaoChannelUrl;
    } else {
      window.open(kakaoChannelUrl, "_blank", "noopener,noreferrer");
    }
  }, [kakaoChannelUrl]);

  if (isAdmin || isLogin || !kakaoChannelUrl) return null;

  const logoSrc = kakaoLogo || kakaoLogoImg;

  return (
    <a
      href={kakaoChannelUrl}
      onClick={handleClick}
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 group"
    >
      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-all duration-300">
        <img src={logoSrc} alt="카카오톡 채널" className="w-full h-full object-cover" />
      </div>
    </a>
  );
}
