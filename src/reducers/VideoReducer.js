const VideoReducer = (state = {
    theater: false,
    fullscreen: false,
  }, action) => {
    switch (action.type) {
      case 'THEATER_MODE_ON':
        {
          state = {
            ...state,
            theater: true,
          }
          break;
        }
      
      case 'THEATER_MODE_OFF':
        {
          state = {
            ...state,
            theater: false,
          }
          break;
        }

      case 'FULLSCREEN_MODE_ON':
        {
          state = {
            ...state,
            fullscreen: true,
          }
          break;
        }
  
      case 'FULLSCREEN_MODE_OFF':
        {
          state = {
            ...state,
            fullscreen: false,
          }
          break;
        }
  
    
      default:
        break;
    }
  
    return state;
  };
  
  export default VideoReducer;