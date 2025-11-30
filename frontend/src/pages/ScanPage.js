import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scanAPI, productAPI } from '../utils/api';
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
    } else {
      fetchRecentScans();
    }
  }, [hairProfile, navigate]);

  const fetchRecentScans = async () => {
    try {
      const response = await scanAPI.getHistory({ limit: 3 });
      setRecentScans(response.data);
    } catch (err) {
      console.error('Failed to fetch recent scans:', err);
    }
  };

  const handleProductSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await productAPI.search(formData.search_query);
      if (response.data && response.data.length > 0) {
        // Use the first matching product
        const product = response.data[0];
        const scanResponse = await scanAPI.scanByIngredients({
          ingredients_text: product.ingredients_text,
          product_name: product.name,
          product_brand: product.brand,
          product_category: product.category,
        });
        navigate(`/results/${scanResponse.data.scan_id}`);
      } else {
        setError('No products found. Please try manual ingredient entry.');
      }
    } catch (err) {
      handleApiError(err, setError, 'Product search failed.');
    } finally {
      setLoading(false);
    }
  };

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
        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Scans</h3>
              <Link to="/history" className="text-primary-600 hover:underline text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan.scan_id}
                  onClick={() => navigate(`/results/${scan.scan_id}`)}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {scan.product_name || 'Unnamed Product'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {scan.product_brand && `${scan.product_brand} • `}
                      {new Date(scan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    scan.verdict === 'GREAT' ? 'bg-green-100 text-green-700' :
                    scan.verdict === 'CAUTION' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {scan.verdict}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Scan a Product
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-3 font-semibold whitespace-nowrap ${
                activeTab === 'search'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔍 Search Product
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-3 font-semibold whitespace-nowrap ${
                activeTab === 'paste'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Paste Ingredients
            </button>
            <button
              onClick={() => setActiveTab('barcode')}
              className={`px-4 py-3 font-semibold whitespace-nowrap ${
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
