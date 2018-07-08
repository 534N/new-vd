import _ from 'lodash'


const getUserSetting = (user, name, defaultValue) => {
  return _.get(user.app_metadata, [name], defaultValue);
};

const getDeviceSetting = (location, name, defaultValue) => {
  return _.get(location, [name], defaultValue);
};

export const isCloudOnly = (location, user) => {
  return getDeviceSetting(location, 'cloudOnly', false) || getUserSetting(user, 'cloudOnly', false);
};