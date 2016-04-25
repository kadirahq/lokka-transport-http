# lokka-transport-http

Isomorphic HTTP Transport Layer for [Lokka](https://github.com/kadirahq/lokka)

---

This is a [graphql-express](https://github.com/graphql/express-graphql) compatible transport layer for [Lokka](https://github.com/graphql/express-graphql).

## Basic Usage

Install the package:

```
npm i --save lokka-transport-http
npm i --save lokka
```

This is how to send request to Facebook's [SWAPI GraphQL Demo](http://graphql-swapi.parseapp.com/).

```js
import HttpTransport from 'lokka-transport-http';
const transport = new HttpTransport('http://graphql-swapi.parseapp.com/');
transport.send(`
    {
      allFilms {
        films {
          title
        }
      }
    }
`).then(response => {
    console.log(JSON.stringify(response, null, 2));
});
```

## Send Custom Options

### Headers

It's possible to send custom headers like this:

```js
const options = {};
options.headers = {
    'my-headers': 'some-value'
};
const transport = new HttpTransport('/graphql', options);
```

### Mode

Allows [any mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode) compatible with Isomorphic-fetch, e.g.: 'same-origin', 'cors', 'no-cors', 'navigate'.
Default is 'cors'.

```js
const options = {};
options.mode = 'no-cors';
const transport = new HttpTransport('/graphql', options);
```

## Authentication

This package does not handle authentication information for you. But it'll let you interact with your app's existing authentication mechanism.

* If you already have an authorized cookie, it'll be sent with the HTTP request. (supports CORS)
* You can also set a custom `Authorization` [header]((https://www.npmjs.com/package/basic-auth-header) to implement [basic-auth](https://www.npmjs.com/package/basic-auth) support.
