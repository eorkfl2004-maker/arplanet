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
        // Open Graph (카카오톡, 페이스북, 네이버 등)
        { tag: 'meta', attrs: { property: 'og:url', content: SITE_URL }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:title', content: 'arplanet | 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:description', content: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE_URL}/${OG_IMAGE_FILENAME}` }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'arplanet | 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'ko_KR' }, injectTo: 'head' as const },
        // Twitter(X) 카드
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'arplanet | 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { name: 'twitter:description', content: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛' }, injectTo: 'head' as const },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE_URL}/${OG_IMAGE_FILENAME}` }, injectTo: 'head' as const },
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
      '/utils': path.resolve(__dirname, './utils'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})