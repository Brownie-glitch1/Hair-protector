import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { scanAPI } from '../utils/api';

function ResultsPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScan();
  }, [scanId]);

  const fetchScan = async () => {
    try {
      const response = await scanAPI.getScan(scanId);
      setScan(response.data);
    } catch (err) {
      setError('Failed to load scan results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/scan')} className="text-primary-600 hover:underline">
            Back to Scan
          </button>
        </div>
      </div>
    );
  }

  const verdictConfig = {
    GREAT: { color: 'green', emoji: '✅', bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
    CAUTION: { color: 'yellow', emoji: '⚠️', bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700' },
    AVOID: { color: 'red', emoji: '❌', bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700' },
  };

  const config = verdictConfig[scan.verdict] || verdictConfig.CAUTION;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/scan" className="text-gray-600 hover:text-gray-900">
              ← Back to Scan
            </Link>
            <Link to="/history" className="text-primary-600 hover:underline">
              View History
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Product Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {scan.product_name || 'Product Analysis'}
          </h1>
          {scan.product_brand && (
            <p className="text-gray-600 mb-2">by {scan.product_brand}</p>
          )}
          <div className="flex gap-2 text-sm text-gray-500">
            <span>Scan type: {scan.scan_type}</span>
            {scan.product_category && <span>• {scan.product_category}</span>}
          </div>
        </div>

        {/* Verdict Card */}
        <div className={`${config.bg} border-4 ${config.border} rounded-xl p-8 mb-6 text-center`}>
          <div className="text-6xl mb-4">{config.emoji}</div>
          <h2 className={`text-4xl font-bold ${config.text} mb-2`}>
            {scan.verdict}
          </h2>
          <p className="text-lg text-gray-700">
            Overall Score: {scan.overall_score}/100
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            <ScoreBar label="Moisture Score" score={scan.moisture_score} color="blue" />
            <ScoreBar label="Buildup Risk" score={scan.buildup_risk} color="orange" isRisk />
            <ScoreBar label="Scalp Safety" score={scan.scalp_score} color="green" />
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Badge label="Water Based" value={scan.water_based} />
            <Badge label="Heavy Oils" value={scan.heavy_oils} />
            <Badge label="Protein Heavy" value={scan.protein_heavy} />
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Analysis</h3>
          <ul className="space-y-3">
            {scan.explanation.map((exp, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700">
                <span className="text-xl flex-shrink-0">
                  {exp.startsWith('✅') || exp.startsWith('✓') ? '✅' : 
                   exp.startsWith('⚠') ? '⚠️' : 
                   exp.startsWith('❌') ? '❌' : 'ℹ️'}
                </span>
                <span>{exp.replace(/^[✅✓⚠❌ℹ️]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hair Profile Used */}
        <div className="bg-gray-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Analyzed for:</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white rounded-full text-sm">
              {scan.hair_profile.porosity} porosity
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-sm">
              {scan.hair_profile.curl_pattern} curl
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-sm">
              {scan.hair_profile.scalp_type} scalp
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-sm">
              {scan.hair_profile.density} density
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Matched {scan.matched_ingredients_count} of {scan.total_ingredients_count} ingredients
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/scan')}
            className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
          >
            Scan Another Product
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, color, isRisk = false }) {
  const getColor = () => {
    if (isRisk) {
      if (score < 30) return 'bg-green-500';
      if (score < 60) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    if (score < 50) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function Badge({ label, value }) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-2xl mb-1">{value ? '✅' : '❌'}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

export default ResultsPage;
