import React, { Component } from 'react'
import { interpolateLab } from 'd3-interpolate'
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale'
import { timeHour, timeMinute, timeSecond } from 'd3-time'
import moment from 'moment'

import Axis from './Axis';

const styles = {
  root: {
  },
  recording: {
    fill: '#fff'
  }
}

export default class extends Component {
  constructor(props) {
    super(props);
    const { simple, time, width } = props;
    const margin = {
      left: simple ? 0 : 10,
      right: simple ? 0 : 10,
    };

    const config = {
      width: width || '100%',
      height: simple ? '8px' : '200px',
      ticks: simple ? 0 : timeHour.every(3),
      translate: simple ? `translate(${margin.left}, 5)` : `translate(${margin.left}, 20)`,
      margin
    }

    const scale = scaleTime().domain([moment(time).startOf('day'), moment(time).endOf('day')]).range([margin.left, width - margin.left - margin.right])

    this.state = {
      config,
      scale,
    };

    
  }

  
  render() {
    const { recordings } = this.props;
    const { config, scale } = this.state;
    const { width, height, ticks, translate, margin } = config;
    
    return (
      <svg width={width - margin.left - margin.right} height={height} style={styles.root}>
        <Axis translate={translate} ticks={ticks} scale={scale} />
        {
          recordings &&
          <g>
            {
              recordings.map(({ start, end }) => {
                const x0 = scale(parseInt(start));
                const x1 = scale(parseInt(end));


                return <rect x={x0} y={0} height={height} width={x1 - x0} style={styles.recording} />
              })
            }
          </g>
        }
        
      </svg>
    )
  }

  
}
