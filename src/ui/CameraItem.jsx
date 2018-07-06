import React from 'react';
import { withStyles } from '@material-ui/core/styles'

import S3Image from '../components/S3Image';
import Flex from '../components/Flex';
import Icon from '../components/Icon';
import IconText from '../components/IconText';

import '../css/CameraItem.css'

const sizes = {
  xs: [320, 180],
  sm: [160, 90],
  md: [240, 135],
  lg: [320, 180],
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
})

const CameraItem = props => {

  console.debug('props', props)
  const {
    id,
    name,
    thumbnail,
    status,
    audioParams,
    isMotionEnabled,
    motionParams,
    auth,
    width: windowWidth,
    classes
  } = props;
  const { tenantId, aws } = auth;

  const [ imgWidht, imgHeight ] = sizes[windowWidth];

  return (
    <div  className='camera-item'>
      <Flex justifyContent='center' alignItems='center' className='camera-item-mask' >
        <Icon path='play_circle' width='36px' height='36px' fill='#fff' />
      </Flex>
      <S3Image
        width={imgWidht}
        height={imgHeight}
        name={name}
        src={thumbnail}
        bucketPrefix={tenantId} />
      <Flex className={classes.infoContainer}>
        <IconText text={name} labelStyle={{fontSize: '14px'}} path='status' widht='10px' height='10px' fill={statusColor[status]}/>
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
  );

  return (
    <div />
  )
}

export default withStyles(styles)(CameraItem);