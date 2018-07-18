
const charts = {
  // top3: {
  //   id: 'top3',
  //   type: 'aggregation',
  //   showOnDashboard: true,
  //   name: 'Top 3',
  //   data: null,
  //   unit: 'Revenue',
  //   aggregation: 'sum',
  //   config: 'top3Config',
  //   query: 'getTop3Chart',
  //   description: 'This is the top 3 stores by total revenues'
  // },
  void5: {
    id: 'void5',
    type: 'histogram',
    showOnDashboard: true,
    name: '5+ Voided Items',
    data: null,
    unit: '',
    query: 'getVoid5Chart',
    config: 'void5Config',
    description: '5+ voided items',

  }

}


const ChartReducer = (state = {
  charts: charts,
}, action) => {
  switch (action.type) {
    case 'CHART_INFO_FULFILLED':
      {
        const { key } = action.meta;

        const {
          data
        } = action.payload;

        const chart = {
          ...state.charts[key],
          data
        }

        charts[key] = chart

        state = {
          ...state,
          charts
        }

        break;
      }

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