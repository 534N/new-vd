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
    const selectedLocation = _.find(locations, loc => {
      console.debug('loc >>> ', loc.id)
      console.debug('locationId >>> ', locationId)
      return loc.id === locationId
    });


    this.state = {
      selectedLocation
    };
  }

  componentDidMount() {
    const { selectedLocation } = this.state;
    store.dispatch({ type: 'SELECTED_LOCATION', payload: selectedLocation })
  }
  
  componentWillReceiveProps(nextProps) {
    const { match, locations } = nextProps;
    const { locationId } = match.params;
    const selectedLocation = _.find(locations, loc => loc.id === locationId);

    this.setState({
      selectedLocation
    })
  }

  render() {
    const { classes, context, onSelect } = this.props;
    const { selectedLocation } = this.state;
    const { cameras } = selectedLocation;

    return (
      <div id='camera-list' className={classes.root}>
        <div className={classes.camerasWrap}>
          {
            cameras.map(cam => (
              <CameraItem key={cam.id} {...cam} selectedLocation={selectedLocation} onSelect={onSelect} context={context} />
            ))
          }
        </div>
      </div>
    )
  }
}
  
export default withStyles(styles)(CameraList);
