import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/root-layout";
import { LandingPage } from "./components/landing-page";
import { AdminPage } from "./components/admin-page";
import { LoginPage } from "./components/login-page";
import { PortfolioDetail } from "./components/portfolio-detail";
import { PortfolioList } from "./components/portfolio-list";
import { PrivacyPage } from "./components/privacy-page";
import { TermsPage } from "./components/terms-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: LoginPage },
      { path: "admin", Component: AdminPage },
      { path: "portfolio", Component: PortfolioList },
      { path: "portfolio/:id", Component: PortfolioDetail },
      { path: "privacy", Component: PrivacyPage },
      { path: "terms", Component: TermsPage },
    ],
  },
]);
