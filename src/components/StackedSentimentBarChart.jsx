'use client';
import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function StackedSentimentBarChart({ themesData }) {
  if (!themesData || themesData.length === 0) {
    return <div className="p-4 text-center text-gray-500">情感分布柱状图数据加载中或无数据...</div>;
  }

  // 1. Combine data for sorting
  const combinedData = themesData.map(theme => {
    const positive = theme.summary?.meta?.sentiment?.positive || theme.sentiment?.pos || 0;
    const neutral = theme.summary?.meta?.sentiment?.neutral || theme.sentiment?.neut || 0;
    const negative = theme.summary?.meta?.sentiment?.negative || theme.sentiment?.neg || 0;
    return {
      label: theme.label || theme.summary?.topic || '未知主题',
      positive,
      neutral,
      negative,
      total: positive + neutral + negative
    };
  });

  // 2. Sort by total volume in descending order
  combinedData.sort((a, b) => b.total - a.total);

  // 3. Extract sorted data for ECharts
  const themeLabels = combinedData.map(item => item.label);
  const positiveData = combinedData.map(item => item.positive);
  const neutralData = combinedData.map(item => item.neutral);
  const negativeData = combinedData.map(item => item.negative);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        let tooltipText = `${params[0].name}<br/>`;
        let total = 0;
        params.forEach(param => {
          tooltipText += `${param.marker}${param.seriesName}: ${param.value || 0}<br/>`;
          total += (param.value || 0);
        });
        tooltipText += `<strong>总计: ${total}</strong>`;
        return tooltipText;
      }
    },
    legend: {
      data: ['正面声量', '中性声量', '负面声量'],
      bottom: 10,
      itemGap: 20,
      textStyle: { color: '#333' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: themeLabels, // Use sorted labels
        axisTick: { alignWithLabel: true },
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: '#555'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '声量 (Volume)',
        nameTextStyle: { color: '#555', padding: [0, 0, 0, 50] },
        axisLabel: { color: '#555' }
      }
    ],
    series: [
      {
        name: '正面声量',
        type: 'bar',
        stack: 'total',
        label: { show: false },
        emphasis: { focus: 'series' },
        data: positiveData, // Use sorted data
        itemStyle: { color: '#22c55e' }
      },
      {
        name: '中性声量',
        type: 'bar',
        stack: 'total',
        label: { show: false },
        emphasis: { focus: 'series' },
        data: neutralData, // Use sorted data
        itemStyle: { color: '#f97316' }
      },
      {
        name: '负面声量',
        type: 'bar',
        stack: 'total',
        label: { show: false },
        emphasis: { focus: 'series' },
        data: negativeData, // Use sorted data
        itemStyle: { color: '#ef4444' }
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        show: themeLabels.length > 10,
        xAxisIndex: [0],
        start: 0,
        end: themeLabels.length > 10 ? (10 / themeLabels.length) * 100 : 100,
        bottom: 40,
        height: 20
      }
    ],
    graphic: !themesData || themesData.length === 0 ? [{
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
            text: '暂无数据',
            font: 'bold 20px Microsoft YaHei',
            fill: '#999'
        }
    }] : null
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-4 md:p-6 my-10 border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">一级主题情感声量分布</h2>
      <ReactECharts option={option} style={{ height: '600px', width: '100%' }} notMerge={true} lazyUpdate={true} />
    </div>
  );
} 