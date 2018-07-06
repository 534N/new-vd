import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import MUIGrid from '@material-ui/core/Grid';

import Grid from '../components/Grid'
import IconText from '../components/IconText'

import CamerasNav from '../ui/CamerasNav'
import CameraList from '../ui/CameraList'
import CameraItem from '../ui/CameraItem'
import DatePicker from '../ui/DatePicker'

import '../css/CamerasSubLayout.css';

const BrowseUsersPage = () => <div>BrowseUsersPage</div>;

const CamerasSubLayout = ({ match, locations, width, auth }) => (
  <Grid gridTemplateColumns={`200px calc(100% - 200px)`} gridTemplateRows={`65px calc(100% - 65px)`} height={`100%`} className='cameras-sub-layout'>
    <Grid.Item gridRow={`1/2`} gridColumn={`1/span 3`} width={`100%`} height={`100%`} style={{borderBottom: `1px solid #ddd`}}>
      <DatePicker />
    </Grid.Item>
    <Grid.Item gridRow={`2/3`} gridColumn={`1/2`} width={`100%`} height={`100%`} style={{padding: '15px'}}>
      <IconText path='location' text='Locations' style={{margin: '5px 0 25px'}} labelStyle={{fontSize: '14px', color: '#aaa'}} width='20px' height='20px' fill='#aaa'/>
      <CamerasNav locations={locations}/>
    </Grid.Item>
    <Grid.Item gridRow={`2/3`} gridColumn={`2/3`} width={`100%`} height={`100%`} className='primary-content'> 
      <Switch>
        <Route path={`${match.url}/:locationId`} render={props => <CameraList {...props} locations={locations} width={width} auth={auth} />} />
      </Switch>
    </Grid.Item>
  </Grid>
)

export default CamerasSubLayout