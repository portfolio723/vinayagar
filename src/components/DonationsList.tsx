import React from 'react';
import { Heart, Phone, Mail, Calendar, User } from 'lucide-react';
import { Donation } from '../lib/supabase';

interface DonationsListProps {
  donations: Donation[];
  showAllDetails?: boolean;
}

export default function DonationsList({ donations, showAllDetails = false }: DonationsListProps) {
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
      case 'Family': return '👨‍👩‍👧‍👦';
      case 'Business': return '🏢';
      case 'Anonymous': return '🤝';
      default: return '👤';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Family': return 'bg-blue-50 text-blue-700';
      case 'Business': return 'bg-purple-50 text-purple-700';
      case 'Anonymous': return 'bg-gray-50 text-gray-700';
      default: return 'bg-green-50 text-green-700';
    }
  };

  const displayDonations = showAllDetails ? donations : donations.slice(0, 8);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-black">Recent Donations</h2>
            <p className="text-sm text-gray-600">Community contributions with gratitude</p>
          </div>
        </div>
        {!showAllDetails && donations.length > 8 && (
          <span className="text-sm text-gray-500">
            Showing {displayDonations.length} of {donations.length}
          </span>
        )}
      </div>

      {displayDonations.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No donations yet</h3>
          <p className="text-gray-500">Be the first to contribute to our festival!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayDonations.map((donation) => (
            <div 
              key={donation.id} 
              className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <span className="text-lg">{getCategoryIcon(donation.category)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-medium text-black">
                      {donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(donation.category)}`}>
                      {donation.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(donation.donation_date)}
                    </span>
                    {showAllDetails && donation.donor_phone && (
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {donation.donor_phone}
                      </span>
                    )}
                    {showAllDetails && donation.donor_email && (
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {donation.donor_email}
                      </span>
                    )}
                  </div>
                  {donation.notes && showAllDetails && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{donation.notes}"</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(donation.amount)}
                </p>
                <p className="text-xs text-gray-500">
                  {donation.payment_method}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}