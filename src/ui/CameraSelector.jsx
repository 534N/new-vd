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

import CameraList from '../ui/CameraList'

import Icon from '../components/Icon'
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
  },
  content: {
    padding: 0
  }

})

class CameraSelector extends React.Component {
  constructor(props) {
    super(props);
    const { selectedLocation } = props;

    this.state = {
      open: !selectedLocation,
      scroll: SCROLL,
    };
  }


  render() {
    const { locations, playlist, selectedLocation, classes, fill } = this.props;
    const { open } = this.state;

    return (
      <div>
        <div className={classes.toggle}>
          <IconButton onClick={this._handleClickOpen}>
            <SvgIcon>
              <Icon path='videocam' fill={fill || '#333'} />
            </SvgIcon>
          </IconButton>
          {/* <label className={classes.label}>{selectedCamera.name} @ {selectedLocation.name} </label> */}
        </div>
        <Dialog
          open={open}
          onClose={this._handleClose}
          scroll={SCROLL}
          maxWidth='md'
          className={classes.root}>
          <DialogTitle id='scroll-dialog-title'>Cameras @ {selectedLocation.name}</DialogTitle>
          <DialogContent className={classes.content} id='cameralist-wrap'>
            <CameraList locations={locations} context='video' onSelect={this._handleClose} match={{params: { locationId: selectedLocation.id }}} />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  _handleClickOpen = () => {
    this.setState({ open: true });
  };

  _handleClose = () => {
    this.setState({ open: false });
  };
}

export default withStyles(styles)(CameraSelector);