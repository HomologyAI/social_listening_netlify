'use client';
import React, { useState } from 'react';
import Link from 'next/link'; // Using Next.js Link for client-side navigation for any actual page links if needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Define navigation items here. href will point to #idOfSection
  // We'll need to add these IDs to your sections in page.js later
  const navItems = [
    { label: '情感声量分布图', href: '#stacked-sentiment-chart' },
    { label: '声量与情感净值图', href: '#volume-sentiment-chart' },
    { label: '象限分布图', href: '#quadrant-chart' },
    { label: '整体总结报告', href: '#summary-report' },
    { label: '主题详细解析区', href: '#theme-details-section' },
    // Add more items as needed, potentially for each ThemeDetail card if desired
  ];

  return (
    <nav className="bg-slate-800 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl hover:text-slate-300 transition-colors">
              数据洞察平台
            </Link>
          </div>
          {/* Desktop Menu & Toggle Button for Mobile */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a // Using <a> for in-page anchors
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-slate-700 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">打开主菜单</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a // Using <a> for in-page anchors
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close menu on click
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 