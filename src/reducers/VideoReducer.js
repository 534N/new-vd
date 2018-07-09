const VideoReducer = (state = {
    playing: false,
    fullscreen: false,
    recordings: null,
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
          state = {
            ...state,
            playing: true,
          }
          break;
        }

      case 'LIST_VIDEO':
        {
          console.debug('recordings >>> ', action.payload)
          debugger
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