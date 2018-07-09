import React from 'react'
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import { store } from '../store';

import { listVideo, getM3u8 } from '../utils/VideoUtil'
import Player from './Player'

const styles = theme => ({
  root: {
    backgroundColor: '#333',
    width: '100%',
    height: 'calc(100vw * 9 / 16)',
  },

});

const playerWidthChart = {
  xs: 400,
  sm: 600,
  md: 650,
  lg: 960,
  xl: 1580
}

const onTimeUpdate = playerTime => {
  // const { ttf, m3u8 } = this.state;
  // if (!m3u8) {
  //   return;
  // }
  
  // const recordingTime = ttf(playerTime * 1000);
  // this.setState({recordingTime})
}

class VideoContainer extends React.Component {
  componentDidMount() {
    store.dispatch({ type: 'PLAY_VIDEO', payload: {}})
  }

  render() {
    const { width, locations, locationId, cameraId, streamId, time, auth, user, classes } = this.props;

    const m3u8 = getM3u8(locations, locationId, cameraId, streamId, time);
    listVideo(locations, locationId, cameraId, streamId, time, auth.tenantId, auth.jwtToken, user.user)

    const playerWidth = playerWidthChart[width];
    return (
      <div className={classes.root}>
        <Player jwtToken={auth.jwtToken} m3u8={m3u8} onTimeUpdate={onTimeUpdate}/>
      </div>
    )
  }
}


export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    ...state.time,
  };
})(withStyles(styles)(VideoContainer));