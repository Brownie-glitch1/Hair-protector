import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scanAPI } from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

function ScanPage() {
  const navigate = useNavigate();
  const { hairProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('paste');
  const [formData, setFormData] = useState({
    ingredients_text: '',
    product_name: '',
    product_brand: '',
    product_category: '',
    barcode: '',
    search_query: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentScans, setRecentScans] = useState([]);

  React.useEffect(() => {
    if (!hairProfile) {
      navigate('/onboarding');
    }
  }, [hairProfile, navigate]);

  const handleScanByIngredients = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await scanAPI.scanByIngredients({
        ingredients_text: formData.ingredients_text,
        product_name: formData.product_name || undefined,
        product_brand: formData.product_brand || undefined,
        product_category: formData.product_category || undefined,
      });
      navigate(`/results/${response.data.scan_id}`);
    } catch (err) {
      handleApiError(err, setError, 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanByBarcode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await scanAPI.scanByBarcode({ barcode: formData.barcode });
      navigate(`/results/${response.data.scan_id}`);
    } catch (err) {
      handleApiError(err, setError, 'Product not found with this barcode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              🔍 Product Scanner
            </h1>
            <div className="flex gap-3">
              <Link to="/history" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                History
              </Link>
              <Link to="/profile" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Profile
              </Link>
              <button onClick={logout} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Hair Profile Card */}
        {hairProfile && (
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-2">Your Hair Profile</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {hairProfile.porosity} porosity
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {hairProfile.curl_pattern} curl
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {hairProfile.scalp_type} scalp
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {hairProfile.density} density
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Scan a Product
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'paste'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Paste Ingredients
            </button>
            <button
              onClick={() => setActiveTab('barcode')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'barcode'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔢 Barcode
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Paste Ingredients Tab */}
          {activeTab === 'paste' && (
            <form onSubmit={handleScanByIngredients} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredient List *
                </label>
                <textarea
                  value={formData.ingredients_text}
                  onChange={(e) => setFormData({ ...formData, ingredients_text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="6"
                  placeholder="Water, Glycerin, Cetearyl Alcohol, Shea Butter..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Copy and paste the ingredients from the product label
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Curl Cream"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.product_brand}
                    onChange={(e) => setFormData({ ...formData, product_brand: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Shea Moisture"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {loading ? 'Analyzing...' : 'Analyze Product'}
              </button>
            </form>
          )}

          {/* Barcode Tab */}
          {activeTab === 'barcode' && (
            <form onSubmit={handleScanByBarcode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Barcode / UPC
                </label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter barcode number"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the UPC/EAN barcode from the product
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {loading ? 'Looking up...' : 'Scan Barcode'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScanPage;
