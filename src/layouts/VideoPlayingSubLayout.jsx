import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import queryString from 'query-string';
import _ from 'lodash'

import IconText from '../components/IconText'
import Icon from '../components/Icon'
import { store } from '../store'

import CamerasNav from '../ui/CamerasNav'
import CamerasNavMobile from '../ui/CamerasNavMobile'
import CameraList from '../ui/CameraList'
import DatePicker from '../ui/DatePicker'
import VideoContainer from '../ui/VideoContainer'
import LocationSelector from '../ui/LocationSelector'
import CameraSelector from '../ui/CameraSelector'

import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// import '../css/VideoPlayingSubLayout.css';

export const VideoPlayingContext = React.createContext(
  {
    auth: null,
    width: null,
  }
);

const styles = theme => ({
  root: {
    background: '#111',
    height: '100%'
  },
  colorDefault: {
    background: '#111',
    color: '#fff',
  },
  navIconHide: {

  }
})

class VideoPlayingSubLayout extends React.Component {
  
  render() {
    const { location, locState, width, auth, video, classes } = this.props;
    const { locations, selectedLocation } = locState;
  
    const { locationId, cameraId, streamId } = queryString.parse(location.search);

    const { cameras } = selectedLocation;
    const selectedCamera = _.find(cameras, cam => cam.cameraId === cameraId);

    return (
      <VideoPlayingContext.Provider value={{ auth, width, selectedLocation}}>
        <div className={classes.root}>
          <AppBar position='sticky' color='default' classes={{colorDefault: classes.colorDefault}} style={{height: '65px'}}>
            <Toolbar> 
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={this._toggleNav}
                className={classes.navIconHide}>
                <SvgIcon>
                  <Icon path='menu' fill='#fff'/>
                </SvgIcon>
              </IconButton>
              <CameraSelector fill='#fff' locations={locations} selectedLocation={selectedLocation} selectedCamera={selectedCamera} />
              <DatePicker fill='#fff'/>
            </Toolbar>
          </AppBar>
          <Switch>
            <VideoContainer locations={locations} locationId={locationId} cameraId={cameraId} streamId={streamId} />
          </Switch>
        </div>
      </VideoPlayingContext.Provider>
    )
  }

  _toggleNav = () => {
    store.dispatch({ type: 'TOGGLE_NAV', payload: {} })
  };
}

export default connect(state => {
  return {
    auth: state.auth,
    video: state.video
  };
})(withStyles(styles)(VideoPlayingSubLayout));