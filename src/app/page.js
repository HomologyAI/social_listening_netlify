'use client';
import { useEffect, useState } from "react";
import ThemeSummaryReport from "../components/ThemeSummaryReport";
import QuadrantChart from "../components/QuadrantChart";
import ThemeDetail from "../components/ThemeDetail";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("data/autohome_dongchedi_summary_postprocess.json")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="text-center mt-20">加载中...</div>;

  const themes = data.first_level_themes
  ? Object.entries(data.first_level_themes).map(([label, value]) => ({
      label,
      ...value
    }))
  : [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ThemeSummaryReport themes={themes} />
      <QuadrantChart coordinates={data.coordinates} />
      <div>
        {themes.map(theme => (
          <ThemeDetail key={theme.label} theme={theme} />
        ))}
      </div>
    </div>
  );
}
