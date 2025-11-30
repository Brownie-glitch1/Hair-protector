import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { scanAPI } from '../utils/api';

function HistoryPage() {
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await scanAPI.getHistory({ limit: 50 });
      setScans(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const verdictColor = (verdict) => {
    const colors = {
      GREAT: 'text-green-600 bg-green-50',
      CAUTION: 'text-yellow-600 bg-yellow-50',
      AVOID: 'text-red-600 bg-red-50',
    };
    return colors[verdict] || colors.CAUTION;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">

        {scans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No scans yet</p>
            <button
              onClick={() => navigate('/scan')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Scan Your First Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan.scan_id}
                onClick={() => navigate(`/results/${scan.scan_id}`)}
                className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {scan.product_name || 'Unnamed Product'}
                    </h3>
                    {scan.product_brand && (
                      <p className="text-gray-600 text-sm">{scan.product_brand}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full font-semibold ${verdictColor(scan.verdict)}`}>
                    {scan.verdict}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Score: {scan.overall_score}/100</span>
                  <span>•</span>
                  <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="capitalize">{scan.scan_type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
