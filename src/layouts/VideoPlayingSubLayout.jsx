import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import queryString from 'query-string';
import _ from 'lodash'

import Icon from '../components/Icon'
import { store } from '../store'

import DatePicker from '../ui/DatePicker'
import VideoContainer from '../ui/VideoContainer'
import CameraSelector from '../ui/CameraSelector'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';

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

const parsePlayerId = playerId => playerId.split('|');

class VideoPlayingSubLayout extends React.Component {
  
  render() {
    const { location, locState, width, auth, video, classes, user, time } = this.props;
    const { locations, selectedLocation } = locState;
  
    const playlist = queryString.parse(location.search);

    return (
      <VideoPlayingContext.Provider value={{ auth, width, selectedLocation, players: playlist}}>
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
              <CameraSelector fill='#fff' locations={locations} selectedLocation={selectedLocation} playlist={playlist} />
              <DatePicker fill='#fff'/>
            </Toolbar>
          </AppBar>
          <Switch>
            <VideoContainer locations={locations} playlist={playlist} video={video} user={user} time={time} auth={auth}/>
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
    user: state.user,
    ...state.time,
    video: state.video,
  };
})(withStyles(styles)(VideoPlayingSubLayout));