const CustomerReducer = (state = {
  customer: null,
}, action) => {
  switch (action.type) {
    case 'CUSTOMER_INFO_FULFILLED':
      {
        const {
          data
        } = action.payload;

        state = {
          ...state,
          customer: data,
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
          customer: null,
        }

        break;
      }

    default:
      break;
  }

  return state;
};

export default CustomerReducer;