import React from 'react'
import classNames from 'classnames';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import SvgIcon from '@material-ui/core/SvgIcon';

import { store } from '../store'
import Icon from '../components/Icon'

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

const mdUp = width => {
  return (width === 'lg' || width === 'xl');
}

class MiniDrawer extends React.Component {
  constructor(props) {
    super(props);
    const { width, video } = props;

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
    const { classes, theme, width, locations, video } = this.props;
    const { open } = this.props;

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
        <NavLinks locations={locations} />
      </div>
    );

    return (
      <div className={classes.root} id='app-nav'>
        {
          (video.playing || mdUp(width)) &&
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
        }
        {
          !video.playing &&
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
        }
        
      </div>
    )
  }

  _handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  _handleDrawerClose = () => {
    store.dispatch({ type: 'TOGGLE_NAV', payload: {} })
  };
}

export default connect(state => {
  return {
    video: state.video,
    ...state.nav
  };
})(withStyles(styles, { withTheme: true })(MiniDrawer));

// export default Nav