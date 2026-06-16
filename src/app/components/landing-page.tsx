import { HeroSection } from "./hero-section";
import { AboutSection } from "./about-section";
import { PortfolioSection } from "./portfolio-section";
import { NewsSection } from "./news-section";
import { ServicesSection } from "./services-section";
import { AwardsSection } from "./awards-section";
import { ContactSection } from "./contact-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="bg-black min-h-screen">
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <NewsSection />
      <ServicesSection />
      <AwardsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}