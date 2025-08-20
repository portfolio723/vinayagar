import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Settings, BarChart3, Calendar, Users } from 'lucide-react';
import { festivalService, authService, Donation, Expense, FestivalSettings } from '../lib/supabase';
import DonationForm from './DonationForm';
import ExpenseForm from './ExpenseForm';
import DonationsList from './DonationsList';
import ExpensesList from './ExpensesList';
import FinancialSummary from './FinancialSummary';

interface AdminPanelProps {
  onLogout: () => void;
}

type ActiveTab = 'dashboard' | 'donations' | 'expenses' | 'settings';

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
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
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
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
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDonationAdded = () => {
    setShowDonationForm(false);
    loadData();
  };

  const handleExpenseAdded = () => {
    setShowExpenseForm(false);
    loadData();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'donations', label: 'Donations', icon: Users },
    { id: 'expenses', label: 'Expenses', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-black">Festival Admin</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Live Dashboard
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <FinancialSummary 
              {...financialSummary}
              fundraisingGoal={festivalSettings?.fundraising_goal || 0}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DonationsList donations={donations.slice(0, 5)} />
              <ExpensesList expenses={expenses.slice(0, 5)} />
            </div>
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">Manage Donations</h2>
              <button
                onClick={() => setShowDonationForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Donation</span>
              </button>
            </div>
            <DonationsList donations={donations} showAllDetails />
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">Manage Expenses</h2>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </div>
            <ExpensesList expenses={expenses} showAllDetails />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-black mb-6">Festival Settings</h2>
            {festivalSettings && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-black mb-2">Festival Information</h3>
                    <p className="text-sm text-gray-600">Name: {festivalSettings.festival_name}</p>
                    <p className="text-sm text-gray-600">Year: {festivalSettings.festival_year}</p>
                    <p className="text-sm text-gray-600">Location: {festivalSettings.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2">Financial Goals</h3>
                    <p className="text-sm text-gray-600">
                      Target: ₹{festivalSettings.fundraising_goal?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Progress: {Math.round((financialSummary.totalDonations / (festivalSettings.fundraising_goal || 1)) * 100)}%
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-black mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{festivalSettings.description}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showDonationForm && (
        <DonationForm 
          onClose={() => setShowDonationForm(false)}
          onSuccess={handleDonationAdded}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm 
          onClose={() => setShowExpenseForm(false)}
          onSuccess={handleExpenseAdded}
        />
      )}
    </div>
  );
}