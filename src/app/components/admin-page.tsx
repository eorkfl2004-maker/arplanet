import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard, FileText, Image, Instagram, Settings,
  Plus, Trash2, Edit3, Eye, Upload, RefreshCw,
  TrendingUp, FolderOpen, MessageSquare, ArrowLeft,
  X, Check, ChevronLeft, ChevronRight, ExternalLink,
  Save, EyeOff, LogOut, Mail, MailOpen,
  Layers, ArrowUp, ArrowDown, Monitor, Link2, Type, ImageIcon, Briefcase, Users, Ticket, CalendarDays,
  Download, AlertTriangle, Database, HardDrive
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useData, type NewsPost, type PortfolioItem, type HeroSlide, type ContentBlock, type ServiceItem, type CompanyInfoData, type AboutData, type ArtistItem, type AwardItem, type CurrentProject, type AdminAccount, type InstagramPost, exportAllData, importAllData, clearAllData } from "./data-store";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type Tab = "dashboard" | "hero" | "about" | "artists" | "currentprojects" | "companyinfo" | "portfolio" | "posts" | "services" | "awards" | "inquiries" | "instagram" | "logos" | "settings";

// Instagram posts are now fetched from the API

/* ───────── Blog Content Block Editor ───────── */
function BlogEditor({ blocks, onChange }: { blocks: ContentBlock[]; onChange: (b: ContentBlock[]) => void }) {
  const imgRef = useRef<HTMLInputElement>(null);

  const addTextBlock = () => onChange([...blocks, { type: "text", value: "" }]);
  const addImageBlock = () => onChange([...blocks, { type: "image", url: "", caption: "" }]);

  const updateBlock = (i: number, patch: Partial<ContentBlock>) => {
    const next = [...blocks];
    next[i] = { ...next[i], ...patch } as ContentBlock;
    onChange(next);
  };

  const removeBlock = (i: number) => onChange(blocks.filter((_, idx) => idx !== i));

  const moveBlock = (i: number, dir: "up" | "down") => {
    const next = [...blocks];
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const handleImgUpload = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateBlock(i, { url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-white/30 tracking-[0.15em]" style={{ fontSize: "10px", fontWeight: 500 }}>블로그 콘텐츠</label>
        <div className="flex gap-2">
          <button type="button" onClick={addTextBlock} className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "11px" }}>
            <Type size={12} /> 텍스트
          </button>
          <button type="button" onClick={addImageBlock} className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "11px" }}>
            <ImageIcon size={12} /> 이미지
          </button>
        </div>
      </div>

      {blocks.length === 0 && (
        <div className="border border-dashed border-white/[0.06] p-8 text-center">
          <p className="text-white/15" style={{ fontSize: "12px" }}>위의 버튼으로 텍스트/이미지 블록을 추가하여 상세 글을 작성하세요.</p>
          <p className="text-white/10 mt-1" style={{ fontSize: "11px" }}>프로젝트 이미지를 클릭하면 이 블로그 글로 이동합니다.</p>
        </div>
      )}

      {blocks.map((block, i) => (
        <div key={i} className="border border-white/[0.06] p-4 relative group/block">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/20 tracking-[0.1em]" style={{ fontSize: "9px", fontWeight: 500 }}>
              {block.type === "text" ? "텍스트 블록" : "이미지 블록"} #{i + 1}
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => moveBlock(i, "up")} disabled={i === 0} className="p-1 text-white/15 hover:text-white/50 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"><ArrowUp size={12} /></button>
              <button type="button" onClick={() => moveBlock(i, "down")} disabled={i === blocks.length - 1} className="p-1 text-white/15 hover:text-white/50 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"><ArrowDown size={12} /></button>
              <button type="button" onClick={() => removeBlock(i)} className="p-1 text-white/15 hover:text-red-400/70 cursor-pointer"><Trash2 size={12} /></button>
            </div>
          </div>

          {block.type === "text" ? (
            <textarea
              value={block.value}
              onChange={(e) => updateBlock(i, { value: e.target.value })}
              rows={5}
              className="w-full bg-transparent border border-white/[0.06] focus:border-white/15 p-3 text-white/70 placeholder:text-white/10 focus:outline-none resize-none"
              placeholder="텍스트를 입력하세요. 빈 줄로 문단을 구분합니다."
              style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.8 }}
            />
          ) : (
            <div className="space-y-3">
              {block.url ? (
                <div className="relative">
                  <img src={block.url} alt="" className="w-full max-h-40 object-cover" />
                  <button type="button" onClick={() => updateBlock(i, { url: "" })} className="absolute top-2 right-2 w-5 h-5 bg-black/70 text-white flex items-center justify-center cursor-pointer"><X size={10} /></button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input type="hidden" ref={i === blocks.length - 1 ? imgRef : undefined} />
                  <label className="flex-1 border border-dashed border-white/[0.08] py-4 flex flex-col items-center cursor-pointer hover:border-white/15 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImgUpload(i, e)} />
                    <Upload size={14} className="text-white/15 mb-1" />
                    <span className="text-white/20" style={{ fontSize: "11px" }}>업로드</span>
                  </label>
                  <div className="flex-1">
                    <input type="url" placeholder="또는 이미지 URL 입력" value={block.url}
                      onChange={(e) => updateBlock(i, { url: e.target.value })}
                      className="w-full bg-transparent border-b border-white/[0.06] py-2 text-white/50 placeholder:text-white/10 focus:outline-none" style={{ fontSize: "12px" }} />
                  </div>
                </div>
              )}
              <input type="text" placeholder="캡션 (선택)" value={block.caption || ""}
                onChange={(e) => updateBlock(i, { caption: e.target.value })}
                className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/15 py-2 text-white/40 placeholder:text-white/10 focus:outline-none" style={{ fontSize: "12px", fontWeight: 300 }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ───────── Admin Page ───────── */
export function AdminPage() {
  const navigate = useNavigate();
  const { heroSlides, setHeroSlides, posts, setPosts, portfolio, setPortfolio, services, setServices, inquiries, setInquiries, isLoggedIn, setIsLoggedIn, companyInfo, setCompanyInfo, aboutData, setAboutData, adminPassword, setAdminPassword, artists, setArtists, awards, setAwards, currentProjects, setCurrentProjects, kakaoChannelUrl, setKakaoChannelUrl, siteLogo, setSiteLogo, kakaoLogo, setKakaoLogo, ogImage, setOgImage, adminAccounts, setAdminAccounts, instagramToken, setInstagramToken } = useData();

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [newPost, setNewPost] = useState({ title: "", category: "공연", content: "", link: "" });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", category: "정기공연", client: "", year: "2026", desc: "", reservationLink: "" });
  const [blogBlocks, setBlogBlocks] = useState<ContentBlock[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [igSettings, setIgSettings] = useState({ autoSync: true, storySync: false, hashtagFilter: true });

  // Admin accounts
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", name: "", role: "admin" as "admin" | "superadmin" });
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);

  // Instagram
  const [igPosts, setIgPosts] = useState<InstagramPost[]>([]);
  const [igLoading, setIgLoading] = useState(false);
  const [igError, setIgError] = useState("");
  const [editingIgToken, setEditingIgToken] = useState("");

  const fetchInstagramFeed = async () => {
    setIgLoading(true);
    setIgError("");
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f286b462/instagram-feed?limit=12`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      if (data.error && !data.posts?.length) {
        setIgError(data.error);
      }
      setIgPosts(data.posts || []);
    } catch (err) {
      console.error("Failed to fetch Instagram:", err);
      setIgError("인스타그램 피드를 불러올 수 없습니다.");
    } finally {
      setIgLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "instagram" && instagramToken) {
      fetchInstagramFeed();
    }
  }, [activeTab, instagramToken]);

  // Hero
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [newSlide, setNewSlide] = useState({ titleLine1: "", titleLine2: "", subtitle: "", imageUrl: "" });
  const [heroUploadedImage, setHeroUploadedImage] = useState<string | null>(null);

  // Services
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Company Info editing
  const [editingCompanyInfo, setEditingCompanyInfo] = useState<CompanyInfoData | null>(null);
  const [companyImageUploaded, setCompanyImageUploaded] = useState<string | null>(null);
  const companyImgRef = useRef<HTMLInputElement>(null);

  // About editing
  const [editingAbout, setEditingAbout] = useState<AboutData | null>(null);

  // Artists
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<ArtistItem | null>(null);
  const [newArtist, setNewArtist] = useState({ name: "", role: "", instrument: "", bio: "" });
  const [artistUploadedImage, setArtistUploadedImage] = useState<string | null>(null);
  const artistImgRef = useRef<HTMLInputElement>(null);

  // Awards
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardItem | null>(null);
  const [newAward, setNewAward] = useState({ year: "2025", title: "", organizer: "", desc: "" });

  // Current Projects
  const [showCpForm, setShowCpForm] = useState(false);
  const [editingCp, setEditingCp] = useState<CurrentProject | null>(null);
  const [newCp, setNewCp] = useState({ title: "", reservationLink: "", description: "", date: "", performanceDate: "", performanceDay: "", performanceTime: "" });
  const [cpUploadedImage, setCpUploadedImage] = useState<string | null>(null);
  const cpImgRef = useRef<HTMLInputElement>(null);

  // Kakao
  const [editingKakaoUrl, setEditingKakaoUrl] = useState("");

  // Password change
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirmPw: "" });

  // Logos
  const siteLogoRef = useRef<HTMLInputElement>(null);
  const kakaoLogoRef = useRef<HTMLInputElement>(null);
  const ogImageRef = useRef<HTMLInputElement>(null);

  // Backup/Restore
  const backupFileRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => { if (!isLoggedIn) navigate("/login"); }, [isLoggedIn, navigate]);
  if (!isLoggedIn) return null;

  const handleLogout = () => { setIsLoggedIn(false); toast.success("로그아웃되었습니다."); navigate("/"); };

  /* ── Posts ── */
  const handleCreatePost = () => {
    if (!newPost.title.trim()) { toast.error("제목을 입력해주세요."); return; }
    const post: NewsPost = { id: Date.now().toString(), title: newPost.title, category: newPost.category, date: new Date().toISOString().slice(0, 10).replace(/-/g, "."), status: "draft", content: newPost.content, image: uploadedImage || undefined, link: newPost.link };
    setPosts(prev => [post, ...prev]); setNewPost({ title: "", category: "공연", content: "", link: "" }); setUploadedImage(null); setShowEditor(false);
    toast.success("글이 저장되었습니다. (임시저장 상태)");
  };
  const handleUpdatePost = () => {
    if (!editingPost) return;
    const updated = { ...editingPost, image: uploadedImage || editingPost.image };
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingPost(null); setUploadedImage(null); setShowEditor(false);
    toast.success("수정되었습니다.");
  };
  const handleDeletePost = (id: string) => { setPosts(prev => prev.filter(p => p.id !== id)); toast.success("삭제되었습니다."); };
  const handleTogglePublish = (id: string) => {
    setPosts(prev => prev.map(p => { if (p.id !== id) return p; return { ...p, status: p.status === "published" ? "draft" as const : "published" as const }; }));
    const post = posts.find(p => p.id === id); toast.success(post?.status === "published" ? "비공개 처리되었습니다." : "게시되었습니다.");
  };

  /* ── Image upload ── */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setUploadedImage(reader.result as string); toast.success(`이미지 업로드 완료`); }; reader.readAsDataURL(file); } };
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setHeroUploadedImage(reader.result as string); toast.success(`이미지 업로드 완료`); }; reader.readAsDataURL(file); } };

  /* ── Portfolio ── */
  const handleCreatePortfolio = () => {
    if (!newPortfolio.title.trim()) { toast.error("프로젝트 제목을 입력해주세요."); return; }
    const item: PortfolioItem = { id: Date.now().toString(), title: newPortfolio.title, category: newPortfolio.category, client: newPortfolio.client, year: newPortfolio.year, desc: newPortfolio.desc, image: uploadedImage || "https://images.unsplash.com/photo-1773270834685-e6a4372874be?w=600", blogContent: blogBlocks.length > 0 ? blogBlocks : [], reservationLink: newPortfolio.reservationLink || undefined, visible: true };
    setPortfolio(prev => [item, ...prev]); setNewPortfolio({ title: "", category: "정기공연", client: "", year: "2026", desc: "", reservationLink: "" }); setBlogBlocks([]); setUploadedImage(null); setShowPortfolioForm(false);
    toast.success("프로젝트가 추가되었습니다.");
  };
  const handleUpdatePortfolio = () => {
    if (!editingPortfolio) return;
    const updated = { ...editingPortfolio, image: uploadedImage || editingPortfolio.image, blogContent: blogBlocks, reservationLink: editingPortfolio.reservationLink || undefined };
    setPortfolio(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingPortfolio(null); setBlogBlocks([]); setUploadedImage(null); setShowPortfolioForm(false);
    toast.success("수정되었습니다.");
  };
  const handleDeletePortfolio = (id: string) => { setPortfolio(prev => prev.filter(p => p.id !== id)); toast.success("삭제되었습니다."); };
  const handleTogglePortfolioVisible = (id: string) => { setPortfolio(prev => prev.map(p => p.id === id ? { ...p, visible: p.visible === false ? true : false } : p)); };

  /* ── Inquiries ── */
  const handleToggleReadInquiry = (id: string) => { setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: !i.read } : i)); };
  const handleDeleteInquiry = (id: string) => { setInquiries(prev => prev.filter(i => i.id !== id)); toast.success("삭제되었습니다."); };

  /* ── Hero ── */
  const handleCreateSlide = () => {
    if (!newSlide.titleLine1.trim()) { toast.error("타이틀 1을 입력해주세요."); return; }
    const img = heroUploadedImage || newSlide.imageUrl;
    if (!img) { toast.error("배경 이미지가 필요합니다."); return; }
    const slide: HeroSlide = { id: Date.now().toString(), image: img, titleLine1: newSlide.titleLine1, titleLine2: newSlide.titleLine2, subtitle: newSlide.subtitle, order: heroSlides.length, active: true };
    setHeroSlides(prev => [...prev, slide]); setNewSlide({ titleLine1: "", titleLine2: "", subtitle: "", imageUrl: "" }); setHeroUploadedImage(null); setShowHeroForm(false);
    toast.success("슬라이드가 추가되었습니다.");
  };
  const handleUpdateSlide = () => { if (!editingSlide) return; setHeroSlides(prev => prev.map(s => s.id === editingSlide.id ? editingSlide : s)); setEditingSlide(null); setHeroUploadedImage(null); toast.success("수정되었습니다."); };
  const handleDeleteSlide = (id: string) => { setHeroSlides(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }))); toast.success("삭제되었습니다."); };
  const handleToggleSlideActive = (id: string) => { setHeroSlides(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s)); toast.success("변경되었습니다."); };
  const handleMoveSlide = (id: string, dir: "up" | "down") => { const sorted = [...heroSlides].sort((a, b) => a.order - b.order); const idx = sorted.findIndex(s => s.id === id); if (dir === "up" && idx > 0) [sorted[idx - 1], sorted[idx]] = [sorted[idx], sorted[idx - 1]]; else if (dir === "down" && idx < sorted.length - 1) [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]]; setHeroSlides(sorted.map((s, i) => ({ ...s, order: i }))); };

  /* ── Services ── */
  const handleUpdateService = () => {
    if (!editingService) return;
    setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
    setEditingService(null); toast.success("수정되었습니다.");
  };

  /* ── Artists ── */
  const handleArtistImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setArtistUploadedImage(reader.result as string); toast.success("이미지 업로드 완료"); }; reader.readAsDataURL(file); } };
  const handleCreateArtist = () => {
    if (!newArtist.name.trim()) { toast.error("이름을 입력해주세요."); return; }
    const item: ArtistItem = { id: Date.now().toString(), name: newArtist.name, role: newArtist.role, instrument: newArtist.instrument, bio: newArtist.bio, image: artistUploadedImage || "https://images.unsplash.com/photo-1726748236517-2f1bad4b0cb9?w=600", order: artists.length, visible: true };
    setArtists(prev => [...prev, item]); setNewArtist({ name: "", role: "", instrument: "", bio: "" }); setArtistUploadedImage(null); setShowArtistForm(false);
    toast.success("예술인이 등록되었습니다.");
  };
  const handleUpdateArtist = () => {
    if (!editingArtist) return;
    const updated = { ...editingArtist, image: artistUploadedImage || editingArtist.image };
    setArtists(prev => prev.map(a => a.id === updated.id ? updated : a));
    setEditingArtist(null); setArtistUploadedImage(null); setShowArtistForm(false);
    toast.success("수정되었습니다.");
  };
  const handleDeleteArtist = (id: string) => { setArtists(prev => prev.filter(a => a.id !== id).map((a, i) => ({ ...a, order: i }))); toast.success("삭제되었습니다."); };
  const handleToggleArtistVisible = (id: string) => { setArtists(prev => prev.map(a => a.id === id ? { ...a, visible: a.visible === false ? true : false } : a)); };
  const handleMoveArtist = (id: string, dir: "up" | "down") => { const sorted = [...artists].sort((a, b) => a.order - b.order); const idx = sorted.findIndex(a => a.id === id); if (dir === "up" && idx > 0) [sorted[idx - 1], sorted[idx]] = [sorted[idx], sorted[idx - 1]]; else if (dir === "down" && idx < sorted.length - 1) [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]]; setArtists(sorted.map((a, i) => ({ ...a, order: i }))); };

  /* ── Awards ── */
  const handleCreateAward = () => {
    if (!newAward.title.trim()) { toast.error("수상/선정 이름을 입력해주세요."); return; }
    const item: AwardItem = { id: Date.now().toString(), year: newAward.year, title: newAward.title, organizer: newAward.organizer, desc: newAward.desc, order: awards.length, visible: true };
    setAwards(prev => [...prev, item]); setNewAward({ year: "2025", title: "", organizer: "", desc: "" }); setShowAwardForm(false);
    toast.success("수상 이력이 추가되었습니다.");
  };
  const handleUpdateAward = () => {
    if (!editingAward) return;
    setAwards(prev => prev.map(a => a.id === editingAward.id ? editingAward : a));
    setEditingAward(null); setShowAwardForm(false);
    toast.success("수정되었습니다.");
  };
  const handleDeleteAward = (id: string) => { setAwards(prev => prev.filter(a => a.id !== id).map((a, i) => ({ ...a, order: i }))); toast.success("삭제되었습니다."); };
  const handleToggleAwardVisible = (id: string) => { setAwards(prev => prev.map(a => a.id === id ? { ...a, visible: a.visible === false ? true : false } : a)); };
  const handleMoveAward = (id: string, dir: "up" | "down") => { const sorted = [...awards].sort((a, b) => a.order - b.order); const idx = sorted.findIndex(a => a.id === id); if (dir === "up" && idx > 0) [sorted[idx - 1], sorted[idx]] = [sorted[idx], sorted[idx - 1]]; else if (dir === "down" && idx < sorted.length - 1) [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]]; setAwards(sorted.map((a, i) => ({ ...a, order: i }))); };

  /* ── Current Projects ── */
  const handleCpImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setCpUploadedImage(reader.result as string); toast.success("이미지 업로드 완료"); }; reader.readAsDataURL(file); } };
  const handleCreateCp = () => {
    if (!newCp.title.trim()) { toast.error("프로젝트 제목을 입력해주세요."); return; }
    if (!newCp.reservationLink.trim()) { toast.error("예약 링크를 입력해주세요."); return; }
    const item: CurrentProject = { id: Date.now().toString(), title: newCp.title, image: cpUploadedImage || "https://images.unsplash.com/photo-1773270834685-e6a4372874be?w=600", reservationLink: newCp.reservationLink, description: newCp.description, date: newCp.performanceDate, performanceDate: newCp.performanceDate, performanceDay: newCp.performanceDay, performanceTime: newCp.performanceTime, active: true, order: currentProjects.length };
    setCurrentProjects(prev => [...prev, item]); setNewCp({ title: "", reservationLink: "", description: "", date: "", performanceDate: "", performanceDay: "", performanceTime: "" }); setCpUploadedImage(null); setShowCpForm(false);
    toast.success("현재 진행 중인 프로젝트가 추가되었습니다.");
  };
  const handleUpdateCp = () => {
    if (!editingCp) return;
    const updated = { ...editingCp, image: cpUploadedImage || editingCp.image };
    setCurrentProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingCp(null); setCpUploadedImage(null); setShowCpForm(false);
    toast.success("수정되었습니다.");
  };
  const handleDeleteCp = (id: string) => { setCurrentProjects(prev => prev.filter(p => p.id !== id).map((p, i) => ({ ...p, order: i }))); toast.success("삭제되었습니다."); };
  const handleToggleCpActive = (id: string) => { setCurrentProjects(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p)); toast.success("변경되었습니다."); };
  const handleMoveCp = (id: string, dir: "up" | "down") => { const sorted = [...currentProjects].sort((a, b) => a.order - b.order); const idx = sorted.findIndex(p => p.id === id); if (dir === "up" && idx > 0) [sorted[idx - 1], sorted[idx]] = [sorted[idx], sorted[idx - 1]]; else if (dir === "down" && idx < sorted.length - 1) [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]]; setCurrentProjects(sorted.map((p, i) => ({ ...p, order: i }))); };

  const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
    { key: "hero", label: "히어로 관리", icon: Layers },
    { key: "about", label: "소개 관리", icon: Type },
    { key: "artists", label: "예술인 관리", icon: Users },
    { key: "currentprojects", label: "진행 중 프로젝트", icon: CalendarDays },
    { key: "companyinfo", label: "회사정보", icon: Monitor },
    { key: "portfolio", label: "포트폴리오", icon: Image },
    { key: "posts", label: "뉴스 관리", icon: FileText },
    { key: "services", label: "서비스 관리", icon: Briefcase },
    { key: "awards", label: "수상 이력", icon: TrendingUp },
    { key: "inquiries", label: "문의 관리", icon: MessageSquare, badge: inquiries.filter(i => !i.read).length || undefined },
    { key: "instagram", label: "인스타그램", icon: Instagram },
    { key: "logos", label: "로고 관리", icon: ImageIcon },
    { key: "settings", label: "설정", icon: Settings },
  ];

  const sortedSlides = [...heroSlides].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-black flex">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      <input ref={heroFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
      <input ref={companyImgRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setCompanyImageUploaded(reader.result as string); toast.success("이미지 업로드 완료"); }; reader.readAsDataURL(file); } }} />
      <input ref={artistImgRef} type="file" accept="image/*" className="hidden" onChange={handleArtistImageUpload} />
      <input ref={cpImgRef} type="file" accept="image/*" className="hidden" onChange={handleCpImageUpload} />

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a] border-b border-white/[0.06] flex items-center justify-between px-4 z-40">
        <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="text-white/60 hover:text-white cursor-pointer p-1"><Layers size={20} /></button>
        <span className="text-white tracking-[0.2em]" style={{ fontSize: "12px", fontWeight: 700 }}>ADMIN</span>
        <Link to="/" className="text-white/40 hover:text-white/70"><ArrowLeft size={18} /></Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`
        bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col transition-all duration-300 fixed h-full z-50
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        w-60 md:${sidebarCollapsed ? "w-[72px]" : "w-60"}
      `} style={{ width: typeof window !== "undefined" && window.innerWidth >= 768 ? (sidebarCollapsed ? 72 : 240) : 240 }}>
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/[0.06]">
          <span className="text-white tracking-[0.2em]" style={{ fontSize: "14px", fontWeight: 700 }}>{sidebarCollapsed ? "A" : "ADMIN"}</span>
          <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden text-white/30 hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-300 cursor-pointer relative ${activeTab === tab.key ? "bg-white/[0.06] text-white" : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"}`}
              style={{ fontSize: "13px", fontWeight: activeTab === tab.key ? 500 : 400 }}>
              <tab.icon size={18} />
              <span className={`${sidebarCollapsed ? "hidden md:hidden" : ""}`}>{tab.label}</span>
              {tab.badge && tab.badge > 0 && <span className="ml-auto bg-red-500/80 text-white px-1.5 py-0.5 min-w-[18px] text-center" style={{ fontSize: "9px" }}>{tab.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-white/30 hover:text-white/60 hover:bg-white/[0.02] transition-all" style={{ fontSize: "13px" }}><ArrowLeft size={18} /><span>홈으로</span></Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-white/30 hover:text-red-400/70 hover:bg-white/[0.02] transition-all cursor-pointer" style={{ fontSize: "13px" }}><LogOut size={18} /><span>로그아웃</span></button>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden md:flex w-full items-center gap-3 px-3 py-2.5 text-white/30 hover:text-white/60 hover:bg-white/[0.02] transition-all cursor-pointer" style={{ fontSize: "13px" }}>{sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}{!sidebarCollapsed && <span>접기</span>}</button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all duration-300 pt-14 md:pt-0 ${sidebarCollapsed ? "md:ml-[72px]" : "md:ml-60"}`}>
        <div className="p-4 md:p-10 max-w-6xl">

          {/* ═══ DASHBOARD ═══ */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>대시보드</h1>
              <p className="text-white/30 mb-10" style={{ fontSize: "13px" }}>아르플래닛 사이트 현황</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                {[
                  { label: "히어로\n슬라이드", value: heroSlides.filter(s => s.active).length, icon: Layers, sub: `${heroSlides.length}개 중 활성` },
                  { label: "게시글", value: posts.length, icon: FileText, sub: `${posts.filter(p => p.status === "published").length}개 게시됨` },
                  { label: "포트폴리오", value: portfolio.filter(p => p.visible !== false).length, icon: FolderOpen, sub: `${portfolio.length}개 중 활성` },
                  { label: "소속 예술인", value: artists.length, icon: Users, sub: "OUR ARTISTS" },
                  { label: "진행 프로젝트", value: currentProjects.filter(p => p.active).length, icon: CalendarDays, sub: "TICKET" },
                  { label: "수상 이력", value: awards.filter(a => a.visible !== false).length, icon: TrendingUp, sub: `${awards.length}개 중 활성` },
                ].map(stat => (
                  <div key={stat.label} className="p-5 border border-white/[0.06] hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-4"><span className="text-white/30 tracking-[0.1em] whitespace-pre-line" style={{ fontSize: "10px", fontWeight: 500 }}>{stat.label.toUpperCase()}</span><stat.icon size={16} className="text-white/15" /></div>
                    <div className="text-white" style={{ fontSize: "32px", fontWeight: 200 }}>{stat.value}</div>
                    <span className="text-white/20" style={{ fontSize: "11px" }}>{stat.sub}</span>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="border border-white/[0.06] p-6">
                  <div className="flex items-center justify-between mb-6"><h3 className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>최근 게시글</h3><button onClick={() => setActiveTab("posts")} className="text-white/30 hover:text-white/60 transition-colors cursor-pointer" style={{ fontSize: "11px" }}>전체보기</button></div>
                  {posts.slice(0, 4).map(post => (
                    <div key={post.id} className="py-3 border-b border-white/[0.04] last:border-0 flex items-center justify-between">
                      <div className="min-w-0 flex-1 mr-4"><p className="text-white/70 truncate" style={{ fontSize: "13px" }}>{post.title}</p><p className="text-white/20" style={{ fontSize: "11px" }}>{post.date}</p></div>
                      <span className={`shrink-0 px-2 py-0.5 ${post.status === "published" ? "bg-green-500/10 text-green-400/70" : "bg-yellow-500/10 text-yellow-400/70"}`} style={{ fontSize: "10px" }}>{post.status === "published" ? "게시" : "임시"}</span>
                    </div>
                  ))}
                </div>
                <div className="border border-white/[0.06] p-6">
                  <div className="flex items-center justify-between mb-6"><h3 className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>최근 문의</h3><button onClick={() => setActiveTab("inquiries")} className="text-white/30 hover:text-white/60 transition-colors cursor-pointer" style={{ fontSize: "11px" }}>전체보기</button></div>
                  {inquiries.length === 0 ? <p className="text-white/15 py-8 text-center" style={{ fontSize: "13px" }}>아직 접수된 문의가 없습니다.</p> : inquiries.slice(0, 4).map(inq => (
                    <div key={inq.id} className="py-3 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center justify-between"><p className="text-white/70 truncate" style={{ fontSize: "13px" }}>{inq.name} — {inq.phone}</p>{!inq.read && <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />}</div>
                      <p className="text-white/25 truncate mt-1" style={{ fontSize: "11px" }}>{inq.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ HERO ═══ */}
          {activeTab === "hero" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div><h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>히어로 슬라이더 관리</h1><p className="text-white/30" style={{ fontSize: "13px" }}>홈페이지 최상단 풀스크린 슬라이더를 관리합니다.</p></div>
                <button onClick={() => { setShowHeroForm(true); setEditingSlide(null); setHeroUploadedImage(null); setNewSlide({ titleLine1: "", titleLine2: "", subtitle: "", imageUrl: "" }); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer shrink-0 self-start" style={{ fontSize: "13px", fontWeight: 500 }}><Plus size={16} /> 새 슬라이드</button>
              </div>
              {/* Image Guide */}
              <div className="mb-8 border border-white/[0.06] p-6 bg-white/[0.01]">
                <div className="flex items-start gap-4"><Monitor size={20} className="text-white/30 shrink-0 mt-0.5" />
                  <div><h3 className="text-white/70 mb-3" style={{ fontSize: "14px", fontWeight: 500 }}>배경 이미지 가이드</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[{ label: "권장 해상도", value: "1920 x 1080px 이상" }, { label: "비율", value: "16:9 (가로형)" }, { label: "파일 형식", value: "JPG, PNG, WebP" }, { label: "최대 용량", value: "10MB 이하" }].map(g => (
                        <div key={g.label}><span className="text-white/25 tracking-[0.1em] block mb-1" style={{ fontSize: "9px", fontWeight: 500 }}>{g.label.toUpperCase()}</span><span className="text-white/50" style={{ fontSize: "12px" }}>{g.value}</span></div>
                      ))}
                    </div>
                    <p className="text-white/20 mt-3" style={{ fontSize: "11px" }}>풀스크린으로 표시되므로 고해상도 가로 이미지를 권장합니다. 어두운 톤의 사진이 텍스트 가독성에 좋습니다.</p>
                  </div>
                </div>
              </div>
              {/* Hero Form */}
              {(showHeroForm || editingSlide) && (
                <div className="mb-10 border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>{editingSlide ? "슬라이드 수정" : "새 슬라이드 추가"}</h3><button onClick={() => { setShowHeroForm(false); setEditingSlide(null); setHeroUploadedImage(null); }} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>타이틀 라인 1 *</label><input type="text" value={editingSlide ? editingSlide.titleLine1 : newSlide.titleLine1} onChange={e => editingSlide ? setEditingSlide({ ...editingSlide, titleLine1: e.target.value }) : setNewSlide({ ...newSlide, titleLine1: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: CLASSICAL" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>타이틀 라인 2</label><input type="text" value={editingSlide ? editingSlide.titleLine2 : newSlide.titleLine2} onChange={e => editingSlide ? setEditingSlide({ ...editingSlide, titleLine2: e.target.value }) : setNewSlide({ ...newSlide, titleLine2: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: MUSIC" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    </div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>서브타이틀</label><input type="text" value={editingSlide ? editingSlide.subtitle : newSlide.subtitle} onChange={e => editingSlide ? setEditingSlide({ ...editingSlide, subtitle: e.target.value }) : setNewSlide({ ...newSlide, subtitle: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: 청년 예술인들과 함께하는 클래식 음악 단체" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>배경 이미지</label>
                      <div onClick={() => heroFileInputRef.current?.click()} className="border border-dashed border-white/10 hover:border-white/20 p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                        {(heroUploadedImage || (editingSlide && editingSlide.image)) ? (
                          <div className="relative w-full"><img src={heroUploadedImage || editingSlide?.image} alt="" className="w-full max-h-48 object-cover" /><button onClick={e => { e.stopPropagation(); setHeroUploadedImage(null); if (editingSlide) setEditingSlide({ ...editingSlide, image: "" }); }} className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black flex items-center justify-center cursor-pointer"><X size={12} /></button></div>
                        ) : (<><Upload size={20} className="text-white/15 group-hover:text-white/30 mb-3" /><p className="text-white/20 group-hover:text-white/40" style={{ fontSize: "13px" }}>클릭하여 배경 이미지를 업로드하세요</p></>)}
                      </div>
                      <div className="mt-3"><label className="text-white/20 block mb-1" style={{ fontSize: "10px" }}>또는 이미지 URL 직접 입력</label><input type="url" value={editingSlide ? editingSlide.image : newSlide.imageUrl} onChange={e => editingSlide ? setEditingSlide({ ...editingSlide, image: e.target.value }) : setNewSlide({ ...newSlide, imageUrl: e.target.value })} className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/20 py-2 text-white/50 placeholder:text-white/10 focus:outline-none" placeholder="https://..." style={{ fontSize: "12px", fontWeight: 300 }} /></div>
                    </div>
                    {/* Preview */}
                    <div><label className="text-white/30 tracking-[0.15em] block mb-3" style={{ fontSize: "10px", fontWeight: 500 }}>미리보기</label>
                      <div className="relative aspect-[16/7] overflow-hidden border border-white/[0.06] bg-black">
                        {(heroUploadedImage || editingSlide?.image || newSlide.imageUrl) && <img src={heroUploadedImage || editingSlide?.image || newSlide.imageUrl} alt="" className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="absolute bottom-4 left-6"><p className="text-white/50 mb-2 tracking-[0.3em]" style={{ fontSize: "8px" }}>{editingSlide ? editingSlide.subtitle : newSlide.subtitle || "서브타이틀"}</p><p className="text-white tracking-[-0.03em]" style={{ fontSize: "clamp(1.2rem, 4vw, 2.5rem)", fontWeight: 700, lineHeight: 0.95 }}>{editingSlide ? editingSlide.titleLine1 : newSlide.titleLine1 || "TITLE 1"}</p><p className="text-white/30 tracking-[-0.03em]" style={{ fontSize: "clamp(1.2rem, 4vw, 2.5rem)", fontWeight: 700, lineHeight: 0.95 }}>{editingSlide ? editingSlide.titleLine2 : newSlide.titleLine2 || "TITLE 2"}</p></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4"><button onClick={editingSlide ? handleUpdateSlide : handleCreateSlide} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> {editingSlide ? "수정 완료" : "추가"}</button><button onClick={() => { setShowHeroForm(false); setEditingSlide(null); setHeroUploadedImage(null); }} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button></div>
                  </div>
                </div>
              )}
              {/* Slide List */}
              <div className="space-y-3">
                {sortedSlides.map((slide, idx) => (
                  <div key={slide.id} className={`border ${slide.active ? "border-white/[0.08]" : "border-white/[0.04] opacity-50"} flex flex-col md:flex-row overflow-hidden transition-opacity`}>
                    <div className="w-full md:w-64 aspect-[16/9] md:aspect-auto shrink-0 relative overflow-hidden"><ImageWithFallback src={slide.image} alt="" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40" /><div className="absolute bottom-3 left-4"><p className="text-white tracking-[-0.02em]" style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1 }}>{slide.titleLine1}</p><p className="text-white/40 tracking-[-0.02em]" style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1 }}>{slide.titleLine2}</p></div>{!slide.active && <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500/20 text-red-400/80" style={{ fontSize: "9px" }}>비활성</div>}</div>
                    <div className="flex-1 p-5 flex flex-col justify-between"><div><div className="flex items-center gap-3 mb-2"><span className="text-white/25 tracking-[0.15em]" style={{ fontSize: "9px", fontWeight: 500 }}>슬라이드 {idx + 1}</span><span className={`px-2 py-0.5 ${slide.active ? "bg-green-500/10 text-green-400/70" : "bg-white/5 text-white/25"}`} style={{ fontSize: "9px" }}>{slide.active ? "활성" : "비활성"}</span></div><p className="text-white/50 mb-1" style={{ fontSize: "12px" }}>{slide.subtitle}</p></div>
                      <div className="flex items-center gap-1 mt-3">
                        <button onClick={() => handleMoveSlide(slide.id, "up")} disabled={idx === 0} className="p-2 text-white/20 hover:text-white/60 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"><ArrowUp size={14} /></button>
                        <button onClick={() => handleMoveSlide(slide.id, "down")} disabled={idx === sortedSlides.length - 1} className="p-2 text-white/20 hover:text-white/60 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"><ArrowDown size={14} /></button>
                        <div className="w-px h-4 bg-white/[0.06] mx-1" />
                        <button onClick={() => handleToggleSlideActive(slide.id)} className="p-2 text-white/20 hover:text-white/60 cursor-pointer">{slide.active ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        <button onClick={() => { setEditingSlide(slide); setHeroUploadedImage(null); setShowHeroForm(false); }} className="p-2 text-white/20 hover:text-white/60 cursor-pointer"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 text-white/20 hover:text-red-400/70 cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {sortedSlides.length === 0 && <div className="border border-white/[0.06] p-16 text-center"><Layers size={32} className="text-white/10 mx-auto mb-4" /><p className="text-white/20" style={{ fontSize: "14px" }}>슬라이드가 없습니다.</p></div>}
            </div>
          )}

          {/* ═══ POSTS (뉴스 관리) ═══ */}
          {activeTab === "posts" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div className="min-w-0"><h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>뉴스 관리</h1><p className="text-white/30" style={{ fontSize: "13px" }}>게시글을 작성하고, 외부 링크를 연결할 수 있습니다.</p></div>
                <button onClick={() => { setShowEditor(true); setEditingPost(null); setUploadedImage(null); setNewPost({ title: "", category: "공연", content: "", link: "" }); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Plus size={16} /> 새 글 작성</button>
              </div>
              {(showEditor || editingPost) && (
                <div className="mb-10 border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>{editingPost ? "글 수정" : "새 글 작성"}</h3><button onClick={() => { setShowEditor(false); setEditingPost(null); }} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>제목 *</label><input type="text" value={editingPost ? editingPost.title : newPost.title} onChange={e => editingPost ? setEditingPost({ ...editingPost, title: e.target.value }) : setNewPost({ ...newPost, title: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="글 제목을 입력하세요" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>카테고리</label><select value={editingPost ? editingPost.category : newPost.category} onChange={e => editingPost ? setEditingPost({ ...editingPost, category: e.target.value }) : setNewPost({ ...newPost, category: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none appearance-none cursor-pointer" style={{ fontSize: "14px", fontWeight: 300 }}>{["공연", "소식", "전시", "모집", "파트너십", "공지"].map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}</select></div>
                    </div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>내용</label><textarea value={editingPost ? editingPost.content : newPost.content} onChange={e => editingPost ? setEditingPost({ ...editingPost, content: e.target.value }) : setNewPost({ ...newPost, content: e.target.value })} rows={6} className="w-full bg-transparent border border-white/10 focus:border-white/20 p-4 text-white placeholder:text-white/15 focus:outline-none resize-none" placeholder="내용을 입력하세요..." style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.8 }} /></div>
                    {/* External Link */}
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>외부 링크 (선택)</label>
                      <div className="flex items-center gap-3">
                        <Link2 size={14} className="text-white/15 shrink-0" />
                        <input type="url" value={editingPost ? (editingPost.link || "") : newPost.link} onChange={e => editingPost ? setEditingPost({ ...editingPost, link: e.target.value }) : setNewPost({ ...newPost, link: e.target.value })} className="flex-1 bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="https://... (블로그, 기사 등 외부 URL)" style={{ fontSize: "14px", fontWeight: 300 }} />
                      </div>
                      <p className="text-white/15 mt-1" style={{ fontSize: "11px" }}>링크를 입력하면 뉴스를 클릭 시 해당 페이지로 이동합니다.</p>
                    </div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>이미지</label>
                      <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-white/10 hover:border-white/20 p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                        {uploadedImage ? (<div className="relative"><img src={uploadedImage} alt="" className="max-h-40 object-contain" /><button onClick={e => { e.stopPropagation(); setUploadedImage(null); }} className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black flex items-center justify-center cursor-pointer"><X size={12} /></button></div>
                        ) : (<><Upload size={20} className="text-white/15 group-hover:text-white/30 mb-3" /><p className="text-white/20 group-hover:text-white/40" style={{ fontSize: "13px" }}>클릭하여 이미지를 업로드하세요</p></>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4"><button onClick={editingPost ? handleUpdatePost : handleCreatePost} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> {editingPost ? "수정 완료" : "저장"}</button><button onClick={() => { setShowEditor(false); setEditingPost(null); }} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button></div>
                  </div>
                </div>
              )}
              <div className="border border-white/[0.06]">
                <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_100px_100px_50px_70px_100px] gap-4 px-6 py-3 border-b border-white/[0.06]">
                  <span className="text-white/25 tracking-[0.15em]" style={{ fontSize: "10px", fontWeight: 500 }}>제목</span>
                  <span className="text-white/25 tracking-[0.15em] hidden md:block" style={{ fontSize: "10px", fontWeight: 500 }}>카테고리</span>
                  <span className="text-white/25 tracking-[0.15em] hidden md:block" style={{ fontSize: "10px", fontWeight: 500 }}>날짜</span>
                  <span className="text-white/25 tracking-[0.15em] hidden md:block" style={{ fontSize: "10px", fontWeight: 500 }}>링크</span>
                  <span className="text-white/25 tracking-[0.15em]" style={{ fontSize: "10px", fontWeight: 500 }}>상태</span>
                  <span className="text-white/25 tracking-[0.15em] text-right" style={{ fontSize: "10px", fontWeight: 500 }}>관리</span>
                </div>
                {posts.map(post => (
                  <div key={post.id} className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_100px_100px_50px_70px_100px] gap-4 px-6 py-4 border-b border-white/[0.04] last:border-0 items-center hover:bg-white/[0.01] transition-colors">
                    <span className="text-white/70 truncate" style={{ fontSize: "13px" }}>{post.title}</span>
                    <span className="text-white/25 hidden md:block" style={{ fontSize: "12px" }}>{post.category}</span>
                    <span className="text-white/20 tabular-nums hidden md:block" style={{ fontSize: "12px" }}>{post.date}</span>
                    <span className="hidden md:flex items-center">{post.link && post.link.trim() ? <ExternalLink size={12} className="text-blue-400/50" /> : <span className="text-white/10" style={{ fontSize: "10px" }}>—</span>}</span>
                    <span className={`px-2 py-0.5 text-center ${post.status === "published" ? "bg-green-500/10 text-green-400/70" : "bg-yellow-500/10 text-yellow-400/70"}`} style={{ fontSize: "10px" }}>{post.status === "published" ? "게시" : "임시"}</span>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleTogglePublish(post.id)} className="p-2 text-white/20 hover:text-white/60 cursor-pointer">{post.status === "published" ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                      <button onClick={() => { setEditingPost(post); setUploadedImage(post.image || null); }} className="p-2 text-white/20 hover:text-white/60 cursor-pointer"><Edit3 size={14} /></button>
                      <button onClick={() => handleDeletePost(post.id)} className="p-2 text-white/20 hover:text-red-400/70 cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ PORTFOLIO ═══ */}
          {activeTab === "portfolio" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div><h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>포트폴리오</h1><p className="text-white/30" style={{ fontSize: "13px" }}>프로젝트를 클릭하면 블로그형 상세 페이지로 이동합니다.</p></div>
                <button onClick={() => { setShowPortfolioForm(!showPortfolioForm); setEditingPortfolio(null); setUploadedImage(null); setBlogBlocks([]); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer shrink-0 self-start" style={{ fontSize: "13px", fontWeight: 500 }}><Plus size={16} /> 새 프로젝트</button>
              </div>

              {(showPortfolioForm || editingPortfolio) && (
                <div className="mb-10 border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>{editingPortfolio ? "프로젝트 수정" : "새 프로젝트 추가"}</h3><button onClick={() => { setShowPortfolioForm(false); setEditingPortfolio(null); setBlogBlocks([]); }} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>프로젝트명 *</label><input type="text" value={editingPortfolio ? editingPortfolio.title : newPortfolio.title} onChange={e => editingPortfolio ? setEditingPortfolio({ ...editingPortfolio, title: e.target.value }) : setNewPortfolio({ ...newPortfolio, title: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="공연/전시 제목" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>장소/파트너</label><input type="text" value={editingPortfolio ? editingPortfolio.client : newPortfolio.client} onChange={e => editingPortfolio ? setEditingPortfolio({ ...editingPortfolio, client: e.target.value }) : setNewPortfolio({ ...newPortfolio, client: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="공연장 또는 협업 파트너" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>카테고리</label><select value={editingPortfolio ? editingPortfolio.category : newPortfolio.category} onChange={e => editingPortfolio ? setEditingPortfolio({ ...editingPortfolio, category: e.target.value }) : setNewPortfolio({ ...newPortfolio, category: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none appearance-none cursor-pointer" style={{ fontSize: "14px", fontWeight: 300 }}>{["정기공연", "독주회", "조인트리사이틀", "초청연주", "협업공연", "전시", "티켓"].map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}</select></div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>연도</label><input type="text" value={editingPortfolio ? editingPortfolio.year : newPortfolio.year} onChange={e => editingPortfolio ? setEditingPortfolio({ ...editingPortfolio, year: e.target.value }) : setNewPortfolio({ ...newPortfolio, year: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                  </div>
                  <div className="mb-6"><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>설명</label><input type="text" value={editingPortfolio ? (editingPortfolio.desc || "") : newPortfolio.desc} onChange={e => editingPortfolio ? setEditingPortfolio({ ...editingPortfolio, desc: e.target.value }) : setNewPortfolio({ ...newPortfolio, desc: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="간단한 설명" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                  <div className="mb-6">
                    <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>예약/티켓 링크 (선택)</label>
                    <div className="flex items-center gap-3"><Ticket size={14} className="text-white/15 shrink-0" /><input type="url" value={editingPortfolio ? (editingPortfolio.reservationLink || "") : newPortfolio.reservationLink} onChange={e => editingPortfolio ? setEditingPortfolio({ ...editingPortfolio, reservationLink: e.target.value }) : setNewPortfolio({ ...newPortfolio, reservationLink: e.target.value })} className="flex-1 bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="https://... (예매/예약 페이지 URL)" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <p className="text-white/15 mt-1" style={{ fontSize: "11px" }}>링크를 입력하면 프로젝트 클릭 시 상세 페이지 대신 예약 페이지로 이동합니다.</p>
                  </div>
                  <div className="mb-6"><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>대표 이미지</label>
                    <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-white/10 hover:border-white/20 p-8 flex flex-col items-center cursor-pointer transition-colors group">
                      {uploadedImage ? (<div className="relative"><img src={uploadedImage} alt="" className="max-h-40 object-contain" /><button onClick={e => { e.stopPropagation(); setUploadedImage(null); }} className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black flex items-center justify-center cursor-pointer"><X size={12} /></button></div>
                      ) : (<><Upload size={20} className="text-white/15 group-hover:text-white/30 mb-3" /><p className="text-white/20 group-hover:text-white/40" style={{ fontSize: "13px" }}>이미지 업로드</p></>)}
                    </div>
                  </div>
                  {/* Blog Content Editor */}
                  <div className="mb-6 border-t border-white/[0.04] pt-6">
                    <BlogEditor blocks={blogBlocks} onChange={setBlogBlocks} />
                  </div>
                  <div className="flex gap-3"><button onClick={editingPortfolio ? handleUpdatePortfolio : handleCreatePortfolio} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Check size={14} /> {editingPortfolio ? "수정 완료" : "추가"}</button><button onClick={() => { setShowPortfolioForm(false); setEditingPortfolio(null); setBlogBlocks([]); }} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button></div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.map(item => (
                  <div key={item.id} className={`border group overflow-hidden relative ${item.visible === false ? 'border-white/[0.03] opacity-50' : 'border-white/[0.06]'}`}>
                    {item.visible === false && <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-red-500/20 text-red-400/80 tracking-[0.1em]" style={{ fontSize: "9px", fontWeight: 500 }}>비활성</div>}
                    <div className="aspect-[16/10] overflow-hidden relative"><ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" /></div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white/25 tracking-[0.1em]" style={{ fontSize: "10px" }}>{item.category}</span>
                        <span className="text-white/15" style={{ fontSize: "10px" }}>{item.year}</span>
                        {item.blogContent && item.blogContent.length > 0 && <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400/60" style={{ fontSize: "8px" }}>블로그</span>}
                        {item.reservationLink && item.reservationLink.trim() && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400/60" style={{ fontSize: "8px" }}>티켓</span>}
                      </div>
                      <h4 className="text-white/80 mb-1" style={{ fontSize: "14px", fontWeight: 500 }}>{item.title}</h4>
                      <p className="text-white/25 mb-4" style={{ fontSize: "12px" }}>{item.client}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPortfolio(item); setUploadedImage(item.image); setBlogBlocks(item.blogContent || []); setShowPortfolioForm(false); }} className="flex-1 py-2 border border-white/[0.06] text-white/30 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "11px" }}><Edit3 size={12} className="inline mr-1" /> 수정</button>
                        <button onClick={() => handleTogglePortfolioVisible(item.id)} className={`py-2 px-4 border transition-all cursor-pointer ${item.visible === false ? 'border-green-500/20 text-green-400/50 hover:text-green-400 hover:border-green-400/30' : 'border-white/[0.06] text-white/30 hover:text-amber-400 hover:border-amber-400/30'}`} title={item.visible === false ? "활성화" : "비활성화"}>{item.visible === false ? <Eye size={12} /> : <EyeOff size={12} />}</button>
                        <button onClick={() => handleDeletePortfolio(item.id)} className="py-2 px-4 border border-white/[0.06] text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ SERVICES (서비스 관리) ═══ */}
          {activeTab === "services" && (
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>서비스 관리 (BUSINESS AREA)</h1>
              <p className="text-white/30 mb-10" style={{ fontSize: "13px" }}>홈페이지 BUSINESS AREA 섹션의 서비스 항목을 관리합니다. 외부 링크를 연결하면 클릭 시 해당 페이지로 이동합니다.</p>

              {editingService && (
                <div className="mb-10 border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>서비스 수정</h3><button onClick={() => setEditingService(null)} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>서비스명</label><input type="text" value={editingService.title} onChange={e => setEditingService({ ...editingService, title: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>상태</label><select value={editingService.status} onChange={e => setEditingService({ ...editingService, status: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none appearance-none cursor-pointer" style={{ fontSize: "14px", fontWeight: 300 }}>{["운영중", "준비중", "종료"].map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}</select></div>
                    </div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>설명</label><textarea value={editingService.desc} onChange={e => setEditingService({ ...editingService, desc: e.target.value })} rows={3} className="w-full bg-transparent border border-white/10 focus:border-white/20 p-4 text-white focus:outline-none resize-none" style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.8 }} /></div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>외부 링크 (선택)</label>
                      <div className="flex items-center gap-3"><Link2 size={14} className="text-white/15 shrink-0" /><input type="url" value={editingService.link || ""} onChange={e => setEditingService({ ...editingService, link: e.target.value })} className="flex-1 bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="https://... (블로그, 홈페이지 등)" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <p className="text-white/15 mt-1" style={{ fontSize: "11px" }}>링크를 입력하면 홈페이지에서 클릭 시 해당 페이지로 이동합니다.</p>
                    </div>
                    <div className="flex gap-3"><button onClick={handleUpdateService} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> 수정 완료</button><button onClick={() => setEditingService(null)} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button></div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {services.map(service => (
                  <div key={service.id} className="border border-white/[0.06] p-6 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4 md:w-16 shrink-0"><span className="text-white/20 tabular-nums" style={{ fontSize: "14px" }}>{service.num}</span></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white/80" style={{ fontSize: "15px", fontWeight: 500 }}>{service.title}</h4>
                        <span className={`px-2 py-0.5 tracking-[0.1em] ${service.status === "운영중" ? "bg-green-500/10 text-green-400/60" : service.status === "준비중" ? "bg-yellow-500/10 text-yellow-400/60" : "bg-white/5 text-white/20"}`} style={{ fontSize: "9px", fontWeight: 500 }}>{service.status}</span>
                        {service.link && service.link.trim() && <ExternalLink size={12} className="text-blue-400/40" />}
                      </div>
                      <p className="text-white/30 truncate" style={{ fontSize: "12px" }}>{service.desc}</p>
                      {service.link && service.link.trim() && <p className="text-blue-400/30 truncate mt-1" style={{ fontSize: "11px" }}>{service.link}</p>}
                    </div>
                    <button onClick={() => setEditingService(service)} className="shrink-0 px-4 py-2 border border-white/[0.06] text-white/30 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "11px" }}><Edit3 size={12} className="inline mr-1" /> 수정</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ COMPANY INFO ═══ */}
          {activeTab === "companyinfo" && (
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>회사 정보 관리</h1>
              <p className="text-white/30 mb-10" style={{ fontSize: "13px" }}>홈페이지 COMPANY INFO 섹션의 텍스트와 이미지를 관리합니다.</p>

              {/* Image Guide */}
              <div className="mb-8 border border-white/[0.06] p-6 bg-white/[0.01]">
                <div className="flex items-start gap-4"><Monitor size={20} className="text-white/30 shrink-0 mt-0.5" />
                  <div><h3 className="text-white/70 mb-3" style={{ fontSize: "14px", fontWeight: 500 }}>회사 이미지 가이드</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[{ label: "권장 해상도", value: "960 x 640px 이상" }, { label: "비율", value: "3:2 (가로형)" }, { label: "파일 형식", value: "JPG, PNG, WebP" }, { label: "최대 용량", value: "5MB 이하" }].map(g => (
                        <div key={g.label}><span className="text-white/25 tracking-[0.1em] block mb-1" style={{ fontSize: "9px", fontWeight: 500 }}>{g.label.toUpperCase()}</span><span className="text-white/50" style={{ fontSize: "12px" }}>{g.value}</span></div>
                      ))}
                    </div>
                    <p className="text-white/20 mt-3" style={{ fontSize: "11px" }}>홈페이지에서 자동으로 크기가 맞춰집니다. 공연장이나 단체 사진 등 어두운 톤의 이미지를 권장합니다.</p>
                  </div>
                </div>
              </div>

              {!editingCompanyInfo ? (
                <div>
                  {/* Current info display */}
                  <div className="border border-white/[0.06] p-6 md:p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>현재 정보</h3>
                      <button onClick={() => { setEditingCompanyInfo({ ...companyInfo }); setCompanyImageUploaded(null); }} className="flex items-center gap-2 px-4 py-2 border border-white/[0.06] text-white/30 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "11px" }}><Edit3 size={12} /> 수정</button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        {[{ label: "단체명", value: companyInfo.name }, { label: "설립 연월", value: companyInfo.foundedDate }, { label: "대표이사", value: companyInfo.ceo }, { label: "사무실 위치", value: companyInfo.address }].map(info => (
                          <div key={info.label} className="flex border-b border-white/[0.04] pb-3">
                            <span className="text-white/25 w-24 shrink-0" style={{ fontSize: "11px" }}>{info.label}</span>
                            <span className="text-white/60" style={{ fontSize: "13px", fontWeight: 300 }}>{info.value}</span>
                          </div>
                        ))}
                        <div className="mt-4">
                          <p className="text-white/25 mb-2" style={{ fontSize: "11px" }}>사업영역</p>
                          <ul className="space-y-1 text-white/40" style={{ fontSize: "12px", fontWeight: 300 }}>
                            {companyInfo.businessAreas.map((area, i) => <li key={i}>· {area}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <ImageWithFallback src={companyInfo.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute bottom-3 left-3"><p className="text-white/50" style={{ fontSize: "11px" }}>{companyInfo.imageCaption}</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>회사 정보 수정</h3><button onClick={() => { setEditingCompanyInfo(null); setCompanyImageUploaded(null); }} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>단체명</label><input type="text" value={editingCompanyInfo.name} onChange={e => setEditingCompanyInfo({ ...editingCompanyInfo, name: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>설립 연월</label><input type="text" value={editingCompanyInfo.foundedDate} onChange={e => setEditingCompanyInfo({ ...editingCompanyInfo, foundedDate: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>대표이사</label><input type="text" value={editingCompanyInfo.ceo} onChange={e => setEditingCompanyInfo({ ...editingCompanyInfo, ceo: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>사무실 위치</label><input type="text" value={editingCompanyInfo.address} onChange={e => setEditingCompanyInfo({ ...editingCompanyInfo, address: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    </div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>사업영역 (줄바꿈으로 구분)</label>
                      <textarea value={editingCompanyInfo.businessAreas.join("\n")} onChange={e => setEditingCompanyInfo({ ...editingCompanyInfo, businessAreas: e.target.value.split("\n").filter(s => s.trim()) })} rows={4} className="w-full bg-transparent border border-white/10 focus:border-white/20 p-4 text-white/70 focus:outline-none resize-none" style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.8 }} />
                    </div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>이미지</label>
                      <div onClick={() => companyImgRef.current?.click()} className="border border-dashed border-white/10 hover:border-white/20 p-8 flex flex-col items-center cursor-pointer transition-colors group">
                        {(companyImageUploaded || editingCompanyInfo.image) ? (
                          <div className="relative w-full aspect-[3/2] overflow-hidden">
                            <img src={companyImageUploaded || editingCompanyInfo.image} alt="" className="w-full h-full object-cover" />
                            <button onClick={e => { e.stopPropagation(); setCompanyImageUploaded(null); setEditingCompanyInfo({ ...editingCompanyInfo, image: "" }); }} className="absolute top-2 right-2 w-6 h-6 bg-white text-black flex items-center justify-center cursor-pointer"><X size={12} /></button>
                          </div>
                        ) : (<><Upload size={20} className="text-white/15 group-hover:text-white/30 mb-3" /><p className="text-white/20 group-hover:text-white/40" style={{ fontSize: "13px" }}>클릭하여 이미지를 업로드하세요</p></>)}
                      </div>
                      <div className="mt-3"><label className="text-white/20 block mb-1" style={{ fontSize: "10px" }}>또는 이미지 URL 직접 입력</label><input type="url" value={editingCompanyInfo.image} onChange={e => setEditingCompanyInfo({ ...editingCompanyInfo, image: e.target.value })} className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/20 py-2 text-white/50 placeholder:text-white/10 focus:outline-none" placeholder="https://..." style={{ fontSize: "12px", fontWeight: 300 }} /></div>
                    </div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>이미지 캡션</label><input type="text" value={editingCompanyInfo.imageCaption} onChange={e => setEditingCompanyInfo({ ...editingCompanyInfo, imageCaption: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none" placeholder="예: Gwangju, South Korea — Since 2024" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={() => { const img = companyImageUploaded || editingCompanyInfo.image; setCompanyInfo({ ...editingCompanyInfo, image: img }); setEditingCompanyInfo(null); setCompanyImageUploaded(null); toast.success("회사 정보가 수정되었습니다."); }} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> 저장</button>
                      <button onClick={() => { setEditingCompanyInfo(null); setCompanyImageUploaded(null); }} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ CURRENT PROJECTS ═══ */}
          {activeTab === "currentprojects" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div className="min-w-0"><h1 className="text-white mb-2" style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 600 }}>진행 중인 공연 바로 예매하기</h1><p className="text-white/30" style={{ fontSize: "13px" }}>홈페이지 TICKET 섹션에 표시됩니다. 포스터 이미지와 예약 링크를 설정하세요.</p></div>
                <button onClick={() => { setShowCpForm(true); setEditingCp(null); setCpUploadedImage(null); setNewCp({ title: "", reservationLink: "", description: "", date: "", performanceDate: "", performanceDay: "", performanceTime: "" }); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Plus size={16} /> 프로젝트 추가</button>
              </div>

              {(showCpForm || editingCp) && (
                <div className="mb-10 border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>{editingCp ? "프로젝트 수정" : "새 프로젝트 추가"}</h3><button onClick={() => { setShowCpForm(false); setEditingCp(null); setCpUploadedImage(null); }} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="space-y-6">
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>프로젝트명 *</label><input type="text" value={editingCp ? editingCp.title : newCp.title} onChange={e => editingCp ? setEditingCp({ ...editingCp, title: e.target.value }) : setNewCp({ ...newCp, title: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="공연/프로젝트 제목" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>공연 날짜</label><input type="text" value={editingCp ? (editingCp.performanceDate || "") : newCp.performanceDate} onChange={e => editingCp ? setEditingCp({ ...editingCp, performanceDate: e.target.value }) : setNewCp({ ...newCp, performanceDate: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: 2025년 6월 1일" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>요일</label><input type="text" value={editingCp ? (editingCp.performanceDay || "") : newCp.performanceDay} onChange={e => editingCp ? setEditingCp({ ...editingCp, performanceDay: e.target.value }) : setNewCp({ ...newCp, performanceDay: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: 일요일" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>공연 시간</label><input type="text" value={editingCp ? (editingCp.performanceTime || "") : newCp.performanceTime} onChange={e => editingCp ? setEditingCp({ ...editingCp, performanceTime: e.target.value }) : setNewCp({ ...newCp, performanceTime: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: 오후 3시" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    </div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>예약 링크 *</label>
                      <div className="flex items-center gap-3"><Ticket size={14} className="text-white/15 shrink-0" /><input type="url" value={editingCp ? editingCp.reservationLink : newCp.reservationLink} onChange={e => editingCp ? setEditingCp({ ...editingCp, reservationLink: e.target.value }) : setNewCp({ ...newCp, reservationLink: e.target.value })} className="flex-1 bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="https://... (예매/예약 페이지 URL)" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <p className="text-white/15 mt-1" style={{ fontSize: "11px" }}>클릭 시 이 링크로 이동하여 예약할 수 있습니다.</p>
                    </div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>설명</label><input type="text" value={editingCp ? (editingCp.description || "") : newCp.description} onChange={e => editingCp ? setEditingCp({ ...editingCp, description: e.target.value }) : setNewCp({ ...newCp, description: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="간단한 설명" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>포스터 이미지</label>
                      <div onClick={() => cpImgRef.current?.click()} className="border border-dashed border-white/10 hover:border-white/20 p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                        {(cpUploadedImage || (editingCp && editingCp.image)) ? (
                          <div className="relative w-full max-w-[200px]">
                            <img src={cpUploadedImage || editingCp?.image} alt="" className="w-full aspect-[2/3] object-cover" />
                            <button type="button" onClick={(e) => { e.stopPropagation(); setCpUploadedImage(null); if (editingCp) setEditingCp({ ...editingCp, image: "" }); }} className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white flex items-center justify-center cursor-pointer"><X size={12} /></button>
                          </div>
                        ) : (
                          <><Upload size={24} className="text-white/15 mb-3 group-hover:text-white/30 transition-colors" /><span className="text-white/20 group-hover:text-white/40 transition-colors" style={{ fontSize: "12px" }}>클릭하여 포스터 이미지 업로드 (2:3 비율 권장)</span></>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={editingCp ? handleUpdateCp : handleCreateCp} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> {editingCp ? "수정 완료" : "추가"}</button>
                      <button onClick={() => { setShowCpForm(false); setEditingCp(null); setCpUploadedImage(null); }} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button>
                    </div>
                  </div>
                </div>
              )}

              {currentProjects.length === 0 ? (
                <div className="border border-white/[0.06] p-16 text-center"><CalendarDays size={32} className="text-white/10 mx-auto mb-4" /><p className="text-white/20" style={{ fontSize: "14px" }}>등록된 프로젝트가 없습니다.</p></div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...currentProjects].sort((a, b) => a.order - b.order).map((cp, idx) => (
                    <div key={cp.id} className={`border overflow-hidden group hover:border-white/10 transition-colors ${cp.active ? "border-white/[0.06]" : "border-white/[0.04] opacity-50"}`}>
                      <div className="aspect-[2/3] overflow-hidden relative">
                        <ImageWithFallback src={cp.image} alt={cp.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button onClick={() => { setEditingCp({ ...cp }); setCpUploadedImage(null); setShowCpForm(false); }} className="w-8 h-8 bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer"><Edit3 size={14} /></button>
                          <button onClick={() => handleDeleteCp(cp.id)} className="w-8 h-8 bg-white/20 text-white flex items-center justify-center hover:bg-red-500/50 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                        {!cp.active && <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500/20 text-red-400/80" style={{ fontSize: "9px" }}>비활성</div>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white/80 truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{cp.title}</h4>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleMoveCp(cp.id, "up")} disabled={idx === 0} className="p-1 text-white/15 hover:text-white/50 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"><ArrowUp size={12} /></button>
                            <button onClick={() => handleMoveCp(cp.id, "down")} disabled={idx === currentProjects.length - 1} className="p-1 text-white/15 hover:text-white/50 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"><ArrowDown size={12} /></button>
                          </div>
                        </div>
                        {(cp.performanceDate || cp.performanceDay || cp.performanceTime) && (
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                            {cp.performanceDate && <span className="text-white/40" style={{ fontSize: "10px" }}>{cp.performanceDate}</span>}
                            {cp.performanceDay && <span className="text-white/25" style={{ fontSize: "10px" }}>({cp.performanceDay})</span>}
                            {cp.performanceTime && <span className="text-white/40" style={{ fontSize: "10px" }}>{cp.performanceTime}</span>}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Ticket size={10} className="text-white/20" />
                          <p className="text-blue-400/40 truncate" style={{ fontSize: "10px" }}>{cp.reservationLink}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleToggleCpActive(cp.id)} className="flex-1 py-1.5 border border-white/[0.06] text-white/30 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "10px" }}>{cp.active ? "비활성화" : "활성화"}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ ARTISTS ═══ */}
          {activeTab === "artists" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div><h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>예술인 관리</h1><p className="text-white/30" style={{ fontSize: "13px" }}>아르플래닛 소속 예술인을 등록하고 관리합니다. 홈페이지 OUR ARTISTS 섹션에 표시됩니다.</p></div>
                <button onClick={() => { setShowArtistForm(true); setEditingArtist(null); setArtistUploadedImage(null); setNewArtist({ name: "", role: "", instrument: "", bio: "" }); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer shrink-0 self-start" style={{ fontSize: "13px", fontWeight: 500 }}><Plus size={16} /> 예술인 등록</button>
              </div>

              {/* Artist Form */}
              {(showArtistForm || editingArtist) && (
                <div className="mb-10 border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>{editingArtist ? "예술인 수정" : "새 예술인 등록"}</h3><button onClick={() => { setShowArtistForm(false); setEditingArtist(null); setArtistUploadedImage(null); }} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>이름 *</label><input type="text" value={editingArtist ? editingArtist.name : newArtist.name} onChange={e => editingArtist ? setEditingArtist({ ...editingArtist, name: e.target.value }) : setNewArtist({ ...newArtist, name: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: 최혜지" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>역할</label><input type="text" value={editingArtist ? editingArtist.role : newArtist.role} onChange={e => editingArtist ? setEditingArtist({ ...editingArtist, role: e.target.value }) : setNewArtist({ ...newArtist, role: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: 대표 / 피아니스트" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    </div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>악기</label><input type="text" value={editingArtist ? editingArtist.instrument : newArtist.instrument} onChange={e => editingArtist ? setEditingArtist({ ...editingArtist, instrument: e.target.value }) : setNewArtist({ ...newArtist, instrument: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: Piano" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>소개</label><textarea value={editingArtist ? editingArtist.bio : newArtist.bio} onChange={e => editingArtist ? setEditingArtist({ ...editingArtist, bio: e.target.value }) : setNewArtist({ ...newArtist, bio: e.target.value })} rows={3} className="w-full bg-transparent border border-white/10 focus:border-white/20 p-4 text-white/70 placeholder:text-white/15 focus:outline-none resize-none" placeholder="예술인 소개를 입력하세요" style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.8 }} /></div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>프로필 사진</label>
                      <div onClick={() => artistImgRef.current?.click()} className="border border-dashed border-white/10 hover:border-white/20 p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                        {(artistUploadedImage || (editingArtist && editingArtist.image)) ? (
                          <div className="relative w-full max-w-[200px]">
                            <img src={artistUploadedImage || editingArtist?.image} alt="" className="w-full aspect-[9/10] object-cover" />
                            <button type="button" onClick={(e) => { e.stopPropagation(); setArtistUploadedImage(null); if (editingArtist) setEditingArtist({ ...editingArtist, image: "" }); }} className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white flex items-center justify-center cursor-pointer"><X size={12} /></button>
                          </div>
                        ) : (
                          <>
                            <Upload size={24} className="text-white/15 mb-3 group-hover:text-white/30 transition-colors" />
                            <span className="text-white/20 group-hover:text-white/40 transition-colors" style={{ fontSize: "12px" }}>클릭하여 이미지 업로드 (5:6 비율 권장)</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={editingArtist ? handleUpdateArtist : handleCreateArtist} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> {editingArtist ? "수정 완료" : "등록"}</button>
                      <button onClick={() => { setShowArtistForm(false); setEditingArtist(null); setArtistUploadedImage(null); }} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Artist List */}
              {artists.length === 0 ? (
                <div className="border border-white/[0.06] p-16 text-center"><Users size={32} className="text-white/10 mx-auto mb-4" /><p className="text-white/20" style={{ fontSize: "14px" }}>등록된 예술인이 없습니다.</p></div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...artists].sort((a, b) => a.order - b.order).map((artist, idx) => (
                    <div key={artist.id} className={`border overflow-hidden group transition-colors ${artist.visible === false ? "border-white/[0.03] opacity-50" : "border-white/[0.06] hover:border-white/10"}`}>
                      <div className="aspect-[9/10] overflow-hidden relative">
                        <ImageWithFallback src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                        {artist.visible === false && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white/40 tracking-[0.15em]" style={{ fontSize: "10px", fontWeight: 500 }}>숨김</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button onClick={() => { setEditingArtist({ ...artist }); setArtistUploadedImage(null); setShowArtistForm(true); }} className="w-8 h-8 bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer"><Edit3 size={14} /></button>
                          <button onClick={() => handleToggleArtistVisible(artist.id)} className="w-8 h-8 bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer">{artist.visible === false ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                          <button onClick={() => handleDeleteArtist(artist.id)} className="w-8 h-8 bg-white/20 text-white flex items-center justify-center hover:bg-red-500/50 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="text-white/80 truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{artist.name}</h4>
                            {artist.visible === false && <EyeOff size={10} className="text-white/20 shrink-0" />}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleMoveArtist(artist.id, "up")} disabled={idx === 0} className="p-1 text-white/15 hover:text-white/50 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"><ArrowUp size={12} /></button>
                            <button onClick={() => handleMoveArtist(artist.id, "down")} disabled={idx === artists.length - 1} className="p-1 text-white/15 hover:text-white/50 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"><ArrowDown size={12} /></button>
                          </div>
                        </div>
                        <p className="text-white/40" style={{ fontSize: "12px" }}>{artist.role}</p>
                        <p className="text-white/20 mt-1" style={{ fontSize: "11px" }}>{artist.instrument}</p>
                        <button onClick={() => handleToggleArtistVisible(artist.id)} className="mt-2 w-full py-1.5 border border-white/[0.06] text-white/30 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "10px" }}>{artist.visible === false ? "홈페이지에 표시" : "숨기기"}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ AWARDS ═══ */}
          {activeTab === "awards" && (
            <div>
              <div className="flex items-center justify-between mb-10">
                <div><h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>수상 이력 관리</h1><p className="text-white/30" style={{ fontSize: "13px" }}>수상, 선정, 지원금 등의 이력을 관리합니다. 홈페이지 AWARDS 섹션에 표시됩니다.</p></div>
                <button onClick={() => { setShowAwardForm(true); setEditingAward(null); setNewAward({ year: "2025", title: "", organizer: "", desc: "" }); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Plus size={16} /> 수상 이력 추가</button>
              </div>

              {(showAwardForm || editingAward) && (
                <div className="mb-10 border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>{editingAward ? "수상 이력 수정" : "새 수상 이력 추가"}</h3><button onClick={() => { setShowAwardForm(false); setEditingAward(null); }} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>수상/선정명 *</label><input type="text" value={editingAward ? editingAward.title : newAward.title} onChange={e => editingAward ? setEditingAward({ ...editingAward, title: e.target.value }) : setNewAward({ ...newAward, title: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: 광주문화재단 공연 지원금 선정" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                      <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>연도</label><input type="text" value={editingAward ? editingAward.year : newAward.year} onChange={e => editingAward ? setEditingAward({ ...editingAward, year: e.target.value }) : setNewAward({ ...newAward, year: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    </div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>수여/주최 기관</label><input type="text" value={editingAward ? editingAward.organizer : newAward.organizer} onChange={e => editingAward ? setEditingAward({ ...editingAward, organizer: e.target.value }) : setNewAward({ ...newAward, organizer: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder:text-white/15 focus:outline-none" placeholder="예: 광주문화재단" style={{ fontSize: "14px", fontWeight: 300 }} /></div>
                    <div><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>설명 (선택)</label><textarea value={editingAward ? (editingAward.desc || "") : newAward.desc} onChange={e => editingAward ? setEditingAward({ ...editingAward, desc: e.target.value }) : setNewAward({ ...newAward, desc: e.target.value })} rows={3} className="w-full bg-transparent border border-white/10 focus:border-white/20 p-4 text-white/70 placeholder:text-white/15 focus:outline-none resize-none" placeholder="수상/선정에 대한 간단한 설명" style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.8 }} /></div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={editingAward ? handleUpdateAward : handleCreateAward} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> {editingAward ? "수정 완료" : "추가"}</button>
                      <button onClick={() => { setShowAwardForm(false); setEditingAward(null); }} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button>
                    </div>
                  </div>
                </div>
              )}

              {awards.length === 0 ? (
                <div className="border border-white/[0.06] p-16 text-center"><TrendingUp size={32} className="text-white/10 mx-auto mb-4" /><p className="text-white/20" style={{ fontSize: "14px" }}>등록된 수상 이력이 없습니다.</p></div>
              ) : (
                <div className="space-y-3">
                  {[...awards].sort((a, b) => a.order - b.order).map((award, idx) => (
                    <div key={award.id} className={`border p-5 flex flex-col md:flex-row md:items-center gap-4 transition-colors ${award.visible === false ? 'border-white/[0.03] opacity-50' : 'border-white/[0.06] hover:border-white/10'}`}>
                      <div className="flex items-center gap-4 md:w-20 shrink-0">
                        <span className="text-white/30 tabular-nums" style={{ fontSize: "14px", fontWeight: 400 }}>{award.year}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white/80" style={{ fontSize: "14px", fontWeight: 500 }}>{award.title}</h4>
                          {award.visible === false && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400/80 shrink-0" style={{ fontSize: "8px" }}>비활성</span>}
                        </div>
                        <p className="text-white/30" style={{ fontSize: "12px" }}>{award.organizer}</p>
                        {award.desc && <p className="text-white/20 mt-1 truncate" style={{ fontSize: "11px" }}>{award.desc}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleMoveAward(award.id, "up")} disabled={idx === 0} className="p-2 text-white/20 hover:text-white/60 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"><ArrowUp size={14} /></button>
                        <button onClick={() => handleMoveAward(award.id, "down")} disabled={idx === awards.length - 1} className="p-2 text-white/20 hover:text-white/60 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"><ArrowDown size={14} /></button>
                        <div className="w-px h-4 bg-white/[0.06] mx-1" />
                        <button onClick={() => handleToggleAwardVisible(award.id)} className={`p-2 cursor-pointer ${award.visible === false ? 'text-green-400/50 hover:text-green-400' : 'text-white/20 hover:text-amber-400'}`} title={award.visible === false ? "활성화" : "비활성화"}>{award.visible === false ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                        <button onClick={() => { setEditingAward({ ...award }); setShowAwardForm(false); }} className="p-2 text-white/20 hover:text-white/60 cursor-pointer"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteAward(award.id)} className="p-2 text-white/20 hover:text-red-400/70 cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ ABOUT ═══ */}
          {activeTab === "about" && (
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>소개 관리 (ABOUT)</h1>
              <p className="text-white/30 mb-10" style={{ fontSize: "13px" }}>홈페이지 ABOUT ARPLANET 섹션의 메인 텍스트, 핵심 가치, 실적을 관리합니다.</p>

              {!editingAbout ? (
                <div className="space-y-6">
                  {/* Main text preview */}
                  <div className="border border-white/[0.06] p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>메인 소개 텍스트</h3>
                      <button onClick={() => setEditingAbout({ ...aboutData, pillars: aboutData.pillars.map(p => ({ ...p })), achievements: aboutData.achievements.map(a => ({ ...a })) })} className="flex items-center gap-2 px-4 py-2 border border-white/[0.06] text-white/30 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "11px" }}><Edit3 size={12} /> 전체 수정</button>
                    </div>
                    <p className="text-white/50 whitespace-pre-line" style={{ fontSize: "14px", lineHeight: 1.8, fontWeight: 300 }}>{aboutData.mainText}</p>
                    <p className="text-white/15 mt-3" style={{ fontSize: "11px" }}>**텍스트** 로 감싸면 굵게 표시됩니다.</p>
                  </div>

                  {/* Pillars preview */}
                  <div className="border border-white/[0.06] p-6 md:p-8">
                    <h3 className="text-white mb-6" style={{ fontSize: "14px", fontWeight: 500 }}>핵심 가치 (3개 항목)</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {aboutData.pillars.map(p => (
                        <div key={p.num} className="border-t border-white/[0.06] pt-4">
                          <span className="text-white/15" style={{ fontSize: "11px" }}>{p.num}</span>
                          <h4 className="text-white/70 mt-2 mb-1" style={{ fontSize: "13px", fontWeight: 500 }}>{p.title}</h4>
                          <p className="text-white/30" style={{ fontSize: "12px", fontWeight: 300, lineHeight: 1.7 }}>{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements preview */}
                  <div className="border border-white/[0.06] p-6 md:p-8">
                    <h3 className="text-white mb-6" style={{ fontSize: "14px", fontWeight: 500 }}>실적 (ACHIEVEMENTS)</h3>
                    <p className="text-white/30 mb-4" style={{ fontSize: "12px" }}>섹션 타이틀: {aboutData.achievementsTitle}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {aboutData.achievements.map(a => (
                        <div key={a.label} className="border border-white/[0.06] p-4 text-center">
                          <div className="text-white/60" style={{ fontSize: "18px", fontWeight: 200 }}>{a.num}</div>
                          <div className="text-white/30 mt-1" style={{ fontSize: "11px" }}>{a.label}</div>
                          {a.sub && <div className="text-white/15 mt-0.5" style={{ fontSize: "10px" }}>{a.sub}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-white" style={{ fontSize: "16px", fontWeight: 500 }}>소개 섹션 수정</h3><button onClick={() => setEditingAbout(null)} className="text-white/30 hover:text-white cursor-pointer"><X size={18} /></button></div>
                  <div className="space-y-8">
                    {/* Main text */}
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>메인 소개 텍스트</label>
                      <textarea value={editingAbout.mainText} onChange={e => setEditingAbout({ ...editingAbout, mainText: e.target.value })} rows={6} className="w-full bg-transparent border border-white/10 focus:border-white/20 p-4 text-white/70 focus:outline-none resize-none" style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.8 }} />
                      <p className="text-white/15 mt-1" style={{ fontSize: "11px" }}>**텍스트** 로 감싸면 굵게(bold) 표시됩니다. 줄바꿈은 그대로 반영됩니다.</p>
                    </div>

                    {/* Pillars */}
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-4" style={{ fontSize: "10px", fontWeight: 500 }}>핵심 가치 항목</label>
                      {editingAbout.pillars.map((pillar, idx) => (
                        <div key={idx} className="border border-white/[0.04] p-4 mb-3">
                          <div className="flex items-center gap-3 mb-3"><span className="text-white/20" style={{ fontSize: "10px" }}>#{pillar.num}</span></div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="text-white/20 block mb-1" style={{ fontSize: "9px" }}>제목</label><input type="text" value={pillar.title} onChange={e => { const next = [...editingAbout.pillars]; next[idx] = { ...next[idx], title: e.target.value }; setEditingAbout({ ...editingAbout, pillars: next }); }} className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/20 py-2 text-white/60 focus:outline-none" style={{ fontSize: "13px", fontWeight: 300 }} /></div>
                            <div><label className="text-white/20 block mb-1" style={{ fontSize: "9px" }}>설명</label><textarea value={pillar.desc} onChange={e => { const next = [...editingAbout.pillars]; next[idx] = { ...next[idx], desc: e.target.value }; setEditingAbout({ ...editingAbout, pillars: next }); }} rows={2} className="w-full bg-transparent border border-white/[0.06] focus:border-white/15 p-2 text-white/50 focus:outline-none resize-none" style={{ fontSize: "12px", fontWeight: 300 }} /></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Achievements */}
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>실적 섹션 타이틀</label>
                      <input type="text" value={editingAbout.achievementsTitle} onChange={e => setEditingAbout({ ...editingAbout, achievementsTitle: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white focus:outline-none mb-6" style={{ fontSize: "14px", fontWeight: 300 }} />
                      <label className="text-white/30 tracking-[0.15em] block mb-4" style={{ fontSize: "10px", fontWeight: 500 }}>실적 항목</label>
                      {editingAbout.achievements.map((ach, idx) => (
                        <div key={idx} className="border border-white/[0.04] p-4 mb-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div><label className="text-white/20 block mb-1" style={{ fontSize: "9px" }}>수치</label><input type="text" value={ach.num} onChange={e => { const next = [...editingAbout.achievements]; next[idx] = { ...next[idx], num: e.target.value }; setEditingAbout({ ...editingAbout, achievements: next }); }} className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/20 py-2 text-white/60 focus:outline-none" style={{ fontSize: "13px", fontWeight: 300 }} /></div>
                            <div><label className="text-white/20 block mb-1" style={{ fontSize: "9px" }}>라벨</label><input type="text" value={ach.label} onChange={e => { const next = [...editingAbout.achievements]; next[idx] = { ...next[idx], label: e.target.value }; setEditingAbout({ ...editingAbout, achievements: next }); }} className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/20 py-2 text-white/60 focus:outline-none" style={{ fontSize: "13px", fontWeight: 300 }} /></div>
                            <div><label className="text-white/20 block mb-1" style={{ fontSize: "9px" }}>보조 텍스트</label><input type="text" value={ach.sub} onChange={e => { const next = [...editingAbout.achievements]; next[idx] = { ...next[idx], sub: e.target.value }; setEditingAbout({ ...editingAbout, achievements: next }); }} className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/20 py-2 text-white/50 focus:outline-none" style={{ fontSize: "12px", fontWeight: 300 }} /></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={() => { setAboutData(editingAbout); setEditingAbout(null); toast.success("소개 섹션이 수정되었습니다."); }} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> 저장</button>
                      <button onClick={() => setEditingAbout(null)} className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer" style={{ fontSize: "13px" }}>취소</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ INQUIRIES ═══ */}
          {activeTab === "inquiries" && (
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>문의 관리</h1>
              <p className="text-white/30 mb-10" style={{ fontSize: "13px" }}>홈페이지 문의하기에서 접수된 문의 목록입니다.</p>
              {inquiries.length === 0 ? (
                <div className="border border-white/[0.06] p-16 text-center"><MessageSquare size={32} className="text-white/10 mx-auto mb-4" /><p className="text-white/20" style={{ fontSize: "14px" }}>아직 접수된 문의가 없습니다.</p></div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map(inq => (
                    <div key={inq.id} className={`border p-6 transition-colors ${inq.read ? "border-white/[0.04]" : "border-white/[0.08] bg-white/[0.01]"}`}>
                      <div className="flex items-start justify-between gap-4 mb-4"><div><div className="flex items-center gap-3 mb-1"><h4 className="text-white/80" style={{ fontSize: "14px", fontWeight: 500 }}>{inq.name}</h4>{!inq.read && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}</div><p className="text-white/30" style={{ fontSize: "12px" }}>{inq.email} · {inq.phone}{inq.company && ` · ${inq.company}`}</p></div>
                        <div className="flex items-center gap-2 shrink-0"><span className="text-white/15 tabular-nums" style={{ fontSize: "11px" }}>{inq.date}</span><button onClick={() => handleToggleReadInquiry(inq.id)} className="p-2 text-white/20 hover:text-white/60 cursor-pointer">{inq.read ? <MailOpen size={14} /> : <Mail size={14} />}</button><button onClick={() => handleDeleteInquiry(inq.id)} className="p-2 text-white/20 hover:text-red-400/70 cursor-pointer"><Trash2 size={14} /></button></div></div>
                      <p className="text-white/50" style={{ fontSize: "13px", lineHeight: 1.8, fontWeight: 300 }}>{inq.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ INSTAGRAM ═══ */}
          {activeTab === "instagram" && (
            <div>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>인스타그램 연동</h1>
                  <p className="text-white/30" style={{ fontSize: "13px" }}>인스타그램 콘텐츠를 실시간으로 홈페이지에 연동합니다.</p>
                </div>
                {instagramToken && (
                  <button onClick={fetchInstagramFeed} disabled={igLoading} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all cursor-pointer disabled:opacity-30" style={{ fontSize: "13px" }}>
                    <RefreshCw size={14} className={igLoading ? "animate-spin" : ""} /> 새로고침
                  </button>
                )}
              </div>

              {/* Access Token Settings */}
              <div className="border border-white/[0.06] p-6 md:p-8 mb-10">
                <h3 className="text-white mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>Instagram Graph API 연결</h3>
                <p className="text-white/20 mb-6" style={{ fontSize: "12px" }}>
                  Instagram Graph API의 액세스 토큰을 입력하면 인스타그램 게시물을 불러옵니다.
                </p>

                {instagramToken ? (
                  <div className="p-4 bg-[#E4405F]/[0.05] border border-[#E4405F]/20 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#E4405F] to-[#C13584] flex items-center justify-center shrink-0">
                          <Instagram size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="text-white flex items-center gap-2" style={{ fontSize: "13px", fontWeight: 500 }}>
                            Instagram 연결됨
                          </p>
                          <p className="text-white/30" style={{ fontSize: "11px" }}>토큰: {instagramToken.slice(0, 20)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400/70" style={{ fontSize: "12px", fontWeight: 500 }}>연결됨</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] mb-4">
                    <p className="text-white/30" style={{ fontSize: "12px" }}>아직 연결되지 않았습니다. 아래에 액세스 토큰을 입력해주세요.</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editingIgToken || instagramToken}
                    onChange={(e) => setEditingIgToken(e.target.value)}
                    placeholder="Instagram Graph API Access Token"
                    className="flex-1 bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 placeholder:text-white/15 focus:outline-none"
                    style={{ fontSize: "13px", fontWeight: 300 }}
                  />
                  <button onClick={() => {
                    const token = editingIgToken || instagramToken;
                    if (!token.trim()) { toast.error("토큰을 입력해주세요."); return; }
                    setInstagramToken(token.trim());
                    setEditingIgToken("");
                    toast.success("Instagram 토큰이 저장되었습니다.");
                  }} className="px-5 py-2 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer shrink-0" style={{ fontSize: "12px", fontWeight: 500 }}>
                    <Save size={12} className="inline mr-1.5" />저장
                  </button>
                </div>
                {instagramToken && (
                  <button onClick={() => { setInstagramToken(""); setIgPosts([]); toast.success("연결이 해제되었습니다."); }} className="mt-3 text-red-400/60 hover:text-red-400 transition-colors cursor-pointer" style={{ fontSize: "11px" }}>
                    연결 해제
                  </button>
                )}

                <div className="p-4 bg-white/[0.02] border border-white/[0.04] mt-6">
                  <p className="text-white/25" style={{ fontSize: "11px", lineHeight: 1.8 }}>
                    <strong className="text-white/40">토큰 발급 방법:</strong><br />
                    1. <a href="https://developers.facebook.com" target="_blank" rel="noopener" className="text-white/50 underline">Meta for Developers</a>에서 앱을 생성합니다.<br />
                    2. Instagram Graph API 제품을 추가합니다.<br />
                    3. Instagram 비즈니스/크리에이터 계정을 연결합니다.<br />
                    4. Graph API Explorer에서 <code className="text-white/30 bg-white/[0.05] px-1">instagram_basic</code>, <code className="text-white/30 bg-white/[0.05] px-1">pages_show_list</code> 권한으로 토큰을 발급받습니다.<br />
                    5. 장기 토큰(60일)으로 교환 후 위에 입력하세요.
                  </p>
                </div>
              </div>

              {/* Posts Grid */}
              {igError && !igPosts.length && (
                <div className="p-5 border border-yellow-500/20 bg-yellow-500/[0.03] mb-6">
                  <p className="text-yellow-400/70" style={{ fontSize: "12px" }}>{igError}</p>
                </div>
              )}

              {igLoading ? (
                <div className="text-center py-20">
                  <RefreshCw size={24} className="text-white/20 animate-spin mx-auto mb-3" />
                  <p className="text-white/20" style={{ fontSize: "12px" }}>인스타그램 피드를 불러오는 중...</p>
                </div>
              ) : igPosts.length > 0 ? (
                <div className="mb-10">
                  <h3 className="text-white/50 tracking-[0.15em] mb-6" style={{ fontSize: "11px", fontWeight: 500 }}>최근 게시물 ({igPosts.length}개)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {igPosts.map(post => (
                      <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="border border-white/[0.06] overflow-hidden group block">
                        <div className="aspect-square overflow-hidden relative">
                          {post.media_type === "VIDEO" ? (
                            <video src={post.media_url} className="w-full h-full object-cover" muted />
                          ) : (
                            <ImageWithFallback src={post.media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                            <ExternalLink size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-white/50 truncate mb-2" style={{ fontSize: "12px" }}>{post.caption || "(캡션 없음)"}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-white/20" style={{ fontSize: "11px" }}>
                              {new Date(post.timestamp).toLocaleDateString("ko-KR")}
                            </span>
                            <span className="px-2 py-0.5 bg-white/5 text-white/25" style={{ fontSize: "9px" }}>
                              {post.media_type === "VIDEO" ? "영상" : post.media_type === "CAROUSEL_ALBUM" ? "슬라이드" : "이미지"}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : instagramToken ? (
                <div className="text-center py-20 border border-dashed border-white/[0.06]">
                  <Instagram size={32} className="text-white/10 mx-auto mb-3" />
                  <p className="text-white/20" style={{ fontSize: "13px" }}>게시물이 없거나 토큰이 유효하지 않습니다.</p>
                  <button onClick={fetchInstagramFeed} className="mt-4 text-white/40 hover:text-white transition-colors cursor-pointer" style={{ fontSize: "12px" }}>
                    다시 시도
                  </button>
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-white/[0.06]">
                  <Instagram size={32} className="text-white/10 mx-auto mb-3" />
                  <p className="text-white/20" style={{ fontSize: "13px" }}>위에서 Instagram 토큰을 입력하면 게시물이 표시됩니다.</p>
                </div>
              )}
            </div>
          )}

          {/* ═══ LOGOS ═══ */}
          {activeTab === "logos" && (
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>로고 관리</h1>
              <p className="text-white/30 mb-10" style={{ fontSize: "13px" }}>홈페이지 로고, 카카오톡 채널 로고, OG 공유 이미지를 관리합니다.</p>

              <input ref={siteLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0]; if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => { setSiteLogo(reader.result as string); toast.success("홈페이지 로고가 변경되었습니다."); };
                reader.readAsDataURL(file);
                e.target.value = "";
              }} />
              <input ref={kakaoLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0]; if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => { setKakaoLogo(reader.result as string); toast.success("카카오톡 로고가 변경되었습니다."); };
                reader.readAsDataURL(file);
                e.target.value = "";
              }} />
              <input ref={ogImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0]; if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => { setOgImage(reader.result as string); toast.success("OG 이미지가 변경되었습니다."); };
                reader.readAsDataURL(file);
                e.target.value = "";
              }} />

              <div className="max-w-2xl space-y-8">
                {/* Site Logo */}
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <h3 className="text-white mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>홈페이지 로고</h3>
                  <p className="text-white/20 mb-6" style={{ fontSize: "12px" }}>네비게이션 바, 푸터, 로그인 페이지에 표시됩니다.</p>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 border border-white/[0.06] bg-white/[0.02] flex items-center justify-center overflow-hidden">
                      {siteLogo ? (
                        <img src={siteLogo} alt="현재 로고" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon size={24} className="text-white/10 mx-auto mb-1" />
                          <span className="text-white/15" style={{ fontSize: "10px" }}>기본 로고</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <button onClick={() => siteLogoRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                        <Upload size={14} /> 로고 업로드
                      </button>
                      {siteLogo && (
                        <button onClick={() => { setSiteLogo(""); toast.success("기본 로고로 복원되었습니다."); }} className="flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <RefreshCw size={14} /> 기본값 복원
                        </button>
                      )}
                      <p className="text-white/15" style={{ fontSize: "10px" }}>PNG 또는 SVG 권장 (투명 배경)</p>
                    </div>
                  </div>
                </div>

                {/* Kakao Logo */}
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <h3 className="text-white mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>카카오톡 채널 로고</h3>
                  <p className="text-white/20 mb-6" style={{ fontSize: "12px" }}>우측 하단 플로팅 버튼에 표시됩니다.</p>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center overflow-hidden">
                      {kakaoLogo ? (
                        <img src={kakaoLogo} alt="카카오 로고" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#FEE500] flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.809 5.114 4.535 6.468-.163.609-.592 2.205-.678 2.546-.107.422.155.416.326.303.134-.089 2.132-1.449 3.003-2.039.59.084 1.196.128 1.814.128 5.523 0 10-3.463 10-7.406C22 6.463 17.523 3 12 3z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <button onClick={() => kakaoLogoRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                        <Upload size={14} /> 로고 업로드
                      </button>
                      {kakaoLogo && (
                        <button onClick={() => { setKakaoLogo(""); toast.success("기본 카카오 로고로 복원되었습니다."); }} className="flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <RefreshCw size={14} /> 기본값 복원
                        </button>
                      )}
                      <p className="text-white/15" style={{ fontSize: "10px" }}>정사각형 비율 권장 (원형으로 표시됨)</p>
                    </div>
                  </div>
                </div>

                {/* OG Image */}
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <h3 className="text-white mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>OG 공유 이미지</h3>
                  <p className="text-white/20 mb-6" style={{ fontSize: "12px" }}>카카오톡, 페이스북 등에서 링크 공유 시 표시되는 미리보기 이미지입니다.</p>
                  <div className="space-y-4">
                    <div className="w-full max-w-md aspect-[1200/630] border border-white/[0.06] bg-white/[0.02] flex items-center justify-center overflow-hidden">
                      {ogImage ? (
                        <img src={ogImage} alt="OG 이미지" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon size={32} className="text-white/10 mx-auto mb-2" />
                          <span className="text-white/15" style={{ fontSize: "11px" }}>기본 OG 이미지</span>
                          <p className="text-white/10 mt-1" style={{ fontSize: "10px" }}>1200 x 630px 권장</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => ogImageRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                        <Upload size={14} /> 이미지 업로드
                      </button>
                      {ogImage && (
                        <button onClick={() => { setOgImage(""); toast.success("기본 OG 이미지로 복원되었습니다."); }} className="flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <RefreshCw size={14} /> 기본값 복원
                        </button>
                      )}
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-white/25" style={{ fontSize: "11px", lineHeight: 1.6 }}>
                        <strong className="text-white/40">참고:</strong> 카카오톡 크롤러는 서버에서 정적 HTML을 읽기 때문에, 관리자에서 업로드한 OG 이미지는 SPA 내에서만 적용됩니다.
                        카카오톡 공유 미리보기에도 반영하려면 GitHub의 <code className="text-white/30 bg-white/[0.05] px-1">/public/og-image.png</code>를 직접 교체해야 합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save all logos button */}
              <button onClick={() => { toast.success("로고 설정이 서버에 저장되었습니다."); }} className="flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer mt-8" style={{ fontSize: "13px", fontWeight: 500 }}>
                <Save size={14} /> 로고 저장하기
              </button>
            </div>
          )}

          {/* ═══ SETTINGS ═══ */}
          {activeTab === "settings" && (
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 600 }}>설정</h1>
              <p className="text-white/30 mb-10" style={{ fontSize: "13px" }}>사이트 정보, SEO, 보안을 관리합니다.</p>
              <div className="max-w-2xl space-y-8">
                <div className="border border-white/[0.06] p-6 md:p-8"><h3 className="text-white mb-6" style={{ fontSize: "14px", fontWeight: 500 }}>단체 정보</h3><div className="space-y-6">{[{ label: "단체명", value: "아르플래닛" }, { label: "대표이사", value: "최혜지" }, { label: "주소", value: "광주광역시 북구 대자로 146 3F 146호" }, { label: "설립일", value: "2024년 01월" }].map(field => (<div key={field.label}><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>{field.label.toUpperCase()}</label><input type="text" defaultValue={field.value} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>))}</div></div>
                <div className="border border-white/[0.06] p-6 md:p-8"><h3 className="text-white mb-6" style={{ fontSize: "14px", fontWeight: 500 }}>SNS 링크</h3><div className="space-y-6">{[{ label: "홈페이지", value: "https://arplanet.co.kr/" }, { label: "인스타그램", value: "https://www.instagram.com/arplanet_/" }, { label: "블로그", value: "https://blog.naver.com/arplanet_" }].map(field => (<div key={field.label}><label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>{field.label.toUpperCase()}</label><input type="url" defaultValue={field.value} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 focus:outline-none" style={{ fontSize: "14px", fontWeight: 300 }} /></div>))}</div></div>

                {/* KakaoTalk Plus Channel */}
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <h3 className="text-white mb-6" style={{ fontSize: "14px", fontWeight: 500 }}>카카오톡 플러스 채널</h3>
                  <p className="text-white/20 mb-4" style={{ fontSize: "12px" }}>우측 하단 카카오톡 플로팅 버튼의 링크를 설정합니다. 비워두면 버튼이 숨겨집니다.</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.809 5.114 4.535 6.468-.163.609-.592 2.205-.678 2.546-.107.422.155.416.326.303.134-.089 2.132-1.449 3.003-2.039.59.084 1.196.128 1.814.128 5.523 0 10-3.463 10-7.406C22 6.463 17.523 3 12 3z" /></svg>
                    </div>
                    <input type="url" value={editingKakaoUrl || kakaoChannelUrl} onChange={e => setEditingKakaoUrl(e.target.value)} className="flex-1 bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 placeholder:text-white/15 focus:outline-none" placeholder="https://open.kakao.com/o/..." style={{ fontSize: "14px", fontWeight: 300 }} />
                  </div>
                  <button onClick={() => { setKakaoChannelUrl(editingKakaoUrl || kakaoChannelUrl); toast.success("카카오톡 채널 링크가 저장되었습니다."); }} className="flex items-center gap-2 mt-4 px-5 py-2 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}><Save size={12} /> 저장</button>
                </div>

                {/* Data Backup / Restore */}
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Database size={16} className="text-white/50" />
                    <h3 className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>데이터 백업 / 복원</h3>
                  </div>
                  <p className="text-white/20 mb-6" style={{ fontSize: "12px" }}>
                    코드 수정 후 데이터가 초기화되는 것을 방지합니다. 백업 파일(.json)을 다운로드한 후, 필요할 때 복원하세요.
                  </p>

                  <div className="space-y-4">
                    {/* Export */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={async () => {
                          const json = await exportAllData();
                          const blob = new Blob([json], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `arplanet-backup-${new Date().toISOString().slice(0, 10)}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast.success("백업 파일이 다운로드되었습니다.");
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        <Download size={14} /> 데이터 백업 (JSON 다운로드)
                      </button>

                      {/* Import */}
                      <input
                        ref={backupFileRef}
                        type="file"
                        accept=".json,application/json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = async () => {
                            const result = await importAllData(reader.result as string);
                            if (result.success) {
                              toast.success(result.message);
                              setTimeout(() => window.location.reload(), 1000);
                            } else {
                              toast.error(result.message);
                            }
                          };
                          reader.readAsText(file);
                          e.target.value = "";
                        }}
                      />
                      <button
                        onClick={() => backupFileRef.current?.click()}
                        className="flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        <Upload size={14} /> 백업 파일로 복원
                      </button>
                    </div>

                    {/* Reset */}
                    <div className="border-t border-white/[0.04] pt-4 mt-4">
                      {!showResetConfirm ? (
                        <button
                          onClick={() => setShowResetConfirm(true)}
                          className="flex items-center gap-2 px-4 py-2 text-red-400/50 hover:text-red-400 transition-colors cursor-pointer"
                          style={{ fontSize: "11px" }}
                        >
                          <AlertTriangle size={12} /> 모든 데이터 초기화 (기본값으로 되돌리기)
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-red-400/70" style={{ fontSize: "11px" }}>정말 초기화하시겠습니까? 모든 커스텀 데이터가 삭제됩니다.</span>
                          <button
                            onClick={async () => { await clearAllData(); toast.success("초기화되었습니다. 새로고침합니다."); setTimeout(() => window.location.reload(), 800); }}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                            style={{ fontSize: "11px", fontWeight: 500 }}
                          >
                            확인
                          </button>
                          <button
                            onClick={() => setShowResetConfirm(false)}
                            className="px-3 py-1.5 border border-white/[0.08] text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                            style={{ fontSize: "11px" }}
                          >
                            취소
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-start gap-2">
                      <HardDrive size={12} className="text-white/20 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white/25" style={{ fontSize: "11px", lineHeight: 1.6 }}>
                          <strong className="text-white/40">사용 방법:</strong> 관리자에서 콘텐츠를 편집한 후 "데이터 백업"을 클릭하여 JSON 파일을 저장하세요.
                          코드 수정 후 데이터가 초기화되면 "백업 파일로 복원"을 클릭하여 저장한 JSON 파일을 업로드하면 됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Accounts Management */}
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>관리자 계정 관리</h3>
                      <p className="text-white/20 mt-1" style={{ fontSize: "11px" }}>여러 관리자를 추가하고 관리합니다.</p>
                    </div>
                    <button onClick={() => { setShowAdminForm(true); setEditingAdmin(null); setNewAdmin({ username: "", password: "", name: "", role: "admin" }); }} className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                      <Plus size={14} /> 관리자 추가
                    </button>
                  </div>

                  {/* Existing admins list */}
                  <div className="space-y-3 mb-6">
                    {/* Legacy admin */}
                    <div className="flex items-center justify-between p-4 border border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-white/[0.08] flex items-center justify-center shrink-0">
                          <Users size={14} className="text-white/40" />
                        </div>
                        <div>
                          <p className="text-white" style={{ fontSize: "13px", fontWeight: 500 }}>기본 관리자</p>
                          <p className="text-white/30" style={{ fontSize: "11px" }}>ID: a1004 (레거시)</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-400/70" style={{ fontSize: "10px", fontWeight: 500 }}>SUPER</span>
                    </div>

                    {(adminAccounts || []).map(acc => (
                      <div key={acc.id} className="flex items-center justify-between p-4 border border-white/[0.06]">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 bg-white/[0.05] flex items-center justify-center shrink-0">
                            <Users size={14} className="text-white/30" />
                          </div>
                          <div>
                            <p className="text-white" style={{ fontSize: "13px", fontWeight: 500 }}>{acc.name || acc.username}</p>
                            <p className="text-white/30" style={{ fontSize: "11px" }}>ID: {acc.username} · {new Date(acc.createdAt).toLocaleDateString("ko-KR")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 ${acc.role === "superadmin" ? "bg-amber-500/10 text-amber-400/70" : "bg-white/5 text-white/30"}`} style={{ fontSize: "10px", fontWeight: 500 }}>
                            {acc.role === "superadmin" ? "SUPER" : "ADMIN"}
                          </span>
                          <button onClick={() => { setEditingAdmin(acc); setNewAdmin({ username: acc.username, password: acc.password, name: acc.name, role: acc.role }); setShowAdminForm(true); }} className="p-1.5 text-white/20 hover:text-white/60 transition-colors cursor-pointer"><Edit3 size={12} /></button>
                          <button onClick={() => { setAdminAccounts(prev => prev.filter(a => a.id !== acc.id)); toast.success("관리자가 삭제되었습니다."); }} className="p-1.5 text-white/20 hover:text-red-400/70 transition-colors cursor-pointer"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add/Edit admin form */}
                  {showAdminForm && (
                    <div className="border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
                      <h4 className="text-white/50 tracking-[0.15em]" style={{ fontSize: "10px", fontWeight: 500 }}>{editingAdmin ? "관리자 수정" : "새 관리자 추가"}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>아이디 *</label>
                          <input type="text" value={newAdmin.username} onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 placeholder:text-white/15 focus:outline-none" placeholder="로그인 아이디" style={{ fontSize: "13px", fontWeight: 300 }} />
                        </div>
                        <div>
                          <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>비밀번호 *</label>
                          <input type="text" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 placeholder:text-white/15 focus:outline-none" placeholder="비밀번호" style={{ fontSize: "13px", fontWeight: 300 }} />
                        </div>
                        <div>
                          <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>이름</label>
                          <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 placeholder:text-white/15 focus:outline-none" placeholder="표시 이름" style={{ fontSize: "13px", fontWeight: 300 }} />
                        </div>
                        <div>
                          <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>권한</label>
                          <select value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value as "admin" | "superadmin" })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 focus:outline-none" style={{ fontSize: "13px", fontWeight: 300 }}>
                            <option value="admin" className="bg-black">일반 관리자</option>
                            <option value="superadmin" className="bg-black">슈퍼 관리자</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => {
                          if (!newAdmin.username.trim() || !newAdmin.password.trim()) { toast.error("아이디와 비밀번호를 입력해주세요."); return; }
                          if (editingAdmin) {
                            setAdminAccounts(prev => prev.map(a => a.id === editingAdmin.id ? { ...a, username: newAdmin.username, password: newAdmin.password, name: newAdmin.name, role: newAdmin.role } : a));
                            toast.success("관리자 정보가 수정되었습니다.");
                          } else {
                            const exists = (adminAccounts || []).some(a => a.username === newAdmin.username) || newAdmin.username === "a1004";
                            if (exists) { toast.error("이미 존재하는 아이디입니다."); return; }
                            setAdminAccounts(prev => [...prev, { id: Date.now().toString(), username: newAdmin.username, password: newAdmin.password, name: newAdmin.name, role: newAdmin.role, createdAt: new Date().toISOString() }]);
                            toast.success("새 관리자가 추가되었습니다.");
                          }
                          setShowAdminForm(false);
                          setEditingAdmin(null);
                        }} className="px-5 py-2 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                          <Save size={12} className="inline mr-1.5" />{editingAdmin ? "수정" : "추가"}
                        </button>
                        <button onClick={() => { setShowAdminForm(false); setEditingAdmin(null); }} className="px-5 py-2 border border-white/[0.08] text-white/40 hover:text-white transition-colors cursor-pointer" style={{ fontSize: "12px", fontWeight: 500 }}>
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Change */}
                <div className="border border-white/[0.06] p-6 md:p-8">
                  <h3 className="text-white mb-6" style={{ fontSize: "14px", fontWeight: 500 }}>레거시 비밀번호 변경</h3>
                  <p className="text-white/20 mb-4" style={{ fontSize: "11px" }}>기본 관리자(a1004)의 비밀번호를 변경합니다.</p>
                  <div className="space-y-6">
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>현재 비밀번호</label>
                      <input type="password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 focus:outline-none" placeholder="현재 비밀번호를 입력하세요" style={{ fontSize: "14px", fontWeight: 300 }} />
                    </div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>새 비밀번호</label>
                      <input type="password" value={pwForm.newPw} onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 focus:outline-none" placeholder="새 비밀번호를 입력하세요" style={{ fontSize: "14px", fontWeight: 300 }} />
                    </div>
                    <div>
                      <label className="text-white/30 tracking-[0.15em] block mb-2" style={{ fontSize: "10px", fontWeight: 500 }}>새 비밀번호 확인</label>
                      <input type="password" value={pwForm.confirmPw} onChange={e => setPwForm({ ...pwForm, confirmPw: e.target.value })} className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white/70 focus:outline-none" placeholder="새 비밀번호를 다시 입력하세요" style={{ fontSize: "14px", fontWeight: 300 }} />
                    </div>
                    <button onClick={() => {
                      if (!pwForm.current || !pwForm.newPw || !pwForm.confirmPw) { toast.error("모든 항목을 입력해주세요."); return; }
                      if (pwForm.current !== adminPassword) { toast.error("현재 비밀번호가 일치하지 않습니다."); return; }
                      if (pwForm.newPw !== pwForm.confirmPw) { toast.error("새 비밀번호가 일치하지 않습니다."); return; }
                      if (pwForm.newPw.length < 4) { toast.error("비밀번호는 4자 이상이어야 합니다."); return; }
                      setAdminPassword(pwForm.newPw);
                      setPwForm({ current: "", newPw: "", confirmPw: "" });
                      toast.success("비밀번호가 변경되었습니다.");
                    }} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> 비밀번호 변경</button>
                  </div>
                </div>

                <button onClick={() => toast.success("설정이 저장되었습니다.")} className="flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-white/90 transition-colors cursor-pointer" style={{ fontSize: "13px", fontWeight: 500 }}><Save size={14} /> 설정 저장</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
