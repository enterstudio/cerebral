# cerebral-provider-http

## install
**NPM**

`npm install cerebral-provider-http@next --save --save-exact`

**YARN**

`yarn add cerebral-provider-http@next --exact`

## description
The HTTP provider exposes the ability to do HTTP requests both in actions and directly in signals. It supports **cors** and file upload, with progress handling. It default to **json**, but you can configure it to whatever you want.

```js
import {set} from 'cerebral/operators'
import {httpGet} from 'cerebral-provider-http/operators'
import {state, props} from 'cerebral/tags'

export default [
  httpGet(`/items/${props`itemKey`}`),
  set(state`app.currentItem`, props`result`)
]
```

All factories of HTTP provider supports template tags.

## instantiate

```js
import {Controller} from 'cerebral'
import HttpProvider from 'cerebral-provider-http'

const controller = Controller({
  providers: [
    HttpProvider({
      // Prefix all requests with this url
      baseUrl: 'https://api.github.com',

      // Any default headers to pass on requests
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json'
      },

      // When talking to cross origin (cors), pass cookies
      // if set to true
      withCredentials: false
    })
  ]
})
```

You can update these default options in an action:

```js
function updateDefaultHttpOptions({http}) {
  http.updateOptions({
    // Updated options
  })
}
```

## error

### HttpProviderError

```js
import {HttpProviderError} from 'cerebral-provider-http'

// Error structure
{
  name: 'HttpProviderError',
  message: 'Some potential error message',
  body: 'Message or response body',
  status: 200,
  isAborted: false,
  headers: {},
  stack: '...'  
}
```

## request

```js
function someGetAction ({http}) {
  return http.request({
    // Any http method
    method: 'GET',

    // Url you want to request to
    url: '/items'

    // Request body as object. Will automatically be stringified if json and
    // urlEncoded if application/x-www-form-urlencoded
    body: {},

    // Query as object, will automatically be urlEncoded
    query: {},

    // If cross origin request, pass cookies
    withCredentials: false,

    // Any additional http headers, or overwrite default
    headers: {},

    // A function or signal path (foo.bar.requestProgressed) that
    // triggers on request progress. Passes {progress: 45} etc.
    onProgress: null
  })
}
```

## get

*action*
```js
function someGetAction ({http}) {
  return http.get('/items', {
    // QUERY object
  }, {
    // Any options defined in "Custom request"
  })
}
```

*factory*
```js
import {httpGet} from 'cerebral-provider-http/operators'

export default [
  httpGet('/items'),

  // Alternatively with explicit paths
  httpGet('/items'), {
    success: [],
    error: [],
    abort: [], // Optional
    '${STATUS_CODE}': [] // Optionally any status code, ex. 404: []
  }
]
```

*output*
```javascript
{
  result: 'the response',
  status: 200,

  // If aborted
  isAborted: true
}
```

## post

*action*
```js
function somePostAction ({http}) {
  return http.post('/items', {
    // BODY object
  }, {
    // Any options defined in "Custom request"
  })
}
```

*factory*
```js
import {httpPost} from 'cerebral-provider-http/operators'
import {props} from 'cerebral/tags'

export default [
  httpPost('/items', {
    title: props`itemTitle`,
    foo: 'bar'
  }),

  // Alternatively with explicit paths
  httpPost('/items', {
    title: props`itemTitle`,
    foo: 'bar'
  }), {
    success: [],
    error: [],
    abort: [], // Optional
    '${STATUS_CODE}': [] // Optionally any status code, ex. 404: []
  }
]
```

*output*
```javascript
{
  result: 'the response',
  status: 200,

  // If aborted
  isAborted: true
}
```

## put

*action*
```js
function somePutAction ({http}) {
  return http.put('/items/1', {
    // BODY object
  }, {
    // Any options defined in "Custom request"
  })
}
```

*factory*
```js
import {httpPost} from 'cerebral-provider-http/operators'

export default [
  httpPut('/items', {
    // BODY object
  }),

  // Alternatively with explicit paths
  httpPut('/items', {
    // BODY object
  }), {
    success: [],
    error: [],
    abort: [], // Optional
    '${STATUS_CODE}': [] // Optionally any status code, ex. 404: []
  }
]
```

