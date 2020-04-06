const fetch = require("node-fetch")

const HASURA_OPERATION = `
mutation createCartItem($product_id: Int!, $store_id: Int!, $user_id: Int!, $stock_available: Int!) {
  insert_cart_one(object: {
    product_id: $product_id, store_id: $store_id, user_id: $user_id
  }) {
    id
  }
  stock_status_update: update_inventory_by_pk(pk_columns: 
    {product_id: $product_id, store_id: $store_id}, _set: {stock_available: $stock_available}
  ) {
    stock_available
  }
}
`;

const INVENTORY_QUERY = `
query ($product_id: Int!, $store_id: Int!) {
  inventory_by_pk(product_id: $product_id, store_id: $store_id) {
    stock_available
  }
}
`;

// execute the parent mutation in Hasura
const execute = async (variables, operation) => {
  const fetchResponse = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: operation,
        variables
      })
    }
  );
  return await fetchResponse.json();
};
  

// Request Handler
const handler = async (req, res) => {

  // get request input
  const { product_id, store_id } = req.body.input;

  const user_id = req.body.session_variables['x-hasura-user-id'];

  // run some business logic
  // fetch current inventory data
  const { data: inventory_response, errors: inventory_errors } = await execute({ product_id, store_id }, INVENTORY_QUERY);
  const inventory_by_pk = inventory_response.inventory_by_pk;
  if(!inventory_by_pk) {
    return res.status(400).json({
      message: "Invalid product or store"
    })
  }
  const stock_available = inventory_by_pk ? inventory_by_pk.stock_available : 0;

  if(stock_available <= 0) {
    return res.status(400).json({
      message: "Out of stock"
    })
  }

  // execute the Hasura operation
  const { data, errors } = await execute({ product_id, store_id, user_id }, HASURA_OPERATION);

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json({
      message: errors.message
    })
  }

  // success
  return res.json({
    ...data.insert_cart_one
  })

}

module.exports = handler;