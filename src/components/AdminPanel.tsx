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
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
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
    setEditingDonation(null);
    loadData();
  };

  const handleExpenseAdded = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
    loadData();
  };

  const handleEditDonation = (donation: Donation) => {
    setEditingDonation(donation);
    setShowDonationForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteDonation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        await festivalService.deleteDonation(id);
        loadData();
      } catch (error) {
        console.error('Error deleting donation:', error);
      }
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await festivalService.deleteExpense(id);
        loadData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
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
        <div className="max-w-7xl mx-auto mobile-padding">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="mobile-heading text-black">Festival Admin</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                Live Dashboard
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mobile-padding">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-1 bg-gray-100 p-1 rounded-lg mb-8 sm:mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md font-medium transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="mobile-content-spacing">
            <FinancialSummary 
              {...financialSummary}
              fundraisingGoal={festivalSettings?.fundraising_goal || 0}
            />
            
            <div className="mobile-grid-2">
              <DonationsList 
                donations={donations.slice(0, 5)} 
                isAdmin={true}
                onEdit={handleEditDonation}
                onDelete={handleDeleteDonation}
              />
              <ExpensesList 
                expenses={expenses.slice(0, 5)} 
                isAdmin={true}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </div>
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && (
          <div className="mobile-content-spacing">
            <div className="flex items-center justify-between">
              <h2 className="mobile-subheading text-black">Manage Donations</h2>
              <button
                onClick={() => setShowDonationForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Donation</span>
              </button>
            </div>
            <DonationsList 
              donations={donations} 
              showAllDetails 
              isAdmin={true}
              onEdit={handleEditDonation}
              onDelete={handleDeleteDonation}
            />
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="mobile-content-spacing">
            <div className="flex items-center justify-between">
              <h2 className="mobile-subheading text-black">Manage Expenses</h2>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Expense</span>
              </button>
            </div>
            <ExpensesList 
              expenses={expenses} 
              showAllDetails 
              isAdmin={true}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="card">
            <h2 className="mobile-subheading text-black mb-6 sm:mb-8">Festival Settings</h2>
            {festivalSettings && (
              <div className="mobile-content-spacing">
                <div className="mobile-grid-2">
                  <div>
                    <h3 className="font-semibold text-black mb-3 sm:mb-4 text-base sm:text-lg">Festival Information</h3>
                    <div className="space-y-2">
                      <p className="mobile-text text-gray-600"><span className="font-medium">Name:</span> {festivalSettings.festival_name}</p>
                      <p className="mobile-text text-gray-600"><span className="font-medium">Year:</span> {festivalSettings.festival_year}</p>
                      <p className="mobile-text text-gray-600"><span className="font-medium">Location:</span> {festivalSettings.location}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-3 sm:mb-4 text-base sm:text-lg">Financial Goals</h3>
                    <div className="space-y-2">
                      <p className="mobile-text text-gray-600">
                        <span className="font-medium">Target:</span> ₹{festivalSettings.fundraising_goal?.toLocaleString('en-IN')}
                      </p>
                      <p className="mobile-text text-gray-600">
                        <span className="font-medium">Progress:</span> {Math.round((financialSummary.totalDonations / (festivalSettings.fundraising_goal || 1)) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-3 sm:mb-4 text-base sm:text-lg">Description</h3>
                  <p className="mobile-text text-gray-600 leading-relaxed">{festivalSettings.description}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showDonationForm && (
        <DonationForm 
          onClose={() => { setShowDonationForm(false); setEditingDonation(null); }}
          onSuccess={handleDonationAdded}
          editingDonation={editingDonation}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm 
          onClose={() => { setShowExpenseForm(false); setEditingExpense(null); }}
          onSuccess={handleExpenseAdded}
          editingExpense={editingExpense}
        />
      )}
    </div>
  );
}