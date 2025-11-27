import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hairProfileAPI } from '../utils/api';

function ProfilePage() {
  const { user, hairProfile, updateHairProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(hairProfile || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await hairProfileAPI.update(formData);
      updateHairProfile(response.data);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to update profile';
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/scan" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <button onClick={logout} className="text-red-600 hover:underline">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* User Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {user?.full_name}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
          </div>
        </div>

        {/* Hair Profile */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Hair Profile</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-primary-600 hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Porosity</label>
                <select
                  value={formData.porosity}
                  onChange={(e) => setFormData({ ...formData, porosity: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Curl Pattern</label>
                <select
                  value={formData.curl_pattern}
                  onChange={(e) => setFormData({ ...formData, curl_pattern: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="3a">3A</option>
                  <option value="3b">3B</option>
                  <option value="3c">3C</option>
                  <option value="4a">4A</option>
                  <option value="4b">4B</option>
                  <option value="4c">4C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Scalp Type</label>
                <select
                  value={formData.scalp_type}
                  onChange={(e) => setFormData({ ...formData, scalp_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="dry">Dry</option>
                  <option value="normal">Normal</option>
                  <option value="oily">Oily</option>
                  <option value="sensitive">Sensitive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Density</label>
                <select
                  value={formData.density}
                  onChange={(e) => setFormData({ ...formData, density: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData(hairProfile);
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Porosity:</span>
                <span className="font-medium">{hairProfile?.porosity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Curl Pattern:</span>
                <span className="font-medium">{hairProfile?.curl_pattern}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scalp Type:</span>
                <span className="font-medium">{hairProfile?.scalp_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Density:</span>
                <span className="font-medium">{hairProfile?.density}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            to="/history"
            className="block w-full py-3 bg-gray-100 text-center rounded-lg font-semibold hover:bg-gray-200"
          >
            View Scan History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
