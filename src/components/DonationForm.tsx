import React, { useState } from 'react';
import { X, User, Phone, Mail, CreditCard, Heart } from 'lucide-react';
import { festivalService } from '../lib/supabase';

interface DonationFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editingDonation?: Donation | null;
}

export default function DonationForm({ onClose, onSuccess, editingDonation }: DonationFormProps) {
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_phone: '',
    donor_email: '',
    amount: '',
    category: 'Individual' as const,
    is_anonymous: false,
    payment_method: 'Cash' as const,
    notes: '',
    donation_date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingDonation) {
      setFormData({
        donor_name: editingDonation.donor_name,
        donor_phone: editingDonation.donor_phone || '',
        donor_email: editingDonation.donor_email || '',
        amount: editingDonation.amount.toString(),
        category: editingDonation.category,
        is_anonymous: editingDonation.is_anonymous,
        payment_method: editingDonation.payment_method,
        notes: editingDonation.notes || '',
        donation_date: new Date(editingDonation.donation_date).toISOString().split('T')[0]
      });
    }
  }, [editingDonation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const donationData = {
        ...formData,
        amount: parseFloat(formData.amount),
        donation_date: new Date(formData.donation_date).toISOString()
      };

      if (editingDonation) {
        await festivalService.updateDonation(editingDonation.id, donationData);
      } else {
        await festivalService.addDonation(donationData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || `Failed to ${editingDonation ? 'update' : 'add'} donation`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-black">
              {editingDonation ? 'Edit Donation' : 'Add New Donation'}
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
                Donor Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  name="donor_name"
                  required
                  value={formData.donor_name}
                  onChange={handleInputChange}
                  className="input-primary pl-10 sm:pl-12"
                  placeholder="Enter donor name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="donor_phone"
                    value={formData.donor_phone}
                    onChange={handleInputChange}
                    className="input-primary pl-10 sm:pl-12"
                    placeholder="Phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="email"
                    name="donor_email"
                    value={formData.donor_email}
                    onChange={handleInputChange}
                    className="input-primary pl-10 sm:pl-12"
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Donation Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 sm:top-4 text-gray-400 text-sm sm:text-base">₹</span>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="1"
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
                  Donation Date
                </label>
                <input
                  type="date"
                  name="donation_date"
                  value={formData.donation_date}
                  onChange={handleInputChange}
                  className="input-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <option value="Individual">Individual</option>
                  <option value="Family">Family</option>
                  <option value="Business">Business</option>
                  <option value="Anonymous">Anonymous</option>
                </select>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_anonymous"
                  checked={formData.is_anonymous}
                  onChange={handleInputChange}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Make this donation anonymous
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="input-primary resize-none"
                placeholder="Additional notes or message from donor..."
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
                ? (editingDonation ? 'Updating...' : 'Adding...') 
                : (editingDonation ? 'Update Donation' : 'Add Donation')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}