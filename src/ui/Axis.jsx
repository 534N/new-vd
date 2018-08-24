import React from 'react'
import * as d3Axis from 'd3-axis'
import { select as d3Select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'

import '../css/Axis.css'

export default class Axis extends React.Component {
  componentDidMount() {
    this._renderAxis();
  }

  componentDidUpdate() {
    this._renderAxis();
  }

  render() {
    const { translate } = this.props;

    return (
      <g
        className={`axis axis-bottom`}
        ref={(el) => { this.axisElement = el; }}
        transform={translate} />
    )
  }

  _renderAxis = () => {
    const { scale, tickSize, ticks, tickFormat } = this.props;

    const axis = d3Axis.axisBottom()
      .scale(scale)
      .tickSize(0)
      .tickPadding([12])
      .ticks(ticks)
      // .tickSize(-tickSize)

    if (tickFormat) {
      axis.tickFormat(tickFormat);
    }

    d3Select(this.axisElement).call(axis);
  }
}