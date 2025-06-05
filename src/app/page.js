'use client';
import { useEffect, useState } from "react";
import ThemeSummaryReport from "../components/ThemeSummaryReport";
import QuadrantChart from "../components/QuadrantChart";
import ThemeDetail from "../components/ThemeDetail";
import StackedSentimentBarChart from "../components/StackedSentimentBarChart";
import VolumeSentimentLineChart from "../components/VolumeSentimentLineChart";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("data/autohome_dongchedi_summary_postprocess.json")
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
    <div className="mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      {themes.length > 0 && (
        <div className="flex flex-row w-full gap-8 mb-10">
          <div className="w-1/2 min-w-0">
            <StackedSentimentBarChart themesData={themes} />
          </div>
          <div className="w-1/2 min-w-0">
            <VolumeSentimentLineChart themesData={themes} />
          </div>
        </div>
      )}

      {data.coordinates && <QuadrantChart coordinates={data.coordinates} />}
      
      {themes.length > 0 && <ThemeSummaryReport themes={themes} />}

      {themes.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center border-t pt-8 border-slate-300">各主题详细解析</h2>
          {themes.map(theme => (
            <ThemeDetail key={theme.label || theme.summary?.topic} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}
