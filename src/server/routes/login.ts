const express = require('express');
const router = express.Router();
const path = require('path');
const mysqlConnection = require('../config/mySqlConnection');
const session = require('express-session');

const staticPath: string = path.join(__dirname, '../public');
router.use(express.static(staticPath));
// console.log(staticPath);

router.get('/', (req, res) =>{
    res.sendFile("login.html", {root: staticPath});
});

router.post('/', (req, res) =>{
    let email: string = req.body.email;
    let password: string = req.body.password;
    console.log('Email: ', email, 'password: ', password); 
    // database connection
    if(email && password){
        mysqlConnection.getConnection((error, conn) =>{
            try {
                if(!!error){
                    res.sendStatus(500).json({
                        status: "no connection",
                        message: "Failed to connect database"
                    });
                }else{
                    const dbquery: string = `SELECT * FROM users WHERE email = '${email}' AND userPassword = '${password}'`;
                    conn.query(dbquery, (error, rows, fields) =>{
                        if(!!error){
                            console.log("Error here",error);
                            req.session.message = "Invalid email or password";
                            res.redirect('/login');
                        }else{
                            let token: string = Math.random().toString(32).replace(/[^a-z0-9]/gi, '').substring(2,10);
                            req.session.userToken = token;
                            req.session.userId = rows[0].id;
                            req.session.loggedIn = true;

                            console.log(token, rows[0].id);
                            res.redirect('/');
                        };
                    });
                };
            } catch (error) {
                res.sendStatus(500).json({
                    status: "Error",
                    message: error
                });
                console.log(error);
            }
        });
    }else{
        req.session.message = "Invalid email or password";
        req.redirect('/login');
        console.log("Invalid credentials");
    };
})

export{}
module.exports = router;
