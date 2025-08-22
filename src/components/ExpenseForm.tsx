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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="icon-container-md bg-red-50">
              <Receipt className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="heading-md">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-outline p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body element-spacing">
          {error && (
            <div className="error-container">
              {error}
            </div>
          )}

          <div className="element-spacing">
            <div>
              <label className="label-primary">
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

            <div className="grid-responsive-2">
              <div>
                <label className="label-primary">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-4 text-gray-400">₹</span>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="input-primary pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="label-primary">
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
              <label className="label-primary">
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

            <div className="grid-responsive-2">
              <div>
                <label className="label-primary">
                  Vendor Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleInputChange}
                    className="input-primary pl-12"
                    placeholder="Vendor or supplier name"
                  />
                </div>
              </div>

              <div>
                <label className="label-primary">
                  Receipt Number
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="receipt_number"
                    value={formData.receipt_number}
                    onChange={handleInputChange}
                    className="input-primary pl-12"
                    placeholder="Receipt/invoice number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label-primary">
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

        </form>
        <div className="modal-footer">
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
              onClick={handleSubmit}
            >
              {isSubmitting 
                ? (editingExpense ? 'Updating...' : 'Adding...') 
                : (editingExpense ? 'Update Expense' : 'Add Expense')
              }
            </button>
          </div>
        </div>
    </div>
  );
}