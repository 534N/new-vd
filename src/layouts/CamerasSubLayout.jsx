import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';


// import Grid from '../components/Grid'
import Grid from '@material-ui/core/Grid';
import IconText from '../components/IconText'

import CamerasNav from '../ui/CamerasNav'
import CamerasNavMobile from '../ui/CamerasNavMobile'
import CameraList from '../ui/CameraList'
import DatePicker from '../ui/DatePicker'

import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select';
import AppBar from '@material-ui/core/AppBar';

import '../css/CamerasSubLayout.css';

export const CamerasPageContext = React.createContext(
  {
    auth: null,
    width: null,
  }
);

const styles = theme => ({
  nav: {
    padding: '10px',
  },
  colorDefault: {
    background: '#fff',
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

const CamerasSubLayout = ({ match, locState, width, auth, classes }) => {
  const { locations, selectedLocation } = locState;

  return (
    <CamerasPageContext.Provider value={{auth, width}}>
      {/* <Grid gridTemplateColumns={`${navColumnWidth[width]}px calc(100% - ${navColumnWidth[width]}px)`} gridTemplateRows={`${navRowHeight[width]}px calc(100% - ${navRowHeight[width]}px)`} height={`100%`} className='cameras-sub-layout'>
        <Grid.Item gridRow={`1/2`} gridColumn={`1/span 3`} width={`100%`} height={`100%`} style={{borderBottom: `1px solid #ddd`}}>
          <DatePicker />
        </Grid.Item>
        <Grid.Item gridRow={`2/3`} gridColumn={`1/2`} width={`100%`} height={`100%`} style={{padding: '15px'}}>
          <Hidden smDown>
            <IconText path='location' text='Locations' style={{margin: '5px 0 25px'}} labelStyle={{fontSize: '14px', color: '#aaa'}} width='20px' height='20px' fill='#aaa'/>
            <CamerasNav locations={locations} />
          </Hidden>
        </Grid.Item>
        <Grid.Item gridRow={`2/3`} gridColumn={`2/3`} width={`100%`} height={`100%`} className='primary-content'> 
          <Hidden mdUp>
            <CamerasNavMobile locations={locations} match={match} selectedLocation={selectedLocation}/>
          </Hidden>
          <Switch>
            <Route path={`${match.url}/:locationId`} render={props => <CameraList {...props} locations={locations} context='cameras' />} />
          </Switch>
        </Grid.Item>
      </Grid> */}
      <AppBar position='sticky' color='default' classes={{colorDefault: classes.colorDefault}} style={{height: '65px', boxShadow: 'none', borderBottom: '1px solid #ddd'}}>
        <DatePicker />
      </AppBar>
      <Grid container className='cameras-sub-layout' justify="center">
        <Grid item xs={12} sm={2} md={2} lg={3} className={classes.nav}>
          <Hidden smDown>
            <IconText path='location' text='Locations' style={{margin: '5px 0 25px'}} labelStyle={{fontSize: '14px', color: '#aaa'}} width='20px' height='20px' fill='#aaa'/>
            <CamerasNav locations={locations} />
          </Hidden>
          <Hidden mdUp>
            <CamerasNavMobile locations={locations} match={match} selectedLocation={selectedLocation}/>
          </Hidden>
        </Grid>
        <Grid item xs={12} sm={10} md={10} lg={9}>
          
          <Switch>
            <Route path={`${match.url}/:locationId`} render={props => <CameraList {...props} locations={locations} context='cameras' />} />
          </Switch>
        </Grid>
      </Grid>
    </CamerasPageContext.Provider>
  )
}

export default connect(state => {
  return {
    auth: state.auth
  };
})(withStyles(styles)(CamerasSubLayout));