import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { store } from '../store'
import Nav from '../ui/Nav'
import Home from '../pages/Home'

import Grid from '@material-ui/core/Grid'
import withWidth from '@material-ui/core/withWidth'

// Sub Layouts
import EventsSubLayout from './EventsSubLayout'
import CamerasSubLayout from './CamerasSubLayout'
import VideoPlayingSubLayout from './VideoPlayingSubLayout'
import Mask from '../components/Mask'
import ForceLogout from '../components/ForceLogout'


const logout = () => {
  store.dispatch({ type: 'USER_LOG_OUT', payload: {}})

  return (
    <Mask />
  )
}

class PrimaryLayout extends React.Component {

  componentWillMount() {
    const { width } = this.props;
    store.dispatch({ type: 'WINDOW_SIZE', payload: width })
  }

  componentWillReceiveProps(nextProps) {
    const { width } = this.props;
    if (width !== nextProps.width) {
      store.dispatch({ type: 'WINDOW_SIZE', payload: nextProps.width })
    }
  }

  render() {
    const { match, width, locations, error } = this.props;

    if (error) {
      return <ForceLogout />
    }

    return (
      <Grid container spacing={0} alignItems='stretch' style={{height: `100%`, overflowY: 'hidden'}}>
        <Grid item >
          <Nav width={width} locations={locations} />
        </Grid>
        <Grid item xs>
          {
            locations.fetching
            ? <Mask text={`Loading locations`}/>
            : <Switch>
                <Route path={`${match.path}`} exact component={Home} />
                <Route path={`${match.path}/events`} component={EventsSubLayout} />
                <Route path={`${match.path}/cameras`} render={props => <CamerasSubLayout {...props} locState={locations} locations={locations.locations} width={width} />} />
                <Route path={`${match.path}/play`} render={props => <VideoPlayingSubLayout  {...props} locState={locations} width={width} {...props} /> } />
                <Route path={`${match.path}/logout`} component={logout} />
                <Redirect to={`${match.url}`} />
              </Switch>
          }
        </Grid>
      </Grid>
    )
  }
}

export default connect(state => {
  return {
    locations: state.locations,
    ...state.error
  };
})(withWidth()(PrimaryLayout));