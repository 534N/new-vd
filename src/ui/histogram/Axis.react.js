import React, { Component } from 'react';
import * as d3Axis from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';

const d3 =  require('utils/d3.v4.js');

export default class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const { orient, scale, tickSize, ticks, tickFormat } = this.props;

    const axisType = `axis${orient}`;
    const axis = d3Axis[axisType]()
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

  render() {
    const { orient, translate } = this.props;

    return (
      <g
        className={`Axis Axis-${orient}`}
        ref={(el) => { this.axisElement = el; }}
        transform={translate} />
    )
  }
}