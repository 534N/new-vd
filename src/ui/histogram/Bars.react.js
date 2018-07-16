import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { interpolateLab } from 'd3-interpolate'
import ThemeColor from 'env/_themeColor';
import VDDate from 'utils/DateUtil';

export default class Bars extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const transactionBars = this._getBars('transactions');
    const motionBars = this._getBars('motions');
    const bookmarkBars = this._getBars('bookmarks') ;

    return (
      <g>
        <g>{transactionBars}</g>
        {/*<g>{motionBars}</g>*/}
        <g>{bookmarkBars}</g>
      </g>
    )
  }

  _getBars(type) {
    const { scales, margins, data, svgDimensions, mouseOverIndex, range, maxValue, barWidth, highlight } = this.props
    const { xScale, yScale, xScaleTime } = scales
    const { height } = svgDimensions;

    const [dateLeft, dateRight] = xScaleTime.domain();
    const padding = 4;
  
    const colorScale = scaleLinear()
          .range(this._determineColorRange(type))
          .domain([0, maxValue])
          .interpolate(interpolateLab);

    const bars = (
      data.filter(datum => {
        return +new Date(datum.startTime) >= +new Date(dateLeft)
      }).map((datum, index) => {
        const { startTime, title } = datum;
        const vdDate = new Date(startTime);
        const value = datum[type].count || 0;

        return <rect
          key={title}
          x={xScaleTime(vdDate)}
          y={yScale(value)}
          height={height - margins.bottom - scales.yScale(value)}
          width={barWidth}
          fill={colorScale(value)}
          stroke={'#565656'}
          strokeWidth={mouseOverIndex === startTime || highlight === startTime ? 2 : 0} />
      })
    )

    return bars;
  }

  _determineColorRange(type) {
    switch(type) {
      case 'transactions':
        return [ThemeColor['green-0'], ThemeColor['green-8']];
        break;
      case 'motions':
        return [ThemeColor['blue-11'], ThemeColor['blue-12']];
        break;
      case 'bookmarks':
        return [ThemeColor['orange-1'], ThemeColor['orange-6']];
        break;
    }
  }
}