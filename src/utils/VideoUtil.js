import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'

import { store } from '../store'
import ConnectAPI from '../api/Connect'
import { isCloudOnly } from '../utils/FeatureUtil'

const getDeviceURL = location => location.accessibleAddress || `https://${location.id}.solink.direct`;

export const getM3u8 = (locations, locationId, cameraId, streamId, time) => {
  const location = _.find(locations, loc => loc.id === locationId);
  const start = +new Date(moment(time).startOf('day').format());
  const end = +new Date(moment(time).endOf('day').format());

  const deviceUrl = getDeviceURL(location);
  return `${deviceUrl}/cameras/${cameraId}/video.m3u8?begin=${start}&end=${end}&stream=${streamId}`;
}

export const listVideo = (locations, locationId, cameraId, streamId, time, tenantId, jwtToken, user) => {
  const location = _.find(locations, loc => loc.id === locationId);
  const start = +new Date(moment(time).startOf('day').format());
  const end = +new Date(moment(time).endOf('day').format());

  const params = {
    deviceId: locationId,
    motiongrid: true,
    tenantId,
    cameraId,
    streamId,
    start,
    end,
  };


  debugger
  const connect = new ConnectAPI({
    deviceUrl: getDeviceURL(location),
    jwtToken: jwtToken,
    cloudOnly: isCloudOnly(location, user),
  });

  store.dispatch({ type: 'LIST_VIDEO', payload: axios(connect.listVideos(params)) })
}
