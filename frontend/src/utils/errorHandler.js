/**
 * Extract error message from API error response
 * Handles various error formats from FastAPI
 */
export const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
  // Check for response data
  if (error.response?.data) {
    const { detail, message } = error.response.data;
    
    // Handle string detail
    if (typeof detail === 'string') {
      return detail;
    }
    
    // Handle string message
    if (typeof message === 'string') {
      return message;
    }
    
    // Handle array of errors (FastAPI validation errors)
    if (Array.isArray(detail)) {
      return detail.map(err => {
        if (typeof err === 'string') return err;
        if (err.msg) return `${err.loc?.join(' → ') || 'Error'}: ${err.msg}`;
        return JSON.stringify(err);
      }).join('; ');
    }
    
    // Handle object errors
    if (typeof detail === 'object') {
      if (detail.msg) return detail.msg;
      return JSON.stringify(detail);
    }
  }
  
  // Fallback to error message
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};

/**
 * Handle API errors with consistent messaging
 */
export const handleApiError = (error, setError, defaultMessage) => {
  const errorMsg = getErrorMessage(error, defaultMessage);
  setError(errorMsg);
  console.error('API Error:', error);
};
