import React from 'react';
import { Receipt, Calendar, Tag, Building } from 'lucide-react';
import { Expense } from '../lib/supabase';

interface ExpensesListProps {
  expenses: Expense[];
  showAllDetails?: boolean;
}

export default function ExpensesList({ expenses, showAllDetails = false }: ExpensesListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Decorations': return '🎨';
      case 'Food/Prasadam': return '🍽️';
      case 'Cultural Programs': return '🎭';
      case 'Utilities': return '⚡';
      case 'Supplies': return '📦';
      default: return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Decorations': return 'bg-pink-50 text-pink-700';
      case 'Food/Prasadam': return 'bg-orange-50 text-orange-700';
      case 'Cultural Programs': return 'bg-purple-50 text-purple-700';
      case 'Utilities': return 'bg-yellow-50 text-yellow-700';
      case 'Supplies': return 'bg-blue-50 text-blue-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const displayExpenses = showAllDetails ? expenses : expenses.slice(0, 6);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-black">Recent Expenses</h2>
            <p className="text-sm text-gray-600">Transparent festival expenditure</p>
          </div>
        </div>
        {!showAllDetails && expenses.length > 6 && (
          <span className="text-sm text-gray-500">
            Showing {displayExpenses.length} of {expenses.length}
          </span>
        )}
      </div>

      {displayExpenses.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No expenses recorded</h3>
          <p className="text-gray-500">Festival expenses will be shown here for transparency</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayExpenses.map((expense) => (
            <div 
              key={expense.id} 
              className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-medium text-black">{expense.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(expense.expense_date)}
                    </span>
                    {expense.vendor_name && (
                      <span className="flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        {expense.vendor_name}
                      </span>
                    )}
                    {expense.receipt_number && showAllDetails && (
                      <span className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        Receipt: {expense.receipt_number}
                      </span>
                    )}
                  </div>
                  {expense.description && (
                    <p className="text-sm text-gray-600 mt-2">{expense.description}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}