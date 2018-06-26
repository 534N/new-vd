import React from 'react';
import { connect } from 'react-redux';

const WithStore = ({ children, state, dispatch }) => children(state, dispatch);
const defaultSelector = (state) => state; // pass the whole state by default

export default connect(
  // the second parameter of this mapStateToProps is the component's props. 
  // We are using this to pass custom selector as `mapStateToProps` directly! 
  (state, { selector = defaultSelector }) => ({ state: selector(state) }),
  dispatch => ({ dispatch }),
)(WithStore);

// *** Usage ***
// const ProfilePage = () => 
//   <WithStore
//     selector={(state) => ({
//       name: state.user.name,
//       avatarUrl: avatarSelector(state),
//     })}
//   >
//     { (props, dispatch) => <UserProfile name={props.name} avatarUrl={props.avatarUrl} /> }
//   </WithStore>