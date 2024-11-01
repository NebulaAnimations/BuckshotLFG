import { API_URL } from '../../../config';

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

export { API_URL };
export const REFRESH_INTERVAL = 59000;
export const LOBBY_REFRESH_INTERVAL = 5000;
export const MAX_PLAYERS_LIMIT = 4;
export const MIN_PLAYERS_LIMIT = 2;