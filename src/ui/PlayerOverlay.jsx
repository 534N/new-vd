import React from 'react'
import { store } from '../store'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import SvgIcon from '@material-ui/core/SvgIcon'

import Flex from '../components/Flex'
import Icon from '../components/Icon'
import IconText from '../components/IconText'
import LoadingSVG from '../svg/loading-cylon.svg'

import PolygonEditor from './PolygonEditor'

import '../css/PlayerOverlay.css'

const styles = {
  root: {
    
  },
  timestamp: {
    color: '#fff',
    background: 'rgba(0,0,0,0.5',
    padding: '10px',
    fontWeight: 100,
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
    const { fetching, error, playTime, playing, id, primaryPlayerId, ttf } = this.props;

    return (
      <Flex ref='playerOverlay' alignItems='center' justifyContent='center' className='player-overlay' width='100%' data-fetching={this._keepOverlayUp()} id={id}>
        {
          playing && playTime >= 0 &&
          <div className='primary-indicator' data-active={primaryPlayerId === id} onClick={this._setPrimary}>
            P
          </div>
        }
        {
          playing && playTime >= 0 && ttf &&
          <div style={styles.timestamp} >
            { moment(parseInt(ttf(playTime))).format() }
          </div>
        }
        {
          fetching && !error &&
            <img src={LoadingSVG} />
        }
        {
          false && !fetching && !error && playing && id &&
          <RemoveVideoButton id={id} />
        }
        {
          error &&
          <ErrorMsg error={`Oops! There was a problem loading this video`} id={id} />
        }
      </Flex>
    )
  }

  _setPrimary = () => {
    const { id } = this.props;

    store.dispatch({ type: 'SET_PRIMARY', payload: id })
  }

  _keepOverlayUp = () => {
    const { fetching, error } = this.props;

    return !!(fetching || error);
  }



 


}

export default PlayerOverlay;