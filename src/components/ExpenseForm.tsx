import React, { useState } from 'react';
import { X, Receipt, Building, Tag } from 'lucide-react';
import { festivalService } from '../lib/supabase';

interface ExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editingExpense?: Expense | null;
}

export default function ExpenseForm({ onClose, onSuccess, editingExpense }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'Other' as const,
    vendor_name: '',
    receipt_number: '',
    expense_date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title,
        description: editingExpense.description || '',
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        vendor_name: editingExpense.vendor_name || '',
        receipt_number: editingExpense.receipt_number || '',
        expense_date: new Date(editingExpense.expense_date).toISOString().split('T')[0]
      });
    }
  }, [editingExpense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        expense_date: new Date(formData.expense_date).toISOString()
      };

      if (editingExpense) {
        await festivalService.updateExpense(editingExpense.id, expenseData);
      } else {
        await festivalService.addExpense(expenseData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || `Failed to ${editingExpense ? 'update' : 'add'} expense`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-black">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mobile-touch-target bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Expense Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="input-primary"
                placeholder="Brief description of the expense"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 sm:top-4 text-gray-400 text-sm sm:text-base">₹</span>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="input-primary pl-8 sm:pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Expense Date
                </label>
                <input
                  type="date"
                  name="expense_date"
                  value={formData.expense_date}
                  onChange={handleInputChange}
                  className="input-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-primary"
              >
                <option value="Decorations">Decorations</option>
                <option value="Food/Prasadam">Food/Prasadam</option>
                <option value="Cultural Programs">Cultural Programs</option>
                <option value="Utilities">Utilities</option>
                <option value="Supplies">Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Vendor Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleInputChange}
                    className="input-primary pl-10 sm:pl-12"
                    placeholder="Vendor or supplier name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Receipt Number
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    name="receipt_number"
                    value={formData.receipt_number}
                    onChange={handleInputChange}
                    className="input-primary pl-10 sm:pl-12"
                    placeholder="Receipt/invoice number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="input-primary resize-none"
                placeholder="Detailed description of the expense..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting 
                ? (editingExpense ? 'Updating...' : 'Adding...') 
                : (editingExpense ? 'Update Expense' : 'Add Expense')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}