'use client';
import React from "react";

export default function ThemeDetail({ theme }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-12 shadow-xl">
      {/* Main Theme Title */}
      <div className="flex items-center mb-3"> 
        {/* You can add a decorative element here if desired, e.g., a colored bar */}
        {/* <div className="w-1.5 h-7 bg-blue-500 rounded-full mr-3"></div> */}
        <h2 className="text-3xl font-bold text-slate-800">{theme.label}</h2>
      </div>

      {/* Meta Information: Volume and Sentiment Scores */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-x-6 gap-y-2 mb-6 text-sm pb-4 border-b border-slate-200">
        <div>
          <span className="text-slate-500">评论数量: </span>
          <span className="font-semibold text-slate-700 text-base">{theme.volume}</span>
        </div>
        <div className="flex items-center flex-wrap gap-x-1">
          <span className="text-slate-500">情感分数: </span>
          <span className="text-green-600 font-medium">积极 {theme.sentiment.pos}</span>
          <span className="text-slate-400">|</span>
          <span className="text-red-600 font-medium">消极 {theme.sentiment.neg}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-medium">中性 {theme.sentiment.neut}</span>
          <span className="text-slate-400">|</span>
          <span className="text-blue-600 font-medium">总体 {theme.sentiment.total}</span>
        </div>
      </div>
      
      {/* Secondary Themes Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-5">二级主题</h3>
        <div className="space-y-6">
          {theme.second_level_themes.map((sub, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-bold text-slate-800 mb-4">{sub.label}</h4>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-start items-center">
                  <span className="text-slate-600 mr-4">声量:</span>
                  <span className="font-medium text-slate-800 text-base">{sub.stats.volume}</span>
                </div>
                <div>
                  <span className="text-slate-600">情感态度: </span>
                  <span className="text-green-600 font-medium">积极 {sub.stats.sentiment?.pos || '0'}</span> |
                  <span className="text-red-600 font-medium"> 消极 {sub.stats.sentiment?.neg || '0'}</span> |
                  <span className="text-slate-500 font-medium"> 中性 {sub.stats.sentiment?.neut || '0'}</span>
                </div>
              </div>
              <div className="space-y-4 mb-5">
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">短总结</h5>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{sub.summary.summary_short}</p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">长总结</h5>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{sub.summary.summary}</p>
                </div>
              </div>
              {sub.summary.keywords && sub.summary.keywords.length > 0 && (
                <div className="mb-5">
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">关键词</h5>
                  <div className="flex flex-wrap gap-2">
                    {sub.summary.keywords.map(k => (
                      <span key={k} className="inline-block bg-sky-100 text-sky-800 text-xs font-medium px-3 py-1 rounded-full">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-green-700 mb-2">正面代表性样本</h5>
                  {(!sub.summary.positive_examples || sub.summary.positive_examples.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">无正面样本</p>
                  ) : (
                    <ul className="list-disc list-inside pl-1 space-y-1 text-xs text-slate-600 leading-normal">
                      {sub.summary.positive_examples.map((s, i) => <li key={i} className="break-words">{s}</li>)}
                    </ul>
                  )}
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-red-700 mb-2">负面代表性样本</h5>
                  {(!sub.summary.negative_examples || sub.summary.negative_examples.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">无负面样本</p>
                  ) : (
                    <ul className="list-disc list-inside pl-1 space-y-1 text-xs text-slate-600 leading-normal">
                      {sub.summary.negative_examples.map((s, i) => <li key={i} className="break-words">{s}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}