import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import Layout from './Layout';
import FinancialSummary from './FinancialSummary';
import DonationsList from './DonationsList';
import ExpensesList from './ExpensesList';
import { festivalService, supabase, Donation, Expense, FestivalSettings } from '../lib/supabase';

interface PublicDashboardProps {
  onAdminClick: () => void;
}

export default function PublicDashboard({ onAdminClick }: PublicDashboardProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [festivalSettings, setFestivalSettings] = useState<FestivalSettings | null>(null);
  const [financialSummary, setFinancialSummary] = useState({
    totalDonations: 0,
    totalExpenses: 0,
    remainingBalance: 0,
    donationCount: 0,
    expenseCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadData();
    setupRealTimeSubscriptions();
  }, []);

  const loadData = async () => {
    try {
      const [donationsData, expensesData, settingsData, summaryData] = await Promise.all([
        festivalService.getDonations(),
        festivalService.getExpenses(),
        festivalService.getFestivalSettings(),
        festivalService.getFinancialSummary()
      ]);

      setDonations(donationsData || []);
      setExpenses(expensesData || []);
      setFestivalSettings(settingsData);
      setFinancialSummary(summaryData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeSubscriptions = () => {
    // Subscribe to donations changes
    const donationsSubscription = supabase
      .channel('donations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donations' },
        () => {
          loadData();
        }
      )
      .subscribe();

    // Subscribe to expenses changes
    const expensesSubscription = supabase
      .channel('expenses-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'expenses' },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      donationsSubscription.unsubscribe();
      expensesSubscription.unsubscribe();
    };
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading festival dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Festival Info Banner */}
      {festivalSettings && (
        <div className="card bg-gradient-to-r from-gray-50 to-white border-l-4 border-l-gray-900 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="heading-lg mb-4">{festivalSettings.festival_name} {festivalSettings.festival_year}</h2>
              <p className="body-lg text-gray-600 mb-4 leading-relaxed">{festivalSettings.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {festivalSettings.location && (
                  <span className="flex items-center gap-1">
                    📍 {festivalSettings.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  📅 {festivalSettings.festival_year}
                </span>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end space-y-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <RefreshCw className="w-4 h-4" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={onAdminClick}
                className="btn-primary"
              >
                <Lock className="w-5 h-5" />
                <span>Admin Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Data Indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3 px-6 py-3 bg-green-50 border border-green-200 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="body-sm font-medium text-green-700">Live Dashboard - Updates Automatically</span>
        </div>
      </div>

      {/* Financial Summary */}
      <FinancialSummary 
        {...financialSummary}
        fundraisingGoal={festivalSettings?.fundraising_goal || 0}
      />

      {/* Donations and Expenses */}
      <div className="grid-responsive-2">
        <DonationsList donations={donations} />
        <ExpensesList expenses={expenses} />
      </div>

      {/* Transparency Statement */}
      <div className="card border-l-4 border-l-blue-500">
        <div className="text-center">
          <h3 className="heading-md mb-6">Complete Financial Transparency</h3>
          <p className="body-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our festival operates with complete financial transparency. All donations received and expenses incurred 
            are publicly displayed in real-time. This ensures accountability and builds trust within our community.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="icon-container-md bg-green-50 mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <p className="heading-lg text-green-600 mb-2">{donations.length}</p>
              <p className="body-sm text-gray-600">Total Donations</p>
            </div>
            <div className="text-center">
              <div className="icon-container-md bg-red-50 mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <p className="heading-lg text-red-600 mb-2">{expenses.length}</p>
              <p className="body-sm text-gray-600">Total Expenses</p>
            </div>
            <div className="text-center">
              <div className="icon-container-md bg-blue-50 mx-auto mb-3">
                <span className="text-2xl">✅</span>
              </div>
              <p className="heading-lg text-blue-600 mb-2">100%</p>
              <p className="body-sm text-gray-600">Transparency</p>
            </div>
            <div className="text-center">
              <div className="icon-container-md bg-purple-50 mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="heading-lg text-purple-600 mb-2">Live</p>
              <p className="body-sm text-gray-600">Real-time Updates</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="text-right">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
                <button
                  onClick={onAdminClick}
                  className="btn-primary"
                >
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Admin Access</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <FinancialSummary 
        {...financialSummary}
        fundraisingGoal={festivalSettings?.fundraising_goal || 0}
      />

      {/* Live Data Indicator */}
      <div className="flex items-center justify-center mobile-section-spacing">
        <div className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-green-700">Live Dashboard - Updates Automatically</span>
        </div>
      </div>

      {/* Donations and Expenses */}
      <div className="mobile-grid-2 mobile-section-spacing">
        <DonationsList donations={donations} />
        <ExpensesList expenses={expenses} />
      </div>

      {/* Transparency Statement */}
      <div className="card">
        <h3 className="text-lg sm:text-xl font-semibold text-black mb-4 sm:mb-6">Financial Transparency</h3>
        <p className="mobile-text text-gray-600 mb-6 sm:mb-8 leading-relaxed">
          Our festival operates with complete financial transparency. All donations received and expenses incurred 
          are publicly displayed in real-time. This ensures accountability and builds trust within our community.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{donations.length}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Total Donations</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">{expenses.length}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Total Expenses</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">100%</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Transparency</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">Live</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time Updates</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}