import React from 'react'
import { NavLink } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import SvgIcon from '@material-ui/core/SvgIcon'

import { store } from '../store'
import Icon from '../components/Icon'

const styles = {
  root: {
    opacity: 0.7,
  },
};

const broadCastAction = () => {
  store.dispatch({ type: 'NAV_LINK_CLICK', payload: {} })
}
  
const NavLinks = props => {
  const { selectedLocation } = props.locations;
  const locationId = selectedLocation ? `/${selectedLocation.id}` : '';
  
  return(
    <List>
      <NavLinkComponent path='dashboard' name='Home' to='/app' exact />
      <NavLinkComponent path='bar_chart' name='Events' to='/app/events' />
      <NavLinkComponent path='videocam' name='Cameras' to={`/app/cameras${locationId}`} />
      <NavLinkComponent path='exit' name='Log out' to='/app/logout' />
    </List>
  )
}

const NavLinkComponent = props => {
  const { path, name, ...navLinkProps } = props;

  return (
    <NavLink {...navLinkProps} activeClassName='active'>
      <ListItem button classes={{ root: 'nav-link' }} onClick={broadCastAction}>
        <ListItemIcon>
          <SvgIcon>
            <Icon path={path} />
          </SvgIcon>
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </NavLink>
  )

}

export default withStyles(styles, { withTheme: true })(NavLinks);

    
  