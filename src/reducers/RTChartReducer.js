import _ from 'lodash'

const RTChartReducer = (state = {
  name: '',
  id: 'rtTransactions',
  config: 'rtTransactions',
  query: 'transactionsInLastMin',
  data: {},
  timestamp: +new Date(),
}, action) => {
  switch (action.type) {
    case 'RT_EVENT_CHART_INFO_FULFILLED':
      {
        const {
          data: {
            results
          }
        } = action.payload;

        const { data } = state;
        
        _.sortBy(results.filter(r => r.type === 'transaction'), o => o.startTime).forEach(d => {
          const { details } = d;

          if (details['Time']) {
            const start = +new Date(details['Time'])
            data[start] = { time: +new Date(details['Time']), amount: details['Total amount'] };
          }
        });

        state = {
          ...state,
          data,
          timestamp: +new Date(),
        }

        break;
      }

    
    case 'USER_LOG_OUT':
      {
        state = {
          ...state,
          data: [],
        }

        break;
      }

    default:
      break;
  }

  return state;
};

export default RTChartReducer;