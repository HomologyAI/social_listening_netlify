"use client";
import React from "react";
import { sanitizeForId } from '../utils/sanitizeForId'; // Import external sanitizeForId

const SidebarTOC = ({ themes = [], isOpen, setIsOpen }) => {
  const tocItems = [];

  // Define labels without leading spaces for indentation
  tocItems.push({ label: "情感声量分布图", href: "#stacked-sentiment-chart", type: "main_chart" });
  tocItems.push({ label: "声量与情感净值图", href: "#volume-sentiment-chart", type: "main_chart" });
  tocItems.push({ label: "象限分布图", href: "#quadrant-chart", type: "main_chart" });

  // 2. Link to the main ThemeSummaryReport section container
  if (themes.length > 0) {
    tocItems.push({
      label: "整体总结报告", // This is the main title for the section of summary reports
      href: "#summary-report", // ID of the <section> in ThemeSummaryReport.jsx
      type: "main_summary_header",
      isHeader: false, // Make it a clickable link to the top of the summary reports area
    });

    // Links to individual theme summary cards
    themes.forEach(theme => {
      const themeTitleText = theme.label || theme.summary?.topic || "untitled-theme";
      const themeSanitizedUrlPart = sanitizeForId(themeTitleText);
      tocItems.push({
        label: `${themeTitleText} (概览)`,
        href: `#theme-summary-report-${themeSanitizedUrlPart}`,
        type: "theme_summary_card_item",
      });
    });
  }

  // 3. Link to the main ThemeDetail section container
  if (themes.length > 0) {
    tocItems.push({
      label: "各主题详细解析", // This is the main title for the section of detail reports
      href: "#theme-details-section", // ID of the main div for theme details in page.js
      type: "main_detail_header",
      isHeader: false, // Make it a clickable link to the top of the details area
      className: "pt-3" // Add some top padding for visual separation
    });

    // Links to individual theme detail cards
    themes.forEach(theme => {
      const themeTitleText = theme.label || theme.summary?.topic || "untitled-theme";
      const parentThemeSanitizedIdentifier = sanitizeForId(themeTitleText);
      // Link to the parent ThemeDetail card
      tocItems.push({
        label: `${themeTitleText} (详情总览)`,
        href: `#theme-detail-${parentThemeSanitizedIdentifier}`,
        type: "theme_detail_card_item",
      });

      // Links to individual second-level theme cards within this ThemeDetail
      if (theme.second_level_themes && theme.second_level_themes.length > 0) {
        theme.second_level_themes.forEach(subTheme => {
          const subThemeTitle = subTheme.label || 'untitled-subtheme';
          const subThemeHref = `#theme-detail-${parentThemeSanitizedIdentifier}-subtheme-${sanitizeForId(subThemeTitle)}`;
          tocItems.push({
            label: `${subThemeTitle}`,
            href: subThemeHref,
            type: "theme_sub_detail_item",
          });
        });
      }
    });
  }

  const getTocItemStyles = (type) => {
    let paddingClass = "";
    let prefix = "";
    switch (type) {
      case "theme_summary_card_item":
      case "theme_detail_card_item":
        paddingClass = "pl-4";
        prefix = "└ ";
        break;
      case "theme_sub_detail_item":
        paddingClass = "pl-8";
        prefix = "› ";
        break;
      // default: no padding, no prefix for main_chart, main_summary_header, main_detail_header
    }
    return { paddingClass, prefix };
  };

  return (
    <>
      {/* Overlay for closing sidebar on click outside (useful on mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-800 text-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"}`}
        aria-label="Table of Contents"
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-xl font-semibold">目录</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-300 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label="关闭目录"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto p-4 space-y-1">
          {tocItems.map((item, index) => {
            const { paddingClass, prefix } = getTocItemStyles(item.type);
            return (
              <a
                key={`${item.href}-${index}`}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm hover:bg-slate-700 transition-colors focus:outline-none focus:bg-slate-700 ${item.className || ''} ${paddingClass}`}
              >
                {prefix && <span className="mr-1">{prefix}</span>}
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
          点击条目跳转至对应位置
        </div>
      </aside>

      {/* Button to open sidebar (always visible when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-md shadow-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          aria-label="打开目录"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      )}
    </>
  );
};

export default SidebarTOC; 