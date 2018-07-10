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
  error: null,
};

const VideoReducer = (state = {
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
            locationId,
            cameraId,
            streamId,
          } = action.payload;

          const playerId = generatePlayerId({ locationId, cameraId, streamId });
          const playerState = {
            ...initPlayerState,
            id: playerId,
          };

          const newState = {
            ...state
          };

          newState.players[playerId] = playerState;
          state = newState
          break;
        }

      case 'SET_M3U8':
        {
          const playerId = generatePlayerId(action.meta);
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
          const playerId = generatePlayerId(action.meta);
          const players = state.players;
          const config = {
            ...players[playerId],
            fetching: true,
          }

          savePlayerConfigToState(players, playerId, config, state);

          break;
        }

        case 'LIST_VIDEO_FULFILLED':
        {
          const {
            data
          } = action.payload

          const playerId = generatePlayerId(action.meta);

          const players = state.players;
          const config = {
            ...players[playerId],
            recordings: data.videos
          }

          savePlayerConfigToState(players, playerId, config, state);

          break;
        }

        case 'LIST_VIDEO_REJECTED':
        {
          const playerId = generatePlayerId(action.meta);

          const players = state.players;
          const config = {
            ...players[playerId],
            fetching: false,
            error: action.payload
          }

          savePlayerConfigToState(players, playerId, config, state);

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