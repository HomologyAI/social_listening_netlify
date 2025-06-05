'use client';
import React from "react";
import ReactECharts from "echarts-for-react";

export default function QuadrantChart({ coordinates }) {
  if (!coordinates || !coordinates.themes || coordinates.themes.length === 0) {
    const defaultOption = {
      title: { text: "一级主题象限分布" },
      xAxis: { name: "情感值 (Sentiment)", min: 0, max: 100, nameLocation: 'middle', nameGap: 25 },
      yAxis: { name: "声量值 (Social Buzz)", min: 0, max: 100, nameLocation: 'middle', nameGap: 35 },
      series: [{
        type: "scatter", data: [],
        markLine: {
          silent: true,
          data: [
            { xAxis: 50, lineStyle: { color: "#cccccc", type: 'dashed' } },
            { yAxis: 50, lineStyle: { color: "#cccccc", type: 'dashed' } }
          ],
          lineStyle: { color: "#FFC0CB", width: 3 }
        }
      }],
      graphic: [
        { type: 'text', left: '10%', top: '10%', style: { text: '风险预警\nRisk Warning', textAlign: 'center', fill: '#A9A9A9', font: 'bold 12px sans-serif' } },
        { type: 'text', right: '10%', top: '10%', style: { text: '重要卖点\nKey Selling Points', textAlign: 'center', fill: '#A9A9A9', font: 'bold 12px sans-serif' } },
        { type: 'text', left: '10%', bottom: '10%', style: { text: '持续关注\nAwareness Tracking', textAlign: 'center', fill: '#A9A9A9', font: 'bold 12px sans-serif' } },
        { type: 'text', right: '10%', bottom: '10%', style: { text: '潜在卖点\nPotential Highlights', textAlign: 'center', fill: '#A9A9A9', font: 'bold 12px sans-serif' } },
      ]
    };
    return (
      <section className="w-full my-8">
        <ReactECharts option={defaultOption} style={{ height: 500, width: "100%" }} />
      </section>
    );
  }

  const { origin, themes } = coordinates;
  const [originX, originY] = origin;

  const xValues = themes.map(t => t[1]);
  const yValues = themes.map(t => t[2]);

  const minX = Math.min(...xValues, originX);
  const maxX = Math.max(...xValues, originX);
  const minY = Math.min(...yValues, originY);
  const maxY = Math.max(...yValues, originY);

  const absoluteMinBuffer = 10; 
  const xBuffer = Math.max((maxX - minX) * 0.15, absoluteMinBuffer);
  const yBuffer = Math.max((maxY - minY) * 0.15, absoluteMinBuffer);

  const xAxisMin = Math.floor(minX - xBuffer);
  const xAxisMax = Math.ceil(maxX + xBuffer);
  const yAxisMin = Math.floor(minY - yBuffer);
  const yAxisMax = Math.ceil(maxY + yBuffer);

  const option = {
    title: { text: "一级主题象限分布", left: 'center' },
    grid: { top: '12%', bottom: '12%', left: '12%', right: '12%', containLabel: true },
    xAxis: { 
      name: "情感值 (Sentiment)", 
      min: xAxisMin, 
      max: xAxisMax, 
      nameLocation: 'middle', 
      nameGap: 30,
      nameTextStyle: { fontWeight: 'bold' },
      splitLine: { 
        show: true,
      },
      axisLine: { show: true, lineStyle: { color: '#999' } },
      axisTick: { show: true, lineStyle: { color: '#999' } }
    },
    yAxis: { 
      name: "声量值 (Social Buzz)", 
      min: yAxisMin, 
      max: yAxisMax, 
      nameLocation: 'middle', 
      nameGap: 45,
      nameTextStyle: { fontWeight: 'bold' },
      splitLine: { 
        show: true,
      },
      axisLine: { show: true, lineStyle: { color: '#999' } },
      axisTick: { show: true, lineStyle: { color: '#999' } }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (params.data && params.data.length > 2) {
          return `${params.data[2]} (情感: ${params.data[0]}, 声量: ${params.data[1]})`;
        }
        return '';
      }
    },
    series: [
      {
        symbolSize: 12,
        data: themes.map(t => [t[1], t[2], t[0]]),
        type: "scatter",
        label: {
          show: true,
          formatter: p => p.data[2],
          position: "top",
          fontSize: 10,
          color: '#333'
        },
        markLine: {
          silent: true,
          precision: 2,
          label: { show: false },
          lineStyle: { color: "#FFC0CB", width: 3 },
          data: [
            { xAxis: origin[1] },
            { yAxis: origin[2] }
          ],
        }
      }
    ],
    graphic: [
      { type: 'text', left: '10%', top: '5%', style: { text: '风险预警\nRisk Warning', textAlign: 'center', fill: '#D0021B', font: 'bold 14px sans-serif' } },
      { type: 'text', right: '10%', top: '5%', style: { text: '重要卖点\nKey Selling Points', textAlign: 'center', fill: '#4A90E2', font: 'bold 14px sans-serif' } },
      { type: 'text', left: '10%', bottom: '5%', style: { text: '持续关注\nAwareness Tracking', textAlign: 'center', fill: '#F5A623', font: 'bold 14px sans-serif' } },
      { type: 'text', right: '10%', bottom: '5%', style: { text: '潜在卖点\nPotential Highlights', textAlign: 'center', fill: '#7ED321', font: 'bold 14px sans-serif' } },
    ]
  };

  return (
    <section className="w-full my-8">
      <ReactECharts option={option} style={{ height: 550, width: "100%" }} />
    </section>
  );
}
