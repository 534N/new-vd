import React from 'react';
import { connect } from 'react-redux';
import Grid from './components/Grid';
import Flex from './components/Flex';

import './Home.css'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='home-page'>
        Amazing home page
        <Grid gridTemplateRows={`70px auto`} gridTemplateColumns={`70px auto`} width={`100%`} height={`100%`}>
          <Grid.Item gridRow={`1/2`} gridColumn={`1/2`} width={`100%`} height={`100%`}>
            <div>1</div>
          </Grid.Item>
          <Grid.Item gridRow={`2/3`} gridColumn={`1/2`} width={`100%`} height={`100%`}>
            <div>2</div>
          </Grid.Item>
          <Grid.Item gridRow={`2/3`} gridColumn={`2/3`} width={`100%`} height={`100%`}>
            <div>3</div>
          </Grid.Item>
        </Grid>
      </div>
    )
  }
}

export default connect(state => {
  return {
    user: state.user
  }
})(Home);