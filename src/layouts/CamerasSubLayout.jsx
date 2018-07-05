import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import CamerasNav from '../ui/CamerasNav'
import Grid from '../components/Grid'

import CameraItem from '../ui/CameraItem'

import '../css/EventsSubLayout.css';

const BrowseUsersPage = () => <div>BrowseUsersPage</div>;

const CamerasByLocation = props => {

  const { match, locations } = props;
  const { locationId } = match.params;

  const [ {cameras} ] = locations.filter(({ id }) => {
    return id === locationId;
  })

  return (
    cameras.map(cam => <CameraItem {...cam} />)
  )
}

const CamerasSubLayout = ({ match, locations }) => (
  <Grid gridTemplateColumns={`200px auto`} className='events-sub-layout'>
    <Grid.Item gridColumn={`1/2`}>
      <CamerasNav locations={locations}/>
    </Grid.Item>
    <Grid.Item gridColumn={`2/3`} className='primary-content'>
      <Switch>
        {/* <Route path={`${match.path}/all`} component={CamerasByLocation} /> */}
        <Route path={`${match.url}/:locationId`} render={props => <CamerasByLocation {...props} locations={locations}/>} />
        {/* <Redirect to={`${match.path}/all`} /> */}
      </Switch>
    </Grid.Item>
  </Grid>
)

export default CamerasSubLayout