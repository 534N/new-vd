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

import Timeline from './Timeline'
import PolygonEditor from './PolygonEditor'
import ResponsiveWrap from '../components/ResponsiveWrap'


import '../css/PlayerOverlay.css'

const styles = multiplay => ({
  previewImageWidth: multiplay ? 160 : 192,
  previewImageHeight: multiplay ? 90 : 108,
  root: {
    
  },
  timeline: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    display: 'flex',
    backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
  },
  timelineWrap: {
    overflow: 'hidden',
  },
  timestamp: {
    color: '#fff',
    background: 'rgba(0,0,0,0.5',
    padding: '10px',
    fontWeight: 100,
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    border: '2px solid #000',
    display: 'flex',
    justifyContent: 'center',
  },
  previewTimestamp: {
    position: 'absolute',
    bottom: 0,
    left: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
    background: '#000',
    padding: '5px',
    fontSize: '12px',
    fontWeight: 100,
    zIndex: 1
  }
})

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
    this.state = {
      playerWidth: props.parentWidth,
    }
  }

  componentWillReceiveProps({ parentWidth }) {
    this.setState({
      playerWidth: parentWidth,
    })
  }

  componentDidMount() {
    const { id, parentWidth } = this.props;
    const obj = document.getElementById(id)

    const rect = obj.getBoundingClientRect();
    this.setState({
      playerWidth: parentWidth //rect.width,
    })
  }

  render() {
    const { loading, fetching, error, playTime, playing, id, primaryPlayerId, ttf, time, recordings, onSeek, locations, multiPlay } = this.props;
    const { playerWidth, showPreview, previewUrl, mouseTime, mouseX } = this.state;

    const [ locationId, cameraId, streamId ] = id.split('|');
    const playerId = id.split('|').join('-');

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
          <div style={styles(multiPlay).timestamp} >
            { moment(parseInt(ttf(playTime))).format() }
          </div>
        }
        {
          (loading || fetching) && !error &&
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
        {
          playerWidth > 0 && !fetching && !error && ttf &&
          <div style={styles(multiPlay).timeline}>
            {
              showPreview && previewUrl &&
              <div style={{...styles(multiPlay).preview, transform: `translate(${mouseX - styles(multiPlay).previewImageWidth / 2 - 2}px, ${0 - (styles(multiPlay).previewImageHeight - 20)}px)`}}>
                <div style={styles(multiPlay).previewTimestamp}>{moment(mouseTime).format('HH:mm:ss')}</div>
                <img src={previewUrl} width={styles(multiPlay).previewImageWidth} height={styles(multiPlay).previewImageHeight} />
              </div>
            }
            <div style={styles(multiPlay).timelineWrap}>
              <Timeline
                multiPlay={multiPlay}
                locations={locations}
                locationId={locationId}
                cameraId={cameraId}
                streamId={streamId}
                id={playerId}
                onSeek={onSeek}
                ttf={ttf}
                time={time}
                width={playerWidth}
                playTime={parseInt(ttf(playTime))}
                recordings={recordings}
                updateShowTooltip={this._updateShowTooltip}
                updatePreviewUrl={this._updatePreviewUrl}
                simple />
            </div>
          </div>
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

  _updateShowTooltip = status => {
    this.setState({
      showPreview: status,
    });
  }

  _updatePreviewUrl = ({ previewUrl, mouseTime, mouseX }) => {
    this.setState({
      previewUrl,
      mouseTime,
      mouseX
    })
  }

 


}

export default ResponsiveWrap(PlayerOverlay);