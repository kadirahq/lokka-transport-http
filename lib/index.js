import LokkaTransport from 'lokka/transport';
import fetch from 'isomorphic-fetch';

export default class LokkaHTTPTransport extends LokkaTransport {
  constructor(endpoint) {
    if (!endpoint) {
      throw new Error('endpoint is required!');
    }

    super();
    this.endpoint = endpoint;
  }

  send(query, variables, operationName) {
    const payload = {query, variables, operationName};
    return fetch(this.endpoint, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      // To pass cookies to the server. (supports CORS as well)
      credentials: 'include',
    }).then(response => {
      return response.json();
    }).then(({data, errors}) => {
      if (errors) {
        const message = errors[0].message;
        const error = new Error(`GraphQL Error: ${message}`);
        error.rawError = errors;

        throw error;
      }

      return data;
    });
  }
}
