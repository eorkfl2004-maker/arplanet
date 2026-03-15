import { createContext, useContext, useState, ReactNode } from "react";

export interface HeroSlide {
  id: string;
  image: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  order: number;
  active: boolean;
}

export type ContentBlock =
  | { type: "text"; value: string }
  | { type: "image"; url: string; caption?: string };

export interface NewsPost {
  id: string;
  title: string;
  category: string;
  date: string;
  status: "published" | "draft";
  content: string;
  image?: string;
  link?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
  client: string;
  desc?: string;
  blogContent?: ContentBlock[];
  reservationLink?: string;
  visible?: boolean;
}

export interface ServiceItem {
  id: string;
  num: string;
  title: "무대 운영 · 브랜딩 지원" | "촬영 · 마케팅 · 행정 지원" | "클래식 공연 기획" | "예술인 매칭 플랫폼 ARTFLOH";
  desc: string;
  status: "운영중" | "준비중";
  link?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  date: string;
  read: boolean;
}

export interface CompanyInfoData {
  name: string;
  foundedDate: string;
  ceo: string;
  address: string;
  businessAreas: string[];
  image: string;
  imageCaption: string;
}

export interface AboutPillar {
  num: string;
  title: string;
  desc: string;
}

export interface AboutAchievement {
  num: string;
  label: string;
  sub: string;
}

export interface ArtistItem {
  id: string;
  name: string;
  role: string;
  instrument: string;
  bio: string;
  image: string;
  order: number;
  visible?: boolean;
}

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  organizer: string;
  desc?: string;
  order: number;
  visible?: boolean;
}

export interface CurrentProject {
  id: string;
  title: string;
  image: string;
  reservationLink: string;
  description?: string;
  date?: string;
  performanceDate?: string;
  performanceDay?: string;
  performanceTime?: string;
  active: boolean;
  order: number;
}

export interface AboutData {
  mainText: string;
  pillars: AboutPillar[];
  achievementsTitle: string;
  achievements: AboutAchievement[];
}

