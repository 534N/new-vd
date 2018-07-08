import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import queryString from 'query-string';


// import Grid from '../components/Grid'
import Grid from '@material-ui/core/Grid';
import IconText from '../components/IconText'

import CamerasNav from '../ui/CamerasNav'
import CamerasNavMobile from '../ui/CamerasNavMobile'
import CameraList from '../ui/CameraList'
import DatePicker from '../ui/DatePicker'
import VideoContainer from '../ui/VideoContainer'

import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select';

// import '../css/VideoPlayingSubLayout.css';

export const VideoPlayingContext = React.createContext(
  {
    auth: null,
    width: null,
  }
);

const styles = theme => ({
  videoPanel: {
    display: 'flex',
    justifyContent: 'center'
  }
})

const navColumnWidth = {
  xs: 0,
  sm: 0,
  md: 150,
  lg: 200,
}

const navRowHeight = {
  xs: 48,
  sm: 65,
  md: 65,
  lg: 65,
}

const videoWidth = {
  xs: 400,
  sm: 640,
  md: 960,
  lg: 1280,
}


// const layout = {
//   regular: {
//     gridTemplateColumns: 
//   },
// }


const VideoPlayingSubLayout = ({ match, location, locState, width, auth, video, classes }) => {
  const { locations, selectedLocation } = locState;
  const { theater, fullscreen } = video;

  const { locationId, cameraId, streamId } = queryString.parse(location.search);

  return (
    <VideoPlayingContext.Provider value={{auth, width}}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={12} lg={12} style={{height: `${navRowHeight[width]}px`}}>
          <DatePicker />
        </Grid>
        <Grid container spacing={0} className={classes.videoPanel}>
          <Grid item xs={12} sm={12} md={theater ? 12 : 9} lg={ theater ? 12 : 9}>
            <VideoContainer locations={locations} locationId={locationId} cameraId={cameraId} streamId={streamId} />
          </Grid>
          <Grid item xs={12} sm={12} md={theater ? 12 : 3} lg={ theater ? 12 : 3}>
            <CameraList match={match} locations={locations} locationId={locationId} context='video'/>
          </Grid>
        </Grid>
      </Grid>
    </VideoPlayingContext.Provider>
  )
}

export default connect(state => {
  return {
    auth: state.auth,
    video: state.video
  };
})(withStyles(styles)(VideoPlayingSubLayout));