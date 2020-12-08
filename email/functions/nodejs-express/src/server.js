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




//Sending email with SMTP
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




//Sending email with Amazon SES

// import dotenv 
require('dotenv').config();
// import AWS SDK
const AWS = require('aws-sdk');

// Amazon SES configuration
const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
};

app.post('/sendEmailAmazonSES', function(req, res) {

  const { email } = req.body.input;
  var params = {
    Source: '<enter Source email>',
    Destination: {
      ToAddresses: [
        email
      ]
    },
    ReplyToAddresses: [
      '<enter Reply to email>',
    ],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: 'It is <strong>Working</strong>! 🤗'
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Hasura Action mail with Amazon SES'
      }
    }
  };

  new AWS.SES(SESConfig).sendEmail(params).promise().then((res) => {
    console.log(res);
  });
  
});


app.listen(PORT);