interface DataStore {
  heroSlides: HeroSlide[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
  posts: NewsPost[];
  setPosts: React.Dispatch<React.SetStateAction<NewsPost[]>>;
  portfolio: PortfolioItem[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  inquiries: InquiryItem[];
  setInquiries: React.Dispatch<React.SetStateAction<InquiryItem[]>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  companyInfo: CompanyInfoData;
  setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfoData>>;
  aboutData: AboutData;
  setAboutData: React.Dispatch<React.SetStateAction<AboutData>>;
  adminPassword: string;
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>;
  artists: ArtistItem[];
  setArtists: React.Dispatch<React.SetStateAction<ArtistItem[]>>;
  awards: AwardItem[];
  setAwards: React.Dispatch<React.SetStateAction<AwardItem[]>>;
  currentProjects: CurrentProject[];
  setCurrentProjects: React.Dispatch<React.SetStateAction<CurrentProject[]>>;
  kakaoChannelUrl: string;
  setKakaoChannelUrl: React.Dispatch<React.SetStateAction<string>>;
}

// Stable context across HMR — reuse existing context if already created
const CONTEXT_KEY = "__ARPLANET_DATA_CONTEXT__";
const _global = globalThis as unknown as Record<string, unknown>;
if (!_global[CONTEXT_KEY]) {
  _global[CONTEXT_KEY] = createContext<DataStore | null>(null);
}
const DataContext = _global[CONTEXT_KEY] as React.Context<DataStore | null>;

const defaultHeroSlides: HeroSlide[] = [
  {
    id: "h1",
    image: "https://images.unsplash.com/photo-1773270834685-e6a4372874be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBtdXNpYyUyMGNvbmNlcnQlMjBwaWFubyUyMHN0YWdlfGVufDF8fHx8MTc3MzU1ODU2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    titleLine1: "CLASSICAL",
    titleLine2: "MUSIC",
    subtitle: "청년 예술인들과 함께하는 클래식 음악 단체",
    order: 0,
    active: true,
  },
  {
    id: "h2",
    image: "https://images.unsplash.com/photo-1665002136015-9ad4e54c9a40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBjb25jZXJ0JTIwaGFsbCUyMGRhcmt8ZW58MXx8fHwxNzczNTU4NTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    titleLine1: "INSPIRE",
    titleLine2: "& CREATE",
    subtitle: "예술의 가능성을 발굴하고 무대를 만듭니다",
    order: 1,
    active: true,
  },
  {
    id: "h3",
    image: "https://images.unsplash.com/photo-1673523280025-61eeb234a4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWFubyUyMGtleXMlMjBjbG9zZSUyMHVwJTIwZGFya3xlbnwxfHx8fDE3NzM1NTg1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    titleLine1: "STAGE",
    titleLine2: "FOR YOU",
    subtitle: "아티스트의 연주를 극대화할 수 있는 서포터 인프라",
    order: 2,
    active: true,
  },
];

const defaultPosts: NewsPost[] = [
  { id: "n1", title: "아르플래닛 제1회 정기연주회 성황리 개최", category: "공연", date: "2025.05.03", status: "published", content: "아르플래닛 제1회 정기연주회가 ACC 예술극장에서 성황리에 개최되었습니다. 소속 아티스트들의 열정적인 무대가 관객들에게 깊은 감동을 선사했습니다.", link: "" },
  { id: "n2", title: "최혜지 피아노 독주회 - 푸른지오아트홀", category: "공연", date: "2025.03.22", status: "published", content: "아르플래닛 대표 최혜지의 피아노 독주회가 푸른지오아트홀에서 성공적으로 개최되었습니다.", link: "" },
  { id: "n3", title: "광주광역시 북구청 문화예술단체 보조금 지원사업 선정", category: "소식", date: "2025.01.10", status: "published", content: "아르플래닛이 광주광역시 북구청 문화예술단체 보조금 지원사업에 선정되어 하반기 공연 및 활동을 위한 지원을 받게 되었습니다.", link: "" },
  { id: "n4", title: "아르플래닛 기록 전시 개최", category: "전시", date: "2024.12.01", status: "published", content: "사진작가 최진령과 함께하는 아르플래닛 기록 전시가 천일빌딩 245 3층에서 12월 1일부터 3일까지 진행됩니다.", link: "" },
  { id: "n5", title: "<아르플래닛 듀오의 밤> 공연 안내", category: "공연", date: "2024.10.19", status: "published", content: "최혜지, 김민호 조인트 리사이틀 <아르플래닛 듀오의 밤>이 광주예술의전당 소극장에서 개최됩니다.", link: "" },
  { id: "n6", title: "2기 소속 아티스트 모집 안내", category: "모집", date: "2024.09.01", status: "published", content: "아르플래닛 2기 소속 아티스트를 모집합니다. 광주/전남지역 출신 청년예술인 음악대학 졸업생 및 재학생을 대상으로 합니다.", link: "" },
];

const defaultPortfolio: PortfolioItem[] = [
  { id: "p1", title: "아르플래닛 제1회 정기연주회", category: "정기공연", image: "https://images.unsplash.com/photo-1773270834685-e6a4372874be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBtdXNpYyUyMGNvbmNlcnQlMjBwaWFubyUyMHN0YWdlfGVufDF8fHx8MTc3MzU1ODU2Nnww&ixlib=rb-4.1.0&q=80&w=1080", year: "2025", client: "ACC 예술극장", desc: "소속 아티스트 전원이 참여하는 첫 번째 정기연주회", visible: true, blogContent: [{ type: "text", value: "아르플래닛의 첫 번째 정기연주회가 2025년 5월 3일, 국립아시아문화전당(ACC) 예술극장에서 성황리에 개최되었습니다.\n\n소속 아티스트 전원이 참여한 이번 무대는 클래식 음악의 다양한 레퍼토리를 선보이며, 관객들에게 깊은 감동을 선사했습니다." }, { type: "image", url: "https://images.unsplash.com/photo-1773270834685-e6a4372874be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBtdXNpYyUyMGNvbmNlcnQlMjBwaWFubyUyMHN0YWdlfGVufDF8fHx8MTc3MzU1ODU2Nnww&ixlib=rb-4.1.0&q=80&w=1080", caption: "ACC 예술극장 공연 현장" }, { type: "text", value: "프로그램은 모차르트, 쇼팽, 라흐마니노프의 대표 작품들로 구성되었으며, 각 아티스트의 개성이 돋보이는 솔로 무대와 앙상블 무대가 함께 펼쳐졌습니다.\n\n특히 피날레에서는 모든 아티스트가 함께하는 합동 무대로 마무리하여, 아르플래닛만의 결속력과 음악적 조화를 보여주었습니다." }] },
  { id: "p2", title: "최혜지 피아노 독주회", category: "독주회", image: "https://images.unsplash.com/photo-1673523280025-61eeb234a4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWFubyUyMGtleXMlMjBjbG9zZSUyMHVwJTIwZGFya3xlbnwxfHx8fDE3NzM1NTg1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080", year: "2025", client: "푸른지오아트홀", desc: "대표 최혜지의 솔로 피아노 리사이틀", visible: true, blogContent: [{ type: "text", value: "아르플래닛 대표 최혜지의 피아노 독주회가 2025년 3월 22일, 푸른지오아트홀에서 성공적으로 개최되었습니다.\n\n이번 독주회는 쇼팽과 리스트의 작품을 중심으로 한 프로그램으로, 피아니스트로서의 깊은 음악적 해석과 테크닉을 선보였습니다." }] },
  { id: "p3", title: "아르플래닛 듀오의 밤", category: "조인트리사이틀", image: "https://images.unsplash.com/photo-1765279256966-3bf83d01c672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFtYmVyJTIwbXVzaWMlMjBkdW8lMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzM1NTg1NzR8MA&ixlib=rb-4.1.0&q=80&w=1080", year: "2024", client: "광주예술의전당 소극장", desc: "최혜지, 김민호 조인트 리사이틀", visible: true, blogContent: [] },
  { id: "p4", title: "안소연 피아노 독주회", category: "초청연주", image: "https://images.unsplash.com/photo-1761173084851-1e5302e931fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZCUyMHBpYW5vJTIwZW1wdHklMjBjb25jZXJ0JTIwaGFsbHxlbnwxfHx8fDE3NzM1NTg1NzR8MA&ixlib=rb-4.1.0&q=80&w=1080", year: "2024", client: "광주예술의 전당 소극장", desc: "초청 연주 - 안소연 피아니스트", visible: true, blogContent: [] },
  { id: "p5", title: "광주문화재단 목요콘서트", category: "협업공연", image: "https://images.unsplash.com/photo-1665002136015-9ad4e54c9a40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBjb25jZXJ0JTIwaGFsbCUyMGRhcmt8ZW58MXx8fHwxNzczNTU4NTY3fDA&ixlib=rb-4.1.0&q=80&w=1080", year: "2024", client: "광주문화재단", desc: '"유소연 작가" 와 색채의 멜로디 진행', visible: true, blogContent: [] },
  { id: "p6", title: "아르플래닛 기록 전시", category: "전시", image: "https://images.unsplash.com/photo-1755389176283-3cd924205df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW9saW4lMjBtdXNpY2lhbiUyMHBlcmZvcm1hbmNlJTIwc3RhZ2V8ZW58MXx8fHwxNzczNTU4NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080", year: "2024", client: "With 사진작가 최진령", desc: "아르플래닛 기록 전시 - 천일빌딩 245 3층", visible: true, blogContent: [] },
];

const defaultServices: ServiceItem[] = [
  { id: "s1", num: "01", title: "무대 운영 · 브랜딩 지원", desc: "공연 1회 운영 비용 최소 500만 원 ~ 1,000만 원의 비용을 아르플래닛이 최소한의 비용으로 무대를 만들어드립니다.", status: "운영중", link: "" },
  { id: "s2", num: "02", title: "촬영 · 마케팅 · 행정 지원", desc: "사진 작가의 사진 촬영 비용, 마케팅 카드뉴스, 언론보도를 통한 아티스트의 브랜딩과 포트폴리오를 위한 지원을 지속합니다.", status: "운영중", link: "" },
  { id: "s3", num: "03", title: "클래식 공연 기획", desc: "고품질의 클래식 음악 공연을 기획하고 진행합니다. 다양한 장르와 주제를 다루며, 청중들에게 깊은 감동을 전달합니다.", status: "운영중", link: "" },
  { id: "s4", num: "04", title: "예술인 매칭 플랫폼 ARTFLOH", desc: "공연섭외, 예술인 매칭 플랫폼 ARTFLOH(아트플로) 기획 및 개발을 진행하고 있습니다.", status: "준비중", link: "" },
];

const defaultCompanyInfo: CompanyInfoData = {
  name: "아르플래닛",
  foundedDate: "2024년 01월",
  ceo: "최혜지",
  address: "광주광역시 북구 대자로 146 3F 146호",
  businessAreas: [
    "청년 예술인 육성",
    "클래식 음악 공연 기획 및 무대 지원",
    "지원 사업 유치, 아티스트 홍보",
    "매출 활동 증명서 발급",
  ],
  image: "https://images.unsplash.com/photo-1761173084851-1e5302e931fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZCUyMHBpYW5vJTIwZW1wdHklMjBjb25jZXJ0JTIwaGFsbHxlbnwxfHx8fDE3NzM1NTg1NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  imageCaption: "Gwangju, South Korea — Since 2024",
};

const defaultAboutData: AboutData = {
  mainText: "아르플래닛은 광주광역시에 본거지를 둔\n**청년 예술인들로 구성된 클래식 음악 단체**입니다.\n젊은 예술가들이 자신의 음악적 경험을 공유하고\n성장할 수 있는 **플랫폼**을 제공합니다.",
  pillars: [
    { num: "01", title: "청년 예술인 기회 제공 및 육성", desc: "우리는 청년 예술인들에게 공연 기회를 제공하고, 음악적 잠재력을 발휘할 수 있는 환경을 조성합니다." },
    { num: "02", title: "지역 클래식 음악 활성화", desc: "광주 지역에서 클래식 음악의 인기와 이해를 증진시키는 데 초점을 맞추고 문화적 교류를 촉진합니다." },
    { num: "03", title: "전문적인 클래식 공연 기획", desc: "고품질의 클래식 음악 공연을 기획하고 진행하여 청중들에게 깊은 감동과 인사이트를 제공합니다." },
  ],
  achievementsTitle: "2025 ARPLANET ACHIEVEMENTS",
  achievements: [
    { num: "3,200만 원+", label: "사업비 지출 내역", sub: "(2025년 기준)" },
    { num: "2,400명+", label: "총 관람자 수", sub: "(기획 3건 중 매진 2건)" },
    { num: "3건", label: "총 공연 기획 수", sub: "(2025년 기준)" },
    { num: "36건+", label: "언론보도", sub: "" },
  ],
};

// ─── localStorage 연동 헬퍼 ───
const STORAGE_KEY = "arplanet_data";

// ─── 데이터 버전 관리 ───
// 스키마가 변경될 때 이 버전을 올리면 마이그레이션이 실행됩니다.
const DATA_VERSION = 2;
const VERSION_KEY = `${STORAGE_KEY}_version`;

function getCurrentVersion(): number {
  try {
    const v = localStorage.getItem(VERSION_KEY);
    return v ? parseInt(v, 10) : 0;
  } catch { return 0; }
}

function setCurrentVersion(v: number) {
  try { localStorage.setItem(VERSION_KEY, String(v)); } catch { /* */ }
}

// 마이그레이션: 기존 데이터에 새 필드를 안전하게 추가
function migrateData() {
  const stored = getCurrentVersion();
  if (stored >= DATA_VERSION) return;

  // v1 → v2: visible 필드 추가 (portfolio, artists, awards)
  if (stored < 2) {
    const migrateArray = (key: string) => {
      try {
        const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            const patched = arr.map((item: Record<string, unknown>) => ({
              ...item,
              visible: item.visible !== undefined ? item.visible : true,
            }));
            localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(patched));
          }
        }
      } catch { /* */ }
    };
    migrateArray("portfolio");
    migrateArray("artists");
    migrateArray("awards");
  }

  setCurrentVersion(DATA_VERSION);
}

