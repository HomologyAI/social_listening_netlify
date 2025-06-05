'use client';
import React from "react";
import ReactECharts from "echarts-for-react";

export default function QuadrantChart({ coordinates }) {
  if (!coordinates || !coordinates.themes || coordinates.themes.length === 0) {
    const defaultOption = {
      title: { text: "一级主题象限分布" },
      xAxis: { name: "X", min: 0, max: 100 },
      yAxis: { name: "Y", min: 0, max: 100 },
      series: [{ type: "scatter", data: [], markLine: {
        data: [
          // 垂直线：x=50
          { xAxis: 50 },
          // 水平线：y=50
          { yAxis: 50 }
        ],
        lineStyle: { color: "#FFC0CB", width: 3 }
      } }],
      
    };
    console.log("Using default option due to empty/missing themes:", defaultOption);
    return (
      <section className="w-full my-8">
        <ReactECharts option={defaultOption} style={{ height: 400, width: "100%" }} />
      </section>
    );
  }

  const { origin, themes } = coordinates;

  const xValues = themes.map(t => t[1]);
  const yValues = themes.map(t => t[2]);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const absoluteMinBuffer = 10; 

  const xBuffer = Math.max((maxX - minX) * 0.1, absoluteMinBuffer);
  const yBuffer = Math.max((maxY - minY) * 0.1, absoluteMinBuffer);

  const xAxisMin = Math.floor(minX - xBuffer);
  const xAxisMax = Math.ceil(maxX + xBuffer);
  const yAxisMin = Math.floor(minY - yBuffer);
  const yAxisMax = Math.ceil(maxY + yBuffer);

  const option = {
    title: { text: "一级主题象限分布" },
    xAxis: { name: "X", min: xAxisMin, max: xAxisMax },
    yAxis: { name: "Y", min: yAxisMin, max: yAxisMax },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (params.data && params.data.length > 2) {
          return `${params.data[2]} (${params.data[0]}, ${params.data[1]})`;
        }
        return '';
      }
    },
    series: [
      {
        symbolSize: 10,
        data: themes.map(t => [t[1], t[2], t[0]]),
        type: "scatter",
        label: {
          show: true,
          formatter: p => p.data[2],
          position: "top"
        },
        markLine: {
          data: [
            { xAxis: origin[1] },
            { yAxis: origin[2] }
          ],
          lineStyle: { color: "#FFC0CB", width: 3 }
        }
      }
    ]
  };
console.log(option)
  return (
    <section className="w-full my-8">
      <ReactECharts option={option} style={{ height: 400, width: "100%" }} />
    </section>
  );
}
