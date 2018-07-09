import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'


const CamerasNav = ({ match, locations, selected, onSelect }) => (
  <span id='camera-nav'>
    {
      locations.map(loc => <span key={loc.id} style={{width: `100%`}} onClick={onSelect.bind(this, loc)}><NavLink key={loc.id} to={`${match.url}/${loc.id}`} activeClassName='active' className={loc.id === selected ? 'active' : ''}>{loc.name}</NavLink></span>)
    }
  </span>
)

export default withRouter(CamerasNav)