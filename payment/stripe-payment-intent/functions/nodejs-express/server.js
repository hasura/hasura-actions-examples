const express = require("express");
const app = express();
const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const fetch = require('node-fetch');

app.use(express.static(process.env.STATIC_DIR));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

app.get("/checkout", (req, res) => {
  // Display checkout page
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

app.post("/create-payment-intent", async (req, res) => {

  const { currency, addressDetails } = req.body.input;
  const session_variables = req.body.session_variables;

  const FETCH_CART_QUERY = `query {
    cart {
      id
      product {
        id
        price
      }
    }
  }`;

  const cart_response = await fetch('http://localhost:8080/v1/graphql', {method: 'POST', body: JSON.stringify({query: FETCH_CART_QUERY}), headers: session_variables});
  const cart_json = await cart_response.json();

  // calculate total price
  let total_price = 0;
  cart_json.data.cart.forEach((item) => total_price += item.product.price);

  // create order
  const ORDER_MUTATION = `mutation ($object: order_insert_input!) {
    insert_order_one(object: $object) {
      id
    }
  }`;

  // find products from cart;
  const cart_products = cart_json.data.cart.map((item) => { 
    return { product_id: item.product.id, price: item.product.price }
  });

  const order_object = {
    ...addressDetails,
    order_items: {
      data: cart_products
    }
  }

  const order_response = await fetch('http://localhost:8080/v1/graphql', {method: 'POST', body: JSON.stringify({query: ORDER_MUTATION, variables: { object: order_object }}), headers: session_variables })
  const order_json = await order_response.json();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseFloat(total_price),
    currency: currency,
    description: 'Order placement',
  });

  // Send publishable key and PaymentIntent details to client
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    clientSecret: paymentIntent.client_secret
  });
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
app.post("/webhook", async (req, res) => {
  let data, eventType;

  console.log('webhook called');

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  }
  res.sendStatus(200);
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
