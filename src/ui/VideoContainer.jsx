import React from 'react'
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import { store } from '../store';

import { listVideo, getM3u8 } from '../utils/VideoUtil'
import Player from './Player'

const styles = theme => ({
  root: {
    backgroundColor: '#333',
    height: '100%',
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

const VideoContainer = (props) => {
  const { width, locations, locationId, cameraId, streamId, time, auth, user, classes } = props;

  const m3u8 = getM3u8(locations, locationId, cameraId, streamId, time);
  listVideo(locations, locationId, cameraId, streamId, time, auth.tenantId, auth.jwtToken, user.user)

  const playerWidth = playerWidthChart[width];
  return (
    <div className={classes.root} style={{width: `${playerWidth}px`, height: `${playerWidth * 9 / 16}px`}}>
      <Player jwtToken={auth.jwtToken} m3u8={m3u8} width='100%' height='100%' onTimeUpdate={onTimeUpdate}/>
    </div>
  )
}


export default connect(state => {
  return {
    auth: state.auth,
    user: state.user,
    ...state.time,
  };
})(withStyles(styles)(VideoContainer));