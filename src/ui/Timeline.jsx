import React, { Component } from 'react'
import { interpolateLab } from 'd3-interpolate'
import { mouse, select } from 'd3-selection'
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale'
import { timeHour, timeMinute, timeSecond } from 'd3-time'
import moment from 'moment'

import { getKeyFrameURL } from '../utils/VideoUtil'
import Axis from './Axis';

import '../css/Timeline.css'

const styles = {
  root: {
    cursor: 'pointer',
  },
  recording: {
    fill: 'rgba(255,255,255,0.7)'
  },
  played: {
    fill: '#f54'
  },
  attempt: {
    fill: 'rgba(255,85,68, 0.5)',
  },
  text: {
    color: '#fff',
    fill: '#fff'
  }
}

const getWidth = width => {
  if (width >= 1000) {
    return 3;
  } else if (width >= 500 && width < 1000) {
    return 3;
  }
}

const mergeSegments = segments => {
  let merged = [];
  let current = {};

  const inSec = timestamp => parseInt(timestamp / 1000) * 1000;

  segments.forEach(({ start, end, ...props }, idx) => {
    if (idx === 0) {
      current = { start: start, end: end, ...props };

      return;
    }

    if (idx === segments.length - 1) {
      merged.push(Object.assign({}, current));
    }

    const currentEndInSec = inSec(current.end);
    const startInSec = inSec(start);

    if (currentEndInSec === startInSec) {
      current.end = end;

      return;
    } else {
      merged.push(Object.assign({}, current));
      current = { start: start, end: end, ...props };
    }

  });

  return merged;
}

const findClosest = (timestamp, recordings) => {
  
  const recs = recordings.map(rec => parseInt(rec.start));
  return binarySearch(recs, timestamp);

  function binarySearch(array, target) {

    let L = 0;
    let R = array.length - 1;
    let M;
    let count = 0;

    while (L < R) {
      count++;
      M = (R + L) >> 1;

      if (target < array[M]) {
        R = M - 1;
      } else if (target > array[M]) {
        L = M + 1;
      } else {
        break;
      }
    }
    
    return M;
  }
}

const isToday = date => moment(date).isSame(new Date(), 'day');

export default class extends Component {
  constructor(props) {
    super(props);
    const { simple, time, width, recordings, multiPlay } = props;
    const margin = {
      left: multiPlay ? 10 : 0,
      right: multiPlay ? 10 : 0,
    };

    const config = {
      width: width || '100%',
      height: simple ? '60px' : '200px',
      barHeight: getWidth(width),
      ticks: multiPlay ? timeHour.every(3) : timeHour.every(3),
      translate: simple ? `translate(${margin.left}, 38)` : `translate(${margin.left}, 20)`,
      margin
    }

    const domain = [
      moment(time).startOf('day'),
      isToday(time) ? new Date() :  moment(time).endOf('day'),
    ];

    const range = [
      margin.left,
      isToday(time) ? width - margin.left - margin.right : width - margin.left - margin.right,
    ];

    const scale = scaleTime().domain(domain).range(range)
    const segments = mergeSegments(recordings);

    this.state = {
      config,
      scale,
      segments,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    const _gD3 = select(`#timeline-${id}`);
    const _gDOM = document.getElementById(`timeline-${id}`);

    _gD3.on('mouseenter', this._handleMouseEnter.bind(this, _gDOM));
    _gD3.on('mouseleave', this._handleMouseOut.bind(this, _gDOM));
    _gD3.on('mousemove', this._handleMouseMove.bind(this, _gDOM));
    // _gD3.on('touchmove', this._handleMouseMove.bind(this, _gDOM));
    _gD3.on('click', this._handleClick.bind(this, _gDOM));
  }

  componentWillUnmount() {

  }


  render() {
    const { id } = this.props;
    const { config, scale, mouseOver } = this.state;
    const { width, height, ticks, translate, margin } = config;

    
    return (
      <svg
        id={`timeline-${id}`}
        className='timeline'
        width={width - margin.left - margin.right}
        height={height}
        style={styles.root}
        transform={`translate(${margin.left}, ${mouseOver ? 0 : 25})`}>
        <Axis translate={translate} ticks={ticks} scale={scale} />
        {
          this._renderRecordingSegments()
        }
        {
          this._renderPlayedBlock()
        }
        {
          this._renderMouseTime()
        }
        
      </svg>
    )
  }

  _renderRecordingSegments = () => {
    const { config, scale, segments, mouseOver } = this.state;
    const { barHeight } = config;

    if (!segments) {
      return
    }

    return (
      <g style={{cursor: 'pointer'}} transform={`translate(0, 35)`}>
        {
          segments.map(({ start, end }, idx) => {
            const x0 = scale(parseInt(start));
            const x1 = scale(parseInt(end));

            return <rect key={`${start}-${idx}`} x={x0} y={0} height={mouseOver ? barHeight + 1 : barHeight} width={x1 - x0} style={styles.recording} />
          })
        }
      </g>
    )
  }

  _renderPlayedBlock = () => {
    const { playTime } = this.props;
    const { config, scale, mouseOver } = this.state;
    const { barHeight } = config;

    const x0 = 0;
    const x1 = scale(playTime);

    return (
      <g transform={`translate(0, 35)`}>
        <rect x={x0} y={0} height={mouseOver ? barHeight + 1 : barHeight} width={x1 - x0} style={styles.played} />
      </g>
    )
  }

  _renderMouseTime() {
    const { config, mouseX, mouseOver } = this.state;
    const { barHeight } = config;

    if (!mouseOver) {
      return
    }

    const x0 = 0;
    const x1 = mouseX;

    return (
      <g transform={`translate(0, 35)`}>
        <rect x={x0} y={0} height={mouseOver ? barHeight + 1 : barHeight} width={x1 - x0} style={styles.attempt} />
      </g>
    )
  }

  _handleMouseMove = (_gDOM) => {
    const { recordings, locationId, locations, cameraId, streamId, updatePreviewUrl } = this.props;
    const { scale } = this.state;
    const [ mouseX ] = mouse(_gDOM)

    const mouseTime = scale.invert(mouseX);
    const cc = findClosest(mouseTime.getTime(), recordings);
    const { start, end } = recordings[cc];
    const duration = parseInt(end) - parseInt(start);
    const previewUrl = getKeyFrameURL(locations, locationId, cameraId, streamId, start, duration)
    updatePreviewUrl({
      previewUrl,
      mouseTime,
      mouseX
    });
    
    this.setState({
      mouseTime,
      mouseX,
    });
  }

  _handleMouseEnter = () => {
    const { updateShowTooltip } = this.props;
    updateShowTooltip(true);

    this.setState({
      mouseOver: true,
    });
  }

  _handleMouseOut = () => {
    const { updateShowTooltip } = this.props;
    updateShowTooltip(false);

    this.setState({
      mouseOver: false,
    });
  }

  _handleClick = _gDOM => {
    const { onSeek, ttf } = this.props;
    const { scale } = this.state;
    const [ mouseX ] = mouse(_gDOM)

    const mouseTime = scale.invert(mouseX);
    const targetPlayerTime = ttf.invert(mouseTime) / 1000
    onSeek(targetPlayerTime)

    

  }

  
}
