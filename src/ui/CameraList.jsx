import React from 'react';
import _ from 'lodash'

import { withStyles } from '@material-ui/core/styles';

import { store } from '../store';

import CameraItem from './CameraItem'

import '../css/CameraList.css'

const cameraListWidth = {
  xs: 340,
  sm: 180,
  md: 260,
  lg: 340,
}

const styles = theme => ({
  root: {
    overflow: 'hidden',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  camerasWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridList: {
    width: 500,
    height: 'auto',
    paddingTop: '20px'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

class CameraList extends React.Component {

  constructor(props) {
    super(props);

    const { match, locations } = props;
    const { locationId } = match.params;
    const selectedLocation = _.find(locations, loc => loc.id === locationId);

    this.selectedLocation = selectedLocation;
  }

  componentDidMount() {
    store.dispatch({ type: 'SELECTED_LOCATION', payload: this.selectedLocation })
  }

  render() {
    const { width, classes, match, locations, context } = this.props;
    const { cameras, name } = this.selectedLocation;

    return (
      <div id='camera-list' className={classes.root}>
        <div className={classes.camerasWrap}>
          {
            cameras.map(cam => (
              <CameraItem key={cam.id} {...cam} match={match} context={context} />
            ))
          }
        </div>
      </div>
    )
  }
}
  
export default withStyles(styles)(CameraList);
