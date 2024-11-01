// api.js
const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  fetchLobbies: async () => {
    const response = await fetch(`${API_URL}?action=getLobbies`);
    return response.json();
  },

  fetchLobbyDetails: async (lobbyId) => {
    const response = await fetch(`${API_URL}?action=getLobby&id=${lobbyId}`);
    return response.json();
  },

  performAction: async (action, params) => {
    const formData = new FormData();
    formData.append('payload', JSON.stringify({ action, ...params }));

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });
    
    const text = await response.text();
    return JSON.parse(text);
  }
};