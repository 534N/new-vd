import React from 'react'
import _ from 'lodash'
import moment from 'moment'

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
    const { video: { players, primaryPlayerId }, auth, classes, time, locations } = this.props;

    return (
      <div className={classes.root}>
        <Grid container>
        {
          Object.keys(players).map(playerId => {
            const config = players[playerId];
            const is360 = playerId.match(/\|is360/);

            const { ttf: primaryTTF, playTime: primaryPlayerTime, recordings } = players[primaryPlayerId];
            const primaryClockTime = primaryTTF ? parseInt(primaryTTF(primaryPlayerTime)) : 0;

            return (
              <Grid key={playerId} item xs={12} sm={playerWidth('sm', players, primaryPlayerId, playerId)} md={playerWidth('md', players, primaryPlayerId, playerId)} lg={playerWidth('lg', players, primaryPlayerId, playerId)} className={classes.playerWrap}>
                <Player
                  {...config}
                  jwtToken={auth.jwtToken}
                  is360={is360}
                  time={time}
                  locations={locations}
                  multiPlay={isMultiPlay(players)}
                  primaryPlayerId={primaryPlayerId}
                  primaryPlayerTime={primaryPlayerTime}
                  primaryClockTime={primaryClockTime}
                  recordings={recordings}/>
              </Grid>
            )
          })
        }
        </Grid>

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
  }
}


export default withStyles(styles)(VideoContainer);