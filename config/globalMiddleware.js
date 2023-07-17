const authMiddleware = require("../middlware/authMiddleware");
const csfrMiddleware = require("../middlware/csfrMiddleware");

const globalMiddleware = [authMiddleware,csfrMiddleware]

module.exports = globalMiddleware;

