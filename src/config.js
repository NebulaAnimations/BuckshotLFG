const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxCG5i3XeHSL8_-ONidpGO9YenPjCTlbuMYFtDCmeXdpX_UfiCmzKYK6ukjKssmnWsz/exec';

/**
 * Configuration values for different environments
 */
const ENV_CONFIG = {
  development: {
    apiUrl: GOOGLE_SCRIPT_URL
  },
  preview: {
    apiUrl: GOOGLE_SCRIPT_URL
  },
  production: {
    apiUrl: GOOGLE_SCRIPT_URL
  }
};

/**
 * Determines the current environment
 */
function getCurrentEnvironment() {
  // Check if running in development
  if (import.meta.env.DEV) {
    return 'development';
  }

  // Check if running on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    return 'preview';
  }

  return 'production';
}

/**
 * Gets the configuration for the current environment
 */
export function getConfig() {
  const environment = getCurrentEnvironment();
  const config = ENV_CONFIG[environment];

  if (!config) {
    console.error(`No configuration found for environment: ${environment}`);
    return ENV_CONFIG.development; // Fallback to development config
  }

  return config;
}

/**
 * Gets the API URL for the current environment
 */
export function getApiUrl() {
  return getConfig().apiUrl;
}

// Export the API URL directly for simpler imports
export const API_URL = getApiUrl();