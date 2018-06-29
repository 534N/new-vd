import React from 'react';
import { connect } from 'react-redux';

import '../css/Home.css'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='home-page'>
      Amazing home page
        
      </div>
    )
  }
}

export default connect(state => {
  return {
    user: state.user
  }
})(Home);