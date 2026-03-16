import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// 배포 도메인 (카카오톡 OG 태그에 절대 URL 필요)
const SITE_URL = 'https://arplanet.kr';
const OG_IMAGE_FILENAME = 'og-image.png';

/**
 * 카카오톡/페이스북 등 SNS 크롤러를 위한 OG 메타태그 플러그인
 * - index.html에 정적 OG 메타태그를 주입
 * - OG 이미지는 /public/og-image.png에 직접 배치
 */
function ogMetaPlugin() {
  return {
    name: 'og-meta-inject',
    transformIndexHtml() {
      return [
        // 기본 메타
        { tag: 'meta', attrs: { name: 'description', content: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛' }, injectTo: 'head' as const },
        // 검색엔진 인덱싱
        { tag: 'meta', attrs: { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }, injectTo: 'head' as const },
        // Canonical URL
        { tag: 'link', attrs: { rel: 'canonical', href: SITE_URL }, injectTo: 'head' as const },
        // 언어 및 지역 설정
        { tag: 'meta', attrs: { 'http-equiv': 'content-language', content: 'ko' }, injectTo: 'head' as const },
        // 네이버 서치어드바이저 인증 (https://searchadvisor.naver.com 에서 발급받은 코드로 교체)
        { tag: 'meta', attrs: { name: 'naver-site-verification', content: 'fe09b420ffa2b75176bc1f29b0b1576f5fc506c1' }, injectTo: 'head' as const },
        // 구글 서치 콘솔 인증 (https://search.google.com/search-console 에서 발급받은 코드로 교체)
        { tag: 'meta', attrs: { name: 'google-site-verification', content: 'GOOGLE_VERIFICATION_CODE' }, injectTo: 'head' as const },
        // Open Graph (카카오톡, 페이스북, 네이버 등)
        { tag: 'meta', attrs: { property: 'og:url', content: SITE_URL }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:title', content: 'ARPlanet | 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:description', content: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE_URL}/${OG_IMAGE_FILENAME}` }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'ARPlanet | 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'ko_KR' }, injectTo: 'head' as const },
        // Twitter(X) 카드
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'ARPlanet | 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { name: 'twitter:description', content: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE_URL}/${OG_IMAGE_FILENAME}` }, injectTo: 'head' as const },
        // JSON-LD 구조화 데이터 (구글 검색 결과 리치 스니펫)
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ARPlanet (아르플래닛)',
            url: SITE_URL,
            logo: `${SITE_URL}/${OG_IMAGE_FILENAME}`,
            description: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛',
            address: {
              '@type': 'PostalAddress',
              addressLocality: '광주광역시',
              addressCountry: 'KR',
            },
            sameAs: [],
          }),
          injectTo: 'head' as const,
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ogMetaPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})