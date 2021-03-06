import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

const EventsNav = ({ match }) => (
  <nav className="context-nav">
    <NavLink to={`${match.path}/all`} activeClassName="active">Browse</NavLink>
    <NavLink to={`${match.path}/add`} activeClassName="active">Add</NavLink>
  </nav>
)

export default withRouter(EventsNav)