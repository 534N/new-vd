import React from 'react'
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Hidden from '@material-ui/core/Hidden';


import mdi from '../svg/MaterialIcons.svg';

import NavLinks from './NavLinks'
import '../css/Nav.css'

const drawerWidth = 240;



const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    zIndex: 10000
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  navIconHide: {
    position: 'absolute'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

const mdDown = width => {
  return (width === 'xs' || width === 'sm' || width === 'md');
}

class MiniDrawer extends React.Component {
  constructor(props) {
    super(props);
    const { width } = props;

    this.state = {
      open: mdDown(width) ? false : true,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    const { width } = nextProps;

    this.setState({
      open: mdDown(width) ? false : true,
    });
  }

  render() {
    const { classes, theme, width } = this.props;
    const { open } = this.state;

    const content = (
      <div>
        <div className={classes.toolbar}>
          {
            mdDown(width) &&
            <IconButton onClick={ open ? this._handleDrawerClose : this._handleDrawerOpen }>
              { !open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          }
        </div>
        <Divider />
        <NavLinks />
      </div>
    );

    return (
      <div className={classes.root} id='app-nav'>
        <Hidden mdUp>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={open ? this._handleDrawerClose : this._handleDrawerOpen}
            className={classes.navIconHide}>
            <svg style={{ width: `24px`, height: `24px`, fill: `#555` }}>
              <use xlinkHref={`${mdi}#menu`}></use>
            </svg>
          </IconButton>
        </Hidden>

        <Hidden mdUp>
          <Drawer
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={open}
            onClose={this._handleDrawerClose}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}>
            { content }
          </Drawer>
        </Hidden>
        <Hidden smDown implementation='css'>
          <Drawer
            variant='permanent'
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={open}>
            { content }
          </Drawer>
        </Hidden>
      </div>
    )
  }

  _handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  _handleDrawerClose = () => {
    this.setState({ open: false });
  };
}

export default withStyles(styles, { withTheme: true })(MiniDrawer);

// export default Nav