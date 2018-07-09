import axios from 'axios'

const sortNameAlphabetically = (object1, object2) => {
  // Sort objects alphabetically according to name property (note that e.g. "Store 12" would be placed before "Store 2")
  if (object1.hasOwnProperty('name') && object2.hasOwnProperty('name')) {
    // Trim whitespace that can affect comparison
    const comparableValue1 = object1.name.trim().toLowerCase();
    const comparableValue2 = object2.name.trim().toLowerCase();
    if (comparableValue1 < comparableValue2) {
      return -1;
    } else if (comparableValue1 > comparableValue2) {
      return 1;
    } else {
      return 0;
    }
  }
}

export const isAccessibleInternally = (location, cb) => {
  const urlToTest = location.vmsLocalHttpsUrl || location.vmsLocalUrl;

  // Also check for URLs like https://null:8080
  if (location.type === 'data' || !urlToTest || urlToTest.indexOf('null') !== -1) {
    return cb(false);
  }

  const config = {
    baseURL: urlToTest,
    url: '/id',
    method: 'GET',
    timeout: 1000
  }

  axios(config)
    .then(res => {
      const returnedId = res.text.replace(/\"/g, '');
      const isAccessible = (returnedId && returnedId === location.id);
      if (isAccessible) {
        console.log('found a locally accessible location', location);
      }

      cb(isAccessible);
    })
    .catch(err => {
      cb(false);
    })
}

export const configLocationParams = (l, localId, allowRemotePlayback) => {
  // if this is our designated local address, give it a default state of 'local'
  if (localId && l.id === localId) {
    l.accessibleAddress = l.vmsLocalHttpsUrl;
    l.isLocal = true;
    l.useRelay = false;
  } else if (l.isRelayEnabled) {
    l.accessibleAddress = l.vmsRelayUrl;
    l.isLocal = !allowRemotePlayback;
    l.useRelay = true;
  } else {
    l.accessibleAddress = allowRemotePlayback ? l.vmsHttpsUrl : l.vmsLocalHttpsUrl;
    l.isLocal = !allowRemotePlayback; // if you are only allowed to view locally, this should be true...
    l.useRelay = false;
  }

  if (l.hasOwnProperty('cameras')) {
    l.cameras.sort(sortNameAlphabetically);
  }
}

