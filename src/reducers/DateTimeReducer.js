const DateTimeReducer = (state = {
    time: null,
  }, action) => {
    switch (action.type) {
      case 'CHANGE_TIME':
        {
          const {
            time
          } = action.payload;
  
          state = {
            ...state,
            time,
          }
          break;
        }
  
    
      default:
        break;
    }
  
    return state;
  };
  
  export default DateTimeReducer;