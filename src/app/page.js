'use client';
import { useEffect, useState } from "react";
import ThemeSummaryReport from "../components/ThemeSummaryReport";
import QuadrantChart from "../components/QuadrantChart";
import ThemeDetail from "../components/ThemeDetail";
import StackedSentimentBarChart from "../components/StackedSentimentBarChart";
import VolumeSentimentLineChart from "../components/VolumeSentimentLineChart";
import SidebarTOC from "../components/SidebarTOC";
import { sanitizeForId } from "../utils/sanitizeForId";

export default function Home() {
  const [data, setData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetch("data/autohome_dongchedi_summary_postprocess_优化_merge.json")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="text-center mt-20 text-lg text-slate-500">数据努力加载中，请稍候...</div>;

  const themes = data && data.first_level_themes
  ? Object.entries(data.first_level_themes).map(([label, value]) => ({
      label,
      ...(typeof value === 'object' && value !== null ? value : {})
    }))
  : [];

  return (
    <>
      <SidebarTOC themes={themes} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`mx-auto p-4 md:p-8 bg-slate-50 min-h-screen ml-72`}>
        {themes.length > 0 && (
          <div className="flex flex-col lg:flex-row w-full gap-8 mb-10">
            <div id="stacked-sentiment-chart" className="w-full lg:w-1/2 min-w-0">
              <StackedSentimentBarChart themesData={themes} />
            </div>
            <div id="volume-sentiment-chart" className="w-full lg:w-1/2 min-w-0">
              <VolumeSentimentLineChart themesData={themes} />
            </div>
          </div>
        )}

        {data.coordinates && 
          <div id="quadrant-chart" className="mb-10">
            <QuadrantChart coordinates={data.coordinates} />
          </div>
        }
        
        {themes.length > 0 && 
          <div id="summary-report" className="mb-10 scroll-mt-16">
            <ThemeSummaryReport themes={themes} />
          </div>
        }

        {themes.length > 0 && (
          <div id="theme-details-section" className="mt-12 scroll-mt-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center border-t pt-8 border-slate-300">各主题详细解析</h2>
            {themes.map((theme, index) => {
              const themeTitle = theme.label || theme.summary?.topic || "untitled-theme";
              const parentThemeSanitizedIdentifier = sanitizeForId(themeTitle);
              const themeId = `theme-detail-${parentThemeSanitizedIdentifier}`;
              return (
                <div id={themeId} key={index} className="mb-8 scroll-mt-20">
                  <ThemeDetail theme={theme} parentThemeSanitizedIdentifier={parentThemeSanitizedIdentifier} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
