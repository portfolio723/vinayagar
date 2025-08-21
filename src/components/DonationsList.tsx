import React from 'react';
import { Heart, Phone, Mail, Calendar, User } from 'lucide-react';
import { Edit2, Trash2 } from 'lucide-react';
import { Donation } from '../lib/supabase';

interface DonationsListProps {
  donations: Donation[];
  showAllDetails?: boolean;
  onEdit?: (donation: Donation) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export default function DonationsList({ 
  donations, 
  showAllDetails = false, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}: DonationsListProps) {
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
    <div className="card">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <div>
            <h2 className="mobile-subheading text-black">Recent Donations</h2>
            <p className="text-sm sm:text-base text-gray-600">Community contributions with gratitude</p>
          </div>
        </div>
        {!showAllDetails && donations.length > 8 && (
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Showing {displayDonations.length} of {donations.length}
          </span>
        )}
      </div>

      {displayDonations.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2 sm:mb-4">No donations yet</h3>
          <p className="text-sm sm:text-base text-gray-500">Be the first to contribute to our festival!</p>
        </div>
      ) : (
        <div className="mobile-card-spacing">
          {displayDonations.map((donation) => (
            <div 
              key={donation.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-colors duration-200 space-y-4 sm:space-y-0"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getCategoryIcon(donation.category)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <h3 className="font-semibold text-black text-base sm:text-lg">
                      {donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start ${getCategoryColor(donation.category)}`}>
                      {donation.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {formatDate(donation.donation_date)}
                    </span>
                    {showAllDetails && donation.donor_phone && (
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {donation.donor_phone}
                      </span>
                    )}
                    {showAllDetails && donation.donor_email && (
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {donation.donor_email}
                      </span>
                    )}
                  </div>
                  {donation.notes && showAllDetails && (
                    <p className="text-sm sm:text-base text-gray-600 mt-3 italic leading-relaxed">"{donation.notes}"</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    {formatCurrency(donation.amount)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {donation.payment_method}
                  </p>
                </div>
                {isAdmin && onEdit && onDelete && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(donation)}
                      className="btn-edit"
                    >
                      <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(donation.id)}
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