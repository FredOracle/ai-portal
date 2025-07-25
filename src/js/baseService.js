/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'const/constants'],

  function(oj, ko, $, Constants) {
    /**
     * Parse a response from the webapp server.
     * @param {Object} responseObject - The response object coming from webapp server
     * @returns {Deferred} - A deferred reject/resolve based on the response object
     */
    function parseResponse(responseObject) {
      return $.Deferred(deferred => deferred.resolve(responseObject));
    }

    function failureParseResponse(responseObject) {
      if(responseObject.status === 403) {
         self.redirectToOrigin();
      }else  {
         return $.Deferred(deferred => deferred.reject(responseObject));
      }
    }

  self.redirectToOrigin = function() {
      if(localStorage.getItem('originFrom') === '0') {
       const URL =  Constants.apnBackendURL + "/web";
       window.location.href = URL;
       alert("Your current session has been expired!, redirecting to APN login page...");
     }else if(localStorage.getItem('originFrom') === '1') {
       const URL =  Constants.apnBackendURL + "/login";
       window.location.href = URL;
       alert("Your current session has been expired!, redirecting to Aware login page...");
     }
  }

   function getSavedSessionInfo() {
     let cookie = document.cookie;
     let tmp = cookie.split(";");
     for(let i = 0; i < tmp.length; i++ ) {
        let tt = tmp[i].trim();
        if(tt.startsWith('sessionInfo')) {
           let [key, value] = tt.split('=');
           if(key === 'sessionInfo' && value) {
              return  JSON.parse(value);
           }

        }
     }
     return false;
    }

    function addSessionToken(headers) {
       headers['x-auth-token'] = getSavedSessionInfo().session_id;
       return headers;
    }

    /**
     * Make a simple post request.
     * @param {String} reqType - request type get or post
     * @param {String} url - servlet url
     * @param {String} dataType - data type like json/text/xml
     * @param {String} method - The method name
     * @returns {Promise} promise
     */
    function post(reqType, url, dataType, method) {
           let headers = addSessionToken(Constants.backendHeaders);
           const req = $.ajax({
                type: reqType,
                headers: headers,
                url: url,
                dataType: dataType,
                data: { methodName: method }
           });
           return req.done(parseResponse).fail(failureParseResponse);
    }

    /**
     * Make a post request with params other than method name.
     * @param {String} reqType - request type get or post
     * @param {String} url - servlet url
     * @param {String} dataType - data type like json/text/xml
     * @param {Object} params - parameters to be passed for the POST request
     * @returns {Promise} promise
     */
    function postWithParams(reqType, url, dataType, params) {
          let headers = addSessionToken(Constants.backendHeaders);
          const req = $.ajax({
            type: reqType,
            headers: headers,
            xhrFields: { withCredentials: false },
            crossDomain: false,
            contentType: "application/json;",
            url: url,
            dataType: dataType,
            data: params
          });
          return req.then(parseResponse).promise();
    }

    /**
     * Make a post request for file upload
     * @param {String} reqType
     * @param {String} url
     * @param {Object} formData
     * @returns {Promise} promise
     */
    function postFileUpload(reqType, url, formData) {
      let headers = addSessionToken(Constants.backendHeaders);
          var req = $.ajax({
            type: reqType,
            url: url,
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            headers: headers,
            contentType: false
          });
          return req.then(parseResponse).promise();
    }

    return {
      post: post,
      postWithParams: postWithParams,
      postFileUpload: postFileUpload,
      getSavedSessionInfo: getSavedSessionInfo,
      addSessionToken: addSessionToken
    };
  });
