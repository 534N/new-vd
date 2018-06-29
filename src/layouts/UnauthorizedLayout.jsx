import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

// Pages
import Login from '../pages/Login'

const UnauthorizedLayout = () => (
  <div id='unauthorized-layout'>
    <Switch>
      <Route path='/auth/login' component={Login} />
      <Redirect to='/auth/login' />
    </Switch>
  </div>
)

export default UnauthorizedLayout