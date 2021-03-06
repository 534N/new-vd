import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import axios from 'axios'
import Highcharts from 'highcharts'
import _ from 'lodash'


import chartConfigs from '../reducers/configs/chartConfigs'
import platform from '../api/Platform'

import Mask from '../components/Mask'
import { store } from '../store'

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
import BellCurve from 'highcharts/modules/histogram-bellcurve'
import HighchartsMore from 'highcharts/highcharts-more'


BellCurve(Highcharts)
HighchartsMore(Highcharts)

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

    const { auth, time, chart, repeatInterval } = props;
    const { time: date, timeZone, range } = time;

    const queryBody = {
      date,
      timeZone,
      range: range
    }

    const { name, id, query } = chart;

    if (repeatInterval) {
      store.dispatch({ type: 'CHART_INFO', meta: { name, key: id }, payload: axios(platform[query](auth.jwtToken, queryBody)) })
      setInterval(() => {
        store.dispatch({ type: 'CHART_INFO', meta: { name, key: id }, payload: axios(platform[query](auth.jwtToken, queryBody)) })
      }, repeatInterval)
    } else {
      store.dispatch({ type: 'CHART_INFO', meta: { name, key: id }, payload: axios(platform[query](auth.jwtToken, queryBody)) })
    }

    this.charts = {};

  }

  componentWillUpdate() {
    this._renderChart()
  }

  componentWillReceiveProps(nextProps) {
    const { auth, time, chart } = nextProps;
    const { time: date, timeZone, range } = time;

    const queryBody = {
      date,
      timeZone,
      range: range
    }

    const { name, id, query, fetching } = chart;
  }

  render() {
    const { chart, width } = this.props;
    const { id, fetching } = chart;

    console.debug('width >>> ', width)
    return (
      <div ref='histogram' >
        {
          false && fetching &&
          <Mask />
        }
        <div id={`chart-${id}`} height='200px' onMouseEnter={this._mouseEnterChart.bind(this)} onMouseLeave={this._mouseLeaveChart.bind(this)} />
      </div>
    );
  }

  _mouseEnterChart(e) {
    const { ignoreHover } = this.props;

    if (ignoreHover) {
      return;
    }

    const id = e.target.id;
    const chart = this.charts[id];

    chart.update({
      yAxis: {
        visible: true,
      },
      legend: {
        enabled: true,
      },
    })
  }

  _mouseLeaveChart(e) {
    const { ignoreHover } = this.props;

    if (ignoreHover) {
      return;
    }

    const id = e.target.id;
    const chart = this.charts[id];

    chart.update({
      yAxis: {
        visible: false,
      },
      legend: {
        enabled: false,
      },
    })
  }

  _changeRange(rangeIdx) {
    store.dispatch({ type: 'CHANGE_RANGE', payload: rangeIdx})
  }

  _renderChart() {
    const { chart } = this.props;
    const { name, id, description, data, unit, config, aggregation, type, fetching } = chart;
    if (!data || fetching) {
      return
    }
    this.charts[`chart-${id}`] = Highcharts.chart(`chart-${id}`, chartConfigs[config](name, description, unit, this._generateSeries(data, type, aggregation)));


  }

  _generateSeries = (data, type, aggregation) => {
    const { locations } = this.props;
    
    if (type === 'aggregation') {
      return data.map(d => {
        const { results, key } = d;
        const { name } = _.find(locations, l => l.id === key);

        return {
          name: name,
          data: results.map(rec => [+new Date(rec.startTime), parseInt(rec.stats[aggregation])])
        }
      });
    } else if ( type === 'combined') {
      const totalAmount = {
        type: 'spline',
        name: 'Total Amount',
        yAxis: 0,
        color: 'rgba(114, 191, 99, 0.8)',
        data: []
      };

      const totalCount = {
        type: 'column',
        name: 'Number of transactions',
        yAxis: 1,
        color: 'rgba(150, 150, 150, 0.5)',
        data: []
      };

      totalAmount.data = data.results.map(d => {
        const rec = _.find(d.results, r => r.type === 'transaction') || {};
        return parseInt(rec.totalAmountSum) || 0;
      });

      totalCount.data = data.results.map(d => {
        const rec = _.find(d.results, r => r.type === 'transaction') || {};
        return parseInt(rec.count) || 0;
      });

      return [ totalCount, totalAmount  ];
    } else if (type === 'rt') {
      const totalCount = {
        data: []
      };

      totalCount.data = data.results.filter(r => r.type === 'transaction').map(d => {
        const { details } = d;
        return [ new Date(details['Time']), details['Total amount'] ];
      });

      return [ totalCount ]
    }
  } 
}

export default Histogram
