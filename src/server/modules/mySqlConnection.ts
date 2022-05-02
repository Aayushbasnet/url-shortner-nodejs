const mysql = require("mysql");
// creating database pool
const pool = mysql.createPool ({
    host: "localhost",
    user: "root",
    password: "",
    database: "urlShortnerDB"
});
//exporting connection
exports.getConnection = function(callback) {
  pool.getConnection(function(err, connection) {
      if(err) {
        return callback(err);
      }
      callback(err, connection);
    });
  };