// 앱 시작 시 마이그레이션 실행
migrateData();

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
  } catch { /* storage full or unavailable */ }
}

function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, _setState] = useState<T>(() => loadFromStorage(key, defaultValue));
  const setState: React.Dispatch<React.SetStateAction<T>> = (action) => {
    _setState((prev) => {
      const next = typeof action === "function" ? (action as (prev: T) => T)(prev) : action;
      saveToStorage(key, next);
      return next;
    });
  };
  return [state, setState];
}

// ─── 데이터 백업/복원 (Export/Import) ───
const ALL_KEYS = [
  "heroSlides", "posts", "portfolio", "services", "inquiries",
  "companyInfo", "aboutData", "adminPassword", "artists", "awards",
  "currentProjects", "kakaoChannelUrl"
];

export function exportAllData(): string {
  const data: Record<string, unknown> = { _version: DATA_VERSION, _exportedAt: new Date().toISOString() };
  for (const key of ALL_KEYS) {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      if (raw) data[key] = JSON.parse(raw);
    } catch { /* skip */ }
  }
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(json);
    if (typeof data !== "object" || data === null) return { success: false, message: "올바른 JSON 형식이 아닙니다." };
    let count = 0;
    for (const key of ALL_KEYS) {
      if (key in data) {
        localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data[key]));
        count++;
      }
    }
    if (data._version) setCurrentVersion(data._version);
    return { success: true, message: `${count}개 항목이 복원되었습니다. 페이지를 새로고침합니다.` };
  } catch {
    return { success: false, message: "JSON 파싱에 실패했습니다. 파일을 확인해주세요." };
  }
}

