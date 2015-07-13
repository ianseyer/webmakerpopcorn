var config = {
  host: process.env.HOST,
  port: process.env.PORT,
  trust_proxy: process.env.TRUST_PROXY === "true",
};

var server = require("./server")(config);

server.start(function() {
  console.log('Server running at: %s', server.info.uri);
});
