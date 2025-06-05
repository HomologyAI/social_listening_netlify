'use client';
import React from "react";

export default function ThemeSummaryReport({ themes }) {
  return (
    <section className="w-full mb-8">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8 tracking-wide">领克 900 用户深度洞察报告</h1>
      <div className="space-y-8">
        {themes.map(theme => (
          <div key={theme.label} className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
            {/* 一级主题标题 */}
            <div className="flex items-center mb-4">
              <div className="w-2 h-8 bg-blue-600 rounded mr-3"></div>
              <h2 className="text-2xl font-bold text-blue-800">{theme.label}</h2>
            </div>
            {/* 评论数和情感分数 */}
            <div className="flex flex-wrap gap-6 mb-6 text-gray-700">
              <div>评论数量：<span className="font-bold">{theme.volume}</span></div>
              <div>
                情感分数：
                <span className="text-green-600 ml-1">积极 {theme.sentiment.pos}</span>
                <span className="text-red-600 ml-2">消极 {theme.sentiment.neg}</span>
                <span className="text-gray-600 ml-2">中性 {theme.sentiment.neut}</span>
                <span className="text-blue-600 ml-2">总体 {theme.sentiment.total}</span>
                <span className="text-purple-600 ml-2">净值 {((theme.sentiment.pos - theme.sentiment.neg) / theme.volume * 100).toFixed(2)}</span>
              </div>
            </div>
            {/* summary内容分块渲染 */}
            <SummaryBlock summary={theme.summary} />
          </div>
        ))}
      </div>
    </section>
  );
}

function SummaryBlock({ summary }) {
  if (!summary) return <div className="text-gray-400">暂无总结</div>;

  // 按照实际的标识符分块
  const sections = parseSummaryIntoSections(summary);

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <SectionCard key={idx} section={section} />
      ))}
    </div>
  );
}

function parseSummaryIntoSections(summary) {
  const sections = [];
  
  // 首先按 ▍ 符号分割
  const mainSections = summary.split(/▍/).filter(Boolean);
  
  mainSections.forEach(sectionText => {
    const trimmed = sectionText.trim();
    if (!trimmed) return;
    
    // 提取章节标题（第一行）
    const lines = trimmed.split('\n').filter(Boolean);
    const title = lines[0].replace(/：$/, '').trim();
    const content = lines.slice(1).join('\n');
    
    // 过滤掉重复的统计信息和主题标题
    if (title.includes('总评论量') || 
        title.includes('情绪概览') || 
        title.includes('【一级主题】') ||
        title === '---') {
      return; // 跳过这些重复内容
    }
    
    // 对于综合总结，需要进一步拆分正面反馈和负面反馈
    if (title.includes('综合总结')) {
      const subSections = parseFeedbackSections(content);
      sections.push(...subSections);
      
      // 在综合总结后，继续寻找代表性评论和趋势判断
      const examplesMatch = trimmed.match(/▍\s*代表性评论[^：]*：?\s*([\s\S]*?)(?=▍|$)/);
      if (examplesMatch && examplesMatch[1].trim()) {
        sections.push({
          title: '代表性评论',
          content: examplesMatch[1].trim(),
          type: 'examples'
        });
      }
      
      const suggestionsMatch = trimmed.match(/▍\s*趋势判断[^：]*：?\s*([\s\S]*?)(?=▍|$)/);
      if (suggestionsMatch && suggestionsMatch[1].trim()) {
        sections.push({
          title: '趋势判断 / 潜在建议',
          content: suggestionsMatch[1].trim(),
          type: 'suggestions'
        });
      }
    } else {
      sections.push({
        title,
        content,
        type: getSectionType(title)
      });
    }
  });
  
  // 如果还没找到代表性评论，在整个 summary 中寻找
  if (!sections.some(s => s.type === 'examples')) {
    const examplesMatch = summary.match(/▍\s*代表性评论[^：]*：?\s*([\s\S]*?)(?=▍|$)/);
    if (examplesMatch && examplesMatch[1].trim()) {
      sections.push({
        title: '代表性评论',
        content: examplesMatch[1].trim(),
        type: 'examples'
      });
    }
  }
  
  // 如果还没找到趋势判断，在整个 summary 中寻找
  if (!sections.some(s => s.type === 'suggestions')) {
    const suggestionsMatch = summary.match(/▍\s*趋势判断[^：]*：?\s*([\s\S]*?)(?=▍|$)/);
    if (suggestionsMatch && suggestionsMatch[1].trim()) {
      sections.push({
        title: '趋势判断 / 潜在建议',
        content: suggestionsMatch[1].trim(),
        type: 'suggestions'
      });
    }
  }
  
  return sections;
}

