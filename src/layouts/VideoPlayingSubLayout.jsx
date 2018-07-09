import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import queryString from 'query-string';


import IconText from '../components/IconText'
import Icon from '../components/Icon'
import { store } from '../store'

import CamerasNav from '../ui/CamerasNav'
import CamerasNavMobile from '../ui/CamerasNavMobile'
import CameraList from '../ui/CameraList'
import DatePicker from '../ui/DatePicker'
import VideoContainer from '../ui/VideoContainer'
import LocationSelector from '../ui/LocationSelector'

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
  videoPanel: {
    display: 'flex',
    justifyContent: 'center'
  },
  colorDefault: {
    background: '#333',
    color: '#fff',
  },
  navIconHide: {

  }
})

class VideoPlayingSubLayout extends React.Component {
  
  render() {
    const { match, location, locState, width, auth, video, classes } = this.props;
    const { locations, selectedLocation } = locState;
    const { theater, fullscreen } = video;
  
    const { locationId, cameraId, streamId } = queryString.parse(location.search);
  
    return (
      <VideoPlayingContext.Provider value={{auth, width}}>
        <AppBar position='sticky' color='default' classes={{colorDefault: classes.colorDefault}} style={{height: '65px', boxShadow: 'none', borderBottom: '1px solid #ddd'}}>
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
            <LocationSelector fill='#fff' />
            <DatePicker fill='#fff'/>
          </Toolbar>
        </AppBar>
        <Switch>
          <VideoContainer locations={locations} locationId={locationId} cameraId={cameraId} streamId={streamId} width={width}/>
        </Switch>
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