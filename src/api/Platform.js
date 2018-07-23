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

const allEventsChart = (jwtToken, params) => ({
  method: 'GET',
  url: `${host}/events/histogram`,
  headers: getHeader(jwtToken),
  data: {
    ...params,
  }
})

const transactionsInLastMin = (jwtToken, params) => ({
  method: 'POST',
  url: `${host}/events/query`,
  headers: getHeader(jwtToken),
  data: {
      end: new Date(+new Date() - 60 * 1000),
      mininum_should_match: 1,
      should: [{ term: { type: 'transaction' } }],
      sorts: [
        { startTime: { order: 'desc'}}
      ],
      timeFieldToSearchOn: 'startTime',
      ...params,
  }
})

export default {
  getTop3Chart,
  getVoid5Chart,
  allEventsChart,
  transactionsInLastMin
}