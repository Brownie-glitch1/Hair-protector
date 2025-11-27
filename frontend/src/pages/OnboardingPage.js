import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hairProfileAPI } from '../utils/api';

function OnboardingPage() {
  const navigate = useNavigate();
  const { updateHairProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    porosity: '',
    curl_pattern: '',
    scalp_type: '',
    density: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await hairProfileAPI.create(formData);
      updateHairProfile(response.data);
      navigate('/scan');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to create profile';
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.porosity !== '';
      case 2:
        return formData.curl_pattern !== '';
      case 3:
        return formData.scalp_type !== '';
      case 4:
        return formData.density !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Hair Profile
            </h1>
            <p className="text-gray-600">
              Tell us about your hair so we can give you personalized recommendations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded mx-1 ${
                    s <= step ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Step {step} of 4
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Porosity */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What's your hair porosity?
                </h2>
                <p className="text-gray-600 mb-6">
                  Porosity determines how well your hair absorbs and retains moisture.
                </p>
                {[
                  {
                    value: 'low',
                    label: 'Low Porosity',
                    description: 'Hair doesn\'t absorb moisture easily, products sit on top',
                  },
                  {
                    value: 'medium',
                    label: 'Medium Porosity',
                    description: 'Hair absorbs and retains moisture well',
                  },
                  {
                    value: 'high',
                    label: 'High Porosity',
                    description: 'Hair absorbs moisture quickly but loses it fast',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, porosity: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition ${
                      formData.porosity === option.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Curl Pattern */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What's your curl pattern?
                </h2>
                <p className="text-gray-600 mb-6">
                  Select the pattern that best matches your natural hair texture.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '3a', label: '3A', desc: 'Loose curls' },
                    { value: '3b', label: '3B', desc: 'Bouncy ringlets' },
                    { value: '3c', label: '3C', desc: 'Tight corkscrews' },
                    { value: '4a', label: '4A', desc: 'Soft coils' },
                    { value: '4b', label: '4B', desc: 'Z-pattern coils' },
                    { value: '4c', label: '4C', desc: 'Very tight coils' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, curl_pattern: option.value })}
                      className={`p-4 border-2 rounded-lg text-center transition ${
                        formData.curl_pattern === option.value
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="font-bold text-lg text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Scalp Type */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What's your scalp type?
                </h2>
                <p className="text-gray-600 mb-6">
                  This helps us identify potential scalp irritants in products.
                </p>
                {[
                  { value: 'dry', label: 'Dry', description: 'Flaky, tight feeling scalp' },
                  { value: 'normal', label: 'Normal', description: 'Balanced, no issues' },
                  { value: 'oily', label: 'Oily', description: 'Greasy, needs frequent washing' },
                  { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated, reactive' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, scalp_type: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition ${
                      formData.scalp_type === option.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Density */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What's your hair density?
                </h2>
                <p className="text-gray-600 mb-6">
                  Density refers to how much hair you have on your head.
                </p>
                {[
                  { value: 'low', label: 'Low Density', description: 'Can see scalp easily' },
                  { value: 'medium', label: 'Medium Density', description: 'Scalp partially visible' },
                  { value: 'high', label: 'High Density', description: 'Thick, scalp hard to see' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, density: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition ${
                      formData.density === option.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Any other details about your hair..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isStepComplete()}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Creating Profile...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
