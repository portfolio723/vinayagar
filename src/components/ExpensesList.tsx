import React from 'react';
import { Receipt, Calendar, Tag, Building, Edit2, Trash2 } from 'lucide-react';
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
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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
      case 'Decorations': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Food/Prasadam': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Cultural Programs': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Utilities': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Supplies': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const displayExpenses = showAllDetails ? expenses : expenses.slice(0, 5);
  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

  // Group expenses by category for summary
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="card border-l-4 border-l-red-500 animate-slide-up">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="icon-container-md bg-red-50">
            <Receipt className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="card-title">Recent Expenses</h2>
            <p className="card-subtitle">Transparent festival expenditure</p>
          </div>
        </div>
        {!showAllDetails && expenses.length > 5 && (
          <div className="status-negative">
            Showing {displayExpenses.length} of {expenses.length}
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="icon-container-lg bg-gray-50 mx-auto mb-6">
            <Receipt className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="heading-md text-gray-600 mb-4">No expenses recorded</h3>
          <p className="body-md text-gray-500 max-w-md mx-auto">
            Festival expenses will be shown here for complete financial transparency.
          </p>
        </div>
      ) : (
        <div className="element-spacing">
          {/* Expenses List */}
          <div className="space-y-4">
            {displayExpenses.map((expense) => (
              <div key={expense.id} className="list-item">
                <div className="list-item-content">
                  <div className="icon-container-sm bg-red-50">
                    <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="heading-sm truncate">{expense.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(expense.expense_date)}
                      </div>
                      {expense.vendor_name && (
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {expense.vendor_name}
                        </div>
                      )}
                      {expense.receipt_number && showAllDetails && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Receipt: {expense.receipt_number}
                        </div>
                      )}
                    </div>
                    
                    {expense.description && (
                      <p className="body-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100 truncate-2">
                        {expense.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="list-item-actions">
                  <div className="text-right mr-4">
                    <div className="heading-md text-red-600 font-bold">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && onEdit && onDelete && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="btn-edit"
                        title="Edit expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this expense?')) {
                            onDelete(expense.id);
                          }
                        }}
                        className="btn-delete"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Statistics */}
          <div className="card-compact bg-red-50 border-red-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-4">
              <div>
                <div className="heading-md text-red-600 mb-1">
                  {expenses.length}
                </div>
                <div className="body-sm text-red-700">Total Expenses</div>
              </div>
              <div>
                <div className="heading-md text-red-600 mb-1">
                  {formatCurrency(totalAmount)}
                </div>
                <div className="body-sm text-red-700">Total Amount</div>
              </div>
              <div>
                <div className="heading-md text-red-600 mb-1">
                  {formatCurrency(averageAmount)}
                </div>
                <div className="body-sm text-red-700">Average</div>
              </div>
              <div>
                <div className="heading-md text-red-600 mb-1">
                  {Object.keys(categoryTotals).length}
                </div>
                <div className="body-sm text-red-700">Categories</div>
              </div>
            </div>

            {/* Category Breakdown */}
            {showAllDetails && Object.keys(categoryTotals).length > 0 && (
              <div className="border-t border-red-200 pt-4">
                <h4 className="body-md font-semibold text-red-700 mb-3">Category Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(categoryTotals).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getCategoryIcon(category)}</span>
                        <span className="body-sm text-red-700">{category}</span>
                      </div>
                      <span className="body-sm font-semibold text-red-600">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}