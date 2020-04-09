const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(
	'smtp://'+process.env.SMTP_LOGIN+':'+process.env.SMTP_PASSWORD+'@' + process.env.SMTP_HOST);

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/hello', async (req, res) => {
  return res.json({
    hello: "world"
  });
});

app.post('/sendEmail', function(req, res) {
  
  const { email } = req.body.input;
  // setup e-mail data
  const from_email = '<enter from email>';
  const mailOptions = {
      from: from_email, // sender address
      to: email, // list of receivers
      subject: 'Testing Hasura Actions', // Subject line
      html: '<p>'+'Hi, This is to test the email action handler</p>' // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
      	  console.log(error);
          return res.status(400).json({
    		message: "error happened"
  		  })
      }
      console.log('Message sent: ' + info.response);
      res.json({'success': true});
  });
  
});


app.listen(PORT);
