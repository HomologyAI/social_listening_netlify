'use client';
import React from "react";
import { sanitizeForId } from '../utils/sanitizeForId';

export default function ThemeSummaryReport({ themes }) {
  // console.log(themes);
  return (
    <section id="summary-report" className="w-full mb-8 scroll-mt-16">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8 tracking-wide">领克 900 用户深度洞察报告</h1>
      <div className="space-y-8">
        {themes.map(theme => {
          const themeIdentifier = theme.label || theme.summary?.topic || `theme-${Math.random().toString(36).substring(2, 9)}`;
          const themeReportCardId = `theme-summary-report-${sanitizeForId(themeIdentifier)}`;
          return (
            <div id={themeReportCardId} key={themeIdentifier} className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 scroll-mt-20">
              <div className="flex items-center mb-4">
                <div className="w-2 h-8 bg-blue-600 rounded mr-3"></div>
                <h2 className="text-2xl font-bold text-blue-800">{theme.label}</h2>
              </div>
              <div className="flex flex-wrap gap-6 mb-6 text-gray-700">
                <div>评论数量：<span className="font-bold">{theme.summary?.meta?.total_comments || theme.volume}</span></div>
                <div>
                  情感分数：
                  <span className="text-green-600 ml-1">积极 {theme.sentiment?.pos}</span>
                  <span className="text-red-600 ml-2">消极 {theme.sentiment?.neg}</span>
                  <span className="text-gray-600 ml-2">中性 {theme.sentiment?.neut}</span>
                </div>
                <div>整体分数：<span className="font-bold">{(theme.sentiment?.total / theme.volume * 100).toFixed(2) + `%`}</span></div>
              </div>
              <SummaryBlock summaryData={theme.summary} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SummaryBlock({ summaryData }) {
  if (!summaryData || typeof summaryData !== 'object' || Object.keys(summaryData).length === 0) {
    return <div className="text-gray-400">暂无总结数据</div>;
  }

  const sections = [];
  const { summary, representative_comments, trend_and_suggestion } = summaryData;

  if (summary) {
    if (summary.tone_summary && summary.tone_summary.trim()) {
      sections.push({ title: '整体论调总结', content: summary.tone_summary.trim(), type: 'tone_summary' });
    }
    if (summary.positive_focus && summary.positive_focus.length > 0) {
      sections.push({ title: '正面焦点', content: summary.positive_focus.map(item => `- ${item}`).join('\n'), type: 'positive_focus' });
    }
    if (summary.negative_focus && summary.negative_focus.length > 0) {
      sections.push({ title: '负面焦点', content: summary.negative_focus.map(item => `- ${item}`).join('\n'), type: 'negative_focus' });
    }
    if (summary.consensus && summary.consensus.length > 0) {
      sections.push({ title: '共识', content: summary.consensus.map(item => `- ${item}`).join('\n'), type: 'consensus' });
    }
    if (summary.divergence && summary.divergence.length > 0) {
      sections.push({ title: '分歧点', content: summary.divergence.map(item => `- ${item}`).join('\n'), type: 'divergence' });
    }
  }

  if (representative_comments) {
    if (representative_comments.positive && representative_comments.positive.trim()) {
      sections.push({ title: '正面代表性评论', content: representative_comments.positive.trim(), type: 'positive_comment' });
    }
    if (representative_comments.negative && representative_comments.negative.trim()) {
      sections.push({ title: '负面代表性评论', content: representative_comments.negative.trim(), type: 'negative_comment' });
    }
  }

  if (trend_and_suggestion) {
    if (trend_and_suggestion.insight && trend_and_suggestion.insight.trim()) {
      sections.push({ title: '洞察', content: trend_and_suggestion.insight.trim(), type: 'insight' });
    }
    if (trend_and_suggestion.risk_and_opportunity && trend_and_suggestion.risk_and_opportunity.length > 0) {
      sections.push({ title: '风险与机遇', content: trend_and_suggestion.risk_and_opportunity.map(item => `- ${item}`).join('\n'), type: 'risk_opportunity' });
    }
  }

  if (sections.length === 0) {
    return <div className="text-gray-400">总结内容为空</div>;
  }

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => {
        return <SectionCard key={idx} section={section} />;
      })}
    </div>
  );
}

function SectionCard({ section }) {
  const { title, content, type } = section;
  
  const getTypeStyles = () => {
    switch (type) {
      case 'tone_summary':
        return { bgColor: 'bg-green-50', titleColor: 'text-green-700', borderColor: 'border-green-200' };
      case 'positive_focus':
      case 'positive_comment':
        return { bgColor: 'bg-emerald-50', titleColor: 'text-emerald-700', borderColor: 'border-emerald-200' };
      case 'negative_focus':
      case 'negative_comment':
        return { bgColor: 'bg-red-50', titleColor: 'text-red-700', borderColor: 'border-red-200' };
      case 'consensus':
        return { bgColor: 'bg-cyan-50', titleColor: 'text-cyan-700', borderColor: 'border-cyan-200' };
      case 'divergence':
        return { bgColor: 'bg-amber-50', titleColor: 'text-amber-700', borderColor: 'border-amber-200' };
      case 'insight':
        return { bgColor: 'bg-purple-50', titleColor: 'text-purple-700', borderColor: 'border-purple-200' };
      case 'risk_opportunity':
        return { bgColor: 'bg-indigo-50', titleColor: 'text-indigo-700', borderColor: 'border-indigo-200' };
      case 'summary_short': 
        return { bgColor: 'bg-teal-50', titleColor: 'text-teal-700', borderColor: 'border-teal-200' };
      case 'keywords': 
        return { bgColor: 'bg-sky-50', titleColor: 'text-sky-700', borderColor: 'border-sky-200' };
      default:
        return { bgColor: 'bg-gray-50', titleColor: 'text-gray-700', borderColor: 'border-gray-200' };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`${styles.bgColor} ${styles.borderColor} border rounded-lg p-4`}>
      <div className="flex items-center mb-3">
        <div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
        <h3 className={`text-lg font-semibold ${styles.titleColor}`}>{title}</h3>
      </div>
      <div className="text-gray-800 leading-relaxed">
        <ContentRenderer content={content} />
      </div>
    </div>
  );
}

function ContentRenderer({ content }) {
  if (typeof content !== 'string' || !content.trim()) return null;
  
  const parts = content.split(/\n\n+/).filter(Boolean);
  
  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        const trimmedPart = part.trim();
        
        if (trimmedPart.includes('\n- ') || trimmedPart.startsWith('- ')) {
          const listSegments = trimmedPart.split(/\n-\s*/);
          const intro = listSegments[0] && !listSegments[0].startsWith('- ') ? listSegments[0].trim() : null;
          const items = intro ? listSegments.slice(1) : listSegments.map(s => s.replace(/^- /, '').trim()).filter(Boolean);

          return (
            <div key={idx}>
              {intro && <p className="mb-2 text-sm leading-relaxed">{intro}</p>}
              {items.length > 0 && (
                <ul className="list-disc pl-6 space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm leading-relaxed">{item}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        }
        
        return (
          <p key={idx} className="text-sm leading-relaxed">
            {trimmedPart}
          </p>
        );
      })}
    </div>
  );
}