import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Nav from '../ui/Nav'
import Home from '../pages/Home';
import Grid from '../components/Grid';
// Sub Layouts
import EventsSubLayout from './EventsSubLayout'
// import ProductSubLayout from './ProductSubLayout'


const cameras = () => <div>Cameras go here</div>;
const NoMatch = () => <div>Nothing to see here</div>;


const PrimaryLayout = ({ match }) => {
return (
  <Grid gridTemplateColumns={`80px calc(100% - 80px)`} gridTemplateRows={`100%`} height={`100%`} className='primary-layout'>
    <Grid.Item gridColumn={`1 / 2`} width={`100%`} height={`100%`}>
      <Nav />
    </Grid.Item>
    <Grid.Item gridColumn={`2 / 3`} width={`100%`} height={`100%`}>
      <Switch>
        <Route path={`${match.path}`} exact component={Home} />
        <Route path={`${match.path}/events`} component={EventsSubLayout} />
        <Route path={`${match.path}/cameras`} component={cameras} />
        <Redirect to={`${match.url}`} />
      </Switch>
    </Grid.Item>
  </Grid>
)
}

export default PrimaryLayout