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
      currency: 'INR'
    }).format(amount);
  };

  const goalProgress = fundraisingGoal > 0 ? (totalDonations / fundraisingGoal) * 100 : 0;
  const isBalancePositive = remainingBalance >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Donations */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm text-gray-500">{donationCount} donations</span>
        </div>
        <h3 className="text-2xl font-bold text-black mb-1">{formatCurrency(totalDonations)}</h3>
        <p className="text-sm text-gray-600">Total Donations Received</p>
        
        {/* Goal Progress */}
        {fundraisingGoal > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Goal Progress</span>
              <span>{Math.round(goalProgress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Goal: {formatCurrency(fundraisingGoal)}</p>
          </div>
        )}
      </div>

      {/* Total Expenses */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <span className="text-sm text-gray-500">{expenseCount} expenses</span>
        </div>
        <h3 className="text-2xl font-bold text-black mb-1">{formatCurrency(totalExpenses)}</h3>
        <p className="text-sm text-gray-600">Total Expenses</p>
      </div>

      {/* Remaining Balance */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isBalancePositive ? 'bg-blue-50' : 'bg-orange-50'
          }`}>
            <Wallet className={`w-6 h-6 ${isBalancePositive ? 'text-blue-600' : 'text-orange-600'}`} />
          </div>
          <span className={`text-sm px-2 py-1 rounded-full text-xs ${
            isBalancePositive 
              ? 'bg-green-50 text-green-700' 
              : 'bg-orange-50 text-orange-700'
          }`}>
            {isBalancePositive ? 'Surplus' : 'Deficit'}
          </span>
        </div>
        <h3 className={`text-2xl font-bold mb-1 ${
          isBalancePositive ? 'text-black' : 'text-orange-600'
        }`}>
          {formatCurrency(Math.abs(remainingBalance))}
        </h3>
        <p className="text-sm text-gray-600">Remaining Balance</p>
      </div>

      {/* Community Impact */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm text-gray-500">Community</span>
        </div>
        <h3 className="text-2xl font-bold text-black mb-1">{donationCount}</h3>
        <p className="text-sm text-gray-600">Community Contributors</p>
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <Target className="w-3 h-3 mr-1" />
          Building stronger community bonds
        </div>
      </div>
    </div>
  );
}