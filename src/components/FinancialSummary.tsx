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
    <div className="mobile-grid-4 mobile-section-spacing">
      {/* Total Donations */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">{donationCount} donations</span>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2">{formatCurrency(totalDonations)}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">Total Donations Received</p>
        
        {/* Goal Progress */}
        {fundraisingGoal > 0 && (
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2">
              <span>Goal Progress</span>
              <span>{Math.round(goalProgress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3">
              <div 
                className="bg-green-600 h-2 sm:h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Goal: {formatCurrency(fundraisingGoal)}</p>
          </div>
        )}
      </div>

      {/* Total Expenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">{expenseCount} expenses</span>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2">{formatCurrency(totalExpenses)}</h3>
        <p className="text-sm sm:text-base text-gray-600">Total Expenses</p>
      </div>

      {/* Remaining Balance */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isBalancePositive ? 'bg-blue-50' : 'bg-orange-50'
          }`}>
            <Wallet className={`w-5 h-5 sm:w-6 sm:h-6 ${isBalancePositive ? 'text-blue-600' : 'text-orange-600'}`} />
          </div>
          <span className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium ${
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
        <p className="text-sm sm:text-base text-gray-600">Remaining Balance</p>
      </div>

      {/* Community Impact */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">Community</span>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2">{donationCount}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">Community Contributors</p>
        <div className="flex items-center text-xs sm:text-sm text-gray-500">
          <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Building stronger community bonds
        </div>
      </div>
    </div>
  );
}