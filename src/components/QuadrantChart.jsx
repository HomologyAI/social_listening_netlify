'use client';
import React from "react";
import ReactECharts from "echarts-for-react";

export default function QuadrantChart({ coordinates }) {
  if (!coordinates) return null;
  const { origin, themes } = coordinates;
  const option = {
    title: { text: "一级主题象限分布" },
    xAxis: { name: "X", min: 0, max: 100 },
    yAxis: { name: "Y", min: 0, max: 100 },
    series: [
      {
        symbolSize: 30,
        data: themes.map(t => [t.x, t.y, t.label]),
        type: "scatter",
        label: {
          show: true,
          formatter: p => p.data[2],
          position: "top"
        }
      }
    ],
    graphic: [
      {
        type: "line",
        shape: { x1: origin.x, y1: 0, x2: origin.x, y2: 100 },
        style: { stroke: "#aaa", lineWidth: 1 }
      },
      {
        type: "line",
        shape: { x1: 0, y1: origin.y, x2: 100, y2: origin.y },
        style: { stroke: "#aaa", lineWidth: 1 }
      }
    ]
  };

  return (
    <section className="w-full my-8">
      <ReactECharts option={option} style={{ height: 400, width: "100%" }} />
    </section>
  );
}