// components/lobby/hooks/useApi.js
import { API_URL } from '../utils/constants';
import { useLobby } from '../context';

export function useApi() {
  const { setError, setLoading } = useLobby();

  const callApi = async (action, params = {}, options = { silent: false }) => {
    try {
      setError('');
      // Only set loading if not in silent mode
      if (!options.silent) {
        setLoading(true);
      }
      
      const queryString = new URLSearchParams({
        action,
        ...params
      }).toString();

      const response = await fetch(`${API_URL}?${queryString}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (err) {
        throw new Error(`Failed to parse response: ${text}`);
      }
    } catch (err) {
      console.error(`API Error (${action}):`, err);
      throw err;
    } finally {
      // Only set loading false if not in silent mode
      if (!options.silent) {
        setLoading(false);
      }
    }
  };

  return { callApi };
}