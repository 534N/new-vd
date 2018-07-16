const ranges = [
  'day', 'week', 'month', 'year'
];

const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions()

const DateTimeReducer = (state = {
    locale: locale,
    timeZone: timeZone,
    time: new Date(),
    range: ranges[0],
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
  
      case 'CHANGE_RANGE': 
        {
          const rangeIdx = action.payload;
          state = {
            ...state,
            range: ranges[rangeIdx],
          }
          break;
        }
    
      default:
        break;
    }
  
    return state;
  };
  
  export default DateTimeReducer;