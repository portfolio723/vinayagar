import React, { useState } from 'react';
import { Heart, Calendar, Edit2, Trash2, Eye, EyeOff, User, Phone, Mail, CreditCard } from 'lucide-react';
import { Donation } from '../lib/supabase';

interface DonationsListProps {
  donations: Donation[];
  showAllDetails?: boolean;
  showViewAll?: boolean;
  showFilters?: boolean;
  onViewAll?: () => void;
  onEdit?: (donation: Donation) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export default function DonationsList({ 
  donations, 
  showAllDetails = false, 
  showViewAll = false,
  showFilters = false,
  onViewAll,
  onEdit, 
  onDelete,
  isAdmin = false 
}: DonationsListProps) {
  const [showAnonymous, setShowAnonymous] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Online':
        return <CreditCard className="w-3 h-3" />;
      case 'Cash':
        return <span className="text-xs">💵</span>;
      case 'Check':
        return <span className="text-xs">📝</span>;
      default:
        return <span className="text-xs">💳</span>;
    }
  };

  const visibleDonations = showAllDetails 
    ? donations
        .filter(d => showAnonymous || !d.is_anonymous)
        .filter(d => categoryFilter === 'all' || d.category === categoryFilter)
        .sort((a, b) => {
          if (sortBy === 'amount') {
            return Number(b.amount) - Number(a.amount);
          }
          return new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime();
        })
    : donations.slice(0, 5);

  const anonymousCount = donations.filter(d => d.is_anonymous).length;
  const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const averageAmount = donations.length > 0 ? totalAmount / donations.length : 0;

  return (
    <div className="card border-l-4 border-l-green-500 animate-slide-up">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="icon-container-md bg-green-50">
            <Heart className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="card-title">Recent Donations</h2>
            <p className="card-subtitle">Community contributions with gratitude</p>
          </div>
        </div>
        {!showAllDetails && donations.length > 5 && (
          <div className="flex items-center gap-3">
            <div className="status-positive">
              Showing {visibleDonations.length} of {donations.length}
            </div>
            {showViewAll && onViewAll && (
              <button
                onClick={onViewAll}
                className="btn-outline text-sm"
              >
                View All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-primary"
              >
                <option value="all">All Categories</option>
                <option value="Individual">Individual</option>
                <option value="Family">Family</option>
                <option value="Business">Business</option>
                <option value="Anonymous">Anonymous</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                className="input-primary"
              >
                <option value="date">Date (Newest First)</option>
                <option value="amount">Amount (Highest First)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anonymous</label>
              <button
                onClick={() => setShowAnonymous(!showAnonymous)}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  showAnonymous 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {showAnonymous ? 'Hide Anonymous' : 'Show Anonymous'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anonymous donations toggle for admin */}
      {isAdmin && showAllDetails && anonymousCount > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showAnonymous ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeOff className="w-5 h-5 text-gray-600" />}
              <span className="body-md font-medium text-gray-700">
                {anonymousCount} anonymous donation{anonymousCount !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => setShowAnonymous(!showAnonymous)}
              className="btn-outline"
            >
              {showAnonymous ? 'Hide Anonymous' : 'Show Anonymous'}
            </button>
          </div>
        </div>
      )}

      {donations.length === 0 ? (
        <div className="text-center py-12">
          <div className="icon-container-lg bg-gray-50 mx-auto mb-6">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="heading-md text-gray-600 mb-4">No donations yet</h3>
          <p className="body-md text-gray-500 max-w-md mx-auto">
            Donations from our generous community will be displayed here with complete transparency.
          </p>
        </div>
      ) : (
        <div className="element-spacing">
          {/* Donations List */}
          <div className="space-y-4">
            {visibleDonations.map((donation) => (
              <div key={donation.id} className="list-item">
                <div className="list-item-content">
                  <div className="icon-container-sm bg-green-50">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="heading-sm truncate">
                        {donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(donation.category)}`}>
                          {donation.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(donation.donation_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        {getPaymentMethodIcon(donation.payment_method)}
                        {donation.payment_method}
                      </div>
                    </div>
                    
                    {showAllDetails && (
                      <div className="space-y-1">
                        {donation.donor_phone && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {donation.donor_phone}
                          </div>
                        )}
                        {donation.donor_email && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {donation.donor_email}
                          </div>
                        )}
                        {donation.notes && (
                          <p className="text-xs sm:text-sm text-gray-600 italic mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                            "{donation.notes}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="list-item-actions">
                  <div className="text-right mr-4">
                    <div className="heading-md text-green-600 font-bold">
                      {formatCurrency(donation.amount)}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && onEdit && onDelete && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(donation)}
                        className="btn-edit"
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
                        className="btn-delete"
                        title="Delete donation"
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
          <div className="card-compact bg-green-50 border-green-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="heading-md text-green-600 mb-1">
                  {donations.length}
                </div>
                <div className="body-sm text-green-700">Total Donations</div>
              </div>
              <div>
                <div className="heading-md text-green-600 mb-1">
                  {formatCurrency(totalAmount)}
                </div>
                <div className="body-sm text-green-700">Total Amount</div>
              </div>
              <div>
                <div className="heading-md text-green-600 mb-1">
                  {formatCurrency(averageAmount)}
                </div>
                <div className="body-sm text-green-700">Average</div>
              </div>
              <div>
                <div className="heading-md text-green-600 mb-1">
                  {anonymousCount}
                </div>
                <div className="body-sm text-green-700">Anonymous</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}