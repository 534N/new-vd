import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles'

import S3Image from '../components/S3Image';
import Flex from '../components/Flex';
import IconText from '../components/IconText';

const sizes = {
  sm: [160, 90],
  md: [240, 135],
  lg: [320, 180],
}

const statusColor = {
  online: '#24ce88',
  offline: '#f54'
}

const styles = theme => ({
  root: {
    position: 'relative',
    margin: '10px',
  },
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
  const { id, name, thumbnail, status, auth, width: windowWidth, classes } = props;
  const { tenantId, aws } = auth;

  const [ imgWidht, imgHeight ] = sizes[windowWidth];

  return (
    <div className={classes.root}>
      <S3Image
        width={imgWidht}
        height={imgHeight}
        name={name}
        src={thumbnail}
        bucketPrefix={tenantId} />
      <Flex className={classes.infoContainer}>
        <div>
          <IconText text={name} labelStyle={{fontSize: '14px'}} path='status' widht='10px' height='10px' fill={statusColor[status]}/>

        </div>
      </Flex>
    </div>
  );
}

export default connect(state => {
  return {
    auth: state.auth,
    ...state.window
  };
})(withStyles(styles)(CameraItem));