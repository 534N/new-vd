import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'

import Line from './Line.react';

export default class Lines extends Component {
  render() {
    const { scales, margins, aggs, svgDimensions } = this.props
    const { xScale } = scales
    const { height } = svgDimensions

    const activeAggs = [];

    Object.keys(aggs).forEach(aggKey => {
      if(aggs[aggKey].active) {
        activeAggs.push(aggs[aggKey]);
      }
    })

    const lines = activeAggs.map(agg => {

      console.debug('agg >>', agg)
      const maxValue = Math.max(...agg.data.map(d => Math.abs(d.value)));

      console.debug('maxValue', maxValue)
      const yScale = scaleLinear()
        .domain([0, maxValue])
        .range([svgDimensions.height - margins.bottom, margins.top])

      return <Line key={agg.key} {...this.props} data={agg.data} color={agg.color} yScale={yScale} maxValue={maxValue} />
    })

    return <g>{lines}</g>

  }
}