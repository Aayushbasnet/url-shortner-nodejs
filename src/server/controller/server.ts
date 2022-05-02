import { connect } from "http2";

const express = require('express');
const app = express();
const mysqlConnection = require('../modules/mySqlConnection')

app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));

app.get('/', (req, res) =>{
    mysqlConnection.getConnection((error, connection) =>{
    const dbquery: string = "SELECT * FROM urlshortners";
        connection.query(dbquery, (error, result, fields) => {
            if(!!error){
                console.log("Failed to retrieve data ");
            }else{
                console.log("retrived successfully \n");
                console.log(result);

                // parse rows/fields
            }
        });
    });
    
    res.render("index");
})

const shortenRoute = require('../routes/shorten');
app.use('/shorten', shortenRoute);




// listen
app.listen(5000,() => {
    console.log("Application listening at http://localhost:5000");
});
