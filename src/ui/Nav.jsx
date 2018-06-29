import React from 'react'
import { NavLink } from 'react-router-dom'

import Flex from '../components/Flex'
import '../css/Nav.css'

const Nav = () => (
  <Flex flexDirection={`column`} height={`100%`} className='primary-header'>
    <NavLink to='/app' exact activeClassName='active'>Home</NavLink>
    <NavLink to='/app/events' activeClassName='active'>Events</NavLink>
    <NavLink to='/app/cameras' activeClassName='active'>Cameras</NavLink>
  </Flex>
)

export default Nav