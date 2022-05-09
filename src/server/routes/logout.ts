import * as express from "express";
import * as session from "express-session";

const router = express.Router();

router.get('/', (req : express.Request, res : express.Response) => {
    delete req.session.user;
    req.session.loggedIn = false;
    res.redirect('/login');
});

export{};
module.exports = router;