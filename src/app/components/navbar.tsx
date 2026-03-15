import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const LOGO_PATH = "/logo.png";

const navLinks = [
  { label: "ABOUT", href: "/#about" },
  { label: "TICKET", href: "/#ticket" },
  { label: "PROJECTS", href: "/#portfolio" },
  { label: "NEWS", href: "/#news" },
  { label: "BUSINESS", href: "/#services" },
  { label: "AWARDS", href: "/#awards" },
  { label: "CONTACT", href: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  const isLogin = location.pathname === "/login";
  const isLegalPage = location.pathname === "/privacy" || location.pathname === "/terms";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.split("#")[1];
    if (!id) return;

    // 현재 홈페이지가 아닌 다른 페이지에 있을 경우, 홈으로 이동 후 스크롤
    if (location.pathname !== "/") {
      navigate("/");
      // 홈 렌더링 후 해당 섹션으로 스크롤
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isAdmin || isLogin || isLegalPage) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? "bg-black/80 backdrop-blur-2xl" : "bg-transparent"
        }`}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link to="/" className="relative z-10">
              <img src={LOGO_PATH} alt="ARPLANET" className="h-20 md:h-24 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white/60 hover:text-white transition-colors duration-500 tracking-[0.15em] cursor-pointer"
                  style={{ fontSize: "12px", fontWeight: 400 }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white z-10 w-10 h-10 flex items-center justify-center cursor-pointer"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white tracking-[0.3em] cursor-pointer hover:opacity-50 transition-opacity"
                  style={{ fontSize: "28px", fontWeight: 300 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}