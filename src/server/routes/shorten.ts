const express = require('express');
const router = express.Router();
const mysqlConnection = require('../modules/mySqlConnection');

router.get('/', (req,res) => {
    res.send(`Hi I am going to shorten ${req.body.userUrl}`);
});

router.post('/', (req,res) => {
    const originalUrl = req.body.userUrl;
    // console.log(originalUrl);
    if(originalUrl.length !== 0){
        try {
            // inserting value in database
            mysqlConnection.getConnection((error, conn) => {
                const uniqueId = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substring(2,10);
                console.log(uniqueId);
                const dbquery:string = `INSERT INTO urlshortners (OriginalUrl, ShortenUrl) VALUES ("${originalUrl}", "${uniqueId}")`;
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
