const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const fetch = require("node-fetch");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/hello', async (req, res) => {
  return res.json({
    hello: "world"
  });
});

// Request Handler
app.post('/validateCoupon', async (req, res) => {

  // get request input
  const { code } = req.body.input;
  const session_variables = req.body.session_variables;

  // run some business logic
  const COUPON_QUERY = `
    query($code: String!) {
      coupon_by_pk(code: $code) {
        discount_value
        expiry_date
        remaining_count
        is_active
      }
      cart {
        product {
          price
        }
      }
    }
  `;
  const variables = { code };
  const fetchCoupon = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: COUPON_QUERY,
        variables
      }),
      headers: session_variables
    }
  );
  const { data, errors } = await fetchCoupon.json();

  // In case of errors:
  if(errors) {
    return res.status(400).json({
      message: "error happened"
    })
  }

  // validate coupon
  const coupon_by_pk = data.coupon_by_pk;
  const cart = data.cart;

  if(!coupon_by_pk) {
    return res.status(400).json({
      message: "Invalid coupon"
    })
  }

  if(!coupon_by_pk.is_active || coupon_by_pk.remaining_count <= 0) {
    return res.status(400).json({
      message: "Coupon inactive"
    })
  }

  // calculate discount value
  const totalPrice = cart.reduce(function(prev, cur) {
    return prev + cur.product.price;
  }, 0);

  // check type of discount and subtract
  const discounted_price = totalPrice - coupon_by_pk.discount_value;

  // success
  return res.json({
    valid: true,
    discountedPrice: discounted_price,
    discountApplied: coupon_by_pk.discount_value
  })

});

app.listen(PORT);
