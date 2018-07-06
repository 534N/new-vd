import React from 'react';


import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
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

  const { classes, match, locations, width, auth } = props;
  const { locationId } = match.params;

  const [ {cameras, name} ] = locations.filter(({ id }) => {
    return id === locationId;
  })

  return (
    <div className={classes.root}>
      {
        cameras.map(cam => (
          <CameraItem key={cam.id} {...cam} width={width} auth={auth} />
        ))
      }
    </div>
  )
}
  
export default withStyles(styles)(CameraList);
