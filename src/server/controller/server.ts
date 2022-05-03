import { connect } from "http2";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysqlConnection = require('../modules/mySqlConnection');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true})); // bodyParser can be replaced with express as well
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    mysqlConnection.getConnection((error, conn) =>{
    const dbquery: string = "SELECT * FROM urlshortners";
        conn.query(dbquery, (error, rows, fields) => {
            if(!!error){
                console.log("Failed to retrieve data", error);
                res.render("index", {data:error});
            }else{
                console.log("retrived successfully \n");
                // console.log(rows);
                res.render("index", {data:rows});

                // parse rows/fields
            }
        });
    });
    
});

const shortenRoute = require('../routes/shorten');
app.use('/shorten', shortenRoute);

// listen
app.listen(5000,() => {
    console.log("Application listening at http://localhost:5000");
});
