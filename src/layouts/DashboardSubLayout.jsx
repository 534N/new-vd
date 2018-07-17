import React from 'react'
import { connect } from 'react-redux';

import { store } from '../store'
import Grid from '@material-ui/core/Grid'

import { withStyles } from '@material-ui/core/styles'

import Histogram from '../ui/Histogram'

import '../css/DashboardSubLayout.css';

class DashboardSubLayout extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    const { charts, locations, time, video, auth } = this.props;

    return (
      <Grid container>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          {
            Object.values(charts).map(chart => <Histogram key={chart.id} locations={locations} time={time} chart={chart} auth={auth}/>)
          }
        </Grid>
      </Grid>
    )
  }


}

export default connect(state => {
  return {
    time: state.time,
    ...state.charts,
    auth: state.auth,
  };
})(DashboardSubLayout);
