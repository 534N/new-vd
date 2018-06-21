let HOST_NAME = 'https://client.solinkcloud.com';
let S3_BUCKET_NAME = 'solinkimages';
let SIGNALLER_URL = 'https://signaller.solinkcloud.com';
let INTERCOM_ID = 'p9rbi4pn';
let AUTH0_CLIENT_ID = '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih';
let AUTH0_DOMAIN = 'solink.auth0.com';
let BRAND_NAME = 'solink';
let CLOUD_VMS_HOST_NAME = 'https://cloudvms.solinkcloud.com';
let CALLHOME_URL = 'https://callhome.solinkcloud.com';
let REFERRAL_URL = 'https://go.solink.com/invite';

if (process.env.NODE_ENV === 'development') {
  // HOST_NAME = 'https://test-api.solinkcloud.com';
  // S3_BUCKET_NAME = 'int-solinkcloud-images';
  // SIGNALLER_URL = 'https://test-signaller.solinkcloud.com';
  // INTERCOM_ID = 'rm5ya6w8';
  // AUTH0_CLIENT_ID = 'apgeIHLz2aSl1PyHUET1jpy3VCL4HAEe';
  // AUTH0_DOMAIN = 'solink-test.auth0.com';
  // CLOUD_VMS_HOST_NAME = 'https://int-cloudvms.solinkcloud.com';
  // CALLHOME_URL = 'https://test-callhome.solinkcloud.com';
} else if (process.env.NODE_ENV === 'integration') {
  HOST_NAME = 'https://test-api.solinkcloud.com';
  S3_BUCKET_NAME = 'int-solinkcloud-images';
  SIGNALLER_URL = 'https://test-signaller.solinkcloud.com';
  INTERCOM_ID = 'rm5ya6w8';
  AUTH0_CLIENT_ID = 'apgeIHLz2aSl1PyHUET1jpy3VCL4HAEe';
  AUTH0_DOMAIN = 'solink-test.auth0.com';
  CLOUD_VMS_HOST_NAME = 'https://int-cloudvms.solinkcloud.com';
  CALLHOME_URL = 'https://test-callhome.solinkcloud.com';
}


if (process.env.BRAND_NAME === 'solink') {
  BRAND_NAME = 'solink';
} else if (process.env.BRAND_NAME === 'red_flag') {
  BRAND_NAME = 'red_flag';
}

export default Object.assign({}, {
  host: HOST_NAME,
  s3_bucket_name: S3_BUCKET_NAME,
  signaller_url: SIGNALLER_URL,
  intercom_id: INTERCOM_ID,
  brand: BRAND_NAME,
  auth0_clientID: AUTH0_CLIENT_ID,
  auth0_domain: AUTH0_DOMAIN,
  cloud_vms_host: CLOUD_VMS_HOST_NAME,
  callhome_url: CALLHOME_URL,
  referral_url: REFERRAL_URL,
});