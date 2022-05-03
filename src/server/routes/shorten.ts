const express = require('express');
const router = express.Router();
const mysqlConnection = require('../modules/mySqlConnection');
const session = require('express-session');
router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}))

router.get('/', (req,res) => {
    res.send(`Hi I am going to shorten ${req.body.userUrl}`);
});

router.post('/', (req,res) => {
    const originalUrl = req.body.userUrl;   //original url from form
    // console.log(originalUrl);
    if(originalUrl.length !== 0){
        try {
            // generating random short url key
            const uniqueId = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substring(2,10);
            // storing uniqueid in session
            req.session.shortUrl = "http://localhost:5000/"+uniqueId;    
            req.session.originalUrl = originalUrl;

            // inserting value in database
            mysqlConnection.getConnection((error, conn) => {
                const dbquery:string = `INSERT INTO urlshortners (OriginalUrl, ShortenUrl, UrlKey) VALUES ("${originalUrl}", "http://localhost:5000/${uniqueId}","${uniqueId}")`;
                conn.query(dbquery,(error, rows,) =>{
                    if(!!error){
                        res.sendStatus(500).json({
                            status: "notoken",
                            message: "Something went wrong"
                        });
                        console.log("Cannot insert data into database", error);
                        throw error;
                    }else{
                        console.log("Inserted successfully \n");
                        res.redirect("/");
                    };
                });
            });        
        } catch (error) {
            res.sendStatus(500);
            console.log(error);
        };
    }else{
        res.redirect('/');
    }

});

export{};
module.exports = router;
