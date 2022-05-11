import { Request, response, Response } from "express";

const express = require('express');
const router = express.Router();
const mysqlConnection = require('../config/mySqlConnection');
const session = require('express-session');
router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}))

// router.get('/', (req, res) => {
//     res.redirect('/');
// });

router.post('/', (req, res) => {
    const loggedIn = req.session.loggedIn;
    if(loggedIn == true){
        const userId = req.session.user.id;
        console.log(" I am user",userId);
        let originalUrl:string = req.body.userUrl.trim();   //original url from form
        let spaceChecker:RegExp = /\s/gi;
        if(spaceChecker.test(originalUrl)== false){
            if(originalUrl.length !== 0){
                // generating random short url key
                const uniqueId = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substring(2,10);
                // storing uniqueid in session
                req.session.shortUrl = "http://localhost:5000/"+uniqueId;    
                req.session.originalUrl = originalUrl;
                console.log(uniqueId, req.session.shortUrl, req.session.originalUrl);
                // inserting value in database
                mysqlConnection.getConnection((error: Error, conn) => {
                    try {
                        const dbquery:string = `INSERT INTO urlshortners (originalUrl, shortUrl, urlKey, userId) VALUES ("${originalUrl}", "http://localhost:5000/${uniqueId}","${uniqueId}","${userId}")`;
                        conn.query(dbquery,(error, rows, fields) =>{
                            if(!!error){
                                console.log("shorten insert Error :", error);
                                delete req.session.shortUrl;
                                req.session.errorMessage= {
                                    status: true,
                                    message: "Short url already exists"
                                };
                                res.redirect('/');
                                // throw "Cannot insert data";
                            }else{
                                console.log("Inserted successfully \n");
                                res.redirect("/");
                            };
                        });
                    } catch (error) {
                        console.log("Catch shorten error", error);
                        res.sendStatus(500).json({
                            status: "notoken",
                            message: "Something went wrong"
                        });
                    };
                });            
            }else{
                req.session.originalUrl = originalUrl;
                req.session.errorMessage = {
                    status: true,
                    message: "Invalid Url ! Empty field"
                };
                res.redirect('/');
            };
        }else{
            req.session.originalUrl = originalUrl;
            req.session.errorMessage = {
                status: true,
                message: "Invalid Url ! Please check spaces between url"
            };
            res.redirect('/');
        };
    }else{
        res.redirect('/login');
    };

});

export{};
module.exports = router;
