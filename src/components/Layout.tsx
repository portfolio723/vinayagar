import React from 'react';
import { Heart, Calendar } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export default function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {showHeader && (
        <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto mobile-padding">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="mobile-heading text-black">Vinayaka Chavithi 2025</h1>
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center mt-1 sm:mt-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Community Festival Dashboard
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-gray-600">Bringing Community Together</p>
                  <p className="text-xs sm:text-sm font-medium text-black">Through Devotion & Celebration</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="max-w-7xl mx-auto mobile-padding">
        {children}
      </main>

      <footer className="border-t border-gray-100 bg-gray-50/50 mt-16">
        <div className="max-w-7xl mx-auto mobile-padding">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <h3 className="mobile-subheading font-semibold text-black mb-3 sm:mb-4">Vinayaka Chavithi Festival</h3>
            <p className="mobile-text text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Celebrating Lord Ganesha with devotion, community spirit, and transparency. 
              All festival finances are publicly available for complete community transparency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-gray-500 font-medium">
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