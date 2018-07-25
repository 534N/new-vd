import React from 'react'
import { store } from '../store'

import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import SvgIcon from '@material-ui/core/SvgIcon'

import Flex from '../components/Flex'
import Icon from '../components/Icon'
import IconText from '../components/IconText'
import LoadingSVG from '../svg/loading-cylon.svg'

import Editor from './Polygon'

import '../css/PlayerOverlay.css'

const styles = () => {
  root: {
    
  }
}

const removePlayer = id => {
  store.dispatch({ type: 'REMOVE_VIDEO', payload: id})
}

const pin = {
  label: 'Pin1',
  color: '#e3e3e3AA',
  points: [
    [50, 50],
  ],
};

const RemoveVideoButton = ({ id }) => {
  return (
    <IconButton
      color='inherit'
      aria-label='open drawer'
      onClick={() => {}}>
      <SvgIcon>
        <Icon path='delete_forever' width='48px' height='48px' fill='#fff'/>
      </SvgIcon>
    </IconButton>
  )
}

const ErrorMsg = ({ error, id }) => (
  <div>
    <IconText path='error' fill='#f54' text={error} labelStyle={{color: '#fff'}} style={{width: 'auto'}}/>
    <RemoveVideoButton id={id} />
  </div>
)

class PlayerOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { id } = this.props;
    const obj = document.getElementById(id)

    const rect = obj.getBoundingClientRect();

  }

  render() {
    const { fetching, error, playTime, playing, id } = this.props;

    return (
      <Flex ref='playerOverlay' alignItems='center' justifyContent='center' className='player-overlay' width='100%' data-fetching={this._keepOverlayUp()} id={id}>
        {
          fetching && !error &&
            <img src={LoadingSVG} />
        }
        {
          !fetching && !error && playing && id &&
          <RemoveVideoButton id={id} />
        }
        {
          error &&
          <ErrorMsg error={`Oops! There was a problem loading this video`} id={id} />
        }
        <Editor />
      </Flex>
    )
  }

  _keepOverlayUp() {
    const { fetching, error } = this.props;

    return !!(fetching || error);
  }



 


}

export default withStyles(styles)(PlayerOverlay);