import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import CamerasNav from '../ui/CamerasNav'
import Grid from '../components/Grid'

import '../css/EventsSubLayout.css';

const BrowseUsersPage = () => <div>BrowseUsersPage</div>;
const AddUserPage = () => <div>AddUserPage</div>;
const camerasByLocation = () => <div>cameras</div>;

const CamerasSubLayout = ({ match, locations }) => (
  <Grid gridTemplateColumns={`200px auto`} className='events-sub-layout'>
    <Grid.Item gridColumn={`1/2`}>
      <CamerasNav locations={locations}/>
    </Grid.Item>
    <Grid.Item gridColumn={`2/3`} className='primary-content'>
      <Switch>
        <Route path={`${match.path}/all`} component={camerasByLocation} />
        <Route path={`${match.path}/:locationId`} component={camerasByLocation} />
        <Redirect to={`${match.path}/all`} />
      </Switch>
    </Grid.Item>
  </Grid>
)

export default CamerasSubLayout