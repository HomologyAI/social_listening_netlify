'use client';
import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function VolumeSentimentLineChart({ themesData }) {
  if (!themesData || themesData.length === 0) {
    return <div className="p-4 text-center text-gray-500">声量与情感趋势图数据加载中或无数据...</div>;
  }

  // 1. Combine data for sorting
  const combinedData = themesData.map(theme => {
    const volume = theme.summary?.meta?.total_comments || theme.volume || 0;
    const pos = theme.summary?.meta?.sentiment?.positive || theme.sentiment?.pos || 0;
    const neg = theme.summary?.meta?.sentiment?.negative || theme.sentiment?.neg || 0;
    const netSentiment = volume === 0 ? 0 : parseFloat(((pos - neg) / volume * 100).toFixed(1));
    return {
      label: theme.label || theme.summary?.topic || '未知主题',
      volume,
      netSentiment
    };
  });

  // 2. Sort by volume in descending order
  combinedData.sort((a, b) => b.volume - a.volume);

  // 3. Extract sorted data for ECharts
  const themeLabels = combinedData.map(item => item.label);
  const volumeData = combinedData.map(item => item.volume);
  const netSentimentData = combinedData.map(item => item.netSentiment);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: function (params) {
        let tooltipText = `${params[0].name}<br/>`;
        params.forEach(param => {
          const unit = param.seriesName === '情感净值' ? ' %' : '';
          tooltipText += `${param.marker}${param.seriesName}: ${param.value || 0}${unit}<br/>`;
        });
        return tooltipText;
      }
    },
    legend: {
      data: ['总声量', '情感净值'],
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
        name: '总声量 (Volume)',
        position: 'left',
        nameTextStyle: { color: '#555', padding: [0,0,0,50] },
        axisLabel: { color: '#555', formatter: '{value}' },
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#eee' } }
      },
      {
        type: 'value',
        name: '情感净值 (%)',
        position: 'right',
        nameTextStyle: { color: '#555', padding: [0,50,0,0] },
        axisLabel: { color: '#555', formatter: '{value} %' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '总声量',
        type: 'bar',
        data: volumeData, // Use sorted data
        yAxisIndex: 0,
        itemStyle: { color: '#60a5fa' },
        emphasis: { focus: 'series' },
        label: { 
          show: true, 
          position: 'top', 
          formatter: '{c}', 
          color:'#333',
          fontSize: 10 
        }
      },
      {
        name: '情感净值',
        type: 'line',
        data: netSentimentData, // Use sorted data
        yAxisIndex: 1,
        itemStyle: { color: '#22c55e' },
        symbol: 'circle',
        symbolSize: 8,
        smooth: true,
        emphasis: { focus: 'series' },
        label: { 
            show: true, 
            position: 'top', 
            formatter: '{c}%', 
            color:'#16a34a',
            fontSize: 10
        }
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">一级主题声量与情感净值趋势</h2>
      <ReactECharts option={option} style={{ height: '600px', width: '100%' }} notMerge={true} lazyUpdate={true} />
    </div>
  );
} 