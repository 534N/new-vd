import React from 'react';


import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import CameraItem from './CameraItem'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

const CameraList = props => {

  const { classes, match, locations } = props;
  const { locationId } = match.params;

  const [ {cameras} ] = locations.filter(({ id }) => {
    return id === locationId;
  })

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">December</ListSubheader>
        </GridListTile>
        {
          cameras.map(cam => (
            <GridListTile key={cam.id}>
              <img src={require('../svg/no-image-available.svg')} />
              <GridListTileBar title={cam.name} subtitle={cam.status} />
            <CameraItem {...cam} />
              
            </GridListTile>
            
          ))
        }
        
      </GridList>
    </div>
  )
}
  
export default withStyles(styles)(CameraList);
