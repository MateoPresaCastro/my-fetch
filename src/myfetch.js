const { request } = require("http");
const XMLHttpRequest = require("xhr2");

// for future tests
const METHODS = new Set([
  "CONNECT",
  "DELETE",
  "GET",
  "HEAD",
  "OPTIONS",
  "POST",
  "PUT",
  "TRACE",
]);

const defaultOptions = {
  method: "GET",
  headers: {},
  body: null,
};

const myFetch = (URL, requestOptions) => {
  return new Promise((resolve, reject) => {
    try {
      const xhttp = new XMLHttpRequest();

      requestOptions = {
        ...defaultOptions,
        ...(isRequestOptionsValid() ? requestOptions : {}),
      };

      function isRequestOptionsValid () {
        return typeof requestOptions === "object" &&
          !Array.isArray(requestOptions) &&
          requestOptions !== null &&
          requestOptions !== undefined
          ? true
          : false;
      };

      xhttp.onreadystatechange = function () {
        if (ableToCreateResponse(xhttp)) {
          const response = createResponse(xhttp);
          resolve(response);
        }
      };

      xhttp.onerror = function () {
        reject(new Error(`Error fetching data from ${URL}`));
      };

      function ableToCreateResponse(xhttp) {
        return (
          xhttp.readyState === 4 && xhttp.status >= 200 && xhttp.status <= 299
        );
      }

      function createResponse(xhttp) {
        const responseBody = xhttp.response;
        const headers = getResponseHeaderObj(xhttp);
        const responseOptions = {
          status: xhttp.status,
          statusText: xhttp.statusText,
          headers: new Headers(headers),
        };
        return new Response(responseBody, responseOptions);
      }

      // https://stackoverflow.com/questions/37924305/how-to-make-a-json-object-out-of-getallresponseheaders-method
      function getResponseHeaderObj(xhttp) {
        const headers = {};
        xhttp
          .getAllResponseHeaders()
          .trim()
          .split(/[\r\n]+/)
          .map((header) => header.split(/: /))
          .forEach(([key, value]) => {
            headers[key.trim()] = value.trim();
          });
        return headers;
      }

      xhttp.open(requestOptions.method, URL, true);
      setRequestHeader(xhttp, requestOptions.headers);
      xhttp.send(requestOptions.body);

      function setRequestHeader(xhttp, headers) {
        if (headers === undefined) return;
        for (const [key, value] of Object.entries(headers)) {
          xhttp.setRequestHeader(key, value);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = myFetch;
