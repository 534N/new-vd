import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import EventsNav from '../ui/EventsNav'
import Grid from '../components/Grid'

import { withStyles } from '@material-ui/core/styles'

import Histogram from '../ui/Histogram'

import '../css/EventsSubLayout.css';

const EventsSubLayout = ({ match, locations, time}) => (
  <div>
    <Histogram locations={locations} time={time}/>
  </div>
)

export default connect(state => {
  return {
    locations: state.locations,
    time: state.time,
  };
})(EventsSubLayout);
