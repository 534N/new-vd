import React, { Component } from 'react'
import { line, curveMonotoneX, curveLinear } from 'd3-shape'
import VDDate from 'utils/DateUtil'

export default class Line extends Component {
  render() {
    const { color, data, type, mouseOverData, scales, barWidth } = this.props
    const { xScaleTime } = scales
    const { y, v, strokeColor } = this._determineLine()

    const d = line()
      .x(d => xScaleTime(new Date(d.startTime)))
      .y(d => y(Math.abs(d[type][v])))
      .curve(curveMonotoneX);

    const style = {
      stroke: color || strokeColor,
      strokeWidth: 2
    };


    const dataUpToNow = data.filter(datum => {
      return +new Date(datum.startTime) <= +new Date()
    })


    return (
      <g >
        <path d={d(dataUpToNow)} style={{...style, fill: 'none'}} transform={`translate(${barWidth/2}, 0)`} />
        {
          mouseOverData && !this._inFuture(mouseOverData.startTime) &&
          <circle style={{...style, fill: '#fff'}}
            r={4}
            cx={xScaleTime(mouseOverData.startTime)}
            cy={y(mouseOverData[type][v])}
            transform={`translate(${barWidth/2}, 0)`} />
        }
      </g>
    )
  }

  _inFuture(timestamp) {
    return +new Date(timestamp) > +new Date();
  }

  _determineLine() {
    const { scales, color, type } = this.props
    const { yScale, xScaleTime, yScaleTotalAmount } = scales

    switch(type) {
      case 'motions': 
        return {
          y: yScale,
          v: 'count',
          strokeColor: '#0088cc',
        }
        break;

      case 'transactions': 
        return {
          y: yScaleTotalAmount,
          v: 'totalAmountSum',
          strokeColor: '#9CDE45',
        }
        break;
    }
  }
}