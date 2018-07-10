import React from 'react'
import { store } from '../store'
import { withStyles } from '@material-ui/core/styles'

import Flex from '../components/Flex'
import Icon from '../components/Icon'

import '../css/PlayerOverlay.css'

const styles = () => {
  root: {
    
  }
}

class PlayerOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Flex alignItems='center' justifyContent='center' className='player-overlay' width='100%'>
        <Icon path='delete_forever' width='48px' height='48px' fill='#fff'/>
      </Flex>
    )
  }


}

export default withStyles(styles)(PlayerOverlay);