import React from 'react'
import { connect } from 'react-redux';

import { store } from '../store'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles'

import Histogram from '../ui/Histogram'

import '../css/DashboardSubLayout.css';

class DashboardSubLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render() {
    const { charts, locations, time, video, auth, width } = this.props;

    return (
      <Grid container spacing={16} style={{padding: '1em', background: `#f5f5f5`, height: '100%'}}>
        <Grid item xs={12} sm={12} md={12} lg={12} >
          <Histogram width={width} locations={locations} time={time} chart={charts.rtTransactions} auth={auth} ignoreHover={true} />
        </Grid>
        {
          Object.values(charts).filter(c => c.type !== 'rt').map((chart, idx) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={idx} >
              <Card>
                <CardContent>
                  <Histogram width={width} locations={locations} time={time} chart={chart} auth={auth} />
                </CardContent>
                <CardActions>
                  <Typography component="p">
                    {chart.description}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))
        }
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
