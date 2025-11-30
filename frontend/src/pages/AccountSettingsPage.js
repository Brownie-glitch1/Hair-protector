import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AccountSettingsPage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Simulate API call - replace with actual API
    setTimeout(() => {
      setSuccess('Account information updated successfully!');
      setEditing(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/settings" className="text-primary-600 hover:text-primary-700">
              ← Back
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-primary-600 hover:underline text-sm font-semibold"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Changing email requires verification
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        full_name: user?.full_name || '',
                        email: user?.email || '',
                      });
                    }}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <p className="text-lg font-medium text-gray-900">{user?.full_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email Address</label>
                  <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Security</h2>
          </div>

          <button
            onClick={() => alert('Password change feature coming soon!')}
            className="w-full p-4 text-left hover:bg-gray-50 transition border-b flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-900">Change Password</p>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
            <span className="text-gray-400">›</span>
          </button>

          <button
            onClick={() => alert('Two-factor authentication coming soon!')}
            className="w-full p-4 text-left hover:bg-gray-50 transition flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add extra security to your account</p>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        {/* Permissions Link */}
        <Link
          to="/permissions"
          className="block bg-white rounded-xl shadow-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-semibold text-gray-900">Device Permissions</p>
                <p className="text-sm text-gray-500">Manage camera and other access</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AccountSettingsPage;
