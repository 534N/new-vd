import React from 'react'
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton'
import SvgIcon from '@material-ui/core/SvgIcon'

import Icon from '../components/Icon'
import CamerasNav from '../ui/CamerasNav'
import { store } from '../store'

const SCROLL = 'paper';

const styles = theme => ({
  root: {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  label: {
    whiteSpace: 'nowrap'
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
  }
  
})

class LocationSelector extends React.Component {
  constructor(props) {
    super(props);
    const { selectedLocation } = props;

    this.state = {
      open: !selectedLocation,
      scroll: SCROLL,
    };
  }
  

  render() {
    const { locations, selectedLocation, classes, fill } = this.props;
    const { open } = this.state;
    
    return (
      <div>
        <div className={classes.toggle}>
          <IconButton onClick={this._handleClickOpen}>
            <SvgIcon>
              <Icon path='location' fill={fill || '#333'}/>
            </SvgIcon>
          </IconButton>
          {
            selectedLocation &&
            <label className={classes.label}>{selectedLocation.name}</label>          
          }
        </div>
        <Dialog
          open={open}
          onClose={this._handleClose}
          scroll={SCROLL}
          aria-labelledby='scroll-dialog-title'
          className={classes.root}>
          <DialogTitle id='scroll-dialog-title'>Locations</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <CamerasNav locations={locations} selected={selectedLocation ? selectedLocation.id : null} onSelect={this._handleSelection} />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  _handleClickOpen =  () => {
    this.setState({ open: true });
  };

  _handleClose = () => {
    this.setState({ open: false });
  };

  _handleSelection = selection => {
    store.dispatch({ type: 'SELECTED_LOCATION', payload: selection })
    this._handleClose()
  }
}

export default connect(state => {
  return {
    ...state.locations
  };
})(withStyles(styles)(LocationSelector));