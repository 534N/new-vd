import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import CameraList from '../ui/CameraList'
import DatePicker from '../ui/DatePicker'
import LocationSelector from '../ui/LocationSelector'

import { store } from '../store'

import Hidden from '@material-ui/core/Hidden'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import SvgIcon from '@material-ui/core/SvgIcon'
import IconButton from '@material-ui/core/IconButton'

import Icon from '../components/Icon'
import '../css/CamerasSubLayout.css'

export const CamerasPageContext = React.createContext(
  {
    auth: null,
    width: null,
  }
)

const styles = theme => ({
  nav: {
    borderRight: '1px solid #ddd'
  },
  colorDefault: {
    background: '#fff',
  },
  navIconHide: {

  }
})

class CamerasSubLayout extends React.Component {

  render() {
    const { match, locState, width, auth, classes, video: { players }} = this.props;
    const { locations } = locState;
    
    return (
      <CamerasPageContext.Provider value={{ auth, width, selectedLocation: null, playlist: players}}>
        <AppBar position='sticky' color='default' classes={{colorDefault: classes.colorDefault}} style={{height: '65px', boxShadow: 'none', borderBottom: '1px solid #ddd'}}>
          <Toolbar>
            <Hidden mdUp>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={this._toggleNav}
                className={classes.navIconHide}>
                <SvgIcon>
                  <Icon path='menu' />
                </SvgIcon>
              </IconButton>
            </Hidden>
            <LocationSelector />
            <DatePicker />
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path={`${match.url}/:locationId`} render={props => <CameraList {...props} locations={locations} context='cameras' />} />
        </Switch>
      </CamerasPageContext.Provider>
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
})(withStyles(styles)(CamerasSubLayout));