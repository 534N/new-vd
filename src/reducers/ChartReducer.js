
const charts = {
  top3: {
    id: 'top3',
    type: 'aggregation',
    showOnDashboard: true,
    name: 'Top 3',
    data: null,
    unit: 'Revenue',
    aggregation: 'sum',
    config: 'top3Config',
    query: 'getTop3Chart',
    description: 'This is the top 3 stores by total revenues',
    fetching: false,
  },
  void5: {
    id: 'void5',
    type: 'combined',
    showOnDashboard: true,
    name: '5+ Voided Items',
    data: null,
    unit: 'Revenue',
    query: 'getVoid5Chart',
    config: 'void5Config',
    description: '5+ voided items',
    fetching: false,
  },
  spiderWeb: {
    id: 'spiderWeb',
    type: 'spider',
    showOnDashboard: true,
    name: 'Regular histogram',
    data: null,
    unit: 'Events',
    query: 'allEventsChart',
    config: 'spiderWebConfig',
    description: 'testing histogram',
  }


}


const ChartReducer = (state = {
  charts: charts,
  timestamp: +new Date(),
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
          fetching: false,
          timestamp: +new Date(),
          data
        }

        charts[key] = chart

        state = {
          ...state,
          charts
        }

        break;
      }

    // case 'CHART_INFO_PENDING':
    //   {
    //     const { key } = action.meta;

    //     const chart = {
    //       ...state.charts[key],
    //       fetching: true,
    //       timestamp: +new Date(),
    //     }

    //     charts[key] = chart

    //     state = {
    //       ...state,
    //       charts
    //     }

    //     break;
    //   }

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