const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/hello', async (req, res) => {
  return res.json({
    hello: "world"
  });
});

// Request Handler
app.post('/resizeImage', async (req, res) => {

  // get request input
  const { arg1 } = req.body.input;
  console.log('outside');

  // run some business logic


  /*
  // In case of errors:
  return res.status(400).json({
    message: "error happened"
  })
  */

  setTimeout(function() {
  	  console.log('inside');
	  return res.json({
	    accessToken: "<value>"
	  })
  }, 25000)

  // success

});

app.listen(PORT);
