import { Outlet, useLocation } from "react-router";
import { Navbar } from "./navbar";
import { Toaster } from "sonner";
import { KakaoFloatButton } from "./kakao-float-button";
import { DataProvider, useData } from "./data-store";
import { SEOHead } from "./seo-head";
import { MaintenancePage } from "./maintenance-page";

function LayoutInner() {
  const { maintenanceMode, isLoggedIn } = useData();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/login";

  // 점검 모드: 관리자 페이지는 항상 접근 가능
  if (maintenanceMode && !isAdminRoute && !isLoggedIn) {
    return <MaintenancePage />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <KakaoFloatButton />
    </>
  );
}

export function RootLayout() {
  return (
    <DataProvider>
      <SEOHead />
      <LayoutInner />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 400,
          },
        }}
      />
    </DataProvider>
  );
}
