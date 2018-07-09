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

        state = {
          ...state,
          selectedLocation,
        }
        break;
      }
    
    //
    // SHARED ACTIONS
    //
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