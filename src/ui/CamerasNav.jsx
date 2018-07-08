import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

const CamerasNav = ({ match, locations }) => (
  <nav style={{padding: '5px'}}>
    {
      locations.map(loc => <NavLink key={loc.id} to={`${match.url}/${loc.id}`} activeClassName='active'>{loc.name}</NavLink>)
    }
  </nav>
)

export default withRouter(CamerasNav)