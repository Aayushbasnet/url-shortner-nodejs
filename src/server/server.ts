import { Request, Response } from "express";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysqlConnection = require('./config/mySqlConnection');

const session = require('express-session');
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}))

// const path = require ('path');
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true})); // bodyParser can be replaced with express as well
app.use(bodyParser.json());

// homepage route
app.get('/', (req, res) =>{
    // session value
    const shortUrl = req.session.shortUrl;
    const originalUrl = req.session.originalUrl;
    const errorMessage = req.session.errorMessage;
    delete req.session.shortUrl;
    delete req.session.originalUrl;
    delete req.session.errorMessage;
    // console.log("Path:",__dirname);
    
    // database connection
    mysqlConnection.getConnection((error, conn) =>{
        // database queries
        try{
            if(!!error){
                // console.log("Cannot get connection");
                res.status(500).json({
                    status: "No connection",
                    message: "Failed to connect database"
                });
            }else{
                const dbquery: string = "SELECT * FROM urlshortners";
                conn.query(dbquery, (error, rows, fields) => {
                    if(!!error){
                        // console.log("Failed to retrieve data", error);
                        res.render("index", {data:error});
                    }else{
                        // console.log(rows);
                        res.render("index", {data:{rows, shortUrl, originalUrl, errorMessage}});  // rows:rows are same show only rows
                        // parse rows/fields
                    };
                });
            }
        }catch(error){
            res.sendStatus(500).json({
                status: error,
                message: "bad"
            });
            console.log(error);
        };
    });
});

// shorten route
const shortenRoute = require('./routes/shorten');
app.use('/shorten', shortenRoute);

// register route
const registerRoute = require('./routes/register');
app.use('/register', registerRoute); 

// login route
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

//get original url route
app.get('/:urlKey', (req, res) => {
    const key = req.params.urlKey;
    // console.log(key);
    mysqlConnection.getConnection((error, conn) => {
        if(!!error){
            // console.log("Cannot get Connection", error);
            res.status(500).json({
                status: "No connection",
                message: "Failed to connect database"
            });
        }else{
            const dbquery : string = 
                `SELECT OriginalUrl FROM urlshortners WHERE UrlKey = "${key}"`;
            conn.query(dbquery, (error: Error, rows: object, fields: object) => {
                if(!!error){
                    // console.log("Query error", error);
                    res.status(500).json({
                        status: "Bad Query",
                        message: "Cannot retrieve original url"
                    });
                }else{
                    // console.log("Original Url: ", rows);
                    if(rows[0] == null){
                        req.session.errorMessage = {
                            status: true,
                            message: "Url doesnot exists"
                        };
                        res.redirect('/');
                    } else{
                        res.redirect(`${rows[0].OriginalUrl}`); 

                    }                   
                };
            });
        }
    });
});

// listen
app.listen(5000,() => {
    console.log("Application listening at http://localhost:5000");
});
