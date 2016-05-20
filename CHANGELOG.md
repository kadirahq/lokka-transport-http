# Change Log

## v1.4.0

* Remove isomorphic-fetch and handle isomorphic stuff overself. This is because isomorphic-fetch doesn't work properly in node 0.10.x

## v1.3.2

* Some code cleanup and potentially fix: [#3](https://github.com/kadirahq/lokka-transport-http/issues/3)

## v1.3.0
* Add react native support. See: [1598111](https://github.com/kadirahq/lokka-transport-http/tree/15981118287d7f72ba019937f3c0fbd0af11d98b)

## v1.2.0

* Able to require normally via `require('lokka-transport-http').Transport`;

## v1.1.0

* Handle 200 and 400 status code separately. Throw errors for others.
  * 200 is for success
  * 400 is for when there is a GraphQL Error

## v1.0.0

* Initial release
