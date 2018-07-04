import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

const CamerasNav = ({ match, locations }) => (
  <nav className="context-nav">
    {
      locations.map(loc => <NavLink to={`${match.path}/${loc.id}`} activeClassName="active">{loc.name}</NavLink>)
    }
  </nav>
)

export default withRouter(CamerasNav)