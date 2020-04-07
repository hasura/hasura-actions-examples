const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch")
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static('public'));


app.post('/hello', async (req, res) => {
  return res.json({
    hello: "world"
  });
});

const fileUpload = async (req, res, next) => {
    const { name, type, base64str } = req.body.input;
    let fileBuffer = Buffer.from(base64str, 'base64');
    try {
      fs.writeFileSync("./public/files/" + name, fileBuffer, 'base64');
      // insert into db
      const HASURA_MUTATION = `
      mutation ($file_path: String!) {
      	insert_files_one(object: {
      		file_path: $file_path
      	}) {
      		id
      	}
      }
      `;
      const variables = { file_path: "/files/" + name };

	  // execute the parent mutation in Hasura
	  const fetchResponse = await fetch(
	    "http://localhost:8080/v1/graphql",
	    {
	      method: 'POST',
	      body: JSON.stringify({
	        query: HASURA_MUTATION,
	        variables
	      })
	    }
	  );
  	  const { data, errors } = await fetchResponse.json();
  	  console.log(data);

  	  // if Hasura operation errors, then throw error
	  if (errors) {
	    return res.status(400).json({
	      message: errors.message
	    })
	  }

	  // success
      return res.json({ file_path: "/files/"+name} );
  } catch (e) {
      next(e);
  }
}

app.post('/fileUpload', fileUpload) 

app.listen(PORT);
