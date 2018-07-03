import React from 'react'
import { Switch, Route, NavLink, Redirect } from 'react-router-dom'

import EventsNav from '../ui/EventsNav'
import Grid from '../components/Grid'
// Sub Layouts
// import BrowseUsersPage from '../pages/BrowseUsersPage'
// import AddUserPage from '../pages/AddUserPage'
// import UserProfilePage from '../pages/UserProfilePage'

import '../css/EventsSubLayout.css';

const BrowseUsersPage = () => <div>BrowseUsersPage</div>;
const AddUserPage = () => <div>AddUserPage</div>;
const UserProfilePage = () => <div>UserProfilePage</div>;

const EventsSubLayout = ({ match }) => (
  <Grid gridTemplateColumns={`200px auto`} className='events-sub-layout'>
    <Grid.Item gridColumn={`1/2`}>
      <EventsNav />
    </Grid.Item>
    <Grid.Item gridColumn={`2/3`} className='primary-content'>
      <Switch>
        {/* <Route path={match.path} exact component={BrowseUsersPage} /> */}
        <Route path={`${match.path}/all`}  component={BrowseUsersPage} />
        <Route path={`${match.path}/add`} exact component={AddUserPage} />
        <Route path={`${match.path}/:userId`}  component={UserProfilePage} />
        <Redirect to={`${match.path}/all`} />
      </Switch>
    </Grid.Item>
  </Grid>
)

export default EventsSubLayout