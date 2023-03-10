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

const DEFAULT_OPTIONS = {
  method: "GET",
  headers: {},
  body: null,
};

const myFetch = (URL, requestOptions = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const xhttp = new XMLHttpRequest();

      requestOptions = {
        ...DEFAULT_OPTIONS,
        ...(isRequestOptionsValid() ? requestOptions : {}),
      };

      function isRequestOptionsValid() {
        return (
          typeof requestOptions === "object" &&
          !Array.isArray(requestOptions) &&
          requestOptions !== null
        );
      }

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
      setRequestHeaders(xhttp, requestOptions.headers);
      xhttp.send(requestOptions.body);

      function setRequestHeaders(xhttp, headers) {
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
