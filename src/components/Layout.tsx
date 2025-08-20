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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-black">Vinayaka Chavithi 2025</h1>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Community Festival Dashboard
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Bringing Community Together</p>
                  <p className="text-sm font-medium text-black">Through Devotion & Celebration</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-100 bg-gray-50/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Vinayaka Chavithi Festival</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Celebrating Lord Ganesha with devotion, community spirit, and transparency. 
              All festival finances are publicly available for complete community transparency.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <span>Financial Transparency</span>
              <span>•</span>
              <span>Community Driven</span>
              <span>•</span>
              <span>Real-time Updates</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}