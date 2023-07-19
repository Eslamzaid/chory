const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "chory",
  password: "eslam1pc2",
  port: 5432,
});


module.exports = pool;