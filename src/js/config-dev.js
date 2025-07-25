/**
 * Define the URI of backend services, the uri should prefix with '/api' because
 * the admin portal is deployed in nginx and the nginx is working as reverse proxy,
 * that will handle both rest or non-restful http request. You can refer to nginx.cnf
 * for more details.
 */
/* eslint-disable */
define({
  "backendURL": "http://localhost:3000",
  "isAuthenticated": false
});
/* eslint-enable */
// slc15xow.us.oracle.com
