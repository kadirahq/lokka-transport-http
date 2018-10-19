/* global fetch */
import LokkaTransport from 'lokka/transport';
// In some envionment like in ReactNative, we don't need fetch at all.
// Technically, this should be handle by 'isomorphic-fetch'.
// But it's not happening. So this is the fix

const isNode = new Function('try {return this===global;}catch(e){return false;}');

let fetchUrl;
if (typeof fetch === 'function') {
  // has a native fetch implementation
  fetchUrl = fetch;
} else if (isNode()) {
  // for Node.js
  fetchUrl = require('node-fetch');
  fetchUrl.Promise = Promise;
} else {
  // for the browser
  require('whatwg-fetch');
  fetchUrl = fetch;
}

// the default error handler
function handleErrors(errors, data) {
  const message = errors[0].message;
  const error = new Error(`GraphQL Error: ${message}`);
  error.rawError = errors;
  error.rawData = data;
  throw error;
}

export class Transport extends LokkaTransport {
  constructor(endpoint, options = {}) {
    if (!endpoint) {
      throw new Error('endpoint is required!');
    }

    super();
    this._httpOptions = {
      auth: options.auth,
      headers: options.headers || {},
      credentials: options.credentials,
    };
    this.endpoint = endpoint;
    this.handleErrors = options.handleErrors || handleErrors;
  }

  _buildOptions(payload) {
    const options = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      // To pass cookies to the server. (supports CORS as well)
      credentials: 'include',
    };

    // use delete property for backward compatibility
    if (this._httpOptions.credentials === false) {
      delete options.credentials;
    }

    Object.assign(options.headers, this._httpOptions.headers);
    return options;
  }

  send(query, variables, operationName) {
    const payload = {query, variables, operationName};
    const options = this._buildOptions(payload);

    return fetchUrl(this.endpoint, options).then(response => {
      // 200 is for success
      // 400 is for bad request
      if (response.status !== 200 && response.status !== 400) {
        throw new Transport.Error(`Invalid status code: ${response.status}`, response);
      }

      return response.json();
    }).then(({data, errors}) => {
      if (errors) {
        this.handleErrors(errors, data);
        return null;
      }

      return data;
    });
  }
}

Transport.Error = class {
  constructor(message, response) {
    this._message = message;
    this._response = response;
  }

  get message() {
    return this._message;
  }

  get response() {
    return this._response;
  }
};

export default Transport;
