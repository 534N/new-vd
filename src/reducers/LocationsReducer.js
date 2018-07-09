import jwtDecode from 'jwt-decode';

import { isAccessibleInternally, configLocationParams } from './utils/Locations'
import { allowRemotePlayback } from './utils/User'

const userPermissions = {};

const LocationsReducer = (state = {
  locations: null,
  fetching: null,
  error: false,
  selectedLocation: null,
  localId: null,
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
        const { localId } = state;
        
        if (!localId && userPermissions.allowRemotePlayback) {
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

        configLocationParams(selectedLocation, localId, userPermissions.allowRemotePlayback)
        
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

        userPermissions.allowRemotePlayback = allowRemotePlayback(user_metadata)

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