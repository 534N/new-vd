/* NPM */
import React, { Component } from 'react';
import moment from 'moment';
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import _ from 'lodash';
/* COMPONENTS */
import Axes from './Axes.react'
import Bars from './Bars.react'
import Lines from './Lines.react'
import Cursor from './Cursor.react'
import Line from './Line.react'
import Area from './Area.react'
import ResponsiveWrapper from './ResponsiveWrapper.react'
/* UTILS */
import VDDate from 'utils/DateUtil';
/* SASS */
import './styles/histogram.sass' 
// const d3 =  require('utils/d3.v4.js');

const getDate = (date, offset=-5) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const min = date.getUTCMinutes();
  const sec = date.getUTCSeconds();

  const d = new Date(Date.UTC(year, month, day, hour, min, sec));
  d.setTime( d.getTime() + offset * 3600 * 1000 );

  return d;
}

export default class Chart extends Component {
  constructor() {
    super();
    this.chartID = 'bar-chart';
    this.xScaleTime = scaleTime();
    this.xScale = scaleBand();
    this.yScale = scaleLinear();
    this.yScaleTotalAmount = scaleLinear();

    this.state = {
      mousePosition: [0, 0],
      showCursor: false,
      highlight: null,
    };
  }

  componentDidMount() {
    const _gD3 = d3.select(`#${this.chartID}`);
    const _gDOM = document.getElementById(this.chartID);

    _gD3.on('mouseenter', this._handleMouseEnter.bind(this, _gDOM));
    _gD3.on('mouseleave', this._handleMouseOut.bind(this, _gDOM));
    _gD3.on('mousemove', this._handleMouseMove.bind(this, _gDOM));
    _gD3.on('touchmove', this._handleMouseMove.bind(this, _gDOM));
    _gD3.on('click', this._handleClick.bind(this, _gDOM));
  }

  render() {
    const margins = { top: 10, right: 40, bottom: 40, left: 40 }
    const { data, date, range, parentWidth, parentHeight, revenueReporting } = this.props;
    const { highlight } = this.state;
    const paddings = { left: 5, right: 5 };

    const svgDimensions = {
      width: Math.max(parentWidth, 300) - paddings.left - paddings.right,
      height: parentHeight - 40,
    }

    const maxCount = Math.max(...data.map(d => d.total))
    const maxTotalAmount = Math.max(...data.map(d => _.get(d, ['transactions', 'totalAmountSum'], 0)))

    // scaleTime
    const xScaleTime = this.xScaleTime
        .domain([moment(date).startOf(range), moment(date).endOf(range)])
        .range([margins.left, svgDimensions.width - margins.right])

    // scaleBand type
    const xScale = this.xScale
        .padding(0.3)
        .domain(data.map(d => d.title))
        .range([margins.left, svgDimensions.width - margins.right])
  
     // scaleLinear type
    const yScale = this.yScale
      .domain([0, maxCount])
      .range([svgDimensions.height - margins.bottom, margins.top])

    const yScaleTotalAmount = this.yScaleTotalAmount
      .domain([0, maxTotalAmount])
      .range([svgDimensions.height - margins.bottom, margins.top])

    const [ leftBound, rightBound ] = xScale.range();
    const [ left, right ] = xScaleTime.range();
    const [ mouseX, mouseY ] = this.state.mousePosition;

    const invert = xScaleTime.invert(mouseX);
    const { timestamp, mouseOverData } = this._determineMouseOverParams(invert, range, data);

    const padding = 4;
    const commonProps = {
      revenueReporting: revenueReporting,
      scales: { xScale, xScaleTime, yScale, yScaleTotalAmount },
      margins: margins,
      svgDimensions: svgDimensions,
      range: range,
      mouseOverIndex: timestamp,
      mouseOverData: mouseOverData,
      barWidth: (right - left) / data.length - padding,
    };


    return (
      <svg id={this.chartID} width={svgDimensions.width} height={svgDimensions.height} transform={`translate(${paddings.left}, 10)`}>
        <Axes {...commonProps} />

        <Bars {...commonProps}
          highlight={highlight}
          data={data}
          maxValue={maxCount} />

        {
          revenueReporting && 
          <Line {...commonProps}
            type={'transactions'}
            data={data}
            maxValue={maxCount} />
        }

        <Area {...commonProps}
          type={'motions'}
          data={data}
          maxValue={maxCount} />

        <Lines {...commonProps}
          aggs={this.props.aggs} />

        {
          this.state.showCursor &&
          <Cursor {...commonProps}
            margins={margins}
            offsetRight={rightBound - mouseX}
            mousePosition={this.state.mousePosition} />
        }
      </svg>
    )
  }

  _handleMouseMove(_gDOM) {
    let coordinates = [0, 0];
    coordinates = d3.mouse(_gDOM);

    const { dateRange } = this.props;
    const { start, end } = dateRange;
    const invert = this.xScaleTime.invert(coordinates[0]);

    this.setState({
      mousePosition: coordinates,
      showCursor: invert >= start && invert <= end,
    });
  }

  _handleClick(_gDOM) {
    const { data, range, location, onSelection } = this.props;
    const [ mouseX ] = this.state.mousePosition;

    const invert = this.xScaleTime.invert(mouseX);
    const { timestamp, mouseOverData } = this._determineMouseOverParams(invert, range, data);

    this.setState({
      highlight: timestamp,
    });

    onSelection(invert, location, {
      date: this._determineFilterDate(invert, range),
      range: range,
      location: location,
    });
  }

  _handleMouseOut(_gDOM) {
    this.setState({
      showCursor: false,
      mousePosition: [0, 0],
    });
  }

  _handleMouseEnter(_gDOM) {
    const [ mouseX, mouseY ] = d3.mouse(_gDOM);
    const { dateRange } = this.props;
    const { start, end } = dateRange;
    const invert = this.xScaleTime.invert(mouseX);

    this.setState({
      showCursor: invert >= start && invert <= end,
    });
  }

  _determineFilterDate(timestamp, range) {
    switch(range) {
      case 'Day':
      case 'Week':
      case 'Month':
        return new VDDate(moment(timestamp).startOf('day').format()).beginningOfDay();
        break;
      case 'Year':
        return new VDDate(moment(timestamp).endOf('month').format()).beginningOfDay();
        break;
    }
  }

  _determineMouseOverParams(invert, range, data) {
    const vdDate = new VDDate(invert).beginningOfDay();
    let timestamp;
    let mouseOverData;


    switch(range) {
      case 'Day': {
        const test = moment(invert).startOf(range);
        timestamp = +new Date(parseInt(invert.getTime() / 60 / 60 / 1000) * 60 * 60 * 1000);
        mouseOverData = _.find(data, o => o.startTime === timestamp);

        return { timestamp, mouseOverData };
        break;
      }

      case 'Week':
      case 'Month': {
        const test = moment(invert).startOf('day').format();
        timestamp = +new Date(test);
        mouseOverData = _.find(data, o => +new Date(new VDDate(o.startTime).beginningOfDay()) === timestamp);

        return { timestamp, mouseOverData };
        break;
      }

      case 'Year': {
        const test = moment(vdDate).startOf('month').format();
        timestamp = +new Date(test);
        mouseOverData = _.find(data, o => new VDDate(moment(o.startTime).startOf('month').format()).beginningOfDay().getTime() === timestamp);

        return { timestamp, mouseOverData };
        break;
      }
    }
  }
}

export default ResponsiveWrapper(Chart)
