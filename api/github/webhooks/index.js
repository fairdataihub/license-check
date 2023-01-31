const { createNodeMiddleware, createProbot } = require("probot");

const app = require("../../../app");
// app.load(require('./middleware'));
const probot = createProbot();

module.exports = createNodeMiddleware(app, {
  probot,
  webhooksPath: "/api/github/webhooks",
});
