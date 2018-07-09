import React from 'react'
import { connect } from 'react-redux';
import { scaleLinear } from 'd3-scale';

import { withStyles } from '@material-ui/core/styles';

import { store } from '../store';

import { listVideo, getM3u8 } from '../utils/VideoUtil'
import Player from './Player'

const styles = () => ({
  root: {
    backgroundColor: '#333',
    width: '100%',
    height: 'calc(100vw * 9 / 16)',
  },

});


class VideoContainer extends React.Component {
  constructor(props) {
    super(props);

    const initState = this._updateVideoData(props);

    this.state = {
      ...initState
    }
  }

  componentWillReceiveProps(nextProps) {
    console.debug('>>>>> play container will receive props')
    const newState = this._updateVideoData(nextProps);

    this.setState = ({
      ...newState
    })

  }

  componentDidMount() {
    store.dispatch({ type: 'PLAY_VIDEO', payload: {}})
  }

  render() {
    const { locations, locationId, cameraId, streamId, time, auth, user, classes } = this.props;
    const { m3u8 } = this.state;

    return (
      <div className={classes.root}>
        <Player jwtToken={auth.jwtToken} m3u8={m3u8} onTimeUpdate={this._onTimeUpdate.bind(this)}/>
      </div>
    )
  }

  _updateVideoData(props) {
    const { locations, locationId, cameraId, streamId, time, auth, user } = props;
    const m3u8 = getM3u8(locations, locationId, cameraId, streamId, time);
    const segments = listVideo(locations, locationId, cameraId, streamId, time, auth.tenantId, auth.jwtToken, user.user);

    debugger
    const mergedPlaylist = this._mergeSegments(segments)
    const { playerDomain } = this._storePlayerDomain(segments);
    const recordingDomain = this._storeRecordingDomain(segments);

    return {
      m3u8,
      segments,
      playlist: mergedPlaylist,
      ttf: scaleLinear().domain(playerDomain).range(recordingDomain),
    }
  }

  _onTimeUpdate(playerTime) {
    const { ttf, m3u8 } = this.state;
    if (!m3u8) {
      return;
    }

    const recordingTime = ttf(playerTime * 1000);
    this.setState({ recordingTime })
  }

  _mergeSegments(segments) {
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

  _storePlayerDomain(recordingData) {
    let playTime = 0;
    let playerDomain = [];

    for (let i = 0; i < recordingData.length; i++) {
      const duration = recordingData[i].end - recordingData[i].start;

      playerDomain.push(playTime);
      playerDomain.push(playTime + duration);
      playTime += duration;
    }
    return { playerDomain: playerDomain, playTime: playTime, filteredRecordingData: recordingData };
  }

  _storeRecordingDomain(recordingData) {
    let recordingDomain = [];

    for (let i = 0; i < recordingData.length; i++) {
      recordingDomain.push(recordingData[i].start);
      recordingDomain.push(recordingData[i].end);
    }
    return recordingDomain;
  }
}


export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    ...state.time,
  };
})(withStyles(styles)(VideoContainer));