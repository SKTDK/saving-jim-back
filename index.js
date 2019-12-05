/**
 * Load environment variables from file
 */
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

/**
 * Imports
 */
const db = require("./modules/db");
const server = require("./modules/server");

server.start();