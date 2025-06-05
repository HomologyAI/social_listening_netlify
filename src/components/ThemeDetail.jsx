'use client';
import React from "react";

export default function ThemeDetail({ theme }) {
  return (
    <div className="border rounded p-4 mb-8 shadow">
      <div className="font-bold text-lg mb-2">{theme.label}</div>
      <div>评论数量: {theme.volume}</div>
      <div>
        情感分数: 积极 {theme.sentiment.pos} | 消极 {theme.sentiment.neg} | 中性 {theme.sentiment.neut} | 总体 {theme.sentiment.total}
      </div>
      <div>总结: {theme.summary}</div>
      <div className="mt-4">
        <div className="font-semibold mb-2">二级主题</div>
        <div className="grid gap-2">
          {theme.second_level_themes.map(sub => (
            <div key={sub.label} className="border rounded p-2">
              <div className="font-semibold">{sub.label}</div>
              <div>声量: {sub.volume}</div>
              <div>情感态度: {sub.sentiment}</div>
              <div>短总结: {sub.summary.summary_short}</div>
              <div>长总结: {sub.summary.summary}</div>
              <div>
                关键词: {sub.summary.keywords?.map(k => (
                  <span key={k} className="inline-block bg-gray-200 rounded px-2 py-0.5 mr-1">{k}</span>
                ))}
              </div>
              <div>
                正面代表性样本:
                <ul className="list-disc ml-5">
                  {sub.summary.positive_samples?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                负面代表性样本:
                <ul className="list-disc ml-5">
                  {sub.summary.negative_samples?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}