import {
  cloud_vms_host,
} from '../settings';

const getHeader = jwtToken => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwtToken}`
  };
}
const convertTimestampsToInts = data => {
  return data.map(({ start, end }) => { return { start: parseInt(start), end: parseInt(end) }})
};

export default class ConnectAPI {
    
  constructor({deviceUrl, jwtToken, cloudOnly=false}) {
    this.host = cloudOnly ? cloud_vms_host : deviceUrl;
    this.jwtToken = jwtToken;
    this.cloudOnly = cloudOnly;
  }


  listVideos({ tenantId, deviceId, cameraId, streamId, start, end, motiongrid, forceCloud=false }) {
    let source = '';

    let url = '';
    if (this.cloudOnly || forceCloud) {
      url = `${cloud_vms_host}/tenants/${tenantId}/devices/${deviceId}/cameras/${cameraId}/playlist.json?start=${start}&end=${end}`;
      source = 'CLOUD';
    } else {
      url = `${this.host}/cameras/${cameraId}/streams/${streamId}/list_videos?start=${start}&end=${end}&with_cloud_info=1&motiongrid=${motiongrid}`;
      source = 'LOCAL';
    }

    return {
      method: 'GET',
      url,
      headers: getHeader(this.jwtToken)
    }
  }
  

}