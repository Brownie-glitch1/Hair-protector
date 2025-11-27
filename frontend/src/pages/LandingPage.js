import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/scan');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center text-white mb-12 pt-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              💇‍♀️ Afro Hair Product Scanner
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Find products that work for your unique hair type
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-bold mb-2">Smart Analysis</h3>
              <p className="opacity-90">
                Advanced ingredient analysis based on hair science and porosity
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <div className="text-4xl mb-3">💧</div>
              <h3 className="text-xl font-bold mb-2">Personalized</h3>
              <p className="opacity-90">
                Tailored recommendations for your curl pattern and scalp type
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-bold mb-2">Instant Results</h3>
              <p className="opacity-90">
                Get clear verdicts: GREAT, CAUTION, or AVOID with explanations
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to find your perfect products?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Create your hair profile and start scanning products in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-700 transform hover:scale-105 transition shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gray-100 text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-200 transform hover:scale-105 transition"
              >
                Login
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-16 text-white text-center">
            <h3 className="text-2xl font-bold mb-8">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl mb-3">1️⃣</div>
                <h4 className="font-bold mb-2">Create Hair Profile</h4>
                <p className="opacity-90">Tell us about your porosity, curl pattern, and scalp type</p>
              </div>
              <div>
                <div className="text-5xl mb-3">2️⃣</div>
                <h4 className="font-bold mb-2">Scan Products</h4>
                <p className="opacity-90">Paste ingredients, scan barcodes, or upload photos</p>
              </div>
              <div>
                <div className="text-5xl mb-3">3️⃣</div>
                <h4 className="font-bold mb-2">Get Results</h4>
                <p className="opacity-90">Receive instant analysis and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;