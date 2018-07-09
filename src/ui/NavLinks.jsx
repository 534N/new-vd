import React from 'react'
import { NavLink } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import mdi from '../svg/MaterialIcons.svg';

const styles = {
  root: {
    opacity: 0.7,
  },
};
  
  
const NavLinks = props => {
  const { selectedLocation } = props.locations;
  const locationId = selectedLocation ? `/${selectedLocation.id}` : '';
  
  return(
    <List>
      <NavLinkComponent path='dashboard' name='Home' to='/app' exact />
      <NavLinkComponent path='bar_chart' name='Events' to='/app/events' />
      <NavLinkComponent path='videocam' name='Cameras' to={`/app/cameras${locationId}`} />
    </List>
  )
}

const NavLinkComponent = props => {
  const { path, name, ...navLinkProps } = props;

  return (
    <NavLink {...navLinkProps} activeClassName='active'>
      <ListItem button classes={{root: 'nav-link'}}>
        <ListItemIcon>
          <svg style={{width: `24px`, height: `24px`, fill: `#555`}}>
            <use xlinkHref={`${mdi}#${path}`}></use>
          </svg>
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </NavLink>
  )

}

export default withStyles(styles, { withTheme: true })(NavLinks);

    
  