*output*
```javascript
{
  result: 'the response',
  status: 200,

  // If aborted
  isAborted: true
}
```

## patch

*action*
```js
function somePatchAction ({http}) {
  return http.patch('/items/1', {
    // BODY object
  }, {
    // Any options defined in "Custom request"
  })
}
```

*factory*
```js
import {httpPost} from 'cerebral-provider-http/operators'
import {state, props, string} from 'cerebral/tags'

export default [
  httpPatch(string`/items/${props`itemId`}`, state`patchData`),

  // Alternatively with explicit paths
  httpPatch(string`/items/${props`itemId`}`, state`patchData`), {
    success: [],
    error: [],
    abort: [], // Optional
    '${STATUS_CODE}': [] // Optionally any status code, ex. 404: []
  }
]
```

*output*
```javascript
{
  result: 'the response',
  status: 200,

  // If aborted
  isAborted: true
}
```

## delete

*action*
```js
function someDeleteAction ({http}) {
  return http.delete('/items/1', {
    // QUERY object
  }, {
    // Any options defined in "Custom request"
  })
}
```

*factory*
```js
import {httpPost} from 'cerebral-provider-http/operators'
import {state} from 'cerebral/tags'

export default [
  httpDelete(string`/items/${state`currentItemId`}`),

  // Alternatively with explicit paths
  httpDelete(string`/items/${state`currentItemId`}`), {
    success: [],
    error: [],
    abort: [], // Optional
    '${STATUS_CODE}': [] // Optionally any status code, ex. 404: []
  }
]
```

*output*
```javascript
{
  result: 'the response',
  status: 200,

  // If aborted
  isAborted: true
}
```

## uploadFile

*action*
```js
function someDeleteAction ({http, props}) {
  return http.uploadFile('/upload', props.files, {
    name: 'filename.png', // Default to "files"
    data: {}, // Additional form data
    headers: {},
    onProgress(progress) {} // Upload progress
  })
}
```

*factory*
```js
import {httpUploadFile} from 'cerebral-provider-http/operators'
import {state, props} from 'cerebral/tags'

export default [
  httpUploadFile('/uploads', props`file`, {
    name: state`currentFileName`
  }),

  // Alternatively with explicit paths
  httpUploadFile('/uploads', props`file`, {
    name: state`currentFileName`
  }), {
    success: [],
    error: [],
    abort: [], // Optional
    '${STATUS_CODE}': [] // Optionally any status code, ex. 404: []
  }
]
```

*output*
```javascript
{
  result: 'the response',
  status: 200,

  // If aborted
  isAborted: true
}
```


## response

```js
function someGetAction ({http}) {
  return http.get('/items')
    // All status codes between 200 - 300, including 200
    .then((response) => {
      response.status // Status code of response
      response.result // Parsed response text
      // The response headers are returned as an object with lowercase header
      // names as keys. Values belonging to the same key are separated by ', '.
      response.headers // Parsed response headers
    })
    // All other status codes
    .catch((error) => {
      // HttpProviderError
      error.message // {status: 500, result: 'response text', headers: {}, isAborted: false}
    })
}
```

## abort
You can abort any running request, causing the request to resolve as status code **0** and set an **isAborted** property on the response object.

```js
function searchItems({input, state, path, http}) {
  http.abort('/items*') // regexp string
  return http.get(`/items?query=${input.query}`)
    .then(path.success)
    .catch((error) => {
      if (error.message.isAborted) {
        return path.abort()
      }

      return path.error({error: error.message})
    })
}

export default [
  searchItems, {
    success: [],
    error: [],
    abort: []
  }
]
```

## cors
Cors has been turned into a "black box" by jQuery. Cors is actually a very simple concept, but due to a lot of confusion of "Request not allowed", **cors** has been an option to help out. In HttpProvider we try to give you the insight to understand how cors actually works.

Cors has nothing to do with the client. The only client configuration related to cors is the **withCredentials** option, which makes sure cookies are passed to the cross origin server. The only requirement for cors to work is that you pass the correct **Content-Type**. Now, this depends on the server in question. Some servers allows any content-type, others require a specific one. These are the typical ones:

- text/plain
- application/x-www-form-urlencoded
- application/json; charset=UTF-8

Note that this is only related to the **request**. If you want to define what you want as response, you set the **Accept** header, which is *application/json* by default.
