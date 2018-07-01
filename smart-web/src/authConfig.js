export default {
  // If using aurelia-api:
  // =====================

  // This is the name of the endpoint used for any requests made in relation to authentication (login, logout, etc.). An empty string selects the default endpoint of aurelia-api.
  endpoint : 'auth',
  // When authenticated, these endpoints will have the token added to the header of any requests (for authorization). Accepts an array of endpoint names. An empty string selects the default endpoint of aurelia-api.
  configureEndpoints : ['auth', 'protected-api'],


  // SPA related options
  // ===================

  // The SPA url to which the user is redirected after a successful login
  loginRedirect : '/',
  // The SPA url to which the user is redirected after a successful logout
  logoutRedirect : '/',
  // The SPA route used when an unauthenticated user tries to access an SPA page that requires authentication
  loginRoute : '/',
  // Whether or not an authentication token is provided in the response to a successful signup
  loginOnSignup : true,
  // If loginOnSignup == false: The SPA url to which the user is redirected after a successful signup (else loginRedirect is used)
  signupRedirect : '/',
  // reload page when token expires. 0 = don't reload (default), 1 = do reload page
  expiredReload : 0,
  // reload page when storage changed aka login/logout in other tabs/windows. 0 = don't reload (default), 1 = do reload page
  storageChangedReload : 0,


  // API related options
  // ===================

  // The base url used for all authentication related requests, including provider.url below.
  // This appends to the httpClient/endpoint base url, it does not override it.
  baseUrl : 'http://localhost:5000',
  // The API endpoint to which login requests are sent
  loginUrl : 'account/login',
  // The API endpoint to which logout requests are sent (not needed for jwt)
  logoutUrl : 'account/logout',
  // The HTTP method used for 'logout' requests (Options: 'get' or 'post')
  logoutMethod : 'post',
  // The API endpoint to which signup requests are sent
  signupUrl : '/account/signup',
  // The API endpoint used in profile requests (inc. `find/get` and `update`)
  profileUrl : '/connect/userinfo',
  // The method used to update the profile ('put' or 'patch')
  profileMethod : 'put',
  // The API endpoint used with oAuth to unlink authentication
  unlinkUrl : '/connect/endsession',
  // The HTTP method used for 'unlink' requests (Options: 'get' or 'post')
  unlinkMethod : 'get',


  // Token Options
  // =============

  // The header property used to contain the authToken in the header of API requests that require authentication
  authHeader : 'Authorization',
  // The token name used in the header of API requests that require authentication
  authTokenType : 'Bearer',
  // Logout when the token is invalidated by the server
  logoutOnInvalidtoken : false,
  // The property from which to get the access token after a successful login or signup
  accessTokenProp : 'access_token',


  // If the property defined by `accessTokenProp` is an object:
  // ------------------------------------------------------------

  //This is the property from which to get the token `{ "accessTokenProp": { "accessTokenName" : '...' } }`
  //accessTokenName : 'token',
  // This allows the token to be a further object deeper `{ "accessTokenProp": { "accessTokenRoot" : { "accessTokenName" : '...' } } }`
  //accessTokenRoot : false,


  // Refresh Token Options
  // =====================

  // Option to turn refresh tokens On/Off
  useRefreshToken : false,
  // The option to enable/disable the automatic refresh of Auth tokens using Refresh Tokens
  autoUpdateToken : true,
  // Oauth Client Id
  clientId : false,
  // Oauth Client secret
  clientSecret : null,
  // The property from which to get the refresh token after a successful token refresh
  refreshTokenProp : 'refresh_token',
  // The property name used to send the existing token when refreshing `{ "refreshTokenSubmitProp": '...' }`
  refreshTokenSubmitProp : 'refresh_token',
  // Option to maintain unchanged response properties. This allows to work with a single refresh_token that was received once and the expiration only is extend
  keepOldResponseProperties : false,

  // If the property defined by `refreshTokenProp` is an object:
  // -----------------------------------------------------------

  // This is the property from which to get the token `{ "refreshTokenProp": { "refreshTokenName" : '...' } }`
  refreshTokenName : 'token',
  // This allows the refresh token to be a further object deeper `{ "refreshTokenProp": { "refreshTokenRoot" : { "refreshTokenName" : '...' } } }`
  refreshTokenRoot : false,


  // Id Token Options
  // =====================

  // The property name from which to get the user authentication token. Can also be dotted "anIdTokenProp.anIdTokenName"
  idTokenProp : 'id_token',

  // If the property defined by `idTokenProp` is an object:
  // -----------------------------------------------------------

  // This is the property from which to get the id token `{ "idTokenProp": { "idTokenName" : '...' } }`
  //idTokenName : 'token',
  // This allows the id token to be a further object deeper `{ "idTokenProp": { "idTokenRoot" : { "idTokenName" : '...' } } }`
  //idTokenRoot : false,


  // Miscellaneous Options
  // =====================

  // Whether to enable the fetch interceptor which automatically adds the authentication headers
  // (or not... e.g. if using a session based API or you want to override the default behaviour)
  httpInterceptor : true,
  // For OAuth only: Tell the API whether or not to include token cookies in the response (for session based APIs)
  withCredentials : true,
  // Controls how the popup is shown for different devices (Options: 'browser' or 'mobile')
  platform : 'browser',
  // Determines the `window` property name upon which aurelia-authentication data is stored (Default: `window.localStorage`)
  storage : 'localStorage',
  // The key used for storing the authentication response locally
  storageKey : 'aurelia_authentication',
  // full page reload if authorization changed in another tab (recommended to set it to 'true')
  storageChangedReload : false,
  // optional function to extract the expiration date. Takes the server response as parameter and returns NumericDate = number of seconds! since 1 January 1970 00:00:00 UTC (Unix Epoch)
  // eg (expires_in in sec): getExpirationDateFromResponse = serverResponse => new Date().getTime() / 1000 + serverResponse.expires_in,
  getExpirationDateFromResponse : null,
  // optional function to extract the access token from the response. Takes the server response as parameter and returns a token
  // eg: getAccessTokenFromResponse = serverResponse => serverResponse.data[0].access_token,
  getAccessTokenFromResponse : null,
  // optional function to extract the refresh token from the response. Takes the server response as parameter and returns a token
  // eg: getRefreshTokenFromResponse = serverResponse => serverResponse.data[0].refresh_token,
  getRefreshTokenFromResponse : null,

  // List of value-converters to make global
  globalValueConverters : ['authFilterValueConverter'],

  // Default headers for login and token-update endpoint
  defaultHeadersForTokenRequests : {
    'Content-Type': 'application/json'
  },
  providers: {
    identityServer: {
      name: 'identityServer',
      oauthType: '2.0',
      clientId: 'aurelia',
      authorizationEndpoint: 'http://localhost:5000/connect/authorize',
      redirectUri: 'http://localhost:8080/profile',
      logoutEndpoint: 'http://localhost:5000/connect/endsession',
      postLogoutRedirectUri: 'http://localhost:8080',
      responseType: 'id_token token',
      scope: ['openid profile api crowdhackathon'],
      requiredUrlParams: ['scope', 'nonce', 'resource'],
      state: function () {
         var text = "";
         var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
         for (var i = 0; i < 32; i++) {
           text += possible.charAt(Math.floor(Math.random() * possible.length));
         }
         return text;
      },
      nonce: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      },
      popupOptions: { width: 1028, height: 529 },
      resource: 'aurelia-openiddict-resources aurelia-openiddict-server'
    }
  }
};
