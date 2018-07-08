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

const VideoContainer = (props) => {
  const { width, locations, locationId, cameraId, streamId, time, auth, user, classes } = props;

  console.debug('>>>>>>>>>', props);


  const m3u8 = getM3u8(locations, locationId, cameraId, streamId, time);
  listVideo(locations, locationId, cameraId, streamId, time, auth.tenantId, auth.jwtToken, user.user)

  return (
    <div className={classes.root} style={{width: width, height: width * 9 / 16}}>
      <Player jwtToken={auth.jwtToken} m3u8={m3u8} width='100%' height='100%'/>
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