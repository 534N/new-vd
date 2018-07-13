import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'

import S3Image from '../components/S3Image'
import Flex from '../components/Flex'
import Icon from '../components/Icon'
import IconText from '../components/IconText'

import ErrorHandler from '../utils/ErrorHandler'


import '../css/CameraItem.css'

const sizes = {
  video: {
    xs: [320, 180],
    sm: [160, 90],
    md: [208, 117],
    lg: [256, 144],
  },
  cameras: {
    xs: [320, 180],
    sm: [240, 135],
    md: [240, 135],
    lg: [320, 180],
  }
  
}

const statusColor = {
  online: '#24ce88',
  offline: '#f54'
}

const styles = theme => ({
  actionItem: {
    cursor: 'pointer'
  }
})


const getConsumer = context => {

  switch (context) {
    case 'cameras':
      {
        const { CamerasPageContext } = require('../layouts/CamerasSubLayout');
        return CamerasPageContext.Consumer;
        break;
      }

    case 'video':
      {
        const { VideoPlayingContext } = require('../layouts/VideoPlayingSubLayout');
        return VideoPlayingContext.Consumer;
        break;
      }

    default:
      return null;
      break;
  }
}

const addPlayerToURL = (playlist, id) => {
  const playerIds = Object.values(playlist);

  return playerIds.map((pid, idx) => (`player${idx}=${pid}`)).join('&') + `&player${playerIds.length}=${id}`
}

const replacePlayerURL = id => `player0=${id}`;
const is360 = name => name.match(/360/);

class CameraItem extends React.Component {

  render() {
    const {
      id,
      cameraId,
      name,
      thumbnail,
      status,
      audioParams,
      isMotionEnabled,
      motionParams,
      streams,
      onSelect,
      match,
      classes,
      context
    } = this.props;

    const [{ id: streamId }] = streams;
    const { locationId } = match.params;
    const Consumer = getConsumer(context);

    return (
      <Consumer>
        {
          ({ auth, width: windowWidth, selectedLocation, playlist }) => {
            const { tenantId } = auth;
            const [imgWidht, imgHeight] = sizes[context][windowWidth];

            const playerId = `${locationId || selectedLocation.id}|${cameraId}|${streamId}` + is360(name) ? '|is360' : '';
            const active = Object.values(playlist).indexOf(playerId) > -1;

            return (
              <div className='camera-item' style={{width: `${imgWidht}px`, height: `${imgHeight}px`}} data-active={active}>
                <Flex justifyContent='space-around' alignItems='center' className='camera-item-mask' >
                  <Link to={`/app/play?${replacePlayerURL(playerId)}`} onClick={onSelect} className={classes.actionItem}>
                    <Icon path='play_circle' width='36px' height='36px' fill='#fff' />
                  </Link>
                  <Link to={`/app/play?${addPlayerToURL(playlist, playerId)}`} onClick={onSelect} className={classes.actionItem}>
                    <Icon path='add_box' width='36px' height='36px' fill='#fff' />
                  </Link>
                </Flex>
                <S3Image
                  width={imgWidht}
                  height={imgHeight}
                  name={name}
                  src={thumbnail}
                  bucketPrefix={tenantId} />
                <Flex className='camera-info-container'>
                  <IconText text={name} labelStyle={{ fontSize: '14px' }} path='status' widht='10px' height='10px' fill={statusColor[status]} />
                  {
                    audioParams.enabled &&
                    <Icon path='volume' width='15px' height='15px' fill='#fff' />
                  }
                  {
                    isMotionEnabled && motionParams.enabled && motionParams.roi &&
                    <Icon path='motionSearch' width='15px' height='15px' fill='#fff' />
                  }
                </Flex>
              </div>
            )
          }
        }
      </Consumer>
    );
  }
}

export default withRouter(withStyles(styles)(CameraItem));