import React from 'react'
import { store } from '../store';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    root: {
      background: '#0088cc'
    }
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

const LogoutButton = props => {
  const { classes } = props;

  return (
    <Button variant='extendedFab' color='primary' onClick={() => { store.dispatch({type: 'USER_LOG_OUT', payload: {}})}} className={classes.button}>
      {/* <NavigationIcon className={classes.extendedIcon} /> */}
      Log out
    </Button>
  )
}

export default withStyles(styles)(LogoutButton);