function parseFeedbackSections(content) {
  const sections = [];
  
  // 先添加综合总结的主要内容（在正面反馈之前的部分）
  const summaryMatch = content.match(/^([\s\S]*?)(?=正面反馈|负面反馈|共识|分歧点)/);
  if (summaryMatch && summaryMatch[1].trim()) {
    sections.push({
      title: '综合总结',
      content: summaryMatch[1].trim(),
      type: 'summary'
    });
  }
  
  // 提取正面反馈 - 修复正则，确保不丢失内容
  const positiveMatch = content.match(/正面反馈[^：]*：?\s*\n?([\s\S]*?)(?=\n负面反馈|负面反馈主要集中在|共识：|分歧点：|代表性评论|趋势判断|$)/);
  if (positiveMatch && positiveMatch[1].trim()) {
    sections.push({
      title: '正面反馈',
      content: positiveMatch[1].trim(),
      type: 'positive-feedback'
    });
  }
  
  // 提取负面反馈 - 修复正则
  const negativeMatch = content.match(/负面反馈[^：]*：?\s*\n?([\s\S]*?)(?=\n共识：|共识：|分歧点：|代表性评论|趋势判断|整体情绪|$)/);
  if (negativeMatch && negativeMatch[1].trim()) {
    sections.push({
      title: '负面反馈',
      content: negativeMatch[1].trim(),
      type: 'negative-feedback'
    });
  }
  
  // 提取共识 - 修复正则匹配
  const consensusMatch = content.match(/\*\*共识\*\*：?\s*\n?([\s\S]*?)(?=\n\*\*分歧点\*\*|分歧点：|代表性评论|趋势判断|整体情绪|$)/);
  if (consensusMatch && consensusMatch[1].trim()) {
    sections.push({
      title: '共识',
      content: consensusMatch[1].trim(),
      type: 'consensus'
    });
  }
  
  // 提取分歧点 - 修复正则匹配
  const disagreementMatch = content.match(/\*\*分歧点\*\*：?\s*\n?([\s\S]*?)(?=代表性评论|趋势判断|整体情绪|$)/);
  if (disagreementMatch && disagreementMatch[1].trim()) {
    sections.push({
      title: '分歧点',
      content: disagreementMatch[1].trim(),
      type: 'disagreement'
    });
  }
  
  // 提取整体情绪偏向等其他内容
  const emotionMatch = content.match(/整体情绪[^：]*：?\s*\n?([\s\S]*?)(?=代表性评论|趋势判断|$)/);
  if (emotionMatch && emotionMatch[1].trim()) {
    sections.push({
      title: '整体情绪偏向',
      content: emotionMatch[1].trim(),
      type: 'emotion'
    });
  }
  
  return sections;
}

function getSectionType(title) {
  if (title.includes('总评论量') || title.includes('情绪概览')) return 'stats';
  if (title.includes('综合总结')) return 'summary';
  if (title.includes('正面反馈')) return 'positive-feedback';
  if (title.includes('负面反馈')) return 'negative-feedback';
  if (title.includes('共识')) return 'consensus';
  if (title.includes('分歧点')) return 'disagreement';
  if (title.includes('代表性评论')) return 'examples';
  if (title.includes('趋势判断') || title.includes('潜在建议')) return 'suggestions';
  if (title.includes('整体情绪')) return 'emotion';
  return 'general';
}

function SectionCard({ section }) {
  const { title, content, type } = section;
  
  // 根据类型设置不同的样式
  const getTypeStyles = () => {
    switch (type) {
      case 'stats':
        return {
          bgColor: 'bg-blue-50',
          titleColor: 'text-blue-700',
          borderColor: 'border-blue-200'
        };
      case 'summary':
        return {
          bgColor: 'bg-green-50',
          titleColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case 'positive-feedback':
        return {
          bgColor: 'bg-emerald-50',
          titleColor: 'text-emerald-700',
          borderColor: 'border-emerald-200'
        };
      case 'negative-feedback':
        return {
          bgColor: 'bg-red-50',
          titleColor: 'text-red-700',
          borderColor: 'border-red-200'
        };
      case 'consensus':
        return {
          bgColor: 'bg-cyan-50',
          titleColor: 'text-cyan-700',
          borderColor: 'border-cyan-200'
        };
      case 'disagreement':
        return {
          bgColor: 'bg-amber-50',
          titleColor: 'text-amber-700',
          borderColor: 'border-amber-200'
        };
      case 'examples':
        return {
          bgColor: 'bg-purple-50',
          titleColor: 'text-purple-700',
          borderColor: 'border-purple-200'
        };
      case 'suggestions':
        return {
          bgColor: 'bg-indigo-50',
          titleColor: 'text-indigo-700',
          borderColor: 'border-indigo-200'
        };
      case 'emotion':
        return {
          bgColor: 'bg-pink-50',
          titleColor: 'text-pink-700',
          borderColor: 'border-pink-200'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          titleColor: 'text-gray-700',
          borderColor: 'border-gray-200'
        };
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
  if (!content) return null;
  
  // 将内容按段落和列表分块
  const parts = content.split(/\n\n+/).filter(Boolean);
  
  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        const trimmed = part.trim();
        
        // 如果包含列表项（以 - 开头的行）
        if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
          const listItems = trimmed.split(/\n-\s+/).filter(Boolean);
          const [firstPart, ...items] = listItems;
          
          return (
            <div key={idx}>
              {firstPart && !firstPart.startsWith('-') && (
                <p className="mb-2">{firstPart}</p>
              )}
              <ul className="list-disc pl-6 space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed">{item.trim()}</li>
                ))}
              </ul>
            </div>
          );
        }
        
        // 普通段落
        return (
          <p key={idx} className="text-sm leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}