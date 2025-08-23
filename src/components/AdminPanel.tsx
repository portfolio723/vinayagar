import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Settings, BarChart3, Calendar, Users, Edit } from 'lucide-react';
import { festivalService, authService, Donation, Expense, FestivalSettings } from '../lib/supabase';
import DonationForm from './DonationForm';
import ExpenseForm from './ExpenseForm';
import SettingsForm from './SettingsForm';
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
  const [showSettingsForm, setShowSettingsForm] = useState(false);
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

  const handleSettingsUpdated = () => {
    setShowSettingsForm(false);
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
        <div className="max-w-7xl mx-auto container-padding py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="heading-lg">Festival Admin</h1>
              <span className="status-positive">
                Live Dashboard
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto container-padding section-spacing">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="content-spacing">
            <FinancialSummary 
              {...financialSummary}
              fundraisingGoal={festivalSettings?.fundraising_goal || 0}
            />
            
            <div className="grid-responsive-2">
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
          <div className="content-spacing">
            <div className="flex items-center justify-between">
              <h2 className="heading-lg">Manage Donations</h2>
              <button
                onClick={() => setShowDonationForm(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                <span>Add Donation</span>
              </button>
            </div>
            <DonationsList 
              donations={donations} 
              showAllDetails={true}
              isAdmin={true}
              onEdit={handleEditDonation}
              onDelete={handleDeleteDonation}
            />
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="content-spacing">
            <div className="flex items-center justify-between">
              <h2 className="heading-lg">Manage Expenses</h2>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            </div>
            <ExpensesList 
              expenses={expenses} 
              showAllDetails={true}
              isAdmin={true}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="content-spacing">
            <div className="flex items-center justify-between">
              <h2 className="heading-lg">Festival Settings</h2>
            </div>
            
            {festivalSettings && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Current Settings</h3>
                  <button
                    onClick={() => setShowSettingsForm(true)}
                    className="btn-primary"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Settings</span>
                  </button>
                </div>
                
                <div className="grid-responsive-2">
                <div className="card">
                  <h3 className="card-title mb-4">Festival Information</h3>
                  <div className="element-spacing">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="body-md font-medium text-gray-700">Name:</span>
                      <span className="body-md text-gray-900">{festivalSettings.festival_name}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="body-md font-medium text-gray-700">Year:</span>
                      <span className="body-md text-gray-900">{festivalSettings.festival_year}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="body-md font-medium text-gray-700">Location:</span>
                      <span className="body-md text-gray-900">{festivalSettings.location || 'Not set'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h3 className="card-title mb-4">Financial Goals</h3>
                  <div className="element-spacing">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="body-md font-medium text-gray-700">Target:</span>
                      <span className="body-md text-gray-900">₹{festivalSettings.fundraising_goal?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="body-md font-medium text-gray-700">Progress:</span>
                      <span className="body-md text-gray-900">{Math.round((financialSummary.totalDonations / (festivalSettings.fundraising_goal || 1)) * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="body-md font-medium text-gray-700">Remaining:</span>
                      <span className="body-md text-gray-900">₹{Math.max(0, (festivalSettings.fundraising_goal || 0) - financialSummary.totalDonations).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              
              <div className="card">
                <h3 className="card-title mb-4">Festival Description</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="body-md text-gray-700 leading-relaxed">{festivalSettings.description}</p>
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

      {showSettingsForm && (
        <SettingsForm 
          onClose={() => setShowSettingsForm(false)}
          onSuccess={handleSettingsUpdated}
          currentSettings={festivalSettings}
        />
      )}
    </div>
  );
}