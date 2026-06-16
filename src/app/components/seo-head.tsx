import { useEffect } from "react";
import { useData } from "./data-store";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * OG(Open Graph) 메타 태그를 동적으로 업데이트하는 컴포넌트
 *
 * 기본 OG 태그는 vite.config.ts의 ogMetaPlugin에 의해
 * index.html에 정적으로 주입됩니다 (카카오톡/페이스북 크롤러 대응).
 *
 * 이 컴포넌트는 SPA 내 페이지 전환 시 타이틀/설명을 동적으로 업데이트하는
 * 보조 역할을 합니다.
 *
 * ⚠️ 배포 시 og:image의 content를 절대 URL로 변경해야 합니다.
 *    예: https://yourdomain.com/og-image.png
 */
export function SEOHead({
  title = "arplanet | 아르플래닛",
  description = "클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛",
  image,
  url,
  type = "website",
}: SEOProps) {
  const { ogImage: storedOgImage } = useData();

  useEffect(() => {
    // 페이지 타이틀
    document.title = title;

    // 현재 도메인 기반 절대 URL 생성
    const origin = window.location.origin;
    // OG 이미지 우선순위: props > context > /og-image.png
    const ogImageSrc = image || storedOgImage || "/og-image.png";
    const absoluteImageUrl = ogImageSrc.startsWith("http") ? ogImageSrc : `${origin}${ogImageSrc.startsWith("/") ? ogImageSrc : `/${ogImageSrc}`}`;
    const siteUrl = url || window.location.href;

    // 메타 태그 설정 헬퍼
    function setMeta(attr: string, key: string, content: string) {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }

    // 기본 메타
    setMeta("name", "description", description);

    // Open Graph (카카오톡, 페이스북, 네이버 등)
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", absoluteImageUrl);
    setMeta("property", "og:url", siteUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", "arplanet | 아르플래닛");
    setMeta("property", "og:locale", "ko_KR");

    // 트위터(X) 카드
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", absoluteImageUrl);

    // 네이버 서치어드바이저 호환
    setMeta("name", "robots", "index, follow");
  }, [title, description, image, url, type, storedOgImage]);

  return null;
}