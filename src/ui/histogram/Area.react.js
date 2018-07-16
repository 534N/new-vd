import React, { Component } from 'react'
import { line, area, curveMonotoneX } from 'd3-shape'
import VDDate from 'utils/DateUtil'

export default class Area extends Component {
  render() {
    const { scales, data, color, type, svgDimensions, margins } = this.props
    const { yScale, xScaleTime } = scales
    const { height } = svgDimensions

    // data.push({type: 'motion', count: 0});

    const d = area()
      .x(d => xScaleTime(new Date(d.startTime))) // set the x values for the line generator
      .y0(height - margins.bottom) 
      .y1(d => yScale(Math.abs(d[type].count))) // set the y values for the line generator 
      .curve(curveMonotoneX) // apply smoothing to the line

    // const d = line()
    //   .x(d => xScaleTime(new Date(d.startTime)))
    //   .y(d => yScale(Math.abs(d[type].count)))
    //   .curve(curveMonotoneX);

    return (
      <g >
        <path d={d(data)} style={{
          fill: 'rgba(143, 215, 251, 0.5)',
          // stroke: color || 'rgba(143, 215, 251, 0.8)',
          // strokeWidth: 1
        }}/>
      </g>
    )
  }
}