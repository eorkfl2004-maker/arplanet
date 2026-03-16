import { useEffect, useRef } from "react";
import { useData } from "./data-store";

export function AnalyticsTracker() {
  const { trackPageView } = useData();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    const path = window.location.pathname;
    trackPageView(path);
  }, [trackPageView]);

  return null;
}
