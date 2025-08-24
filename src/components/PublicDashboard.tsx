import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Calendar, MapPin, Target, Users, Heart, Receipt } from 'lucide-react';
import Layout from './Layout';
import FinancialSummary from './FinancialSummary';
import DonationsList from './DonationsList';
import ExpensesList from './ExpensesList';
import { festivalService, FestivalSettings, Donation, Expense } from '../lib/supabase';

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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading festival dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <Layout onAdminClick={onAdminClick}>
      {/* Financial Summary */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Financial Overview</h2>
            <p className="text-gray-600">Complete transparency in festival finances</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-700">{formatDate(lastUpdated)}</p>
            </div>
            <button
              onClick={loadData}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <FinancialSummary 
          {...financialSummary}
          fundraisingGoal={festivalSettings?.fundraising_goal || 0}
        />
      </div>

      {/* Donations and Expenses */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <DonationsList 
          donations={donations} 
          showAllDetails={false}
        />
        <ExpensesList 
          expenses={expenses} 
          showAllDetails={false}
        />
      </div>

      {/* Transparency Statement */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Financial Transparency</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Every donation received and every expense made for this festival is recorded and displayed here in real-time. 
            Our commitment to transparency ensures that our community can see exactly how their contributions are being used 
            to create a memorable celebration of Lord Ganesha.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 mb-1">Every Donation</h4>
              <p className="text-sm text-green-700">Recorded with gratitude</p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <Receipt className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold text-red-900 mb-1">Every Expense</h4>
              <p className="text-sm text-red-700">Documented transparently</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 mb-1">Real-time Updates</h4>
              <p className="text-sm text-blue-700">Always current information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Access */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={onAdminClick}
          className="bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200 group"
          title="Admin Access"
        >
          <Shield className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    </Layout>
  );
}
  )
}