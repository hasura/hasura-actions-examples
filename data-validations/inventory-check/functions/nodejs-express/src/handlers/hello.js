const handler = (req, resp) => {
  // You can access ther request body at req.body
  return resp.json({ "hello": "world" });
};

module.exports = handler;
