import React from 'react';


import { withStyles } from '@material-ui/core/styles';

import { store } from '../store';

import CameraItem from './CameraItem'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
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

  const { classes, match, locations } = props;
  const { locationId } = match.params;

  const [selectedLocation] = locations.filter(({ id }) => {
    return id === locationId;
  })
 
  const { cameras, name } = selectedLocation;

  // store.dispatch({ type: 'SELECTED_LOCATION', payload: selectedLocation })


  return (
    <div className={classes.root}>
      {
        cameras.map(cam => (
          <CameraItem key={cam.id} {...cam} />
        ))
      }
    </div>
  )
}
  
export default withStyles(styles)(CameraList);
