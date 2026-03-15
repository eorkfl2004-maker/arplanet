import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// OG 이미지 소스 경로 (figma:asset 해시)
const OG_IMAGE_HASH = 'edc2ba40c0534126f7e9e2b23999f44408914b90.png';
const OG_IMAGE_FILENAME = 'og-image.png';

// 배포 도메인 (카카오톡 OG 태그에 절대 URL 필요)
const SITE_URL = 'https://arplanet.kr';

/**
 * 카카오톡/페이스북 등 SNS 크롤러를 위한 OG 메타태그 + 이미지 플러그인
 * - index.html에 정적 OG 메타태그를 주입
 * - OG 이미지를 /og-image.png 경로로 제공
 */
function ogMetaPlugin() {
  let resolvedOgImagePath = '';

  return {
    name: 'og-meta-inject',
    configResolved(config: any) {
      // figma:asset이 resolve되는 경로를 찾기 위한 root 저장
      const possiblePaths = [
        path.resolve(config.root, 'src/imports', OG_IMAGE_HASH),
        path.resolve(config.root, 'node_modules/.figma-asset', OG_IMAGE_HASH),
      ];
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          resolvedOgImagePath = p;
          break;
        }
      }
    },
    configureServer(server: any) {
      // 개발 서버에서 /og-image.png 요청 시 이미지 제공
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === `/${OG_IMAGE_FILENAME}`) {
          if (resolvedOgImagePath && fs.existsSync(resolvedOgImagePath)) {
            res.setHeader('Content-Type', 'image/png');
            fs.createReadStream(resolvedOgImagePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
    generateBundle() {
      // 빌드 시 OG 이미지를 고정 파일명으로 출력
      if (resolvedOgImagePath && fs.existsSync(resolvedOgImagePath)) {
        this.emitFile({
          type: 'asset',
          fileName: OG_IMAGE_FILENAME,
          source: fs.readFileSync(resolvedOgImagePath),
        });
      }
    },
    transformIndexHtml() {
      return [
        // 기본 메타
        { tag: 'meta', attrs: { name: 'description', content: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛' }, injectTo: 'head' },
        // Open Graph (카카오톡, 페이스북, 네이버 등)
        { tag: 'meta', attrs: { property: 'og:url', content: SITE_URL }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:title', content: 'ARPlanet | 아르플래닛' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:description', content: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE_URL}/${OG_IMAGE_FILENAME}` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'ARPlanet | 아르플래닛' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'ko_KR' }, injectTo: 'head' },
        // Twitter(X) 카드
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'ARPlanet | 아르플래닛' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:description', content: '클래식의 새로운 가능성 — 광주광역시 기반 클래식 음악 단체 아르플래닛' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE_URL}/${OG_IMAGE_FILENAME}` }, injectTo: 'head' },
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
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})