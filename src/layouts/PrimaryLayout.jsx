import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import queryString from 'query-string'
import _ from 'lodash'

import Grid from '@material-ui/core/Grid'
import withWidth from '@material-ui/core/withWidth'

// Sub Layouts
import DashboardSubLayout from './DashboardSubLayout'
import EventsSubLayout from './EventsSubLayout'
import CamerasSubLayout from './CamerasSubLayout'
import VideoPlayingSubLayout from './VideoPlayingSubLayout'

import Mask from '../components/Mask'

import { store } from '../store'
import Nav from '../ui/Nav'
import RedirectDialog from '../ui/RedirectDialog'


const logout = () => {
  store.dispatch({ type: 'USER_LOG_OUT', payload: {}})

  return (
    <Mask />
  )
}

class PrimaryLayout extends React.Component {
  constructor(props) {
    super(props);

    const { match, location, video: { players } } = props;
    const playlist = queryString.parse(location.search);

    let redirect = null;

    if (_.isEmpty(playlist) && !_.isEmpty(players)) {
      const params = Object.keys(players).map((id, idx) => `player${idx}=${id}`).join('&');
      redirect = `${match.path}/play?${params}`;
    }

    this.state = { redirect };
  }

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
    const { match, width, locations, video, time } = this.props;
    const { redirect } = this.state;

    return (
      <Grid container spacing={0} alignItems='stretch' style={{height: `100%`, overflowY: 'hidden'}}>
        {
          !!redirect &&
          <RedirectDialog redirectURL={redirect} message='Seems like you were watching something... would you like to continue?' />
        }
        <Grid item >
          <Nav width={width} locations={locations} match={match} />
        </Grid>
        <Grid item xs>
          {
            locations.fetching
            ? <Mask text={`Loading locations`}/>
            : <Switch>
                <Route path={`${match.path}`} exact render={props => <DashboardSubLayout {...props} selectedLocation={locations.selectedLocation} locations={locations.locations} width={width} video={video} /> } />
                <Route path={`${match.path}/events`} component={EventsSubLayout} />
                <Route path={`${match.path}/cameras`} render={props => <CamerasSubLayout {...props} locState={locations} locations={locations.locations} width={width} video={video} time={time} />} />
                <Route path={`${match.path}/play`} render={props => <VideoPlayingSubLayout  {...props} locState={locations} width={width} video={video} time={time}/> } />
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
    ...state.time,
    video: state.video,
  };
})(withWidth()(PrimaryLayout));