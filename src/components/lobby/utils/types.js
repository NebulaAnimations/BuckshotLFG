// components/lobby/utils/types.js
/**
 * @typedef {Object} Lobby
 * @property {string} id
 * @property {string} host
 * @property {string} region
 * @property {string} voice_requirement
 * @property {string} [discord_link]
 * @property {number} created_at
 * @property {number} last_active
 * @property {string} game_code
 * @property {number} max_players
 * @property {string[]} players
 */

/**
 * @typedef {Object} LobbyConfig
 * @property {string} gameCode
 * @property {number} maxPlayers
 * @property {string} voiceRequirement
 * @property {string} [discordLink]
 */