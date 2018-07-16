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

export default {
    
  getChart(jwtToken, params) {
    return {
      method: 'POST',
      url: `${host}/events/top3`,
      headers: getHeader(jwtToken),
      data: params
    }
  }

}