export function clearAllData() {
  for (const key of ALL_KEYS) {
    try { localStorage.removeItem(`${STORAGE_KEY}_${key}`); } catch { /* */ }
  }
  try { localStorage.removeItem(VERSION_KEY); } catch { /* */ }
}

export function hasCustomData(): boolean {
  return ALL_KEYS.some(key => {
    try { return localStorage.getItem(`${STORAGE_KEY}_${key}`) !== null; } catch { return false; }
  });
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [heroSlides, setHeroSlides] = usePersistedState<HeroSlide[]>("heroSlides", defaultHeroSlides);
  const [posts, setPosts] = usePersistedState<NewsPost[]>("posts", defaultPosts);
  const [portfolio, setPortfolio] = usePersistedState<PortfolioItem[]>("portfolio", defaultPortfolio);
  const [services, setServices] = usePersistedState<ServiceItem[]>("services", defaultServices);
  const [inquiries, setInquiries] = usePersistedState<InquiryItem[]>("inquiries", []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [companyInfo, setCompanyInfo] = usePersistedState<CompanyInfoData>("companyInfo", defaultCompanyInfo);
  const [aboutData, setAboutData] = usePersistedState<AboutData>("aboutData", defaultAboutData);
  const [adminPassword, setAdminPassword] = usePersistedState<string>("adminPassword", "1004");
  const [artists, setArtists] = usePersistedState<ArtistItem[]>("artists", [
    { id: "a1", name: "최혜지", role: "대표 / 피아니스트", instrument: "Piano", bio: "아르플래닛 대표. 광주 출신 피아니스트로 다수의 독주회 및 앙상블 무대 경험을 보유하고 있습니다.", image: "https://images.unsplash.com/photo-1726748236517-2f1bad4b0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwaWFuaXN0JTIwY2xhc3NpY2FsJTIwbXVzaWMlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM1NjM1MzF8MA&ixlib=rb-4.1.0&q=80&w=1080", order: 0, visible: true },
    { id: "a2", name: "김민호", role: "첼리스트", instrument: "Cello", bio: "섬세하고 깊은 음색으로 관객들에게 감동을 전하는 첼리스트입니다.", image: "https://images.unsplash.com/photo-1702524598856-70c855481d9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwY2VsbGlzdCUyMG11c2리카인JTIwcG9ydHJhaXQlMjBkYXJrfGVufDF8fHx8MTc3MzU2MzUzMnww&ixlib=rb-4.1.0&q=80&w=1080", order: 1, visible: true },
    { id: "a3", name: "안소연", role: "피아니스트", instrument: "Piano", bio: "전남대학교 음악학과 출신으로 다양한 초청 연주 활동을 펼치고 있습니다.", image: "https://images.unsplash.com/photo-1690398832220-de3a89887bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB2aW9saW5pc3QlMjBjbGFzc2ljYWwlMjBwb3J0cmFpdCUyMGVsZWdhbnR8ZW58MXx8fHwxNzczNTYzNTMyfDA&ixlib=rb-4.1.0&q=80&w=1080", order: 2, visible: true },
    { id: "a4", name: "박준영", role: "피아니스트", instrument: "Piano", bio: "다양한 장르를 아우르는 표현력을 지닌 젊은 피아니스트입니다.", image: "https://images.unsplash.com/photo-1681070907979-33fb54f56c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcGlhbmlzdCUyMGNsYX시카인JTIw무시JTIwZm9ybWFsfGVufDF8fHx8MTc3MzU2MzUzMnww&ixlib=rb-4.1.0&q=80&w=1080", order: 3, visible: true },
  ]);
  const [awards, setAwards] = usePersistedState<AwardItem[]>("awards", [
    { id: "aw1", year: "2024", title: "광주문화재단 클래식 음악 공연 지원금", organizer: "광주문화재단", desc: "아르플래닛의 클래식 음악 공연을 지원하는 재단의 지원금을 수상했습니다.", order: 0, visible: true },
    { id: "aw2", year: "2025", title: "국립아시아문화전당(ACC) 공연 지원금", organizer: "국립아시아문화전당(ACC)", desc: "ACC에서 주최하는 공연 지원금을 수상했습니다.", order: 1, visible: true },
  ]);
  const [currentProjects, setCurrentProjects] = usePersistedState<CurrentProject[]>("currentProjects", [
    { id: "cp1", title: "아르플래닛 제2회 정기연주회", image: "https://images.unsplash.com/photo-1773270834685-e6a4372874be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBtdXNpYyUyMGNvbmNlcnQlMjBwaWFubyUyMHN0YWdlfGVufDF8fHx8MTc3MzU1ODU2Nnww&ixlib=rb-4.1.0&q=80&w=1080", reservationLink: "https://example.com/reserve", description: "아르플래닛의 다음 정기연주회를 예약하세요.", date: "2025.06.01", performanceDate: "2025년 6월 1일", performanceDay: "일요일", performanceTime: "오후 3시", active: true, order: 0 },
    { id: "cp2", title: "아르플래닛 듀오의 밤", image: "https://images.unsplash.com/photo-1765279256966-3bf83d01c672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFtYmVyJTIwbXVzaWMlMjBkdW8lMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzM1NTg1NzR8MA&ixlib=rb-4.1.0&q=80&w=1080", reservationLink: "https://example.com/reserve", description: "아르플래닛 듀오의 밤을 예약하세요.", date: "2025.07.15", performanceDate: "2025년 7월 15일", performanceDay: "화요일", performanceTime: "오후 7시 30분", active: true, order: 1 },
  ]);
  const [kakaoChannelUrl, setKakaoChannelUrl] = usePersistedState<string>("kakaoChannelUrl", "https://open.kakao.com/o/gGzQw6Qc");

  return (
    <DataContext.Provider value={{ heroSlides, setHeroSlides, posts, setPosts, portfolio, setPortfolio, services, setServices, inquiries, setInquiries, isLoggedIn, setIsLoggedIn, companyInfo, setCompanyInfo, aboutData, setAboutData, adminPassword, setAdminPassword, artists, setArtists, awards, setAwards, currentProjects, setCurrentProjects, kakaoChannelUrl, setKakaoChannelUrl }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}