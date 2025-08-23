import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Users, Target, Calendar } from 'lucide-react';

interface FinancialSummaryProps {
  totalDonations: number;
  totalExpenses: number;
  remainingBalance: number;
  donationCount: number;
  expenseCount: number;
  fundraisingGoal?: number;
}

export default function FinancialSummary({ 
  totalDonations, 
  totalExpenses, 
  remainingBalance, 
  donationCount,
  expenseCount,
  fundraisingGoal = 0
}: FinancialSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const goalProgress = fundraisingGoal > 0 ? Math.min((totalDonations / fundraisingGoal) * 100, 100) : 0;
  const isBalancePositive = remainingBalance >= 0;
  const balanceColor = isBalancePositive ? 'blue' : 'orange';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Donations Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="card-header">
          <div className="icon-container-md bg-green-50">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
          </div>
          <div className="status-positive">
            {donationCount} donations
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="heading-lg text-green-600 mb-2">
              {formatCurrency(totalDonations)}
            </h3>
            <p className="body-md text-gray-600">Total Donations Received</p>
          </div>
          
          {/* Goal Progress */}
          {fundraisingGoal > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="body-sm text-gray-600">Goal Progress</span>
                <span className="body-sm font-semibold text-green-600">
                  {Math.round(goalProgress)}%
                </span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="body-sm text-gray-500">
                  Target: {formatCurrency(fundraisingGoal)}
                </span>
                <span className="body-sm text-gray-500">
                  Remaining: {formatCurrency(Math.max(0, fundraisingGoal - totalDonations))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="card-header">
          <div className="icon-container-md bg-red-50">
            <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
          </div>
          <div className="status-negative">
            {expenseCount} expenses
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="heading-lg text-red-600 mb-2">
              {formatCurrency(totalExpenses)}
            </h3>
            <p className="body-md text-gray-600">Total Festival Expenses</p>
          </div>
          
          {/* Expense Breakdown Indicator */}
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
            <span className="body-sm text-red-700">Average per expense</span>
            <span className="body-sm font-semibold text-red-700">
              {expenseCount > 0 ? formatCurrency(totalExpenses / expenseCount) : '₹0'}
            </span>
          </div>
        </div>
      </div>

      {/* Remaining Balance Card */}
      <div className={`bg-white rounded-2xl p-6 border border-gray-200 border-l-4 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-${balanceColor}-500`}>
        <div className="card-header">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${balanceColor}-50`}>
            <Wallet className={`w-6 h-6 text-${balanceColor}-600`} />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${balanceColor}-50 text-${balanceColor}-700 border border-${balanceColor}-200`}>
            {isBalancePositive ? 'Surplus' : 'Deficit'}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className={`text-2xl font-bold mb-2 text-${balanceColor}-600`}>
              {formatCurrency(Math.abs(remainingBalance))}
            </h3>
            <p className="body-md text-gray-600">
              {isBalancePositive ? 'Available Balance' : 'Amount Over Budget'}
            </p>
          </div>
          
          {/* Balance Status */}
          <div className={`p-3 rounded-lg border bg-${balanceColor}-50 border-${balanceColor}-100`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm text-${balanceColor}-700`}>
                Financial Status
              </span>
              <span className={`text-sm font-semibold text-${balanceColor}-700`}>
                {isBalancePositive ? 'Healthy' : 'Attention Needed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Impact Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="card-header">
          <div className="icon-container-md bg-purple-50">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
          </div>
          <div className="status-neutral">
            Community
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="heading-lg text-purple-600 mb-2">
              {donationCount}
            </h3>
            <p className="body-md text-gray-600">Community Contributors</p>
          </div>
          
          {/* Community Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="body-sm text-purple-700">Participation</span>
              </div>
              <span className="body-sm font-semibold text-purple-700">
                {donationCount > 0 ? 'Active' : 'Starting'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="body-sm text-purple-700">Festival Spirit</span>
              </div>
              <span className="body-sm font-semibold text-purple-700">Growing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}