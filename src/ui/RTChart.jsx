import React from 'react'
import axios from 'axios'
import Highcharts from 'highcharts'
import _ from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux';



import chartConfigs from '../reducers/configs/chartConfigs'
import platform from '../api/Platform'

import { store } from '../store'

import '../css/histogram.css';
import BellCurve from 'highcharts/modules/histogram-bellcurve'
import HighchartsMore from 'highcharts/highcharts-more'


BellCurve(Highcharts)
HighchartsMore(Highcharts)

const interval = 1000 * 5;

class RTChart extends React.Component {
  constructor(props) {
    super(props);

    const { auth, chart, time } = props;
    const { query } = chart;

    const { range } = time;

    this.lastQueried = new Date(+new Date() - 5 * 1000);
    const start = new Date(moment().startOf(range));
    const end = this.lastQueried;

    store.dispatch({ type: 'RT_EVENT_CHART_INFO', payload: axios(platform[query](auth.jwtToken, start, end)) })
    // setInterval(() => {
    //   const newEnd = new Date(+new Date() - 5 * 1000);
    //   store.dispatch({ type: 'RT_EVENT_CHART_INFO', payload: axios(platform[query](auth.jwtToken)), start: this.lastQueried, newEnd })
    //   this.lastQueried = newEnd;
    // }, interval)

    this.chart = null;
  }

  componentWillReceiveProps(nextProps) {
    const { chart: { data: newData } } = nextProps;
    const { chart: { data: oldData, id, config } } = this.props;


    if (!this.chart) {

      const seriesData = Object.values(newData).map(d => [ new Date(d.time), d.amount ]);
      this.chart = Highcharts.chart(`chart-${id}`, chartConfigs[config](seriesData));
    } else {
      const seriesData = Object.values(newData).map(d => [new Date(d.time), d.amount]);
      this.chart.update({
        series: seriesData,
      })
    }

    

  }

  componentDidMount() {
    // this._renderChart()
  }

  render() {
    const { chart, width } = this.props;
    const { id } = chart;

    console.debug('chart >>>> ', chart)
    return (
      <div ref='RTChart' >
        <div id={`chart-${id}`} height='200px' />
      </div>
    );
  }

  _renderChart() {
    const { chart } = this.props;
    const { id, data, config } = chart;

    this.chart = Highcharts.chart(`chart-${id}`, chartConfigs[config](data));
  }
}

export default connect(state => {
  const { rtChart } = state;

  return {
    chart: rtChart,
  };
})(RTChart);
