import { Outlet } from "react-router";
import { Navbar } from "./navbar";
import { Toaster } from "sonner";
import { KakaoFloatButton } from "./kakao-float-button";
import { DataProvider } from "./data-store";
import { SEOHead } from "./seo-head";

export function RootLayout() {
  return (
    <DataProvider>
      <SEOHead />
      <Navbar />
      <Outlet />
      <KakaoFloatButton />
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