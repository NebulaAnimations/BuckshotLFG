import { API_URL } from '../../../config';
import { useLobby } from '../context';

export function useApi() {
  const { setError, setLoading } = useLobby();

  const callApi = async (action, params = {}, options = { silent: false }) => {
    try {
      if (!options.silent) {
        setError('');
        setLoading(true);
      }
      
      if (!API_URL) {
        throw new Error('API URL is not configured');
      }

      // Build query string
      const queryString = new URLSearchParams({
        action,
        ...params
      }).toString();

      console.log(`Calling API: ${API_URL}?${queryString}`); // Debug log

      const response = await fetch(`${API_URL}?${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors' // Enable CORS
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Raw API response:', text); // Debug log

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Failed to parse API response:', err);
        throw new Error('Invalid API response format');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Ensure lobbies data is properly formatted
      if (action === 'getLobbies') {
        if (!Array.isArray(data)) {
          console.error('Invalid lobbies response:', data);
          return [];
        }
        return data.map(lobby => ({
          ...lobby,
          max_players: Number(lobby.max_players) || 4,
          created_at: Number(lobby.created_at),
          last_active: Number(lobby.last_active),
          players: Array.isArray(lobby.players) ? lobby.players : []
        }));
      }

      return data;
    } catch (err) {
      console.error(`API Error (${action}):`, err);
      if (!options.silent) {
        setError(err.message);
      }
      throw err;
    } finally {
      if (!options.silent) {
        setLoading(false);
      }
    }
  };

  return { callApi };
}