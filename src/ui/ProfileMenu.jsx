import React from 'react'
import { store } from '../store'

import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import IconButton from '@material-ui/core/IconButton'
import SvgIcon from '@material-ui/core/SvgIcon'

import Icon from '../components/IconText'

const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
})

class ListItemComposition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }
  

  render() {
    const { classes } = this.props;
    const { open } = this

    return (
      <div>
        <IconButton
            aria-label="More"
            aria-haspopup="true"
            onClick={this.handleToggle} >
          <SvgIcon>
            <Icon path='account' />
          </SvgIcon>
        </IconButton>
        <ClickAwayListener onClickAway={this.handleClose}>
          <Grow in={open} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
            <Paper>
              <MenuList>
                <MenuItem className={classes.menuItem} onClick={this.logout}>
                  <ListItemIcon className={classes.icon}>
                    <SvgIcon>
                      <Icon path='exit' />
                    </SvgIcon>
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary='Log out' />
                </MenuItem>
              </MenuList>
            </Paper>
          </Grow>
        </ClickAwayListener>
      </div>
    );
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    // if (this.target1.contains(event.target) || this.target2.contains(event.target)) {
    //   return;
    // }

    this.setState({ open: false });
  };

  logout = () => {
    store.dispatch({ type: 'USER_LOG_OUT', payload: {}})
  };
}

export default withStyles(styles)(ListItemComposition);