'use client';
import { useEffect, useState } from "react";
import ThemeSummaryReport from "../components/ThemeSummaryReport";
import QuadrantChart from "../components/QuadrantChart";
import StackedSentimentBarChart from "../components/StackedSentimentBarChart";
import VolumeSentimentLineChart from "../components/VolumeSentimentLineChart";
import SidebarTOC from "../components/SidebarTOC";

export default function Home() {
  const [data, setData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetch("data/output_full_rawtheme.json")
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
      <div className={`transition-all duration-300 ease-in-out p-4 md:p-8 bg-slate-50 min-h-screen ${
        isSidebarOpen ? 'ml-72' : 'mx-auto max-w-7xl'
      }`}>
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8 tracking-wide">Genesis社媒聆听报告</h1>
        
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
      </div>
    </>
  );
}
