import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import IconText from '../components/IconText'

import CameraList from '../ui/CameraList'
import DatePicker from '../ui/DatePicker'
import LocationSelector from '../ui/LocationSelector'

import Hidden from '@material-ui/core/Hidden'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

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
  }
})

class CamerasSubLayout extends React.Component {

  render() {
    const { match, locState, width, auth, classes, location } = this.props;
    const { locations } = locState;
    
    return (
      <CamerasPageContext.Provider value={{auth, width}}>
        <AppBar position='sticky' color='default' classes={{colorDefault: classes.colorDefault}} style={{height: '65px', boxShadow: 'none', borderBottom: '1px solid #ddd'}}>
          <Toolbar>
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
}

export default connect(state => {
  return {
    auth: state.auth
  };
})(withStyles(styles)(CamerasSubLayout));