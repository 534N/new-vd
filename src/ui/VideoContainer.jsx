import React from 'react'
import { connect } from 'react-redux';
import { scaleLinear } from 'd3-scale';
import _ from 'lodash'

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { store } from '../store';

import { listVideo, getM3u8 } from '../utils/VideoUtil'
import Player from './Player'
import Timeline from './Timeline'

const styles = () => ({
  root: {
    backgroundColor: '#000',
    width: '100%',
    minHeight: 'calc(100vw * 9 / 16)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  playerWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

});

const isMultiPlay = players => Object.keys(players).length > 1;
const isMultiRows = players => Object.keys(players).length > 2;

const getCamera = (locations, locationId, cameraId) => {
  const { cameras } = _.find(locations, l => l.id === locationId);
  return _.find(cameras, c => c.cameraId === cameraId);
}

const playerWidth = (screenWidth, players, primaryPlayerId, playerId) => {
  if (isMultiPlay(players)) {
    // if (primaryPlayerId === playerId) {
    //   return 8;
    // } else {
      if (screenWidth === 'lg' && Object.keys(players).length > 2) {
        return 4;
      } else {
        return 6;
      }
    // }
  } else {
    return 12;
  }
}

class VideoContainer extends React.Component {
  constructor(props) {
    super(props);
    const { playlist } = props;
    const isMultiPlay = Object.keys(playlist).length > 1;

    this._kickOffVideoLoading({ ...props, replace: !isMultiPlay });
  }

  componentWillReceiveProps(nextProps) {
    const { playlist } = nextProps;
    const { playlist: oldPlayList } = this.props;

    const diff = _.omitBy(playlist, (v, k) => oldPlayList[k] === v);
    const isMultiPlay = Object.keys(playlist).length > 1;

    if (!_.isEmpty(diff)) {
      this._kickOffVideoLoading({ ...nextProps, playlist: diff, replace: !isMultiPlay });
    }
  }

  render() {
    const { video: { players, primaryPlayerId }, auth, classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container>
        {
          Object.keys(players).map(playerId => {
            const config = players[playerId];
            const is360 = playerId.match(/\|is360/);
            return (
              <Grid key={playerId} item xs={12} sm={playerWidth('sm', players, primaryPlayerId, playerId)} md={playerWidth('md', players, primaryPlayerId, playerId)} lg={playerWidth('lg', players, primaryPlayerId, playerId)} className={classes.playerWrap}>
                <Player jwtToken={auth.jwtToken} {...config} is360={is360} multiPlay={isMultiPlay(players)} />
              </Grid>
            )
          })
        }
        </Grid>

        <Timeline multiPlay={isMultiPlay(players)} />
      </div>
    )
  }

  _kickOffVideoLoading({ locations, playlist, time, auth, user, replace=false }) {

    Object.keys(playlist).forEach(playerIdx => {
      const playerId = playlist[playerIdx];
      
      const [ locationId, cameraId, streamId ] = playerId.split('|');
      const camera = getCamera(locations, locationId, cameraId);

      store.dispatch({ type: 'INIT_VIDEO', payload: { playerId, replace, camera } })
      getM3u8(locations, playerId, locationId, cameraId, streamId, time);
      listVideo(locations, playerId, locationId, cameraId, streamId, time, auth.tenantId, auth.jwtToken, user.user);
    })
    

    // debugger
    // const mergedPlaylist = this._mergeSegments(segments)
    // const { playerDomain } = this._storePlayerDomain(segments);
    // const recordingDomain = this._storeRecordingDomain(segments);

  }

  _onTimeUpdate(id, playerTime) {
    // const { ttf, m3u8 } = this.state;

    const {
      video: {
        players
      }
    } = this.props;

    if (!players[id]) {
      return
    }

    
    const {
      playTime
    } = players[id];
    // if (!m3u8) {
    //   return;
    // }

    // const recordingTime = ttf(playerTime * 1000);
    // this.setState({ recordingTime })

    if (!playTime || playerTime - playTime >= 10) {
      store.dispatch({ type: 'UPDATE_PLAY_TIME', meta: { playerId: id }, payload: playerTime })
    }
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


export default withStyles(styles)(VideoContainer);