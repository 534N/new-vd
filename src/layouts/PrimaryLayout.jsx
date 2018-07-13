import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import queryString from 'query-string'
import _ from 'lodash'

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
      // redirect = `${match.path}/play?${params}`;
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
    const { match, width, locations, video } = this.props;
    const { redirect } = this.state;

    return (
      redirect 
        ? <Redirect to={redirect} />
        : <Grid container spacing={0} alignItems='stretch' style={{height: `100%`, overflowY: 'hidden'}}>
            <Grid item >
              <Nav width={width} locations={locations} match={match} />
            </Grid>
            <Grid item xs>
              {
                locations.fetching
                ? <Mask text={`Loading locations`}/>
                : <Switch>
                    <Route path={`${match.path}`} exact component={Home} />
                    <Route path={`${match.path}/events`} component={EventsSubLayout} />
                    <Route path={`${match.path}/cameras`} render={props => <CamerasSubLayout {...props} locState={locations} locations={locations.locations} width={width} />} />
                    <Route path={`${match.path}/play`} render={props => <VideoPlayingSubLayout  {...props} locState={locations} width={width} video={video}/> } />
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
    video: state.video,
  };
})(withWidth()(PrimaryLayout));