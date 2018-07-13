import React from 'react'
import { Link } from 'react-router-dom'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import { store } from '../store'


class RedirectDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  render() {
    const { message, redirectURL } = this.props;
    const { open } = this.state;

    return (
      <Dialog
        open={open}
        onClose={this._handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { message }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to={redirectURL}>
            <Button onClick={this._handleClose} color="primary" autoFocus> Yes </Button>
          </Link>
          <Button onClick={this._clearVideoCache} color="primary"> No </Button>
        </DialogActions>
      </Dialog>
    );
  }

  _clearVideoCache = () => {
    store.dispatch({ type: 'CLEAR_VIDEO_CACHE', payload: {} })
    this._handleClose();
  }

  _handleClose = () => {
    this.setState({ open: false });
  };
}

export default RedirectDialog;