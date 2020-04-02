const fetch = require("node-fetch")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HASURA_OPERATION = `
mutation ($name: String!, $username: String!, $password: String!) {
  insert_users_one(object: {
    name: $name,
    username: $username,
    password: $password
  }) {
    id
  }
}
`;

// execute the parent mutation in Hasura
const execute = async (variables, reqHeaders) => {
  const fetchResponse = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      headers: reqHeaders || {},
      body: JSON.stringify({
        query: HASURA_OPERATION,
        variables
      })
    }
  );
  return await fetchResponse.json();
};
  

// Request Handler
const handler = async (req, res) => {

  // get request input
  const { name, username, password } = req.body.input;

  // run some business logic
  let hashedPassword = await bcrypt.hash(password, 10);

  // execute the Hasura operation
  const { data, errors } = await execute({ name, username, password: hashedPassword }, req.headers);

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json({
      message: errors.message
    })
  }

  const tokenContents = {
    sub: data.insert_users_one.id.toString(),
    name: name,
    iat: Date.now() / 1000,
    iss: 'https://myapp.com/',
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-user-id": data.insert_users_one.id.toString(),
      "x-hasura-default-role": "user",
      "x-hasura-role": "user"
    },
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  }

  const token = jwt.sign(tokenContents, process.env.ENCRYPTION_KEY);

  // success
  return res.json({
    ...data.insert_users_one,
    token: token
  })

}

module.exports = handler;