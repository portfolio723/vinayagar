import React, { useState, useEffect } from 'react';
import { X, Settings, Calendar, MapPin, Target, FileText } from 'lucide-react';
import { festivalService, FestivalSettings } from '../lib/supabase';

interface SettingsFormProps {
  onClose: () => void;
  onSuccess: () => void;
  currentSettings: FestivalSettings | null;
}

export default function SettingsForm({ onClose, onSuccess, currentSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    festival_name: 'Vinayaka Chavithi',
    festival_year: new Date().getFullYear(),
    location: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fundraising_goal: 50000,
    description: 'Join us in celebrating Lord Ganesha with devotion, community spirit, and complete financial transparency.'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentSettings) {
      setFormData({
        festival_name: currentSettings.festival_name || 'Vinayaka Chavithi',
        festival_year: currentSettings.festival_year || new Date().getFullYear(),
        location: currentSettings.location || '',
        start_date: currentSettings.start_date ? new Date(currentSettings.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        end_date: currentSettings.end_date ? new Date(currentSettings.end_date).toISOString().split('T')[0] : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fundraising_goal: Number(currentSettings.fundraising_goal) || 50000,
        description: currentSettings.description || 'Join us in celebrating Lord Ganesha with devotion, community spirit, and complete financial transparency.'
      });
    }
  }, [currentSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const settingsData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        fundraising_goal: Number(formData.fundraising_goal)
      };

      await festivalService.updateFestivalSettings(settingsData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to update festival settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'festival_year' || name === 'fundraising_goal' ? Number(value) : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="icon-container-md bg-blue-50">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="heading-md">Festival Settings</h2>
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
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="grid-responsive-2">
            <div>
              <label className="label-primary">
                Festival Name *
              </label>
              <input
                type="text"
                name="festival_name"
                required
                value={formData.festival_name}
                onChange={handleInputChange}
                className="input-primary"
                placeholder="Enter festival name"
              />
            </div>

            <div>
              <label className="label-primary">
                Festival Year *
              </label>
              <input
                type="number"
                name="festival_year"
                required
                min="2020"
                max="2030"
                value={formData.festival_year}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>
          </div>

          <div>
            <label className="label-primary">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="input-primary"
              placeholder="Festival location (e.g., Community Center, Temple)"
            />
          </div>

          <div className="grid-responsive-2">
            <div>
              <label className="label-primary">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>

            <div>
              <label className="label-primary">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>
          </div>

          <div>
            <label className="label-primary">
              <Target className="w-4 h-4 inline mr-2" />
              Fundraising Goal (₹)
            </label>
            <input
              type="number"
              name="fundraising_goal"
              min="0"
              step="1000"
              value={formData.fundraising_goal}
              onChange={handleInputChange}
              className="input-primary"
              placeholder="50000"
            />
            <p className="body-sm text-gray-500 mt-2">
              Set a realistic fundraising target for the festival expenses
            </p>
          </div>

          <div>
            <label className="label-primary">
              <FileText className="w-4 h-4 inline mr-2" />
              Festival Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="input-primary resize-none"
              placeholder="Describe the festival, its significance, and community involvement..."
            />
          </div>

          <div className="info-container">
            <h4 className="font-semibold mb-2">Settings Impact</h4>
            <ul className="body-sm space-y-1">
              <li>• Festival name and year appear on the public dashboard</li>
              <li>• Location helps community members find the celebration</li>
              <li>• Dates help plan donations and participation</li>
              <li>• Fundraising goal shows progress to the community</li>
              <li>• Description explains the festival's significance</li>
            </ul>
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
            form="settings-form"
            disabled={isSubmitting}
            className="btn-primary flex-1"
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Updating...' : 'Update Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}