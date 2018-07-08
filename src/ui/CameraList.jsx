import React from 'react';
import _ from 'lodash'

import { withStyles } from '@material-ui/core/styles';

import { store } from '../store';

import CameraItem from './CameraItem'

import '../css/CameraList.css'

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

const CameraList = props => {

  const { classes, match, locations, locationId: locationIdFromProps, context } = props;
  const { locationId: locationIdFromURL } = match.params;

  const locationId = locationIdFromProps || locationIdFromURL;

  const selectedLocation = _.find(locations, loc => loc.id === locationId);
  const { cameras, name } = selectedLocation;

  // store.dispatch({ type: 'SELECTED_LOCATION', payload: selectedLocation })


  return (
    <div id='camera-list' className={classes.root} style={{backgroundColor: context === 'video' ? '#f1f1f1': '#fff', height: 'calc(100vh - 70px'}}>
      <div className={classes.camerasWrap}>
        {
          cameras.map(cam => (
            <CameraItem key={cam.id} {...cam} context={context} match={match}/>
          ))
        }
      </div>
    </div>
  )
}
  
export default withStyles(styles)(CameraList);
