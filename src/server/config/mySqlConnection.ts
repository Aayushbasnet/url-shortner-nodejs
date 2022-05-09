// import { Connection } from "mysql";
import * as mysql from "mysql";
// const mysql = require("mysql");
// creating database pool
const pool = mysql.createPool ({
    connectionLimit: 50,
    host: "localhost",
    user: "root",
    password: "",
    database: "urlShortnerDB"
});
//exporting connection
exports.getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
      if(err) {
        conn.release();
        return callback(err);
      }
      callback(err, conn);
    });
  };
