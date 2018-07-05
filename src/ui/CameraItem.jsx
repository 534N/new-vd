import React from 'react';
import { connect } from 'react-redux';

import S3Image from '../components/S3Image';

const CameraItem = props => {

  console.debug('props', props)
  const { id, name, thumbnail, auth } = props;

  const { tenantId, aws } = auth;
  return (
    <div>
      <S3Image name={name}
        src={thumbnail}
        bucketPrefix={tenantId} />
    </div>
  );
}

export default connect(state => {
  return {
    auth: state.auth
  };
})(CameraItem);