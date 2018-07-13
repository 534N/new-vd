const generatePlayerId = meta => Object.values(meta).join('-');
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
};

const VideoReducer = (state = {
    lastUpdate: +new Date(),
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
            replace
          } = action.payload;

          // 
          // initialize a new player state with the player id
          const playerState = {
            ...initPlayerState,
            id: playerId,
          };

          // 
          // decide replace vs append
          const players = replace ? {} : {
            ...state.players
          };
          
          // 
          // set the players object
          players[playerId] = playerState;

          // 
          // set state
          const newState = {
            ...state,
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
            data
          } = action.payload

          const { playerId } = action.meta;

          const players = state.players;
          const config = {
            ...players[playerId],
            recordings: data.videos
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

      case 'CLEAR_VIDEO_CACHE':
        {
          state = {
            ...state,
            players: {}
          }

          break;
        }

      case 'REMOVE_VIDEO': 
        {
          const id = action.payload;

          const { players } = state;
          delete(players[id]);

          debugger
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
          }
          break;
        }
  
      case 'USER_LOG_OUT':
        {
          state = {
            ...state,
            fullscreen: false,
            players: {},
          }
          break;
        }
    
      default:
        break;
    }
  
    return state;
  };
  
  export default VideoReducer;