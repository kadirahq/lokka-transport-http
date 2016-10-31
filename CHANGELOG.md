# Change Log

## v1.6.1
31 October 2017

Fixes [#18](https://github.com/kadirahq/lokka-transport-http/issues/18).
That causes due to a typo came with `v1.6.0`.

## v1.6.0
27 October 2017

* Support custom error handlers [PR17](https://github.com/kadirahq/lokka-transport-http/pull/17)

## v1.5.0

* Add the data object received to the Error object [PR9](https://github.com/kadirahq/lokka-transport-http/pull/9)
* optional CORS credentials support. [PR11](https://github.com/kadirahq/lokka-transport-http/pull/11)

## v1.4.1

Fix the way how we load fetch. Now it's work properly on safari as well. See [PR16](https://github.com/kadirahq/lokka-transport-http/pull/16)

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
