import React from 'react';
import { Receipt, Calendar, Tag, Building } from 'lucide-react';
import { Edit2, Trash2 } from 'lucide-react';
import { Expense } from '../lib/supabase';

interface ExpensesListProps {
  expenses: Expense[];
  showAllDetails?: boolean;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export default function ExpensesList({ 
  expenses, 
  showAllDetails = false, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}: ExpensesListProps) {
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
    <div className="card">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <div>
            <h2 className="mobile-subheading text-black">Recent Expenses</h2>
            <p className="text-sm sm:text-base text-gray-600">Transparent festival expenditure</p>
          </div>
        </div>
        {!showAllDetails && expenses.length > 6 && (
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Showing {displayExpenses.length} of {expenses.length}
          </span>
        )}
      </div>

      {displayExpenses.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <Receipt className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2 sm:mb-4">No expenses recorded</h3>
          <p className="text-sm sm:text-base text-gray-500">Festival expenses will be shown here for transparency</p>
        </div>
      ) : (
        <div className="mobile-card-spacing">
          {displayExpenses.map((expense) => (
            <div 
              key={expense.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-colors duration-200 space-y-4 sm:space-y-0"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <h3 className="font-semibold text-black text-base sm:text-lg">{expense.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {formatDate(expense.expense_date)}
                    </span>
                    {expense.vendor_name && (
                      <span className="flex items-center">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {expense.vendor_name}
                      </span>
                    )}
                    {expense.receipt_number && showAllDetails && (
                      <span className="flex items-center">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Receipt: {expense.receipt_number}
                      </span>
                    )}
                  </div>
                  {expense.description && (
                    <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">{expense.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                {isAdmin && onEdit && onDelete && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="btn-edit"
                    >
                      <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="btn-delete"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}