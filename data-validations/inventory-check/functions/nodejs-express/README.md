# nodejs-express

This is a starter kit for `nodejs` with `express`. To get started:

```
npm ci
npm start
```

## Development

The entrypoint for the server lives in `src/index.js`.

If you wish to add a new route (say `/greet`) , you can:

### Adding a route

#### Option 1

Add it yourself manually as:
  
```js
const requestHandler = (req, res) => {
  return res.json({
    "greeting": "have a nice day"
  });
}

app.post('/greet', requestHandler);
```

#### Option 2

Use dynamic imports.
If you want to add a route (say `/greet`), you can just add a new file called `greet.js` in `src/handlers`. This file must have a default export function that behaves as a request handler.

Example of `greet.js`

```js
const greetHandler = (req, res) => {
  return res.json({
    "greeting"
  })
}

module.exports = greetHandler;
```

### Throwing erros

You can throw an error object or a list of error objects from your handler. The response must be 4xx and the error object must have a string field called `message`.

```js
retun res.status(400).json({
  message: 'invalid email'
});
```
