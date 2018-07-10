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
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: '5px',
    background: 'rgba(0,0,0,0.7)',
    color: '#fff',
    width: '100%',
    height: '30%'
  },
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

    if (!Consumer) {
      ErrorHandler.send(`Consumer error: ${Consumer}, context: ${context}`)
      return <div />;
    }

    return (
      <Consumer>
        {
          ({ auth, width: windowWidth, selectedLocation }) => {
            const { tenantId } = auth;
            const [imgWidht, imgHeight] = sizes[context][windowWidth];

            return (
              <div className='camera-item' style={{width: `${imgWidht}px`, height: `${imgHeight}px`}}>
                <Flex justifyContent='space-around' alignItems='center' className='camera-item-mask' >
                  <Link to={`/app/play?locationId=${locationId || selectedLocation.id}&&cameraId=${cameraId}&&streamId=${streamId}`} onClick={onSelect} className={classes.actionItem}>
                    <Icon path='play_circle' width='36px' height='36px' fill='#fff' />
                  </Link>
                  <Icon path='add_box' width='36px' height='36px' fill='#fff' />
                </Flex>
                <S3Image
                  width={imgWidht}
                  height={imgHeight}
                  name={name}
                  src={thumbnail}
                  bucketPrefix={tenantId} />
                <Flex className={classes.infoContainer}>
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