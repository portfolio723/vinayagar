import React, { useState } from 'react';
import { User, Calendar, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Donation } from '../lib/supabase';

interface DonationsListProps {
  donations: Donation[];
  showDetails?: boolean;
  onEdit?: (donation: Donation) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export default function DonationsList({ 
  donations, 
  showDetails = false, 
  onEdit, 
  onDelete,
  isAdmin = false 
}: DonationsListProps) {
  const [showAnonymous, setShowAnonymous] = useState(false);

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Individual':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Family':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Business':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Anonymous':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const visibleDonations = donations.filter(donation => 
    showAnonymous || !donation.is_anonymous
  );

  const anonymousCount = donations.filter(d => d.is_anonymous).length;

  if (donations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
        <p className="text-gray-500">Donations will appear here once they are added.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Anonymous donations toggle for admin */}
      {isAdmin && anonymousCount > 0 && (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {showAnonymous ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeOff className="w-5 h-5 text-gray-600" />}
            <span className="text-sm font-medium text-gray-700">
              {anonymousCount} anonymous donation{anonymousCount !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => setShowAnonymous(!showAnonymous)}
            className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            {showAnonymous ? 'Hide' : 'Show'}
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6">
        {visibleDonations.map((donation) => (
          <div
            key={donation.id}
            className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Donor Info */}
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(donation.category)}`}>
                      {donation.category}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(donation.donation_date)}
                    </div>
                  </div>
                  {showDetails && donation.donor_phone && (
                    <p className="text-sm text-gray-600 mt-1">📞 {donation.donor_phone}</p>
                  )}
                  {showDetails && donation.donor_email && (
                    <p className="text-sm text-gray-600">✉️ {donation.donor_email}</p>
                  )}
                  {showDetails && donation.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{donation.notes}"</p>
                  )}
                </div>
              </div>

              {/* Amount and Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {formatCurrency(donation.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    via {donation.payment_method}
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && onEdit && onDelete && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(donation)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit donation"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this donation?')) {
                          onDelete(donation.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete donation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {donations.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Donations</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-green-600">
              {formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0))}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              {formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Average</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-purple-600">
              {anonymousCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Anonymous</div>
          </div>
        </div>
      </div>
    </div>
  );
}