import React from 'react'
import { NavLink } from 'react-router-dom'

import './css/Nav.css'

const Nav = () => (
  <header className='primary-header'>
    <nav>
      <NavLink to='/' exact activeClassName='active'>Home</NavLink>
      <NavLink to='/events' activeClassName='active'>Events</NavLink>
      <NavLink to='/cameras' activeClassName='active'>Cameras</NavLink>
    </nav>
  </header>
)

export default Nav