// components/lobby/utils/constants.js
export const Screen = {
    WELCOME: 'welcome',
    MAIN: 'main',
    LOBBY: 'lobby',
    CONFIG: 'config'
  };
  
  export const Regions = {
    NA: 'North America',
    EU: 'Europe',
    AS: 'Asia',
    OC: 'Oceania'
  };
  
  export const VoiceSettings = {
    OPTIONAL: 'optional',
    REQUIRED: 'required',
    NO_MIC: 'no-mic'
  };
  
  export const API_URL = import.meta.env.VITE_API_URL;
  export const REFRESH_INTERVAL = 5000;
  export const LOBBY_REFRESH_INTERVAL = 3000;
  export const MAX_PLAYERS_LIMIT = 10;
  export const MIN_PLAYERS_LIMIT = 2;
  