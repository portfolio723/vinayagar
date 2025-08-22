import React from 'react';
import { Heart, Calendar } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export default function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto container-padding py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="icon-container-md bg-gray-900">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="heading-md">Vinayaka Chavithi 2025</h1>
                  <p className="body-sm text-gray-600 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Community Festival Dashboard
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-right">
                  <p className="body-sm text-gray-600">Bringing Community Together</p>
                  <p className="body-sm font-medium text-gray-900">Through Devotion & Celebration</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="max-w-7xl mx-auto container-padding section-spacing content-spacing">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto container-padding section-spacing">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="icon-container-sm bg-gray-900">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="heading-md mb-4">Vinayaka Chavithi Festival</h3>
            <p className="body-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Celebrating Lord Ganesha with devotion, community spirit, and transparency. 
              All festival finances are publicly available for complete community transparency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 body-sm text-gray-500 font-medium">
              <span>Financial Transparency</span>
              <span className="hidden sm:inline">•</span>
              <span>Community Driven</span>
              <span className="hidden sm:inline">•</span>
              <span>Real-time Updates</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}