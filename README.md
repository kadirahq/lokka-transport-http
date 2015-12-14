# lokka-transport-http

Isomorphic HTTP Transport Layer for [Lokka](https://github.com/kadirahq/lokka)

---

This is a [graphql-express](https://github.com/graphql/express-graphql) compatible transport layer for [Lokka](https://github.com/graphql/express-graphql).

## Basic Usage

```
npm i --savs lokka-transport-http
```

```js
import HttpTransport from 'lokka-transport-http';
const transport = new HttpTransport('http://graphql-swapi.parseapp.com/');
const response = transport.send(`
    {
      allFilms {
        films {
          title
        }
      }
    }
`);
console.log(response);
```

## Send Custom Headers

It's possible to send custom headers like this:

```js
const headers = {
    'my-headers': 'some-value'
};
const transport = new HttpTransport('/graphql', {headers});
```

## Authentication

This package does not handle authentication information for you. But it'll let you interact with your app's existing authentication machanism.

* If you aleady have an authorized cookie, it'll be sent with the HTTP request. (supports CORS)
* You can also set a custom `Authorization` header to implement [basic-auth](https://www.npmjs.com/package/basic-auth-header) or similar authentication schema.
