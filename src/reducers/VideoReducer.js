const VideoReducer = (state = {
    fetching: false,
    playing: false,
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
  
      case 'PLAY_VIDEO': 
        {
          const {
            locationId,
            cameraId,
            streamId,
          } = action.payload;

          debugger
          const playerId = `${locationId}-${cameraId}-${streamId}`;
          const config = {
            ttf: null,
            mu38: null,
            recordings: null,
            state: 'init'
          };

          state = {
            ...state,
            players: {
              playerId: config,
            }
          }
          break;
        }

      case 'LIST_VIDEO_PENDING':
        {
          console.debug('Loading Recordings >>> ')
          const locationId = action.meta.locationId;
          
          const playerId = `${action.meta.locationId}-${action.meta.cameraId}-${action.meta.streamId}`;

debugger
          
          const players = state.players;
          const config = {
            ...players[playerId],
            state: 'loading',
          }

          state = {
            ...state,
            fetching: true,
            players: {
              ...players,
              playerId: config,
            }
          }

          break;

        }

        case 'LIST_VIDEO_FULFILLED':
        {
          console.debug('recordings >>> ', action.payload)

          debugger
          break;

        }

        case 'LIST_VIDEO_REJECTED':
        {
          console.debug('recordings >>> ', action.payload)
          const { data } = action.payload;

          state = {
            ...state,
            recordings: data.video,
          }
          break;

        }

      case 'NAV_LINK_CLICK':
        {
          state = {
            ...state,
            playing: false,
            recordings: null,
          }
          break;
        }
  
      case 'USER_LOG_OUT':
        {
          state = {
            ...state,
            playing: false,
            fullscreen: false,
            recordings: null,
          }
          break;
        }
    
      default:
        break;
    }
  
    return state;
  };
  
  export default VideoReducer;