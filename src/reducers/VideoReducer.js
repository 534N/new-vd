import _ from 'lodash'
import { scaleLinear } from 'd3-scale';

const generatePlayerId = meta => Object.values(meta).join('-');
const storePlayerDomain = recordingData => {
  let playTime = 0;
  let playerDomain = [];

  for (let i = 0; i < recordingData.length; i++) {
    const duration = recordingData[i].end - recordingData[i].start;

    playerDomain.push(playTime);
    playerDomain.push(playTime + duration);
    playTime += duration;
  }
  return { playerDomain: playerDomain, playTime: playTime, filteredRecordingData: recordingData };
}

const storeRecordingDomain = recordingData => {
  let recordingDomain = [];

  for (let i = 0; i < recordingData.length; i++) {
    recordingDomain.push(recordingData[i].start);
    recordingDomain.push(recordingData[i].end);
  }
  return recordingDomain;
}


const savePlayerConfigToState = (players, playerId, config, state) => {
  players[playerId] = config;
  state = {
    ...state,
    players: {
      ...players
    }
  }

  return state;
}

const initPlayerState = {
  id: null,
  m3u8: null,
  ttf: null,
  recordings: null,
  playTime: null,
  fetching: false,
  playing: false,
  paused: false,
  ended: false,
  live: false,
  is360: false,
  error: null,
  camera: null,
};

const VideoReducer = (state = {
    lastUpdate: +new Date(),
    primaryPlayerId: null,
    players: {},
    fullscreen: false,
  }, action) => {
    switch (action.type) {
      case 'TOGGLE_FULLSCREEN':
        {
          const { fullscreen } = state;
          state = {
            ...state,
            fullscreen: !fullscreen,
          }
          break;
        }
  
      case 'INIT_VIDEO':
        {
          const {
            playerId,
            replace,
            camera
          } = action.payload;

          let { primaryPlayerId } = state;
          // 
          // initialize a new player state with the player id
          const playerState = {
            ...initPlayerState,
            id: playerId,
            camera,
          };

          // 
          // decide replace vs append
          const players = replace ? {} : {
            ...state.players
          };

          // 
          // set primary player id
          if (_.isEmpty(players)) {
            primaryPlayerId = playerId;
          }
          
          // 
          // set the players object
          players[playerId] = playerState;

          // 
          // set state
          const newState = {
            ...state,
            primaryPlayerId,
            players,
            lastUpdate: +new Date(),
          };

          state = newState
          break;
        }

      case 'SET_M3U8':
        {
          const { playerId } = action.meta;
          const players = state.players;
          const config = {
            ...players[playerId],
            m3u8: action.payload,            
          }

          savePlayerConfigToState(players, playerId, config, state);

          break;
        }

      case 'LIST_VIDEO_PENDING':
        {
          const { playerId } = action.meta;
          const players = state.players;
          const config = {
            ...players[playerId],
            fetching: true,
          }

          state = savePlayerConfigToState(players, playerId, config, state);

          break;
        }

      case 'LIST_VIDEO_FULFILLED':
        {
          const {
            data: { videos },
          } = action.payload;

          const { 
            playerId
          } = action.meta;

          const { playerDomain } = storePlayerDomain(videos);
          const recordingDomain = storeRecordingDomain(videos);

          const players = state.players;
          const config = {
            ...players[playerId],
            recordings: videos,
            ttf: scaleLinear().domain(playerDomain).range(recordingDomain),
          }

          state = savePlayerConfigToState(players, playerId, config, state);

          break;
        }

      case 'LIST_VIDEO_REJECTED':
        {
          const { playerId } = action.meta;

          const players = state.players;
          const config = {
            ...players[playerId],
            fetching: false,
            error: action.payload
          }

          state = savePlayerConfigToState(players, playerId, config, state);

          break;
        }

      case 'UPDATE_PLAY_TIME': 
        {
          const { playerId } = action.meta;
          const players = state.players;

          if (!playerId || typeof(playerId) !== 'string' || !players[playerId]) {
            return
          }

          const config = {
            ...players[playerId],
            fetching: false,
            playTime: action.payload,
            playing: true,
          }


          state = savePlayerConfigToState(players, playerId, config, state);
          
          break;
        }

      case 'SET_PRIMARY':
        {
          const id = action.payload;
          state = {
            ...state,
            primaryPlayerId: id
          };

          break;
        }

      case 'CLEAR_VIDEO_CACHE':
        {
          state = {
            ...state,
            players: {},
            camera: null,
          }

          break;
        }

      case 'REMOVE_VIDEO': 
        {
          const id = action.payload;

          const { players } = state;
          delete(players[id]);

          state = {
            ...state,
            players
          };
          
          break;
        }

      case 'NAV_LINK_CLICK':
        {
          state = {
            ...state,
            players: {},
            camera: null,
          }
          break;
        }
  
      case 'USER_LOG_OUT':
        {
          state = {
            ...state,
            fullscreen: false,
            players: {},
            camera: null,
          }
          break;
        }
    
      default:
        break;
    }
  
    return state;
  };
  
  export default VideoReducer;