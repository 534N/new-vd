import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import axios from 'axios'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts'
import _ from 'lodash'

import { store } from '../store'
import Platform from '../api/Platform'


/* ACTIONS */
// import FilterActions from 'actions/FilterActions';
// import { fetchHistogram, changeHistogramRange } from './rdx/actions';
// /* STORE */
// import AuthStore from 'stores/AuthStore';
// import LocationStore from 'stores/LocationStore';
/* MUI */
// import IconButton from 'material-ui/IconButton';
/* D3 COMPONENTS */
// import BarChart from './BarChart.';
// import NoEventMessage from 'filter/NoEventMessage.react';
// import Flex from 'components/Flex/Flex';
/* UTILS */
// import VDDate from 'utils/DateUtil';
/* MISC */
/* SASS */
import '../css/histogram.css';

const categories = [
  {
    DAY: '00:00',
    WEEK: 'Monday',
    MONTH: '1',
    YEAR: 'Jan',
  },
  {
    DAY: '01:10',
    WEEK: 'Tuesday',
    MONTH: '2',
    YEAR: 'Feb',
  },
  {
    DAY: '02:00',
    WEEK: 'Wednesday',
    MONTH: '3',
    YEAR: 'Mar',
  },
  {
    DAY: '03:00',
    WEEK: 'Thursday',
    MONTH: '4',
    YEAR: 'Apr',
  },
  {
    DAY: '04:00',
    WEEK: 'Friday',
    MONTH: '5',
    YEAR: 'May',
  },
  {
    DAY: '05:00',
    WEEK: 'Saturday',
    MONTH: '6',
    YEAR: 'Jun',
  },
  {
    DAY: '06:00',
    WEEK: 'Sunday',
    MONTH: '7',
    YEAR: 'Jul',
  },
  {
    DAY: '07:00',
    MONTH: '8',
    YEAR: 'Aug',
  },
  {
    DAY: '08:00',
    MONTH: '9',
    YEAR: 'Sep',
  },
  {
    DAY: '09:00',
    MONTH: '10',
    YEAR: 'Oct',
  },
  {
    DAY: '10:00',
    MONTH: '11',
    YEAR: 'Nov',
  },
  {
    DAY: '11:00',
    MONTH: '12',
    YEAR: 'Dec',
  },
  {
    DAY: '12:00',
  },
  {
    DAY: '13:00',
  },
  {
    DAY: '14:00',
  },
  {
    DAY: '15:00',
  },
  {
    DAY: '16:00',
  },
  {
    DAY: '17:00',
  },
  {
    DAY: '18:00',
  },
  {
    DAY: '19:00',
  },
  {
    DAY: '20:00',
  },
  {
    DAY: '21:00',
  },
  {
    DAY: '22:00',
  },
  {
    DAY: '23:00',
  },
]

const getCategories = range => categories.filter(c => c.hasOwnProperty(range)).map(c => c[range]);
const getInterval = range => {
  switch(range) {
    case 'DAY': {
      return 3600 * 1000;
      break;
    }
    case 'WEEK': {
      return 3600 * 1000 * 24;
      break;
    }
    case 'MONTH': {
      return 3600 * 1000 * 24;
      break;
    }
    case 'YEAR': {
      return 3600 * 1000 * 24;
      break;
    }
  }
}


class Histogram extends React.Component {
  constructor(props) {
    super(props);

    const { auth, time } = props;
    const { getTop3Chart } = Platform;
    const { time: date, timeZone, range } = time;

    const queryBody = {
      date,
      timeZone,
      range: range
    }

    store.dispatch({ type: 'CHART_INFO', meta: { name: 'Top 3', key: 'top3' }, payload: axios(getTop3Chart(auth.jwtToken, queryBody)) })
  }

  componentDidUpdate() {
    this._renderChart()
  }

  componentWillReceiveProps(nextProps) {
    const { auth, time } = nextProps;
    const { getTop3Chart, getVoid5Chart } = Platform;
    const { time: date, timeZone, range } = time;

    const queryBody = {
      date,
      timeZone,
      range: range
    }

    store.dispatch({ type: 'CHART_INFO', meta: { name: 'Top 3', key: 'top3' }, payload: axios(getTop3Chart(auth.jwtToken, queryBody)) })
    store.dispatch({ type: 'CHART_INFO', meta: { name: 'Void 5+', key: 'void5' }, payload: axios(getVoid5Chart(auth.jwtToken, queryBody)) })
  }

  render() {
    return (
      <div id='histogram' ref='histogram'>
        <div>
          <div onClick={this._changeRange.bind(this, 0)}>Day</div>
          <div onClick={this._changeRange.bind(this, 1)}>Week</div>
          <div onClick={this._changeRange.bind(this, 2)}>Month</div>
          <div onClick={this._changeRange.bind(this, 3)}>Year</div>
        </div>
        <div id="container" style={{width:'100%', height:'400px'}}></div>
      </div>
    );
  }

  _changeRange(rangeIdx) {
    store.dispatch({ type: 'CHANGE_RANGE', payload: rangeIdx})
  }

  _renderChart() {
    const { time } = this.props;
    const { range } = time;
    const { charts } = this.props;

    Object.values(charts).map(c => {
      
      const config = {
        chart: {
          type: 'spline'
        },
        title: {
          text: c.name
        },
        subtitle: {
          text: c.description
        },
        xAxis: {
          type: 'datetime',
          labels: {
            overflow: 'justify'
          }
        },
        yAxis: {
          title: {
            text: c.unit
          },
          labels: {
            formatter: function () {
              return '$' + this.value;
            }
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        plotOptions: {
          spline: {
            lineWidth: 4,
            states: {
              hover: {
                lineWidth: 5
              }
            },
            marker: {
              enabled: false
            },
            pointInterval: getInterval(range), // one hour
            pointStart: moment().startOf(range)
          }
        },
        series: this._generateSeries(c.data, 'sum')
      }

      Highcharts.chart('container', config);
    })
  }

  _generateSeries = (data, type) => {

    const { locations } = this.props;

    return data.map(d => {
      const { results, key } = d;

      const { name } = _.find(locations, l => l.id === key);

      return {
        name: name,
        // marker: {
        //   symbol: 'square'
        // },
        data: results.map(rec => parseInt(rec.stats[type]))
      }
    });
  }
}

export default connect(state => {
  return {
    ...state.charts,
  };
})(Histogram);