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
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">{festivalSettings.festival_name}</h2>
              <p className="text-gray-600 mb-2">{festivalSettings.description}</p>
              <p className="text-sm text-gray-500">
                {festivalSettings.location} • {festivalSettings.festival_year}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
                <button
                  onClick={onAdminClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  <Lock className="w-4 h-4" />
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
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Live Dashboard - Updates Automatically</span>
        </div>
      </div>

      {/* Donations and Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <DonationsList donations={donations} />
        <ExpensesList expenses={expenses} />
      </div>

      {/* Transparency Statement */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-black mb-3">Financial Transparency</h3>
        <p className="text-gray-600 mb-4">
          Our festival operates with complete financial transparency. All donations received and expenses incurred 
          are publicly displayed in real-time. This ensures accountability and builds trust within our community.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{donations.length}</p>
            <p className="text-sm text-gray-500">Total Donations</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{expenses.length}</p>
            <p className="text-sm text-gray-500">Total Expenses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">100%</p>
            <p className="text-sm text-gray-500">Transparency</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">Live</p>
            <p className="text-sm text-gray-500">Real-time Updates</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}