import { useMemo, useState } from "react";
import { Eye, Users, TrendingUp, Globe, Calendar } from "lucide-react";
import { useData } from "./data-store";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getThisMonth() {
  return new Date().toISOString().slice(0, 7);
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatMonthShort(monthStr: string) {
  const parts = monthStr.split("-");
  return `${parseInt(parts[1])}월`;
}

function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7));
  }
  return months;
}

/* ── Custom lightweight chart components (no recharts) ── */

interface BarChartItem {
  label: string;
  value: number;
  value2?: number;
}

function SimpleBarChart({
  data,
  height = 200,
  showLabels = true,
  labelInterval = 1,
  barColor = "rgba(255,255,255,0.12)",
  barColor2,
  valueLabel = "방문",
  valueLabel2 = "순방문자",
}: {
  data: BarChartItem[];
  height?: number;
  showLabels?: boolean;
  labelInterval?: number;
  barColor?: string;
  barColor2?: string;
  valueLabel?: string;
  valueLabel2?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(...data.map(d => Math.max(d.value, d.value2 || 0)), 1);

  return (
    <div className="relative h-full flex flex-col">
      {/* Tooltip */}
      {hovered !== null && data[hovered] && (
        <div
          className="absolute z-10 bg-[#1a1a1a] border border-white/10 px-3 py-2 pointer-events-none"
          style={{
            fontSize: "11px",
            left: `${((hovered + 0.5) / data.length) * 100}%`,
            top: "0",
            transform: "translateX(-50%)",
          }}
        >
          <p className="text-white/50 mb-1">{data[hovered].label}</p>
          <p className="text-white/80">{valueLabel}: {data[hovered].value}</p>
          {barColor2 && data[hovered].value2 !== undefined && (
            <p className="text-white/80">{valueLabel2}: {data[hovered].value2}</p>
          )}
        </div>
      )}

      {/* Y-axis guides */}
      <div className="flex-1 relative" style={{ minHeight: height - 24 }}>
        {[0.25, 0.5, 0.75, 1].map(frac => (
          <div
            key={frac}
            className="absolute left-0 right-0 border-t border-white/[0.04]"
            style={{ bottom: `${frac * 100}%` }}
          >
            <span className="absolute -top-2.5 -left-1 text-white/15" style={{ fontSize: "9px" }}>
              {Math.round(maxVal * frac)}
            </span>
          </div>
        ))}

        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-px pl-6">
          {data.map((item, i) => (
            <div
              key={item.label}
              className="flex-1 flex items-end justify-center gap-px h-full cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {barColor2 ? (
                <>
                  <div
                    className="flex-1 transition-all duration-300 rounded-t-sm"
                    style={{
                      height: `${(item.value / maxVal) * 100}%`,
                      minHeight: item.value > 0 ? 2 : 0,
                      background: hovered === i ? barColor.replace(/[\d.]+\)$/, "0.5)") : barColor,
                    }}
                  />
                  <div
                    className="flex-1 transition-all duration-300 rounded-t-sm"
                    style={{
                      height: `${((item.value2 || 0) / maxVal) * 100}%`,
                      minHeight: (item.value2 || 0) > 0 ? 2 : 0,
                      background: hovered === i ? barColor2.replace(/[\d.]+\)$/, "0.3)") : barColor2,
                    }}
                  />
                </>
              ) : (
                <div
                  className="w-full transition-all duration-300 rounded-t-sm"
                  style={{
                    height: `${(item.value / maxVal) * 100}%`,
                    minHeight: item.value > 0 ? 2 : 0,
                    background: hovered === i ? barColor.replace(/[\d.]+\)$/, "0.25)") : barColor,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      {showLabels && (
        <div className="flex pl-6 mt-1.5" style={{ height: 16 }}>
          {data.map((item, i) => (
            <div key={item.label} className="flex-1 text-center">
              {i % labelInterval === 0 && (
                <span className="text-white/20" style={{ fontSize: "9px" }}>{item.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SimpleAreaChart({
  data,
  height = 200,
  strokeColor = "rgba(255,255,255,0.4)",
  fillColor = "rgba(255,255,255,0.06)",
  valueLabel = "방문",
}: {
  data: BarChartItem[];
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  valueLabel?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const chartH = height - 24;

  // Build SVG path
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / maxVal) * 100,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  return (
    <div className="relative h-full flex flex-col">
      {/* Tooltip */}
      {hovered !== null && data[hovered] && (
        <div
          className="absolute z-10 bg-[#1a1a1a] border border-white/10 px-3 py-2 pointer-events-none"
          style={{
            fontSize: "11px",
            left: `${((hovered + 0.5) / data.length) * 100}%`,
            top: "0",
            transform: "translateX(-50%)",
          }}
        >
          <p className="text-white/50 mb-1">{data[hovered].label}</p>
          <p className="text-white/80">{valueLabel}: {data[hovered].value}</p>
        </div>
      )}

      {/* Chart area */}
      <div className="flex-1 relative" style={{ minHeight: chartH }}>
        {/* Y-axis guides */}
        {[0.25, 0.5, 0.75, 1].map(frac => (
          <div
            key={frac}
            className="absolute left-0 right-0 border-t border-white/[0.04]"
            style={{ bottom: `${frac * 100}%` }}
          >
            <span className="absolute -top-2.5 -left-1 text-white/15" style={{ fontSize: "9px" }}>
              {Math.round(maxVal * frac)}
            </span>
          </div>
        ))}

        {/* SVG area */}
        <svg
          className="absolute inset-0 ml-6"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: "calc(100% - 24px)", height: "100%" }}
        >
          <path d={areaPath} fill={fillColor} />
          <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Hover areas */}
        <div className="absolute inset-0 flex ml-6" style={{ width: "calc(100% - 24px)" }}>
          {data.map((item, i) => (
            <div
              key={item.label}
              className="flex-1 h-full cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>

        {/* Hover dot */}
        {hovered !== null && points[hovered] && (
          <div
            className="absolute w-2 h-2 rounded-full border border-white/50 bg-[#0a0a0a] pointer-events-none ml-6"
            style={{
              left: `calc(${points[hovered].x}% * (100% - 24px) / 100)`,
              bottom: `${100 - points[hovered].y}%`,
              transform: "translate(-50%, 50%)",
              marginLeft: `calc(24px + (100% - 48px) * ${points[hovered].x / 100})`,
              position: "absolute",
              top: `${points[hovered].y}%`,
            }}
          />
        )}
      </div>

      {/* X-axis labels */}
      <div className="flex pl-6 mt-1.5" style={{ height: 16 }}>
        {data.map((item, i) => (
          <div key={item.label} className="flex-1 text-center">
            <span className="text-white/20" style={{ fontSize: "9px" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */

export function AdminAnalytics() {
  const { analyticsData, portfolio, posts } = useData();
  const today = getToday();
  const thisMonth = getThisMonth();

  const todayData = analyticsData.daily[today];
  const todayVisits = todayData?.visits || 0;
  const todayUnique = todayData?.uniqueVisitors || 0;

  const monthlyData = useMemo(() => {
    let visits = 0;
    let unique = 0;
    Object.entries(analyticsData.daily).forEach(([date, data]) => {
      if (date.startsWith(thisMonth)) {
        visits += data.visits;
        unique += data.uniqueVisitors;
      }
    });
    if (analyticsData.monthly?.[thisMonth]) {
      visits = Math.max(visits, analyticsData.monthly[thisMonth].visits);
      unique = Math.max(unique, analyticsData.monthly[thisMonth].uniqueVisitors);
    }
    return { visits, unique };
  }, [analyticsData.daily, analyticsData.monthly, thisMonth]);

  const chartData7 = useMemo(() => {
    return getLast7Days().map((date) => ({
      label: formatDateShort(date),
      value: analyticsData.daily[date]?.visits || 0,
    }));
  }, [analyticsData.daily]);

  const chartData30 = useMemo(() => {
    return getLast30Days().map((date) => ({
      label: formatDateShort(date),
      value: analyticsData.daily[date]?.uniqueVisitors || 0,
    }));
  }, [analyticsData.daily]);

  const chartData12Months = useMemo(() => {
    return getLast12Months().map((month) => ({
      label: formatMonthShort(month),
      value: analyticsData.monthly?.[month]?.visits || 0,
      value2: analyticsData.monthly?.[month]?.uniqueVisitors || 0,
    }));
  }, [analyticsData.monthly]);

  const has7DayData = chartData7.some(d => d.value > 0);
  const has30DayData = chartData30.some(d => d.value > 0);
  const has12MonthData = chartData12Months.some(d => d.value > 0);

  const yearlyTotal = useMemo(() => {
    const currentYear = new Date().getFullYear().toString();
    let visits = 0;
    let unique = 0;
    Object.entries(analyticsData.monthly || {}).forEach(([month, data]) => {
      if (month.startsWith(currentYear)) {
        visits += data.visits;
        unique += data.uniqueVisitors;
      }
    });
    return { visits, unique };
  }, [analyticsData.monthly]);

  const topPages = useMemo(() => {
    if (!todayData?.pages) return [];
    return Object.entries(todayData.pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));
  }, [todayData]);

  const portfolioRanking = useMemo(() => {
    return portfolio
      .map(p => ({
        id: p.id,
        title: p.title,
        views: analyticsData.portfolioViews[p.id] || 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }, [portfolio, analyticsData.portfolioViews]);

  const postRanking = useMemo(() => {
    return posts
      .map(p => ({
        id: p.id,
        title: p.title,
        views: analyticsData.postViews[p.id] || 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }, [posts, analyticsData.postViews]);

  const statCards = [
    { id: "stat-today", label: "오늘 방문", value: todayVisits, sub: `순방문자 ${todayUnique}명`, icon: Eye, color: "text-blue-400/70" },
    { id: "stat-month", label: "이번 달 방문", value: monthlyData.visits, sub: `순방문자 ${monthlyData.unique}명`, icon: Users, color: "text-green-400/70" },
    { id: "stat-year", label: `${new Date().getFullYear()}년 방문`, value: yearlyTotal.visits, sub: `순방문자 ${yearlyTotal.unique}명`, icon: Calendar, color: "text-cyan-400/70" },
    { id: "stat-total", label: "총 방문 수", value: analyticsData.totalVisits, sub: "누적 전체", icon: TrendingUp, color: "text-purple-400/70" },
    { id: "stat-top", label: "오늘 인기 페이지", value: topPages.length > 0 ? topPages[0].path : "-", sub: topPages.length > 0 ? `${topPages[0].count}회 조회` : "데이터 없음", icon: Globe, color: "text-orange-400/70", isText: true },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(stat => (
          <div key={stat.id} className="p-5 border border-white/[0.06] hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/30 tracking-[0.1em]" style={{ fontSize: "10px", fontWeight: 500 }}>{stat.label.toUpperCase()}</span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div className="text-white" style={{ fontSize: stat.isText ? "14px" : "32px", fontWeight: 200 }}>
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
            </div>
            <span className="text-white/20" style={{ fontSize: "11px" }}>{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 7 Day Chart */}
        <div className="border border-white/[0.06] p-6">
          <h3 className="text-white mb-1" style={{ fontSize: "14px", fontWeight: 500 }}>최근 7일 방문 추이</h3>
          <p className="text-white/20 mb-6" style={{ fontSize: "11px" }}>일별 페이지 방문 수</p>
          <div className="h-[200px]">
            {has7DayData ? (
              <SimpleAreaChart data={chartData7} valueLabel="방문" />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-white/15" style={{ fontSize: "12px" }}>방문 데이터가 쌓이면 차트가 표시됩니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 30 Day Chart */}
        <div className="border border-white/[0.06] p-6">
          <h3 className="text-white mb-1" style={{ fontSize: "14px", fontWeight: 500 }}>최근 30일 방문 추이</h3>
          <p className="text-white/20 mb-6" style={{ fontSize: "11px" }}>일별 순방문자 수</p>
          <div className="h-[200px]">
            {has30DayData ? (
              <SimpleBarChart data={chartData30} labelInterval={7} valueLabel="순방문자" />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-white/15" style={{ fontSize: "12px" }}>방문 데이터가 쌓이면 차트가 표시됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 12 Month Chart */}
      <div className="border border-white/[0.06] p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>연간 월별 방문 추이</h3>
          <span className="text-white/15" style={{ fontSize: "10px" }}>최근 12개월 · 데이터 1년 보존</span>
        </div>
        <p className="text-white/20 mb-6" style={{ fontSize: "11px" }}>월별 총 방문 수 및 순방문자 수</p>
        <div className="h-[260px]">
          {has12MonthData ? (
            <SimpleBarChart
              data={chartData12Months}
              height={260}
              barColor="rgba(100,200,255,0.3)"
              barColor2="rgba(255,255,255,0.15)"
              valueLabel="방문"
              valueLabel2="순방문자"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/15 mb-2" style={{ fontSize: "12px" }}>월별 방문 데이터가 쌓이면 차트가 표시됩니다.</p>
                <p className="text-white/10" style={{ fontSize: "10px" }}>매월 방문 데이터가 자동으로 집계되며, 1년간 보존됩니다.</p>
              </div>
            </div>
          )}
        </div>
        {has12MonthData && (
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 rounded-sm" style={{ background: "rgba(100,200,255,0.4)" }} />
              <span className="text-white/25" style={{ fontSize: "10px" }}>총 방문</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.2)" }} />
              <span className="text-white/25" style={{ fontSize: "10px" }}>순방문자</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Views */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Portfolio Views */}
        <div className="border border-white/[0.06] p-6">
          <h3 className="text-white mb-1" style={{ fontSize: "14px", fontWeight: 500 }}>포트폴리오 조회수</h3>
          <p className="text-white/20 mb-6" style={{ fontSize: "11px" }}>프로젝트별 누적 조회수</p>
          {portfolioRanking.length === 0 || portfolioRanking.every(p => p.views === 0) ? (
            <p className="text-white/15 py-8 text-center" style={{ fontSize: "13px" }}>아직 조회 데이터가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {portfolioRanking.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-white/15 w-5 shrink-0" style={{ fontSize: "11px" }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 truncate" style={{ fontSize: "12px" }}>{item.title}</p>
                    <div className="mt-1.5 h-1 bg-white/[0.04] relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-white/15 transition-all duration-500"
                        style={{ width: `${portfolioRanking[0]?.views ? (item.views / portfolioRanking[0].views) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white/30 shrink-0 tabular-nums" style={{ fontSize: "12px" }}>{item.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Views */}
        <div className="border border-white/[0.06] p-6">
          <h3 className="text-white mb-1" style={{ fontSize: "14px", fontWeight: 500 }}>게시글 조회수</h3>
          <p className="text-white/20 mb-6" style={{ fontSize: "11px" }}>게시글별 누적 조회수</p>
          {postRanking.length === 0 || postRanking.every(p => p.views === 0) ? (
            <p className="text-white/15 py-8 text-center" style={{ fontSize: "13px" }}>아직 조회 데이터가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {postRanking.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-white/15 w-5 shrink-0" style={{ fontSize: "11px" }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 truncate" style={{ fontSize: "12px" }}>{item.title}</p>
                    <div className="mt-1.5 h-1 bg-white/[0.04] relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-white/15 transition-all duration-500"
                        style={{ width: `${postRanking[0]?.views ? (item.views / postRanking[0].views) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white/30 shrink-0 tabular-nums" style={{ fontSize: "12px" }}>{item.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's Page Breakdown */}
      {topPages.length > 0 && (
        <div className="border border-white/[0.06] p-6">
          <h3 className="text-white mb-1" style={{ fontSize: "14px", fontWeight: 500 }}>오늘 페이지별 방문</h3>
          <p className="text-white/20 mb-6" style={{ fontSize: "11px" }}>경로별 조회수</p>
          <div className="space-y-2">
            {topPages.map(page => (
              <div key={page.path} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-white/50 font-mono" style={{ fontSize: "12px" }}>{page.path}</span>
                <span className="text-white/30 tabular-nums" style={{ fontSize: "12px" }}>{page.count}회</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
