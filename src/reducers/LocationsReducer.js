import jwtDecode from 'jwt-decode';

import { isAccessibleInternally, configLocationParams } from './utils/Locations'
import { allowRemotePlaybackFunc } from './utils/User'

const LocationsReducer = (state = {
  locations: null,
  fetching: null,
  error: false,
  selectedLocation: null,
  localId: null,
  allowRemotePlayback: false,
}, action) => {
  switch (action.type) {
    
    case 'LOCATION_INFO_FULFILLED':
      {
        const {
          data
        } = action.payload;

        state = {
          ...state,
          locations: data,
          fetching: false,
        }
        break;
      }

    case 'LOCATION_INFO_PENDING':
      {
        state = {
          ...state,
          fetching: true,
        }
        break;
      }

    case 'LOCATION_INFO_REJECTED':
      {
        state = {
          ...state,
          error: true,
        }
        break;
      }

    case 'SELECTED_LOCATION':
      {
        const selectedLocation = action.payload;
        const {
          localId,
          allowRemotePlayback
        } = state;
        
        if (!localId && allowRemotePlayback) {
          isAccessibleInternally(selectedLocation, isAccessible => {
            if (isAccessible) {
              selectedLocation.accessibleAddress = selectedLocation.vmsLocalHttpsUrl || selectedLocation.vmsLocalUrl;

              selectedLocation.isLocal = true;
              selectedLocation.useRelay = false;

              state = {
                ...state,
                localId: selectedLocation.id,
              }
            }
          });
        }

        configLocationParams(selectedLocation, localId, allowRemotePlayback)
        
        state = {
          ...state,
          selectedLocation,
        }
        break;
      }
    
    //
    // SHARED ACTIONS
    //
    case 'USER_LOG_IN':
      {
        const {
          idToken: jwtToken,
        } = action.payload;

        const user = jwtDecode(jwtToken);
        const {
          user_metadata
        } = user;

        state = {
          ...state,
          allowRemotePlayback: allowRemotePlaybackFunc(user_metadata)
        }

        break;
      }

    case 'USER_LOG_OUT':
      {
        state = {
          ...state,
          locations: null,
          fetching: null,
          error: false,
          selectedLocation: null,
        }

        break;
      }

    default:
      break;

    
  }

  return state;
};

export default LocationsReducer;