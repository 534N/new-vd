
const charts = {
  c1: {
    id: 'c1',
    type: 'histogram',
    showOnDashboard: true,
    name: 'Top 3',
    // query: 'events/top3'
    description: 'This is the top 3 histogram, you can change this description to anything you like'
  }
}


const ChartReducer = (state = {
  charts: charts,
}, action) => {
  switch (action.type) {
    // case 'ADD_Chart':
    //   {
    //     const {
    //       id,
    //       type,
    //       data
    //     } = action.payload;

    //     const charts = state.charts;
    //     charts[id] = {
    //       id,
    //       type,
    //       data,
    //     }

    //     state = {
    //       ...state,
    //       charts,
    //     }
    //     break;
    //   }

      //
      // SHARED ACTIONS
      //
    case 'USER_LOG_OUT':
      {
        state = {
          ...state,
          charts: charts,
        }

        break;
      }

    default:
      break;
  }

  return state;
};

export default ChartReducer;