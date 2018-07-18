import {
  host,
} from '../settings';

const getHeader = jwtToken => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwtToken}`
  };
}

const jsonToQueryString = json => '?' + Object.keys(json).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key])).join('&');

    
const getTop3Chart = (jwtToken, params) => ({
  method: 'POST',
  url: `${host}/events/top3`,
  headers: getHeader(jwtToken),
  data: params
})

const getVoid5Chart = (jwtToken, params) => ({
  method: 'GET',
  url: `${host}/events/histogram`,
  headers: getHeader(jwtToken),
  data: {
    ...params,
    filterId: '735a5c50-0197-11e6-af27-2d5012c820c0',
  }
})


export default {
  getTop3Chart,
  getVoid5Chart,
}