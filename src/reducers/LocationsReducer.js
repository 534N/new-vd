const LocationsReducer = (state = {
  locations: null,
  fetching: null,
  error: false,
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
        }

        break;
      }

    default:
      break;

    
  }

  return state;
};

export default LocationsReducer;