import * as express from 'express';
import * as session from 'express-session';
import { MysqlError } from 'mysql';

const router = express.Router();
const path = require('path');
const mysqlConnection = require('../config/mySqlConnection');

const staticPath = path.join(__dirname, '../public');
router.use(express.static(staticPath));

// router.set('views', __dirname + '/views');
// router.set("view engine", "ejs");

router.get('/', (req : express.Request, res : express.Response) =>{
    // console.log("Path: ",path.join(__dirname, '../public'));
    let errorMessage = req.session.errorMessage;
    let email = req.session.email;
    let firstName = req.session.firstName;
    let lastName = req.session.lastName;
    let phoneNumber = req.session.phoneNumber;
    delete req.session.email;
    delete req.session.firstName;
    delete req.session.lastName;
    delete req.session.phoneNumber;


    req.session.errorMessage ={        
        status: false,
        message: "Invalid email or password"
    };
    res.render("register", {data: {errorMessage, email, firstName, lastName, phoneNumber}});
});

router.post('/', (req : express.Request, res : express.Response) => {
    let firstName : string = req.body.firstName;
    let lastName : string = req.body.lastName;
    let email : string = req.body.email;
    let password : string = req.body.password;
    let confirmPassword : string = req.body.confirmPassword;
    let phoneNumber : string = req.body.phoneNumber;
    req.session.email = email;
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    req.session.phoneNumber = phoneNumber;
    const phoneChecker : RegExp = /[0-9]{10}/gi;
    if(phoneChecker.test(phoneNumber) == true){
        if( password == confirmPassword){
            mysqlConnection.getConnection((error : MysqlError, conn) =>{
                try{
                    if(!!error){
                        console.log("Register db error: ", error);
                        throw "Unable to get connection";
                    }else{
                        let searchQuery : string = `
                            SELECT COUNT (email) as duplicateEmail from users 
                            WHERE email = "${email}"
                        `; 
                        conn.query(searchQuery, (error, rows, fields) => {
                            if(!!error){
                                console.log("Search Error:", error);
                                throw "Email already exists"
                            }else{
                                if(rows[0].duplicateEmail == 0){
                                    console.log("No duplicate email", rows);
                                    let dbquery : string = `
                                            INSERT INTO users (firstName, lastName, email, phoneNumber, userPassword)
                                            VALUES ("${firstName}", "${lastName}", "${email}", "${phoneNumber}", "${password}")
                                        `;
                                    conn.query(dbquery, (error, rows, fileds) => {
                                        if(!!error){
                                            console.log("Register Query error:", error);
                                            throw "Cannot insert data";
                                        }else{
                                            console.log("Inserted successfully", rows);
                                            delete req.session.email;
                                            delete req.session.firstName;
                                            delete req.session.lastName;
                                            delete req.session.phoneNumber;
                                            res.redirect('/login');
                                        };
                                    });
                                }else{
                                    console.log("Duplicate email", rows);
                                    req.session.errorMessage = {
                                        status : true,
                                        message : "Email already exists"
                                    };
                                    res.redirect("/register");
                                };
                                // console.log(rows);
                            };
                        });
                    };
                }catch(error){
                    console.log("Catch register error:", error);
                    res.sendStatus(500).json({
                        status : error,
                        message : "Something went wrong"
                    });
                };
            });
        }else {
            req.session.errorMessage ={        
                status: true,
                message: "Invalid password"
            };
            res.redirect('/register');
        };
    }else{
        req.session.errorMessage ={        
            status: true,
            message: "Invalid Phonenumber ! Must be 10 digits."
        };
        res.redirect('/register');   
    };
});

export{};
module.exports = router;