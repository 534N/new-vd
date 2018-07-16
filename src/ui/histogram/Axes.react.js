import React from 'react';
import Axis from './Axis.react';

const d3 =  require('utils/d3.v4.js');

export default ({ scales, margins, svgDimensions, range, mouseOverIndex, mouseOverData, barWidth, revenueReporting }) => {

  const determineWidth = range => {
    switch(range) {
      case 'Day':
        return d3.timeHour.every(3);
        break;

      case 'Week':
        return d3.timeDay.every(3);
        break;

      case 'Month':
        return d3.timeDay.every(5);
        break;

      case 'Year':
        return d3.timeMonth.every(3);
        break;
    }
  }

  const { height, width } = svgDimensions

  const xProps = {
    orient: 'Bottom',
    scale: scales.xScaleTime,
    translate: `translate(${barWidth / 2}, ${height - margins.bottom})`,
    tickSize: height - margins.top - margins.bottom,
    ticks: determineWidth(range),
  }

  const yProps = {
    orient: 'Left',
    scale: scales.yScale,
    translate: `translate(${margins.left}, 0)`,
    tickSize: width - margins.left - margins.right,
    ticks: 4,
    tickFormat: d3.format('.0s'),
  }

  const yPropsTotalAmount = revenueReporting ? {
    orient: 'Right',
    scale: scales.yScaleTotalAmount,
    translate: `translate(${width - margins.right}, 0)`,
    tickSize: 0, //width - margins.left - margins.right,
    ticks: 4,
    tickFormat: d3.format('.0s'),
  } : '';

  return (
    <g>
      <Axis {...xProps} />
      <Axis {...yProps} />
      { 
        revenueReporting && 
        <Axis {...yPropsTotalAmount} />
      }
    </g>
  )

  
}