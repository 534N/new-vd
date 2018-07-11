import React from 'react'
import { connect } from 'react-redux';
import { scaleLinear } from 'd3-scale';
import _ from 'lodash'

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { store } from '../store';

import { listVideo, getM3u8 } from '../utils/VideoUtil'
import Player from './Player'

const styles = () => ({
  root: {
    backgroundColor: '#000',
    width: '100%',
    minHeight: 'calc(100vw * 9 / 16)',
    display: 'flex',
    alignItems: 'center'
  },
  playerWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

});

const isMultiPlay = players => Object.keys(players).length > 1;
const isMultiRows = players => Object.keys(players).length > 2;


class VideoContainer extends React.Component {
  constructor(props) {
    super(props);
    this._kickOffVideoLoading(props);
  }

  componentWillReceiveProps(nextProps) {
    console.debug('>>> nextProps', nextProps)
  }

  render() {
    const { video, locations, locationId, cameraId, streamId, time, auth, user, classes } = this.props;
    const { players } = video;

    return (
      <div className={classes.root}>
        <Grid container>
        {
          Object.keys(players).map(playerId => {
            const config = players[playerId];
            return (
              <Grid key={playerId} item xs={12} sm={isMultiPlay(players) ? 6 : 12} md={isMultiPlay(players) ? 6 : 12} lg={isMultiPlay(players) ? 6 : 12} className={classes.playerWrap}>
                <Player jwtToken={auth.jwtToken} {...config} multiPlay={isMultiPlay(players)} onTimeUpdate={this._onTimeUpdate.bind(this)} />
              </Grid>
            )
          })
        }
        </Grid>
      </div>
    )
  }

  _kickOffVideoLoading(props) {
    const { locations, locationId, cameraId, streamId, time, auth, user } = props;
    store.dispatch({ type: 'INIT_VIDEO', payload: this.props })
    getM3u8(locations, locationId, cameraId, streamId, time);
    listVideo(locations, locationId, cameraId, streamId, time, auth.tenantId, auth.jwtToken, user.user);

    // debugger
    // const mergedPlaylist = this._mergeSegments(segments)
    // const { playerDomain } = this._storePlayerDomain(segments);
    // const recordingDomain = this._storeRecordingDomain(segments);

  }

  _onTimeUpdate(id, playerTime) {
    // const { ttf, m3u8 } = this.state;
    // if (!m3u8) {
    //   return;
    // }

    // const recordingTime = ttf(playerTime * 1000);
    // this.setState({ recordingTime })
    store.dispatch({ type: 'UPDATE_PLAY_TIME', meta: { playerId: id }, payload: playerTime})
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
    video: state.video,
  };
})(withStyles(styles)(VideoContainer));